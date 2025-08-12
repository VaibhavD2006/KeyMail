"use client";

import { useState } from "react";
import Link from "next/link";
import { Client } from "@/types";
import { formatDate } from "@/lib/utils";

interface ClientCardProps {
  client: Client;
  onDelete?: (id: string) => void;
}

export function ClientCard({ client, onDelete }: ClientCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this client?")) {
      setIsDeleting(true);
      try {
        if (onDelete) {
          await onDelete(client.id);
        }
      } catch (error) {
        console.error("Error deleting client:", error);
        alert("Failed to delete client");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Calculate days until next birthday or anniversary
  const getNextEvent = () => {
    const today = new Date();
    let nextEvent = null;
    let eventType = "";
    let daysUntil = 0;

    // Check for birthday
    if (client.birthday) {
      const birthDate = new Date(client.birthday);
      const nextBirthday = new Date(
        today.getFullYear(),
        birthDate.getMonth(),
        birthDate.getDate()
      );
      
      // If the birthday has already occurred this year, set it for next year
      if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
      }
      
      const daysToBirthday = Math.ceil(
        (nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      nextEvent = nextBirthday;
      eventType = "Birthday";
      daysUntil = daysToBirthday;
    }

    // Check for closing anniversary
    if (client.closingAnniversary) {
      const closingDate = new Date(client.closingAnniversary);
      const nextAnniversary = new Date(
        today.getFullYear(),
        closingDate.getMonth(),
        closingDate.getDate()
      );
      
      // If the anniversary has already occurred this year, set it for next year
      if (nextAnniversary < today) {
        nextAnniversary.setFullYear(today.getFullYear() + 1);
      }
      
      const daysToAnniversary = Math.ceil(
        (nextAnniversary.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      // If we don't have a birthday or the anniversary is sooner
      if (!nextEvent || daysToAnniversary < daysUntil) {
        nextEvent = nextAnniversary;
        eventType = "Closing Anniversary";
        daysUntil = daysToAnniversary;
      }
    }

    if (nextEvent) {
      return {
        date: formatDate(nextEvent),
        type: eventType,
        daysUntil,
      };
    }

    return null;
  };

  const nextEvent = getNextEvent();
  
  return (
    <div className="flex flex-col p-4 bg-white rounded-lg border shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg">{client.name}</h3>
          <p className="text-sm text-gray-500">{client.email}</p>
          {client.phone && (
            <p className="text-sm text-gray-500">{client.phone}</p>
          )}
        </div>
        <div className="flex flex-col items-end">
          <span className={`px-2 py-1 text-xs rounded-full ${
            client.relationshipLevel === "close" 
              ? "bg-green-100 text-green-800" 
              : client.relationshipLevel === "established"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          }`}>
            {client.relationshipLevel || "New"}
          </span>
          {client.tags && client.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2 justify-end">
              {client.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
              {client.tags.length > 2 && (
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                  +{client.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      
      {nextEvent && (
        <div className="mt-3 p-2 bg-purple-50 rounded text-sm">
          <span className="font-medium">{nextEvent.type}:</span> {nextEvent.date} ({nextEvent.daysUntil} days)
        </div>
      )}
      
      <div className="mt-4 pt-3 border-t flex justify-between items-center">
        <div className="text-xs text-gray-500">
          {client.lastContactDate ? (
            <>Last contact: {formatDate(new Date(client.lastContactDate))}</>
          ) : (
            <>No recent contact</>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/emails/compose?clientId=${client.id}`}
            className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200"
          >
            Email
          </Link>
          <Link
            href={`/clients/${client.id}`}
            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
          >
            View
          </Link>
          <Link
            href={`/clients/${client.id}/edit`}
            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 disabled:opacity-50"
          >
            {isDeleting ? "..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
} 