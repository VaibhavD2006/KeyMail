import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getEmails,
  createEmail,
} from "@/lib/db/emails";
import { EmailFormData } from "@/types";

// Mock data for development
const mockClients = [
  {
    id: "client-1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "555-123-4567",
    relationshipLevel: "warm_lead",
    status: "active",
  },
  {
    id: "client-2",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "555-987-6543",
    relationshipLevel: "current_client",
    status: "active",
  },
  {
    id: "client-3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "555-567-8901",
    relationshipLevel: "prospect",
    status: "active",
  },
];

const mockEmails = [
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
  },
];

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === "development" || process.env.SKIP_ENV_VALIDATION === "1";

// Export mock data for use in other routes
export { mockEmails, mockClients };

// GET /api/emails - Get all emails with filtering and pagination
export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // If in development mode, return mock data
    if (isDevelopment) {
      // Extract query parameters
      const searchParams = req.nextUrl.searchParams;
      const page = searchParams.get("page")
        ? parseInt(searchParams.get("page")!)
        : 1;
      const limit = searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!)
        : 10;
      const clientId = searchParams.get("clientId") || "";
      const status = searchParams.get("status") || "";
      const search = searchParams.get("search") || "";
      const sortBy = searchParams.get("sortBy") || "createdAt";
      const sortDirection = searchParams.get("sortDirection") as "asc" | "desc" || "desc";
      const includeClient = searchParams.get("includeClient") === "true";

      // Filter emails based on search and filters
      let filteredEmails = [...mockEmails];
      
      // Filter by client ID
      if (clientId) {
        filteredEmails = filteredEmails.filter(email => email.clientId === clientId);
      }
      
      // Filter by status
      if (status && status !== "all") {
        if (status.includes(",")) {
          const statusArray = status.split(",");
          filteredEmails = filteredEmails.filter(email => statusArray.includes(email.status));
        } else {
          filteredEmails = filteredEmails.filter(email => email.status === status);
        }
      }
      
      // Filter by search term
      if (search) {
        const searchLower = search.toLowerCase();
        filteredEmails = filteredEmails.filter(
          email => 
            email.subject.toLowerCase().includes(searchLower) || 
            email.content.toLowerCase().includes(searchLower)
        );
      }
      
      // Sort emails
      filteredEmails.sort((a, b) => {
        const aValue = a[sortBy as keyof typeof a];
        const bValue = b[sortBy as keyof typeof b];
        
        if (sortDirection === "asc") {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
      
      // Add client data if requested
      const emailsWithClientData = filteredEmails.map(email => {
        if (includeClient) {
          const client = mockClients.find(c => c.id === email.clientId);
          return { ...email, client };
        }
        return email;
      });
      
      // Paginate results
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedEmails = emailsWithClientData.slice(startIndex, endIndex);
      
      return NextResponse.json({
        success: true,
        data: paginatedEmails,
        pagination: {
          totalItems: filteredEmails.length,
          totalPages: Math.ceil(filteredEmails.length / limit),
          currentPage: page,
          pageSize: limit
        }
      });
    }

    // Production code
    // Extract query parameters
    const searchParams = req.nextUrl.searchParams;
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page")!)
      : 1;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : 10;
    const clientId = searchParams.get("clientId") || undefined;
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortDirection = (searchParams.get("sortDirection") as "asc" | "desc") || "desc";
    const includeClient = searchParams.get("includeClient") === "true";

    // Parse status array if comma-separated
    let statusArray: string[] | undefined;
    if (status && status.includes(",")) {
      statusArray = status.split(",");
    }

    // This is where you'd normally query your database
    // const emails = await getEmails(session.user.id, {
    //   page,
    //   limit,
    //   clientId,
    //   status: statusArray || status,
    //   search,
    //   sortBy,
    //   sortDirection,
    //   includeClient,
    // });

    // For now, return mock data for production too
    // Add client data if requested
    const emailsWithClientData = mockEmails.map(email => {
      if (includeClient) {
        const client = mockClients.find(c => c.id === email.clientId);
        return { ...email, client };
      }
      return email;
    });

    return NextResponse.json({ 
      success: true, 
      data: emailsWithClientData,
      pagination: {
        totalItems: mockEmails.length,
        totalPages: Math.ceil(mockEmails.length / limit),
        currentPage: page,
        pageSize: limit
      }
    });
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch emails" },
      { status: 500 }
    );
  }
}

// POST /api/emails - Create a new email
export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    
    // Validate required fields
    if (!body.clientId || !body.subject || !body.content) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (clientId, subject, content)" },
        { status: 400 }
      );
    }

    // If in development mode, add to mock data and return
    if (isDevelopment) {
      const newEmail = {
        id: `email-${Date.now()}`,
        userId: session.user.id,
        clientId: body.clientId,
        subject: body.subject,
        content: body.content,
        status: body.status || "draft",
        scheduledDate: body.scheduledDate || null,
        sentDate: null,
        isFavorite: body.isFavorite || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Add to the mock emails array
      mockEmails.unshift(newEmail);
      
      return NextResponse.json({ success: true, data: newEmail });
    }

    // Create email data object
    const emailData: EmailFormData = {
      clientId: body.clientId,
      subject: body.subject,
      content: body.content,
      status: body.status || "draft",
      scheduledDate: body.scheduledDate || undefined,
      isFavorite: body.isFavorite || false,
    };

    // This is where you'd normally create the email in your database
    // const email = await createEmail(emailData, session.user.id);

    // For now, return mock data for production too
    const newEmail = {
      id: `email-${Date.now()}`,
      userId: session.user.id,
      clientId: body.clientId,
      subject: body.subject,
      content: body.content,
      status: body.status || "draft",
      scheduledDate: body.scheduledDate || null,
      sentDate: null,
      isFavorite: body.isFavorite || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: newEmail });
  } catch (error) {
    console.error("Error creating email:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create email" },
      { status: 500 }
    );
  }
} 