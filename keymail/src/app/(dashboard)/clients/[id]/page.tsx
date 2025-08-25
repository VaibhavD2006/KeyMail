"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Client } from "@/types";
import { formatDate } from "@/lib/utils";

interface ClientPageProps {
  params: {
    id: string;
  };
}

export default function ClientPage({ params }: ClientPageProps) {
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch client data
  useEffect(() => {
    const fetchClient = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/crm/${params.id}`, {
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

  // Add an extra cache for client data to prevent loss on re-render
  useEffect(() => {
    if (client) {
      sessionStorage.setItem(`client-${params.id}`, JSON.stringify(client));
    }
  }, [client, params.id]);

  // Try to recover client from sessionStorage if it's missing
  useEffect(() => {
    if (!client && !loading && !error) {
      try {
        const cachedClient = sessionStorage.getItem(`client-${params.id}`);
        if (cachedClient) {
          setClient(JSON.parse(cachedClient));
        }
      } catch (err) {
        console.error("Error recovering client from cache:", err);
      }
    }
  }, [client, loading, error, params.id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this client?")) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/crm/${params.id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete client");
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Failed to delete client");
      }
      
      // Navigate back to clients list
      router.push("/clients");
      router.refresh();
    } catch (err) {
      console.error("Error deleting client:", err);
      alert(typeof err === "string" ? err : (err as Error).message);
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading client details...</p>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{client.name}</h1>
        <div className="flex space-x-3">
          <Link
            href={`/clients/${params.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Edit
          </Link>
          <Link
            href={`/emails/compose?clientId=${params.id}`}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            Email
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
          <Link
            href="/clients"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Back
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{client.email}</p>
              </div>
              
              {client.phone && (
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{client.phone}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-gray-500">Relationship Level</p>
                <p className="inline-flex items-center">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    client.relationshipLevel === "close" 
                      ? "bg-green-100 text-green-800" 
                      : client.relationshipLevel === "established"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {client.relationshipLevel || "New"}
                  </span>
                </p>
              </div>
              
              {client.yearsKnown && (
                <div>
                  <p className="text-sm text-gray-500">Years Known</p>
                  <p className="font-medium">{client.yearsKnown}</p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-4">Important Dates</h2>
            <div className="space-y-4">
              {client.birthday && (
                <div>
                  <p className="text-sm text-gray-500">Birthday</p>
                  <p className="font-medium">{formatDate(new Date(client.birthday))}</p>
                </div>
              )}
              
              {client.closingAnniversary && (
                <div>
                  <p className="text-sm text-gray-500">Closing Anniversary</p>
                  <p className="font-medium">{formatDate(new Date(client.closingAnniversary))}</p>
                </div>
              )}
              
              {client.lastContactDate && (
                <div>
                  <p className="text-sm text-gray-500">Last Contact</p>
                  <p className="font-medium">{formatDate(new Date(client.lastContactDate))}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-gray-500">Client Since</p>
                <p className="font-medium">{formatDate(new Date(client.createdAt))}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t">
          <h2 className="text-lg font-semibold mb-4">Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Communication Frequency</p>
              <p className="font-medium">{client.preferences?.communicationFrequency || "Monthly"}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Preferred Contact Method</p>
              <p className="font-medium">{client.preferences?.preferredContactMethod || "Email"}</p>
            </div>
          </div>
        </div>
        
        {client.tags && client.tags.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h2 className="text-lg font-semibold mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {client.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 