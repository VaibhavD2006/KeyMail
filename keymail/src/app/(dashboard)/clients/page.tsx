"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ClientList } from "@/components/client/list";
import { Client } from "@/types";
import { clientStorage } from "@/lib/utils";

export default function ClientsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Get search and filter parameters from URL
  const search = searchParams.get("search") || "";
  const relationshipLevel = searchParams.get("relationshipLevel") || "all";
  const tag = searchParams.get("tag") || "";
  
  // Try to initialize from localStorage on first mount 
  useEffect(() => {
    // Don't show loading indicator if we have data from localStorage
    const localClients = clientStorage.loadClients();
    if (localClients && localClients.length > 0) {
      setClients(localClients);
      setLoading(false);
    }
  }, []);
  
  // Fetch clients on initial load and when parameters change
  useEffect(() => {
    const fetchClients = async () => {
      // Don't set loading state if we already have clients, to avoid flickering
      if (clients.length === 0) {
        setLoading(true);
      }
      setError(null);
      
      try {
        // Build query string with parameters
        const queryParams = new URLSearchParams();
        queryParams.append("page", page.toString());
        queryParams.append("limit", "12");
        
        if (search) {
          queryParams.append("search", search);
        }
        
        if (relationshipLevel !== "all") {
          queryParams.append("relationshipLevel", relationshipLevel);
        }
        
        if (tag) {
          queryParams.append("tag", tag);
        }
        
        const response = await fetch(`/api/clients?${queryParams.toString()}`, {
          cache: 'no-store', 
          next: { revalidate: 0 },
          headers: { 
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache' 
          }
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || "Failed to fetch clients");
        }
        
        setClients(data.data.items);
        setTotalPages(Math.ceil(data.data.total / data.data.limit));
        
        // Also update localStorage
        if (data.data.items.length > 0) {
          clientStorage.saveClients(data.data.items);
        }
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError(typeof err === "string" ? err : (err as Error).message);
        
        // If API fetch fails, try loading from localStorage as fallback
        const localClients = clientStorage.loadClients();
        if (localClients && localClients.length > 0) {
          setClients(localClients);
        } else {
          setClients([]);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchClients();
  }, [page, search, relationshipLevel, tag]);
  
  // Add an effect to refresh data when the component gains focus (user navigates back)
  useEffect(() => {
    // Function to refresh data when the window gets focus
    const handleFocus = () => {
      // Only refresh if we already have loaded data
      if (!loading) {
        const fetchClients = async () => {
          try {
            const queryParams = new URLSearchParams();
            queryParams.append("page", page.toString());
            queryParams.append("limit", "12");
            
            if (search) {
              queryParams.append("search", search);
            }
            
            if (relationshipLevel !== "all") {
              queryParams.append("relationshipLevel", relationshipLevel);
            }
            
            if (tag) {
              queryParams.append("tag", tag);
            }
            
            const response = await fetch(`/api/clients?${queryParams.toString()}`, {
              cache: 'no-store',
              next: { revalidate: 0 },
              headers: { 
                'Pragma': 'no-cache',
                'Cache-Control': 'no-cache' 
              }
            });
            
            if (!response.ok) {
              throw new Error("Failed to fetch clients");
            }
            
            const data = await response.json();
            
            if (!data.success) {
              throw new Error(data.error || "Failed to fetch clients");
            }
            
            setClients(data.data.items);
            setTotalPages(Math.ceil(data.data.total / data.data.limit));
          } catch (err) {
            console.error("Error refreshing clients:", err);
          }
        };
        
        fetchClients();
      }
    };

    // Add event listener for when the window gains focus
    window.addEventListener('focus', handleFocus);
    
    // Clean up the event listener
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [page, search, relationshipLevel, tag, loading]);
  
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete client");
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Failed to delete client");
      }
      
      // Remove deleted client from state
      setClients(clients.filter(client => client.id !== id));
    } catch (err) {
      console.error("Error deleting client:", err);
      alert(typeof err === "string" ? err : (err as Error).message);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Link
          href="/clients/add"
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          Add Client
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading clients...</p>
        </div>
      ) : (
        <>
          <ClientList clients={clients} onDelete={handleDelete} />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              
              <span className="text-sm">
                Page {page} of {totalPages}
              </span>
              
              <button
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 