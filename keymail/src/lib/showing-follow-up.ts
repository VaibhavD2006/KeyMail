import {
  getClientById,
  getListingById,
  getShowingById,
  saveEmailHistory,
  updateShowing,
} from "@/lib/db/queries-mongodb";
import { generateEmailContent } from "@/lib/ai/openai";

function buildFollowUpContext({
  listing,
  showing,
  customMessage,
  emailTemplate,
  includeFeedbackRequest,
}: {
  listing: any;
  showing: any;
  customMessage?: string;
  emailTemplate?: string;
  includeFeedbackRequest: boolean;
}) {
  return [
    "Write a personalized follow-up email after a real estate property showing.",
    `Property: MLS #${listing.mlsId || "N/A"} - ${listing.address}, ${listing.city}, ${listing.state} ${listing.zipCode}`,
    listing.price ? `Price: $${Number(listing.price).toLocaleString()}` : null,
    `Property details: ${
      [
        listing.bedrooms ? `${listing.bedrooms} bedrooms` : null,
        listing.bathrooms ? `${listing.bathrooms} bathrooms` : null,
        listing.squareFeet
          ? `${Number(listing.squareFeet).toLocaleString()} sq ft`
          : null,
        listing.propertyType
          ? String(listing.propertyType).replace("_", " ")
          : null,
        listing.neighborhood ? `in ${listing.neighborhood}` : null,
      ]
        .filter(Boolean)
        .join(", ") || "No additional property details provided"
    }`,
    listing.features?.length ? `Features: ${listing.features.join(", ")}` : null,
    listing.description ? `Description: ${listing.description}` : null,
    `Showing status: ${showing.status}`,
    showing.scheduledAt
      ? `Scheduled at: ${new Date(showing.scheduledAt).toLocaleString()}`
      : null,
    showing.completedAt
      ? `Completed at: ${new Date(showing.completedAt).toLocaleString()}`
      : null,
    showing.agentNotes ? `Agent notes: ${showing.agentNotes}` : null,
    customMessage ? `Agent custom message: ${customMessage}` : null,
    emailTemplate ? `Requested template or theme: ${emailTemplate}` : null,
    includeFeedbackRequest
      ? "Ask the client for brief feedback about the showing."
      : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function sendShowingFollowUp({
  userId,
  showingId,
  emailTemplate,
  customMessage,
  tone,
  includeFeedbackRequest,
}: {
  userId: string;
  showingId: string;
  emailTemplate?: string;
  customMessage?: string;
  tone: string;
  includeFeedbackRequest: boolean;
}) {
  const showing = await getShowingById(showingId);

  if (!showing || showing.userId !== userId) {
    return { error: "Showing not found" as const };
  }

  const [client, listing] = await Promise.all([
    getClientById(showing.clientId),
    getListingById(showing.listingId),
  ]);

  if (!client || !listing || client.userId !== userId || listing.userId !== userId) {
    return { error: "Client or listing not found" as const };
  }

  const emailContent = await generateEmailContent({
    client: {
      id: client._id.toString(),
      name: client.name,
      email: client.email,
      relationshipLevel: client.relationshipLevel,
      yearsKnown: client.yearsKnown,
      tags: client.tags,
    },
    occasion: "showing_follow_up",
    tone,
    style: "real_estate",
    length: "medium",
    additionalContext: buildFollowUpContext({
      listing,
      showing,
      customMessage,
      emailTemplate,
      includeFeedbackRequest,
    }),
  });

  const emailRecord = await saveEmailHistory({
    userId,
    clientId: showing.clientId,
    occasion: "showing_follow_up",
    subject: emailContent.subject,
    generatedContent: emailContent.content,
    editedContent: emailContent.content,
    status: "sent",
    sentDate: new Date(),
    metadata: {
      milestoneType: "showing_follow_up",
      listingId: showing.listingId,
      showingId: showing._id.toString(),
      tone,
      customMessage,
      emailTemplate,
      includeFeedbackRequest,
    },
  });

  await updateShowing(showing._id.toString(), {
    followUpSent: true,
    followUpSentAt: new Date(),
  });

  return {
    data: {
      emailId: emailRecord._id.toString(),
      subject: emailContent.subject,
      showingId: showing._id.toString(),
      clientName: client.name,
      listingAddress: listing.address,
      followUpSent: true,
      feedbackRequested: includeFeedbackRequest,
    },
  };
}
