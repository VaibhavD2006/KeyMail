"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Client } from "@/types";
import { EmailEditor } from "@/components/email/editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

interface Template {
  id: string;
  name: string;
  occasion: string;
  subject: string;
  generatedContent: string;
  editedContent?: string | null;
}

export default function ComposeEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientIdParam = searchParams.get("clientId");
  const templateIdParam = searchParams.get("templateId");

  // States
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(clientIdParam);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialSubject, setInitialSubject] = useState("");
  const [initialContent, setInitialContent] = useState("");
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);

  // Fetch clients on component mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("/api/clients", {
          cache: 'no-store',
          next: { revalidate: 0 }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }
        const data = await response.json();
        
        // Handle the data structure correctly
        const clientsData = data.data?.items || [];
        setClients(clientsData);

        // If a client ID was provided, find and select that client
        if (clientIdParam) {
          const client = clientsData.find((c: Client) => c.id === clientIdParam);
          if (client) {
            setSelectedClient(client);
          }
        }
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError(typeof err === "string" ? err : (err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [clientIdParam]);

  // Fetch template if templateId is provided
  useEffect(() => {
    const fetchTemplate = async () => {
      if (!templateIdParam) return;
      
      setIsLoadingTemplate(true);
      try {
        const response = await fetch(`/api/templates/${templateIdParam}`);
        if (!response.ok) {
          throw new Error("Failed to fetch template");
        }
        
        const data = await response.json();
        if (data.success) {
          const template = data.data;
          setInitialSubject(template.subject);
          // Use edited content if available, otherwise use generated content
          setInitialContent(template.editedContent || template.generatedContent);
        } else {
          throw new Error(data.error || "Failed to fetch template");
        }
      } catch (err) {
        console.error("Error fetching template:", err);
        setError(typeof err === "string" ? err : (err as Error).message);
      } finally {
        setIsLoadingTemplate(false);
      }
    };

    fetchTemplate();
  }, [templateIdParam]);

  // Update selected client when selection changes
  useEffect(() => {
    if (selectedClientId) {
      const client = clients.find(c => c.id === selectedClientId);
      setSelectedClient(client || null);
    } else {
      setSelectedClient(null);
    }
  }, [selectedClientId, clients]);

  // Handle client selection
  const handleClientChange = (value: string) => {
    setSelectedClientId(value);
  };

  // Handle email save
  const handleSaveEmail = async (subject: string, content: string) => {
    if (!selectedClient) {
      setError("Please select a client before saving");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: selectedClient.id,
          subject,
          content,
          status: "draft", // Default to draft status
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save email");
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to save email");
      }

      // Navigate to the email list or detail page
      router.push("/emails");
      router.refresh();
    } catch (err) {
      console.error("Error saving email:", err);
      setError(typeof err === "string" ? err : (err as Error).message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link href="/emails" className="flex items-center text-purple-600 hover:text-purple-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Emails
        </Link>
      </div>

      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle>Compose New Email</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Error display */}
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
              <p>{error}</p>
            </div>
          )}

          {/* Client selector */}
          <div className="mb-6">
            <Label htmlFor="client">Select Client</Label>
            <Select
              value={selectedClientId || ""}
              onValueChange={handleClientChange}
              disabled={isLoading}
            >
              <SelectTrigger id="client" className="w-full">
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isLoading && <p className="text-sm text-gray-500 mt-1">Loading clients...</p>}
          </div>

          {/* Email editor */}
          {isLoadingTemplate ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading template...</p>
            </div>
          ) : (
            <EmailEditor
              client={selectedClient || undefined}
              initialSubject={initialSubject}
              initialContent={initialContent}
              onSave={handleSaveEmail}
              isSubmitting={isSubmitting}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
} 