import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateEmailContent } from "@/lib/ai/openai";
import { getClientById, saveEmailHistory } from "@/lib/db/queries-mongodb";

interface MLSListing {
  mlsId: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  description: string;
  photos: string[];
  features: string[];
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  lotSize: number;
  propertyType: string;
  neighborhood: string;
}

interface MLSEmailRequest {
  mlsId: string;
  clientId: string;
  tone: "professional" | "casual" | "urgent";
  customMessage?: string;
  listingData?: MLSListing;
}

/**
 * POST /api/emails/generate-mls - Generate MLS listing email
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body: MLSEmailRequest = await req.json();

    // Validate required fields
    if (!body.mlsId || !body.clientId) {
      return NextResponse.json(
        { error: "Missing required fields: mlsId, clientId" },
        { status: 400 }
      );
    }

    // Get client information
    const client = await getClientById(body.clientId);
    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    // If no listing data provided, try to fetch from MLS or cache
    let listingData = body.listingData;
    if (!listingData) {
      // TODO: Implement MLS API integration
      // For now, we'll create a mock listing structure
      listingData = {
        mlsId: body.mlsId,
        address: "123 Main Street",
        city: "Anytown",
        state: "CA",
        zipCode: "90210",
        price: 750000,
        description: "Beautiful home with great features",
        photos: [],
        features: ["Updated kitchen", "Hardwood floors", "Large backyard"],
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1800,
        lotSize: 6000,
        propertyType: "Single Family",
        neighborhood: "Downtown"
      };
    }

    // Generate email content using AI
    const emailContent = await generateEmailContent({
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        preferences: {
          priceRange: {
            min: client.priceRangeMin || 0,
            max: client.priceRangeMax || 1000000
          },
          neighborhoods: client.preferredNeighborhoods || [],
          propertyTypes: client.preferredPropertyTypes || [],
          mustHaves: client.mustHaves || [],
          urgency: client.urgency || "low"
        }
      },
      occasion: "property_listing",
      tone: body.tone || "professional",
      style: "real_estate",
      length: "medium",
      additionalContext: `
        MLS Listing: ${listingData.mlsId}
        Property: ${listingData.address}, ${listingData.city}, ${listingData.state} ${listingData.zipCode}
        Price: $${listingData.price.toLocaleString()}
        Features: ${listingData.bedrooms} bed, ${listingData.bathrooms} bath, ${listingData.squareFeet} sq ft
        Property Type: ${listingData.propertyType}
        Neighborhood: ${listingData.neighborhood}
        Key Features: ${listingData.features.join(", ")}
        Custom Message: ${body.customMessage || ""}
        
        Generate a compelling real estate email that:
        1. Mentions the client by name
        2. Highlights why this property matches their preferences
        3. Includes key property details and photos
        4. Has a clear call-to-action for scheduling a showing
        5. Maintains the specified tone (${body.tone})
        6. Is personalized to their specific needs and preferences
      `
    });

    if (!emailContent.success) {
      return NextResponse.json(
        { error: "Failed to generate email content" },
        { status: 500 }
      );
    }

    // Save email to history
    const emailHistory = await saveEmailHistory({
      userId,
      clientId: body.clientId,
      subject: emailContent.subject,
      content: emailContent.content,
      metadata: {
        listingId: body.mlsId,
        tone: body.tone,
        customMessage: body.customMessage,
        mlsData: listingData
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        emailId: emailHistory.id,
        subject: emailContent.subject,
        content: emailContent.content,
        listing: listingData,
        client: {
          id: client.id,
          name: client.name,
          email: client.email
        }
      },
      message: "MLS email generated successfully"
    });
  } catch (error) {
    console.error("Error in POST /api/emails/generate-mls:", error);
    return NextResponse.json(
      { error: "Failed to generate MLS email" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/emails/generate-mls - Get MLS listing data (for preview)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const mlsId = searchParams.get("mlsId");

    if (!mlsId) {
      return NextResponse.json(
        { error: "Missing mlsId parameter" },
        { status: 400 }
      );
    }

    // TODO: Implement actual MLS API integration
    // For now, return mock data
    const mockListing: MLSListing = {
      mlsId,
      address: "123 Main Street",
      city: "Anytown",
      state: "CA",
      zipCode: "90210",
      price: 750000,
      description: "Beautiful home with great features and modern amenities. This property offers the perfect blend of comfort and style.",
      photos: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800"
      ],
      features: [
        "Updated kitchen with granite countertops",
        "Hardwood floors throughout",
        "Large backyard with mature trees",
        "2-car garage",
        "Central air conditioning",
        "Fresh paint"
      ],
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1800,
      lotSize: 6000,
      propertyType: "Single Family",
      neighborhood: "Downtown"
    };

    return NextResponse.json({
      success: true,
      data: mockListing
    });
  } catch (error) {
    console.error("Error in GET /api/emails/generate-mls:", error);
    return NextResponse.json(
      { error: "Failed to fetch MLS listing data" },
      { status: 500 }
    );
  }
}

