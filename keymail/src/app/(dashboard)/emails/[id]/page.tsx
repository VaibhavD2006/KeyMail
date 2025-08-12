"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Email } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Trash2,
  Star,
  Send,
  Clock,
  CheckCircle,
  Archive,
  ArrowLeft,
  User,
  Calendar,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function EmailDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [email, setEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [isMarkingAsSent, setIsMarkingAsSent] = useState(false);

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
      } catch (err) {
        console.error("Error fetching email:", err);
        setError(typeof err === "string" ? err : (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmail();
  }, [params.id]);

  // Handle delete with confirmation
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this email?")) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/emails/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete email");
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Failed to delete email");
      }

      // Navigate back to emails list
      router.push("/emails");
    } catch (err) {
      console.error("Error deleting email:", err);
      setError(typeof err === "string" ? err : (err as Error).message);
      setIsDeleting(false);
    }
  };

  // Toggle favorite status
  const handleToggleFavorite = async () => {
    if (!email) return;

    setIsTogglingFavorite(true);
    setError(null);

    try {
      const response = await fetch(`/api/emails/${params.id}/favorite`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to toggle favorite status");
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Failed to toggle favorite status");
      }

      // Update email in state
      setEmail({ ...email, isFavorite: !email.isFavorite });
    } catch (err) {
      console.error("Error toggling favorite status:", err);
      setError(typeof err === "string" ? err : (err as Error).message);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  // Mark as sent
  const handleMarkAsSent = async () => {
    if (!email) return;

    setIsMarkingAsSent(true);
    setError(null);

    try {
      const response = await fetch(`/api/emails/${params.id}/send`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to mark email as sent");
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Failed to mark email as sent");
      }

      // Update email in state
      setEmail({ ...email, status: "sent", sentDate: new Date() });
    } catch (err) {
      console.error("Error marking email as sent:", err);
      setError(typeof err === "string" ? err : (err as Error).message);
    } finally {
      setIsMarkingAsSent(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="outline" className="text-gray-600 border-gray-300">
            <Clock className="w-3 h-3 mr-1" />
            Draft
          </Badge>
        );
      case "scheduled":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-300">
            <Clock className="w-3 h-3 mr-1" />
            Scheduled
          </Badge>
        );
      case "sent":
        return (
          <Badge variant="outline" className="text-green-600 border-green-300">
            <CheckCircle className="w-3 h-3 mr-1" />
            Sent
          </Badge>
        );
      case "archived":
        return (
          <Badge variant="outline" className="text-amber-600 border-amber-300">
            <Archive className="w-3 h-3 mr-1" />
            Archived
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-gray-600 border-gray-300">
            {status}
          </Badge>
        );
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

      {/* Error display */}
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-24" />
          </CardFooter>
        </Card>
      )}

      {/* Email details */}
      {!loading && email && (
        <Card>
          <CardHeader className="border-b bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-bold flex items-center">
                  {email.subject}
                  {email.isFavorite && (
                    <Star
                      className="ml-2 h-5 w-5 text-amber-400 fill-amber-400"
                      aria-label="Favorite"
                    />
                  )}
                </CardTitle>
                <CardDescription className="mt-2 flex flex-wrap items-center gap-2">
                  {getStatusBadge(email.status)}
                  <span className="text-gray-500">
                    {email.status === "sent"
                      ? `Sent on ${formatDate(email.sentDate!)}`
                      : email.status === "scheduled"
                      ? `Scheduled for ${formatDate(email.scheduledDate!)}`
                      : `Last updated ${formatDate(email.updatedAt)}`}
                  </span>
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-purple-600"
                  onClick={() => router.push(`/emails/${email.id}/edit`)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-amber-600"
                  onClick={handleToggleFavorite}
                  disabled={isTogglingFavorite}
                >
                  <Star
                    className={`h-4 w-4 mr-1 ${
                      email.isFavorite ? "fill-amber-400" : ""
                    }`}
                  />
                  {isTogglingFavorite
                    ? "Updating..."
                    : email.isFavorite
                    ? "Favorited"
                    : "Favorite"}
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Client information */}
          {email.client && (
            <div className="p-4 bg-purple-50 border-b">
              <div className="flex items-center">
                <User className="h-4 w-4 text-purple-600 mr-2" />
                <span className="font-medium">To:</span>
                <Link
                  href={`/clients/${email.client.id}`}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  {email.client.name}
                </Link>
                <span className="ml-2 text-gray-600">({email.client.email})</span>
              </div>
            </div>
          )}

          {/* Email content */}
          <CardContent className="p-6">
            <div className="prose max-w-none">
              {email.content.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </CardContent>

          {/* Action buttons */}
          <CardFooter className="border-t bg-gray-50 flex justify-between">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="text-red-600"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
            <div className="flex space-x-2">
              {email.status === "draft" && (
                <Button
                  variant="outline"
                  className="text-green-600"
                  onClick={handleMarkAsSent}
                  disabled={isMarkingAsSent}
                >
                  <Send className="h-4 w-4 mr-1" />
                  {isMarkingAsSent ? "Marking..." : "Mark as Sent"}
                </Button>
              )}
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => router.push(`/emails/${email.id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit Email
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
} 