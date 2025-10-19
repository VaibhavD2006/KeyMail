"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface EmailListProps {
  emails: Email[];
  loading: boolean;
  error: string | null;
  onDelete: (id: string) => Promise<void>;
  onToggleFavorite: (id: string) => Promise<void>;
  onMarkAsSent: (id: string) => Promise<void>;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function EmailList({
  emails,
  loading,
  error,
  onDelete,
  onToggleFavorite,
  onMarkAsSent,
  currentPage,
  totalPages,
  onPageChange,
}: EmailListProps) {
  const router = useRouter();
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  // Handle delete with confirmation
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this email?")) {
      setActionLoading((prev) => ({ ...prev, [`delete-${id}`]: true }));
      try {
        await onDelete(id);
      } finally {
        setActionLoading((prev) => ({ ...prev, [`delete-${id}`]: false }));
      }
    }
  };

  // Handle favorite toggle
  const handleToggleFavorite = async (id: string) => {
    setActionLoading((prev) => ({ ...prev, [`favorite-${id}`]: true }));
    try {
      await onToggleFavorite(id);
    } finally {
      setActionLoading((prev) => ({ ...prev, [`favorite-${id}`]: false }));
    }
  };

  // Handle mark as sent
  const handleMarkAsSent = async (id: string) => {
    setActionLoading((prev) => ({ ...prev, [`send-${id}`]: true }));
    try {
      await onMarkAsSent(id);
    } finally {
      setActionLoading((prev) => ({ ...prev, [`send-${id}`]: false }));
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

  // Loader skeleton for the list
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((index) => (
          <Card key={index} className="border border-gray-200">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/4 mt-2" />
            </CardHeader>
            <CardContent className="pb-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full mt-2" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  // Show error message
  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (emails.length === 0) {
    return (
      <Card className="border-dashed border-2 border-gray-200">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-500 mb-4">No emails found</p>
          <Link href="/emails/compose">
            <Button>Create Your First Email</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        {emails.map((email) => (
          <Card key={email.id} className="border border-gray-200 hover:border-purple-200 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold">
                    <Link
                      href={`/emails/${email.id}`}
                      className="hover:text-purple-600 transition-colors"
                    >
                      {email.subject}
                    </Link>
                    {email.isFavorite && (
                      <Star
                        className="inline-block ml-2 h-4 w-4 text-amber-400 fill-amber-400"
                        aria-label="Favorite"
                      />
                    )}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    {email.client && (
                      <Link
                        href={`/clients/${email.client.id}`}
                        className="text-gray-600 hover:text-purple-600 transition-colors"
                      >
                        To: {email.client.name}
                      </Link>
                    )}
                    <span className="mx-2">•</span>
                    {getStatusBadge(email.status)}
                    <span className="mx-2">•</span>
                    <span className="text-gray-500 text-xs">
                      {email.status === "sent"
                        ? `Sent ${formatDate(email.sentDate!)}`
                        : email.status === "scheduled"
                        ? `Scheduled for ${formatDate(email.scheduledDate!)}`
                        : `Last updated ${formatDate(email.updatedAt)}`}
                    </span>
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => router.push(`/emails/${email.id}`)}
                    >
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push(`/emails/${email.id}/edit`)}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleToggleFavorite(email.id)}
                      disabled={actionLoading[`favorite-${email.id}`]}
                    >
                      {email.isFavorite ? "Remove from favorites" : "Add to favorites"}
                    </DropdownMenuItem>
                    {email.status === "draft" && (
                      <DropdownMenuItem
                        onClick={() => handleMarkAsSent(email.id)}
                        disabled={actionLoading[`send-${email.id}`]}
                      >
                        Mark as sent
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDelete(email.id)}
                      disabled={actionLoading[`delete-${email.id}`]}
                      className="text-red-600"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-gray-600 line-clamp-2">
                {email.content.substring(0, 200)}
                {email.content.length > 200 ? "..." : ""}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-600"
                  onClick={() => router.push(`/emails/${email.id}`)}
                >
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-purple-600"
                  onClick={() => router.push(`/emails/${email.id}/edit`)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
              <div className="flex space-x-2">
                {email.status === "draft" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-green-600"
                    onClick={() => handleMarkAsSent(email.id)}
                    disabled={actionLoading[`send-${email.id}`]}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    {actionLoading[`send-${email.id}`] ? "Marking..." : "Mark Sent"}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-amber-600"
                  onClick={() => handleToggleFavorite(email.id)}
                  disabled={actionLoading[`favorite-${email.id}`]}
                >
                  <Star
                    className={`h-4 w-4 mr-1 ${
                      email.isFavorite ? "fill-amber-400" : ""
                    }`}
                  />
                  {actionLoading[`favorite-${email.id}`]
                    ? "Updating..."
                    : email.isFavorite
                    ? "Favorited"
                    : "Favorite"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600"
                  onClick={() => handleDelete(email.id)}
                  disabled={actionLoading[`delete-${email.id}`]}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  {actionLoading[`delete-${email.id}`] ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
} 