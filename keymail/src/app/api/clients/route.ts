import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getClientsByUserId, createClient } from "@/lib/db/queries";

// Initial mock data
const initialMockClients = [
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

// Load clients from localStorage or use initial data
const loadMockClients = () => {
  if (typeof window !== 'undefined') {
    try {
      const savedClients = localStorage.getItem('keymail_mock_clients');
      if (savedClients) {
        return JSON.parse(savedClients);
      }
    } catch (err) {
      console.error('Error loading clients from localStorage:', err);
    }
  }
  return [...initialMockClients];
};

// Save clients to localStorage
const saveMockClients = (clients: any[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('keymail_mock_clients', JSON.stringify(clients));
    } catch (err) {
      console.error('Error saving clients to localStorage:', err);
    }
  }
};

// Initialize mockClients
let mockClients = initialMockClients;

// Try to load from localStorage when this module is first loaded in the browser
if (typeof window !== 'undefined') {
  // This will run only on the client side
  try {
    const savedClients = localStorage.getItem('keymail_mock_clients');
    if (savedClients) {
      mockClients = JSON.parse(savedClients);
    } else {
      // Initialize localStorage with default clients if empty
      localStorage.setItem('keymail_mock_clients', JSON.stringify(initialMockClients));
    }
  } catch (e) {
    console.error('Error accessing localStorage:', e);
  }
}

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === "development" || process.env.SKIP_ENV_VALIDATION === "1";

// Export mockClients so it can be imported in [id]/route.ts
export { mockClients, saveMockClients };

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // In browser environment, try to get latest clients from localStorage
    if (typeof window !== 'undefined') {
      try {
        const savedClients = localStorage.getItem('keymail_mock_clients');
        if (savedClients) {
          mockClients = JSON.parse(savedClients);
        }
      } catch (e) {
        console.error('Error reading from localStorage:', e);
      }
    }

    // If in development mode, return mock data
    if (isDevelopment) {
      // Get query parameters
      const searchParams = request.nextUrl.searchParams;
      const page = parseInt(searchParams.get("page") || "1", 10);
      const limit = parseInt(searchParams.get("limit") || "10", 10);
      const search = searchParams.get("search") || "";
      const relationshipLevel = searchParams.get("relationshipLevel");
      const tag = searchParams.get("tag");
      
      // Filter clients based on search term
      let filteredClients = [...mockClients];
      
      if (search) {
        const searchLower = search.toLowerCase();
        filteredClients = filteredClients.filter(
          client => client.name.toLowerCase().includes(searchLower) || 
                    client.email.toLowerCase().includes(searchLower)
        );
      }
      
      // Filter by relationship level if provided
      if (relationshipLevel && relationshipLevel !== "all") {
        filteredClients = filteredClients.filter(
          client => client.relationshipLevel === relationshipLevel
        );
      }
      
      // Filter by tag if provided
      if (tag) {
        filteredClients = filteredClients.filter(
          client => client.tags.includes(tag)
        );
      }
      
      // Calculate pagination
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedClients = filteredClients.slice(startIndex, endIndex);
      
      return NextResponse.json({
        success: true,
        data: {
          items: paginatedClients,
          pagination: {
            totalItems: filteredClients.length,
            totalPages: Math.ceil(filteredClients.length / limit),
            currentPage: page,
            pageSize: limit
          },
          total: filteredClients.length,
          limit: limit,
          page: page
        }
      });
    }

    // Production code continues here
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || undefined;
    
    // Parse filters from query parameters
    const filterParams: Record<string, any> = {};
    
    // Add relationship level filter if provided
    const relationshipLevel = searchParams.get("relationshipLevel");
    if (relationshipLevel) {
      filterParams.relationshipLevel = relationshipLevel;
    }
    
    // Add tag filter if provided
    const tag = searchParams.get("tag");
    if (tag) {
      filterParams.tags = tag;
    }

    // This is where you'd normally query your database
    // const clients = await getClientsByUserId(
    //   session.user.id,
    //   page,
    //   limit,
    //   search,
    //   filterParams
    // );

    // For now, return mock data even in production
    // This should be replaced with actual database calls later
    return NextResponse.json({
      success: true,
      data: {
        items: mockClients,
        pagination: {
          totalItems: mockClients.length,
          totalPages: 1,
          currentPage: 1,
          pageSize: limit
        },
        total: mockClients.length,
        limit: limit,
        page: 1
      }
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // In browser environment, try to get latest clients from localStorage
    if (typeof window !== 'undefined') {
      try {
        const savedClients = localStorage.getItem('keymail_mock_clients');
        if (savedClients) {
          mockClients = JSON.parse(savedClients);
        }
      } catch (e) {
        console.error('Error reading from localStorage:', e);
      }
    }

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Check for duplicate email
    const existingClient = mockClients.find(client => 
      client.email.toLowerCase() === body.email.toLowerCase()
    );
    
    if (existingClient) {
      return NextResponse.json(
        { success: false, error: "A client with this email already exists" },
        { status: 400 }
      );
    }
    
    // Create a new client with default values for missing fields
    const newClient = {
      id: `client-${Date.now()}`,
      ...body,
      status: body.status || "active",
      tags: body.tags || [],
      userId: session.user.id || "dev-user-id",
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: body.updatedAt || new Date().toISOString(),
    };
    
    // Add to the mock clients array
    mockClients.unshift(newClient);

    // Save to localStorage in browser environment
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('keymail_mock_clients', JSON.stringify(mockClients));
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
    }

    // Return the newly created client
    return NextResponse.json(
      { success: true, data: newClient },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create client" },
      { status: 500 }
    );
  }
} 