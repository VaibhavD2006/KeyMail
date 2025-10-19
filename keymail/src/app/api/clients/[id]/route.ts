import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/session";
import { getClientById, updateClient, deleteClient } from "@/lib/db/queries-mongodb";
import { mockClients, saveMockClients } from "../route"; // Import the mockClients array and localStorage utils

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Try to get latest clients from localStorage in browser environment
    if (typeof window !== 'undefined') {
      try {
        const savedClients = localStorage.getItem('keymail_mock_clients');
        if (savedClients) {
          const updatedMockClients = JSON.parse(savedClients);
          // Update the reference but keep the same array to avoid breaking imports
          mockClients.length = 0;
          mockClients.push(...updatedMockClients);
        }
      } catch (e) {
        console.error('Error reading from localStorage:', e);
      }
    }

    // If in development mode, get client from mock data
    if (process.env.NODE_ENV === "development" || process.env.SKIP_ENV_VALIDATION) {
      // Find the client in mock data
      const client = mockClients.find(client => client.id === params.id);
      
      if (!client) {
        return NextResponse.json(
          { success: false, error: "Client not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ success: true, data: client });
    }

    // Production code
    const client = await getClientById(params.id, session.user.id);

    if (!client) {
      return NextResponse.json(
        { success: false, error: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: client });
  } catch (error) {
    console.error("Error fetching client:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch client" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Try to get latest clients from localStorage in browser environment
    if (typeof window !== 'undefined') {
      try {
        const savedClients = localStorage.getItem('keymail_mock_clients');
        if (savedClients) {
          const updatedMockClients = JSON.parse(savedClients);
          // Update the reference but keep the same array to avoid breaking imports
          mockClients.length = 0;
          mockClients.push(...updatedMockClients);
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

    // If in development mode, update client in mock data
    if (process.env.NODE_ENV === "development" || process.env.SKIP_ENV_VALIDATION) {
      // Find the client in mock data
      const clientIndex = mockClients.findIndex(client => client.id === params.id);
      
      if (clientIndex === -1) {
        return NextResponse.json(
          { success: false, error: "Client not found" },
          { status: 404 }
        );
      }
      
      // Check for duplicate email (but not the client's own email)
      const existingEmailClient = mockClients.find(
        client => client.email.toLowerCase() === body.email.toLowerCase() && client.id !== params.id
      );
      
      if (existingEmailClient) {
        return NextResponse.json(
          { success: false, error: "A client with this email already exists" },
          { status: 400 }
        );
      }
      
      // Update client in array
      const updatedClient = {
        ...mockClients[clientIndex],
        ...body,
        updatedAt: new Date().toISOString()
      };
      
      mockClients[clientIndex] = updatedClient;
      
      // Save updated clients to localStorage in browser environment
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('keymail_mock_clients', JSON.stringify(mockClients));
        } catch (e) {
          console.error('Error saving to localStorage:', e);
        }
      }
      
      return NextResponse.json(
        { success: true, data: updatedClient },
        { status: 200 }
      );
    }

    // Production code
    // Ensure we're updating the client for the current user
    const existingClient = await getClientById(params.id, session.user.id);

    if (!existingClient) {
      return NextResponse.json(
        { success: false, error: "Client not found" },
        { status: 404 }
      );
    }

    const updatedClient = await updateClient(
      params.id, 
      session.user.id, 
      body
    );

    return NextResponse.json({ success: true, data: updatedClient });
  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update client" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Try to get latest clients from localStorage in browser environment
    if (typeof window !== 'undefined') {
      try {
        const savedClients = localStorage.getItem('keymail_mock_clients');
        if (savedClients) {
          const updatedMockClients = JSON.parse(savedClients);
          // Update the reference but keep the same array to avoid breaking imports
          mockClients.length = 0;
          mockClients.push(...updatedMockClients);
        }
      } catch (e) {
        console.error('Error reading from localStorage:', e);
      }
    }

    // If in development mode, handle deletion from mock data
    if (process.env.NODE_ENV === "development" || process.env.SKIP_ENV_VALIDATION) {
      // Find the client in mock data
      const clientIndex = mockClients.findIndex(client => client.id === params.id);
      
      if (clientIndex === -1) {
        return NextResponse.json(
          { success: false, error: "Client not found" },
          { status: 404 }
        );
      }
      
      // Remove client from array
      mockClients.splice(clientIndex, 1);
      
      // Save updated clients to localStorage in browser environment
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('keymail_mock_clients', JSON.stringify(mockClients));
        } catch (e) {
          console.error('Error saving to localStorage:', e);
        }
      }
      
      return NextResponse.json(
        { success: true, message: "Client deleted successfully" },
        { status: 200 }
      );
    }

    // Production code
    // Ensure we're deleting the client for the current user
    const existingClient = await getClientById(params.id, session.user.id);

    if (!existingClient) {
      return NextResponse.json(
        { success: false, error: "Client not found" },
        { status: 404 }
      );
    }

    await deleteClient(params.id, session.user.id);

    return NextResponse.json(
      { success: true, message: "Client deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete client" },
      { status: 500 }
    );
  }
} 