import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Mock data (same as in the other routes for consistency)
const mockClients = [
  {
    id: "client-1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "555-123-4567",
    address: "123 Main St, Anytown, CA 90210",
    notes: "Looking for a vacation property",
    relationshipLevel: "warm_lead",
    status: "active",
    tags: ["buyer", "luxury"],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "client-2",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "555-987-6543",
    address: "456 Oak Ave, Somecity, CA 94123",
    notes: "Closing next month on new home",
    relationshipLevel: "current_client",
    status: "active",
    tags: ["buyer", "first-time"],
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "client-3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "555-567-8901",
    address: "789 Pine Rd, Othercity, CA 92101",
    notes: "Wants to sell in the spring",
    relationshipLevel: "prospect",
    status: "active",
    tags: ["seller", "repeat"],
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "client-4",
    name: "Emily Brown",
    email: "emily.brown@example.com",
    phone: "555-345-6789",
    address: "101 Maple Dr, Newtown, CA 95123",
    notes: "Looking for investment properties",
    relationshipLevel: "cold_lead",
    status: "pending",
    tags: ["investor"],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "client-5",
    name: "Michael Davis",
    email: "michael.davis@example.com",
    phone: "555-234-5678",
    address: "202 Cherry Ln, Lastcity, CA 91234",
    notes: "Past client from 2020, may be looking again soon",
    relationshipLevel: "past_client",
    status: "inactive",
    tags: ["buyer", "seller"],
    createdAt: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

// Create email mock data with client references
const mockEmailsWithClient = [
  {
    id: "email-1",
    userId: "dev-user-id",
    clientId: "client-1",
    subject: "Property viewing follow-up",
    content: "Dear John, thank you for viewing the property on Main Street yesterday. I wanted to follow up and see if you had any questions about the property or if you'd like to schedule another viewing.",
    status: "sent",
    sentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: true,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    client: mockClients[0],
  },
  {
    id: "email-2",
    userId: "dev-user-id",
    clientId: "client-2",
    subject: "Closing documents for review",
    content: "Hi Jane, attached are the closing documents for your new home purchase. Please review them and let me know if you have any questions before our meeting on Friday.",
    status: "sent",
    sentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    client: mockClients[1],
  },
  {
    id: "email-3",
    userId: "dev-user-id",
    clientId: "client-3",
    subject: "Market update for your neighborhood",
    content: "Hello Robert, I thought you might be interested in this market update for your neighborhood. Property values have increased by 5% in the last quarter, which is good news if you're still considering selling in the spring.",
    status: "draft",
    isFavorite: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    client: mockClients[2],
  },
  {
    id: "email-4",
    userId: "dev-user-id",
    clientId: "client-1",
    subject: "New listings in your price range",
    content: "Hi John, I wanted to share these new listings that just came on the market in your price range. There are a few properties that match your criteria, especially the one on Oak Street that has the updated kitchen you were looking for.",
    status: "scheduled",
    scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    client: mockClients[0],
  },
  {
    id: "email-5",
    userId: "dev-user-id",
    clientId: "client-2",
    subject: "Your 1-year home anniversary",
    content: "Dear Jane, it's been almost a year since you purchased your home, and I wanted to check in to see how you're enjoying it. I also wanted to let you know about some tax benefits you might be eligible for as a homeowner.",
    status: "draft",
    isFavorite: false,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    client: mockClients[1],
  },
];

// Dashboard stats
const mockStats = {
  activeClients: 4, // Number of active clients
  sentEmails: 2, // Number of sent emails
  scheduledEmails: 1, // Number of scheduled emails
  draftEmails: 2, // Number of draft emails
  clientsByRelationship: {
    cold_lead: 1,
    warm_lead: 1,
    prospect: 1,
    current_client: 1,
    past_client: 1,
    advocate: 0,
  }
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Return mock dashboard data for development
    return NextResponse.json({
      success: true,
      data: {
        stats: mockStats,
        recentClients: mockClients,
        recentEmails: mockEmailsWithClient,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
} 