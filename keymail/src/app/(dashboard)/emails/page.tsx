"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { EmailList } from "@/components/email/list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PenSquare, Search, X, Filter } from "lucide-react";
import { Email } from "@/types";

function EmailsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(false);

  // Show saved message
  const savedParam = searchParams.get("saved");
  const [showSavedMessage, setShowSavedMessage] = useState(!!savedParam);

  // Clear saved message after a few seconds
  useEffect(() => {
    if (showSavedMessage) {
      const timer = setTimeout(() => {
        setShowSavedMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSavedMessage]);

  // Fetch emails with the current filters
  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true);
      setError(null);

      try {
        // Build URL with parameters
        let url = `/api/emails?page=${currentPage}&includeClient=true`;

        if (searchTerm) {
          url += `&search=${encodeURIComponent(searchTerm)}`;
        }

        if (statusFilter && statusFilter !== "all") {
          url += `&status=${encodeURIComponent(statusFilter)}`;
        }

        url += `&sortBy=${sortBy}&sortDirection=${sortDirection}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch emails");
        }

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || "Failed to fetch emails");
        }

        setEmails(data.data);
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        console.error("Error fetching emails:", err);
        setError(typeof err === "string" ? err : (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [currentPage, searchTerm, statusFilter, sortBy, sortDirection]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset page when search changes
  };

  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset page when filter changes
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1); // Reset page when sort changes
  };

  // Handle sort direction change
  const handleSortDirectionChange = (value: "asc" | "desc") => {
    setSortDirection(value);
    setCurrentPage(1); // Reset page when sort direction changes
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSortBy("createdAt");
    setSortDirection("desc");
    setCurrentPage(1);
  };

  // Delete an email
  const handleDeleteEmail = async (id: string) => {
    try {
      const response = await fetch(`/api/emails/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete email");
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Failed to delete email");
      }

      // Remove the deleted email from the list
      setEmails(emails.filter((email) => email.id !== id));
    } catch (err) {
      console.error("Error deleting email:", err);
      setError(typeof err === "string" ? err : (err as Error).message);
    }
  };

  // Toggle favorite status
  const handleToggleFavorite = async (id: string) => {
    try {
      const response = await fetch(`/api/emails/${id}/favorite`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to toggle favorite status");
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Failed to toggle favorite status");
      }

      // Update email in the list
      setEmails(
        emails.map((email) =>
          email.id === id
            ? { ...email, isFavorite: !email.isFavorite }
            : email
        )
      );
    } catch (err) {
      console.error("Error toggling favorite status:", err);
      setError(typeof err === "string" ? err : (err as Error).message);
    }
  };

  // Mark as sent
  const handleMarkAsSent = async (id: string) => {
    try {
      const response = await fetch(`/api/emails/${id}/send`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to mark email as sent");
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Failed to mark email as sent");
      }

      // Update email in the list
      setEmails(
        emails.map((email) =>
          email.id === id
            ? { ...email, status: "sent", sentDate: new Date() }
            : email
        )
      );
    } catch (err) {
      console.error("Error marking email as sent:", err);
      setError(typeof err === "string" ? err : (err as Error).message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Page header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Emails</h1>
          <p className="text-gray-600">Manage your email communications</p>
        </div>
        <Link href="/emails/compose">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <PenSquare className="h-4 w-4 mr-2" />
            Compose New Email
          </Button>
        </Link>
      </div>

      {/* Success message */}
      {showSavedMessage && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6 flex justify-between items-center">
          <p>Email saved successfully!</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSavedMessage(false)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Search and filters */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Emails</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="h-8"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>
          <CardDescription>
            {statusFilter !== "all"
              ? `Showing ${statusFilter} emails`
              : "Showing all emails"}
            {searchTerm && ` matching "${searchTerm}"`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search emails..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit">Search</Button>
              {(searchTerm || statusFilter !== "all" || sortBy !== "createdAt" || sortDirection !== "desc") && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearFilters}
                >
                  Clear
                </Button>
              )}
            </div>
          </form>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <Label htmlFor="status-filter">Status</Label>
                <Select
                  value={statusFilter}
                  onValueChange={handleStatusFilterChange}
                >
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Drafts</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sort-by">Sort By</Label>
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger id="sort-by">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Date Created</SelectItem>
                    <SelectItem value="updatedAt">Date Updated</SelectItem>
                    <SelectItem value="scheduledDate">Scheduled Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sort-direction">Direction</Label>
                <Select
                  value={sortDirection}
                  onValueChange={(value) =>
                    handleSortDirectionChange(value as "asc" | "desc")
                  }
                >
                  <SelectTrigger id="sort-direction">
                    <SelectValue placeholder="Sort direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Newest First</SelectItem>
                    <SelectItem value="asc">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email list */}
      <EmailList
        emails={emails}
        loading={loading}
        error={error}
        onDelete={handleDeleteEmail}
        onToggleFavorite={handleToggleFavorite}
        onMarkAsSent={handleMarkAsSent}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default function EmailsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading emails...</div>}>
      <EmailsPageContent />
    </Suspense>
  );
}