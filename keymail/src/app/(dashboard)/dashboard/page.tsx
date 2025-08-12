"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Client, Email } from "@/types";
import { formatDate } from "@/lib/utils";
import { Users, Mail, Star, Clock, CheckCircle, PenSquare, UserPlus } from "lucide-react";

// Extend the Email type for dashboard display
interface EmailWithClient extends Email {
  client?: Client;
  isFavorite: boolean;
}

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [emails, setEmails] = useState<EmailWithClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        try {
          // Try first with the dashboard API
          const dashboardResponse = await fetch("/api/dashboard", {
            cache: 'no-store', // Prevent caching
            next: { revalidate: 0 }, // Force revalidation
            headers: { 
              'Pragma': 'no-cache',
              'Cache-Control': 'no-cache' 
            }
          });
          if (dashboardResponse.ok) {
            const dashboardData = await dashboardResponse.json();
            if (dashboardData.success) {
              setClients(dashboardData.data.recentClients);
              setEmails(dashboardData.data.recentEmails);
              setLoading(false);
              return;
            }
          }
        } catch (dashboardErr) {
          console.error("Dashboard API error, falling back to individual APIs:", dashboardErr);
        }

        // Fallback to individual API endpoints
        // Fetch recent clients
        const clientsResponse = await fetch("/api/clients?limit=5", {
          cache: 'no-store', 
          next: { revalidate: 0 },
          headers: { 
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache' 
          }
        });
        if (!clientsResponse.ok) {
          throw new Error("Failed to fetch clients");
        }
        const clientsData = await clientsResponse.json();

        // Fetch recent emails
        const emailsResponse = await fetch("/api/emails?limit=5&includeClient=true", {
          cache: 'no-store',
          next: { revalidate: 0 },
          headers: { 
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache' 
          }
        });
        if (!emailsResponse.ok) {
          throw new Error("Failed to fetch emails");
        }
        const emailsData = await emailsResponse.json();

        // Make sure we're handling the data structure correctly
        // The clients API returns { data: { items: [...] } }
        setClients(clientsData.data.items || []);
        setEmails(emailsData.data || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(typeof err === "string" ? err : (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Get status icon for emails
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <Clock className="h-4 w-4 text-gray-500" />;
      case "scheduled":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "sent":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Client Overview</CardTitle>
            <CardDescription>Manage your client relationships</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{clients.length}</p>
                <p className="text-sm text-gray-500">Recent Clients</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/clients" className="w-full">
              <Button variant="outline" className="w-full">View All Clients</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Email Overview</CardTitle>
            <CardDescription>Track your email communications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="bg-pink-100 p-3 rounded-full">
                <Mail className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{emails.length}</p>
                <p className="text-sm text-gray-500">Recent Emails</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/emails" className="w-full">
              <Button variant="outline" className="w-full">View All Emails</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="clients">Recent Clients</TabsTrigger>
          <TabsTrigger value="emails">Recent Emails</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clients" className="mt-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium">Recent Clients</CardTitle>
                <Link href="/clients/add">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Client
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center py-4 text-gray-500">Loading clients...</p>
              ) : clients.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">No clients found</p>
                  <Link href="/clients/add">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Your First Client
                    </Button>
                  </Link>
                  <p className="mt-4 text-sm text-gray-500">
                    Adding clients will help you organize your contacts and send personalized emails.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {clients.map((client) => (
                    <div
                      key={client.id}
                      className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <div>
                        <Link
                          href={`/clients/${client.id}`}
                          className="font-medium hover:text-purple-600 transition-colors"
                        >
                          {client.name}
                        </Link>
                        <p className="text-sm text-gray-500">{client.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {client.relationshipLevel && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                            {client.relationshipLevel.replace("_", " ")}
                          </span>
                        )}
                        <Link href={`/clients/${client.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">View client</span>
                            <Users className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Link href="/clients" className="w-full">
                <Button variant="outline" className="w-full">View All Clients</Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="emails" className="mt-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium">Recent Emails</CardTitle>
                <Link href="/emails/compose">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <PenSquare className="h-4 w-4 mr-2" />
                    Compose Email
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center py-4 text-gray-500">Loading emails...</p>
              ) : emails.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">No emails found</p>
                  <Link href="/emails/compose">
                    <Button>Compose Your First Email</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {emails.map((email) => (
                    <div
                      key={email.id}
                      className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <div>
                        <div className="flex items-center">
                          <Link
                            href={`/emails/${email.id}`}
                            className="font-medium hover:text-purple-600 transition-colors"
                          >
                            {email.subject}
                          </Link>
                          {email.isFavorite && (
                            <Star className="h-4 w-4 ml-2 text-amber-400 fill-amber-400" />
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="flex items-center">
                            {getStatusIcon(email.status)}
                            <span className="ml-1 capitalize">{email.status}</span>
                          </span>
                          <span className="mx-2">•</span>
                          {email.client && (
                            <Link
                              href={`/clients/${email.client.id}`}
                              className="hover:text-purple-600 transition-colors"
                            >
                              {email.client.name}
                            </Link>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(email.updatedAt)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Link href="/emails" className="w-full">
                <Button variant="outline" className="w-full">View All Emails</Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 