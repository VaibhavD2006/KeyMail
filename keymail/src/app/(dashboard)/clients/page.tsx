"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ClientList } from "@/components/client/list";
import { Client } from "@/types";
import { clientStorage } from "@/lib/utils";

function ClientsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tags, setTags] = useState<{ _id: string; count: number }[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
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
        queryParams.append("pageSize", "12");
        
        if (search) {
          queryParams.append("q", search);
        }
        
        if (tag) {
          queryParams.append("tag", tag);
        }
        // Include multi-tag filters
        for (const t of selectedTags) {
          queryParams.append("tag", t);
        }
        
        const response = await fetch(`/api/crm?${queryParams.toString()}`, {
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
        
        setClients(data.data.items as any);
        setTotalPages(Math.ceil(data.data.total / data.data.pageSize));
        
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
  }, [page, search, relationshipLevel, tag, selectedTags.join(",")]);

  // Fetch tag analytics
  useEffect(() => {
    const loadTags = async () => {
      try {
        const res = await fetch('/api/crm/tags', { cache: 'no-store', next: { revalidate: 0 } });
        if (!res.ok) return;
        const json = await res.json();
        if (json?.data) setTags(json.data);
      } catch (e) {
        console.warn('Failed to load tags');
      }
    };
    loadTags();
  }, []);
  
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
            queryParams.append("pageSize", "12");
            
            if (search) {
              queryParams.append("q", search);
            }
            
            if (tag) {
              queryParams.append("tag", tag);
            }
            for (const t of selectedTags) {
              queryParams.append("tag", t);
            }
            
            const response = await fetch(`/api/crm?${queryParams.toString()}`, {
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
            
            setClients(data.data.items as any);
            setTotalPages(Math.ceil(data.data.total / data.data.pageSize));
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
      const response = await fetch(`/api/crm/${id}`, {
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
      
      {/* Tag Analytics */}
      {tags.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-700">Popular Tags</h2>
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="text-xs text-purple-600 hover:underline"
              >
                Clear selected
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map(t => {
              const active = selectedTags.includes(t._id);
              return (
                <button
                  key={t._id}
                  onClick={() => setSelectedTags(prev => active ? prev.filter(x => x !== t._id) : [...prev, t._id])}
                  className={`text-xs px-2 py-1 rounded border ${active ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                  title={`${t.count} contact${t.count !== 1 ? 's' : ''}`}
                >
                  {t._id} <span className="opacity-60">({t.count})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

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

export default function ClientsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8"><div className="text-center py-12"><div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div><p className="mt-4 text-gray-500">Loading clients...</p></div></div>}>
      <ClientsPageContent />
    </Suspense>
  );
}