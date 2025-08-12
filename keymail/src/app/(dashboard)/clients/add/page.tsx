"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ClientForm } from "@/components/forms/client-form";
import { ClientFormData } from "@/types";
import { clientStorage } from "@/lib/utils";

export default function AddClientPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: ClientFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Ensure required fields have values
      const clientData = {
        ...formData,
        status: formData.status || "active",
        tags: formData.tags || [],
        createdAt: new Date().toISOString(), // Explicitly add timestamps
        updatedAt: new Date().toISOString()
      };

      const response = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache"
        },
        body: JSON.stringify(clientData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to create client");
      }
      
      if (!data.success) {
        throw new Error(data.error || "Failed to create client");
      }
      
      // Also save directly to localStorage as a backup
      if (data.data) {
        clientStorage.addClient(data.data);
      }
      
      // Navigate back to clients list
      // Add a timestamp parameter to force a refresh
      router.push(`/clients?refresh=${Date.now()}`);
      router.refresh(); // Force Next.js router to refresh

      // Add an explicit manual refetch
      try {
        await fetch("/api/clients", {
          cache: "no-store",
          headers: { 
            "Pragma": "no-cache",
            "Cache-Control": "no-cache" 
          }
        });
      } catch (refetchErr) {
        console.error("Error prefetching client data:", refetchErr);
      }
    } catch (err) {
      console.error("Error creating client:", err);
      setError(typeof err === "string" ? err : (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Add New Client</h1>
        <Link
          href="/clients"
          className="text-gray-500 hover:text-gray-700"
        >
          &larr; Back to Clients
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          <p>{error}</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <ClientForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
} 