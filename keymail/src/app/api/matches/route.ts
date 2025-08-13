import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { clients, listings, propertyMatches, emailHistory } from "@/lib/db/schema";
import { eq, and, gte, lte, inArray, desc } from "drizzle-orm";
import { generateEmailContent } from "@/lib/ai/openai";

// GET /api/matches - Get all property matches for a user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");
    const isActive = searchParams.get("isActive");

    let query = db
      .select()
      .from(propertyMatches)
      .where(eq(propertyMatches.userId, session.user.id));

    if (clientId) {
      query = query.where(eq(propertyMatches.clientId, clientId));
    }

    if (isActive !== null) {
      query = query.where(eq(propertyMatches.isActive, isActive === "true"));
    }

    query = query.orderBy(desc(propertyMatches.matchScore));

    const matches = await query;

    // Enrich with client and listing details
    const enrichedMatches = await Promise.all(
      matches.map(async (match) => {
        const [client, listing] = await Promise.all([
          db.select().from(clients).where(eq(clients.id, match.clientId)).limit(1),
          db.select().from(listings).where(eq(listings.id, match.listingId)).limit(1),
        ]);

        return {
          ...match,
          client: client[0] || null,
          listing: listing[0] || null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: enrichedMatches,
    });
  } catch (error) {
    console.error("Error fetching property matches:", error);
    return NextResponse.json(
      { error: "Failed to fetch property matches" },
      { status: 500 }
    );
  }
}

// POST /api/matches - Generate new property matches for a client
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { clientId, maxMatches = 5 } = await request.json();

    if (!clientId) {
      return NextResponse.json(
        { error: "Client ID is required" },
        { status: 400 }
      );
    }

    // Get client with preferences
    const clientResult = await db
      .select()
      .from(clients)
      .where(and(eq(clients.id, clientId), eq(clients.userId, session.user.id)))
      .limit(1);

    if (clientResult.length === 0) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    const client = clientResult[0];

    // Get active listings
    const listingsResult = await db
      .select()
      .from(listings)
      .where(eq(listings.userId, session.user.id));

    if (listingsResult.length === 0) {
      return NextResponse.json(
        { error: "No listings found" },
        { status: 404 }
      );
    }

    // Calculate match scores for each listing
    const matches = listingsResult
      .map((listing) => {
        const score = calculateMatchScore(client, listing);
        return {
          listing,
          score,
          reasons: getMatchReasons(client, listing),
        };
      })
      .filter((match) => match.score > 0.3) // Only include matches above 30%
      .sort((a, b) => b.score - a.score)
      .slice(0, maxMatches);

    // Save matches to database
    const savedMatches = await Promise.all(
      matches.map(async (match) => {
        const matchData = {
          userId: session.user.id,
          clientId,
          listingId: match.listing.id,
          matchScore: match.score,
          reasons: match.reasons,
          isActive: true,
        };

        const result = await db
          .insert(propertyMatches)
          .values(matchData)
          .returning();

        return result[0];
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        matches: savedMatches,
        totalFound: matches.length,
        client: {
          id: client.id,
          name: client.name,
          preferences: {
            priceRange: [client.priceRangeMin, client.priceRangeMax],
            neighborhoods: client.preferredNeighborhoods,
            propertyTypes: client.preferredPropertyTypes,
            bedrooms: [client.minBedrooms, client.maxBedrooms],
            bathrooms: [client.minBathrooms, client.maxBathrooms],
          },
        },
      },
    });
  } catch (error) {
    console.error("Error generating property matches:", error);
    return NextResponse.json(
      { error: "Failed to generate property matches" },
      { status: 500 }
    );
  }
}

// Helper function to calculate match score (0-1)
function calculateMatchScore(client: any, listing: any): number {
  let score = 0;
  let totalWeight = 0;

  // Price range (weight: 0.3)
  if (client.priceRangeMin && client.priceRangeMax) {
    const priceWeight = 0.3;
    totalWeight += priceWeight;
    
    if (listing.price >= client.priceRangeMin && listing.price <= client.priceRangeMax) {
      score += priceWeight;
    } else if (listing.price < client.priceRangeMin * 1.1 || listing.price > client.priceRangeMax * 0.9) {
      score += priceWeight * 0.5; // Close to range
    }
  }

  // Property type (weight: 0.2)
  if (client.preferredPropertyTypes && client.preferredPropertyTypes.length > 0) {
    const typeWeight = 0.2;
    totalWeight += typeWeight;
    
    if (client.preferredPropertyTypes.includes(listing.propertyType)) {
      score += typeWeight;
    }
  }

  // Neighborhood (weight: 0.2)
  if (client.preferredNeighborhoods && client.preferredNeighborhoods.length > 0) {
    const neighborhoodWeight = 0.2;
    totalWeight += neighborhoodWeight;
    
    if (client.preferredNeighborhoods.includes(listing.neighborhood)) {
      score += neighborhoodWeight;
    }
  }

  // Bedrooms (weight: 0.15)
  if (client.minBedrooms && client.maxBedrooms) {
    const bedroomWeight = 0.15;
    totalWeight += bedroomWeight;
    
    if (listing.bedrooms >= client.minBedrooms && listing.bedrooms <= client.maxBedrooms) {
      score += bedroomWeight;
    } else if (listing.bedrooms >= client.minBedrooms - 1 && listing.bedrooms <= client.maxBedrooms + 1) {
      score += bedroomWeight * 0.7; // Close to range
    }
  }

  // Bathrooms (weight: 0.15)
  if (client.minBathrooms && client.maxBathrooms) {
    const bathroomWeight = 0.15;
    totalWeight += bathroomWeight;
    
    if (listing.bathrooms >= client.minBathrooms && listing.bathrooms <= client.maxBathrooms) {
      score += bathroomWeight;
    } else if (listing.bathrooms >= client.minBathrooms - 0.5 && listing.bathrooms <= client.maxBathrooms + 0.5) {
      score += bathroomWeight * 0.7; // Close to range
    }
  }

  return totalWeight > 0 ? score / totalWeight : 0;
}

// Helper function to get match reasons
function getMatchReasons(client: any, listing: any): string[] {
  const reasons: string[] = [];

  // Price match
  if (client.priceRangeMin && client.priceRangeMax) {
    if (listing.price >= client.priceRangeMin && listing.price <= client.priceRangeMax) {
      reasons.push("Perfect price range match");
    } else if (listing.price < client.priceRangeMin * 1.1 || listing.price > client.priceRangeMax * 0.9) {
      reasons.push("Close to your price range");
    }
  }

  // Property type match
  if (client.preferredPropertyTypes && client.preferredPropertyTypes.includes(listing.propertyType)) {
    reasons.push(`Matches your preferred property type: ${listing.propertyType}`);
  }

  // Neighborhood match
  if (client.preferredNeighborhoods && client.preferredNeighborhoods.includes(listing.neighborhood)) {
    reasons.push(`In your preferred neighborhood: ${listing.neighborhood}`);
  }

  // Bedroom match
  if (client.minBedrooms && client.maxBedrooms) {
    if (listing.bedrooms >= client.minBedrooms && listing.bedrooms <= client.maxBedrooms) {
      reasons.push(`Perfect bedroom count: ${listing.bedrooms}`);
    }
  }

  // Bathroom match
  if (client.minBathrooms && client.maxBathrooms) {
    if (listing.bathrooms >= client.minBathrooms && listing.bathrooms <= client.maxBathrooms) {
      reasons.push(`Perfect bathroom count: ${listing.bathrooms}`);
    }
  }

  // Special features
  if (listing.features && listing.features.length > 0) {
    const specialFeatures = listing.features.filter((feature: string) =>
      feature.toLowerCase().includes("luxury") ||
      feature.toLowerCase().includes("updated") ||
      feature.toLowerCase().includes("modern")
    );
    
    if (specialFeatures.length > 0) {
      reasons.push(`Special features: ${specialFeatures.slice(0, 2).join(", ")}`);
    }
  }

  return reasons;
}

