"use client";

import { useState, useEffect } from "react";
import { Client } from "@/types";
import { ClientCard } from "./card";
import { clientStorage } from "@/lib/utils";

interface ClientListProps {
  clients: Client[];
  onDelete?: (id: string) => void;
}

export function ClientList({ clients, onDelete }: ClientListProps) {
  const [filteredClients, setFilteredClients] = useState<Client[]>(clients);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [cachedClients, setCachedClients] = useState<Client[]>(clients);
  
  // Try to load from localStorage on first render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const localClients = clientStorage.loadClients();
        if (localClients && localClients.length > 0) {
          setCachedClients(localClients);
        }
      } catch (e) {
        console.error('Error loading clients from localStorage:', e);
      }
    }
  }, []);
  
  // Update cached clients when the prop changes
  useEffect(() => {
    if (clients.length > 0) {
      setCachedClients(prevCached => {
        // If we have fewer clients than before, there might be a missing refresh
        // Keep the higher count between props and cached
        return clients.length >= prevCached.length ? clients : prevCached;
      });
    }
  }, [clients]);
  
  // Apply filters when clients, searchTerm, or filter changes
  useEffect(() => {
    // Use cached clients if available, otherwise use the prop
    const clientsToFilter = cachedClients.length > 0 ? cachedClients : clients;
    let result = [...clientsToFilter];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        client => 
          client.name.toLowerCase().includes(term) || 
          client.email.toLowerCase().includes(term) ||
          (client.phone && client.phone.includes(term)) ||
          (client.tags && client.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }
    
    // Apply relationship level filter
    if (filter !== "all") {
      result = result.filter(client => client.relationshipLevel === filter);
    }
    
    setFilteredClients(result);
  }, [clients, cachedClients, searchTerm, filter]);
  
  // Get unique tags from all clients
  const allTags = Array.from(
    new Set(
      // Use cached clients for tag filtering
      cachedClients
        .filter(client => client.tags && client.tags.length > 0)
        .flatMap(client => client.tags || [])
    )
  );
  
  // Handle deleting a client while preserving state
  const handleDeleteWithStateUpdate = async (id: string) => {
    if (onDelete) {
      try {
        await onDelete(id);
        // Update cached clients
        setCachedClients(prev => prev.filter(client => client.id !== id));
        // Also update localStorage directly
        clientStorage.removeClient(id);
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search clients..."
            className="w-full px-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <select
            className="px-4 py-2 border rounded-md bg-white"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Relationships</option>
            <option value="new">New</option>
            <option value="established">Established</option>
            <option value="close">Close</option>
          </select>
        </div>
      </div>
      
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="text-sm text-gray-500">Filter by tag:</span>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag)}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
      
      <div>
        {filteredClients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.map((client) => (
              <ClientCard 
                key={client.id} 
                client={client} 
                onDelete={handleDeleteWithStateUpdate}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500">No clients found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilter("all");
              }}
              className="mt-2 text-sm text-purple-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 