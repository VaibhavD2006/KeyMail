"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Email, Client } from "@/types";
import { EmailEditor } from "@/components/email/editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function EditEmailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [email, setEmail] = useState<Email | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch email data
  useEffect(() => {
    const fetchEmail = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/emails/${params.id}?includeClient=true`);
        if (!response.ok) {
          throw new Error("Failed to fetch email");
        }

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || "Failed to fetch email");
        }

        setEmail(data.data);
        if (data.data.client) {
          setClient(data.data.client);
        }
      } catch (err) {
        console.error("Error fetching email:", err);
        setError(typeof err === "string" ? err : (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmail();
  }, [params.id]);

  // Handle save
  const handleSaveEmail = async (subject: string, content: string) => {
    if (!email) {
      setError("Email not found");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/emails/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update email");
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Failed to update email");
      }

      // Navigate back to email detail page
      router.push(`/emails/${params.id}?updated=true`);
    } catch (err) {
      console.error("Error updating email:", err);
      setError(typeof err === "string" ? err : (err as Error).message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link 
          href={`/emails/${params.id}`} 
          className="flex items-center text-purple-600 hover:text-purple-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Email
        </Link>
      </div>

      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle>Edit Email</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Error display */}
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
              <p>{error}</p>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="py-8 text-center">
              <p className="text-gray-500">Loading email...</p>
            </div>
          )}

          {/* Email editor */}
          {!loading && email && (
            <EmailEditor
              client={client || undefined}
              initialSubject={email.subject}
              initialContent={email.content}
              onSave={handleSaveEmail}
              isSubmitting={isSubmitting}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
} 