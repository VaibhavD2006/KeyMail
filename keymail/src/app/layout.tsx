import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";

const inter = Inter({ subsets: ["latin"] });

// Local storage initialization script
const localStorageInitScript = `
  try {
    if (typeof window !== 'undefined') {
      const existingClients = localStorage.getItem('keymail_mock_clients');
      if (!existingClients) {
        // Initial mock data
        const initialClients = [
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
        
        localStorage.setItem('keymail_mock_clients', JSON.stringify(initialClients));
        console.log('KeyMail: Initialized localStorage with default clients');
      }
    }
  } catch (e) {
    console.error('Error initializing localStorage:', e);
  }
`;

export const metadata: Metadata = {
  title: "KeyMail - AI-Powered Real Estate Email Marketing",
  description: "KeyMail helps real estate agents automate personalized email campaigns for client retention.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Initialize localStorage with client data */}
        <script dangerouslySetInnerHTML={{ __html: localStorageInitScript }} />
      </head>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
