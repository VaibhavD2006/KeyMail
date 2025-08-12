"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ClientForm } from "@/components/forms/client-form";
import { Client, ClientFormData } from "@/types";

interface EditClientPageProps {
  params: {
    id: string;
  };
}

export default function EditClientPage({ params }: EditClientPageProps) {
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch client data
  useEffect(() => {
    const fetchClient = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/clients/${params.id}`, {
          cache: 'no-store',
          next: { revalidate: 0 },
          headers: { 
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache' 
          }
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch client");
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || "Failed to fetch client");
        }
        
        setClient(data.data);
      } catch (err) {
        console.error("Error fetching client:", err);
        setError(typeof err === "string" ? err : (err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClient();
  }, [params.id]);

  // Try to recover client from sessionStorage if it's missing
  useEffect(() => {
    if (!client) {
      try {
        const cachedClient = sessionStorage.getItem(`client-${params.id}`);
        if (cachedClient) {
          setClient(JSON.parse(cachedClient));
        }
      } catch (err) {
        console.error("Error recovering client from cache:", err);
      }
    }
  }, [params.id, client]);

  const handleSubmit = async (formData: ClientFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/clients/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to update client");
      }
      
      if (!data.success) {
        throw new Error(data.error || "Failed to update client");
      }
      
      // Navigate back to client detail page
      router.push(`/clients/${params.id}`);
      router.refresh();
    } catch (err) {
      console.error("Error updating client:", err);
      setError(typeof err === "string" ? err : (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading client data...</p>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-500 p-4 rounded-md">
          <p>{error || "Client not found"}</p>
          <Link href="/clients" className="text-purple-600 hover:underline mt-2 inline-block">
            Back to Clients
          </Link>
        </div>
      </div>
    );
  }

  // Transform client data to form data format
  const initialFormData: ClientFormData = {
    name: client.name,
    email: client.email,
    phone: client.phone || "",
    birthday: client.birthday ? new Date(client.birthday).toISOString().split("T")[0] : "",
    closingAnniversary: client.closingAnniversary ? new Date(client.closingAnniversary).toISOString().split("T")[0] : "",
    yearsKnown: client.yearsKnown,
    relationshipLevel: client.relationshipLevel || "new",
    tags: client.tags || [],
    customFields: client.customFields || {},
    preferences: {
      communicationFrequency: client.preferences?.communicationFrequency || "monthly",
      preferredContactMethod: client.preferences?.preferredContactMethod || "email",
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Client: {client.name}</h1>
        <div className="flex space-x-3">
          <Link
            href={`/clients/${params.id}`}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Cancel
          </Link>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          <p>{error}</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <ClientForm
          initialData={initialFormData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
} 