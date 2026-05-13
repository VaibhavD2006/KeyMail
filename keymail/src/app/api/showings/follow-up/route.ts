import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db/mongodb";
import { Client, Email, Listing, Showing, ShowingFeedback } from "@/lib/db/models";
import { serializeMongoDocument } from "@/lib/db/serialize";
import { generateEmailContent } from "@/lib/ai/openai";

type SerializedClient = Record<string, unknown> & {
  name?: string;
  email?: string;
};

type SerializedListing = Record<string, unknown> & {
  mlsId?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  propertyType?: string;
  neighborhood?: string;
  features?: string[];
  description?: string;
};

type SerializedShowing = Record<string, unknown> & {
  id?: string;
  clientId?: string;
  listingId?: string;
  scheduledAt?: string | Date;
  completedAt?: string | Date;
  agentNotes?: string;
};

type ShowingDocument = SerializedShowing & {
  clientId: string;
  listingId: string;
  followUpSent?: boolean;
  followUpSentAt?: Date;
  save: () => Promise<unknown>;
};

function formatContextDate(value?: string | Date) {
  return value ? new Date(value).toISOString() : null;
}

function buildFollowUpContext({
  listing,
  showing,
  customMessage,
  emailTemplate,
  includeFeedbackRequest,
}: {
  listing: SerializedListing;
  showing: SerializedShowing;
  customMessage?: string;
  emailTemplate?: string;
  includeFeedbackRequest: boolean;
}) {
  const propertyDetails = [
    listing.mlsId ? `MLS ID: ${listing.mlsId}` : null,
    listing.address ? `Address: ${listing.address}` : null,
    [listing.city, listing.state, listing.zipCode].filter(Boolean).join(", ") || null,
    listing.price ? `Price: ${listing.price}` : null,
    listing.bedrooms ? `Bedrooms: ${listing.bedrooms}` : null,
    listing.bathrooms ? `Bathrooms: ${listing.bathrooms}` : null,
    listing.squareFeet ? `Square feet: ${listing.squareFeet}` : null,
    listing.propertyType ? `Property type: ${listing.propertyType}` : null,
    listing.neighborhood ? `Neighborhood: ${listing.neighborhood}` : null,
    Array.isArray(listing.features) && listing.features.length > 0
      ? `Features: ${listing.features.join(", ")}`
      : null,
    listing.description ? `Description: ${listing.description}` : null,
  ].filter(Boolean);

  return [
    "Write a follow-up email after a real estate showing.",
    propertyDetails.length > 0 ? `Property details:\n${propertyDetails.join("\n")}` : null,
    showing.scheduledAt ? `Showing scheduled at: ${formatContextDate(showing.scheduledAt)}` : null,
    showing.completedAt ? `Showing completed at: ${formatContextDate(showing.completedAt)}` : null,
    showing.agentNotes ? `Agent notes: ${showing.agentNotes}` : null,
    customMessage ? `Custom agent message to incorporate: ${customMessage}` : null,
    emailTemplate ? `Template guidance: ${emailTemplate}` : null,
    includeFeedbackRequest ? "Ask the client for brief feedback about the property." : null,
  ].filter(Boolean).join("\n\n");
}

async function loadOwnedShowing(showingId: string, userId: string) {
  await dbConnect();

  const showing = await Showing.findOne({ _id: showingId, userId }) as ShowingDocument | null;
  if (!showing) {
    return null;
  }

  const [client, listing] = await Promise.all([
    Client.findOne({ _id: showing.clientId, userId }),
    Listing.findOne({ _id: showing.listingId, userId }),
  ]);

  if (!client || !listing) {
    return { showing, client: null, listing: null };
  }

  return { showing, client, listing };
}

async function createFollowUpEmail({
  showing,
  client,
  listing,
  userId,
  emailTemplate,
  customMessage,
  tone,
  includeFeedbackRequest,
}: {
  showing: ShowingDocument;
  client: unknown;
  listing: unknown;
  userId: string;
  emailTemplate?: string;
  customMessage?: string;
  tone: string;
  includeFeedbackRequest: boolean;
}) {
  const serializedClient = serializeMongoDocument<SerializedClient>(client);
  const serializedListing = serializeMongoDocument<SerializedListing>(listing);
  const serializedShowing = serializeMongoDocument<SerializedShowing>(showing);

  if (!serializedClient || !serializedListing || !serializedShowing) {
    throw new Error("Cannot create follow-up email without showing, client, and listing records");
  }

  const emailContent = await generateEmailContent({
    client: {
      ...serializedClient,
      name: serializedClient.name || "Client",
      email: serializedClient.email || "",
    },
    occasion: "showing_follow_up",
    tone,
    style: "professional",
    additionalContext: buildFollowUpContext({
      listing: serializedListing,
      showing: serializedShowing,
      customMessage,
      emailTemplate,
      includeFeedbackRequest,
    }),
  });

  const email = await Email.create({
    userId,
    clientId: serializedShowing.clientId,
    occasion: "showing_follow_up",
    subject: emailContent.subject,
    generatedContent: emailContent.content,
    editedContent: emailContent.content,
    status: "sent",
    sentDate: new Date(),
    metadata: {
      aiParameters: {
        tone,
        style: "professional",
        length: "medium",
      },
    },
  }) as { id?: string };

  showing.followUpSent = true;
  showing.followUpSentAt = new Date();
  await showing.save();

  if (includeFeedbackRequest) {
    await ShowingFeedback.create({
      showingId: serializedShowing.id,
      clientId: serializedShowing.clientId,
      followUpNeeded: false,
    });
  }

  return {
    email,
    emailContent,
    serializedShowing,
    serializedClient,
    serializedListing,
  };
}

// GET /api/showings/follow-up - Get showings that need follow-up emails
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const daysAgo = parseInt(searchParams.get("daysAgo") || "1");

    // Get showings completed in the last X days that haven't had follow-up emails sent
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

    await dbConnect();

    const showingsNeedingFollowUp = await Showing.find({
      userId: session.user.id,
      status: "completed",
      followUpSent: false,
      completedAt: { $gte: cutoffDate },
    }).sort({ completedAt: -1 });

    // Enrich with client and listing details
    const enrichedShowings = await Promise.all(
      showingsNeedingFollowUp.map(async (showing: ShowingDocument) => {
        const [client, listing] = await Promise.all([
          Client.findOne({ _id: showing.clientId, userId: session.user.id }),
          Listing.findOne({ _id: showing.listingId, userId: session.user.id }),
        ]);

        return {
          ...serializeMongoDocument(showing),
          client: client ? serializeMongoDocument(client) : null,
          listing: listing ? serializeMongoDocument(listing) : null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        showings: enrichedShowings,
        totalNeedingFollowUp: enrichedShowings.length,
        cutoffDate: cutoffDate.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching showings needing follow-up:", error);
    return NextResponse.json(
      { error: "Failed to fetch showings needing follow-up" },
      { status: 500 }
    );
  }
}

// POST /api/showings/follow-up - Send follow-up email for a specific showing
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { 
      showingId, 
      emailTemplate, 
      customMessage, 
      tone = "professional",
      includeFeedbackRequest = true 
    } = await request.json();

    if (!showingId) {
      return NextResponse.json(
        { error: "Showing ID is required" },
        { status: 400 }
      );
    }

    const ownedShowing = await loadOwnedShowing(showingId, session.user.id);
    if (!ownedShowing) {
      return NextResponse.json(
        { error: "Showing not found" },
        { status: 404 }
      );
    }

    const { showing, client, listing } = ownedShowing;
    if (!client || !listing) {
      return NextResponse.json(
        { error: "Client or listing not found" },
        { status: 404 }
      );
    }

    const {
      email,
      emailContent,
      serializedShowing,
      serializedClient,
      serializedListing,
    } = await createFollowUpEmail({
      showing,
      client,
      listing,
      userId: session.user.id,
      emailTemplate,
      customMessage,
      tone,
      includeFeedbackRequest,
    });

    return NextResponse.json({
      success: true,
      data: {
        emailId: email.id,
        subject: emailContent.subject,
        showingId: serializedShowing.id,
        clientName: serializedClient.name,
        listingAddress: serializedListing.address,
        followUpSent: true,
        feedbackRequested: includeFeedbackRequest,
      },
    });

  } catch (error) {
    console.error("Error sending showing follow-up:", error);
    return NextResponse.json(
      { error: "Failed to send showing follow-up" },
      { status: 500 }
    );
  }
}


