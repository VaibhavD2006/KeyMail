"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Calendar, 
  Users, 
  Home, 
  Mail, 
  Send, 
  RefreshCw, 
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Eye
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
}

interface Listing {
  id: string;
  mlsId: string;
  address: string;
  city: string;
  state: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
}

interface Showing {
  id: string;
  clientId: string;
  listingId: string;
  scheduledAt: string;
  completedAt?: string;
  agentNotes?: string;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  followUpSent: boolean;
  followUpSentAt?: string;
  client?: Client;
  listing?: Listing;
}

export default function ShowingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showings, setShowings] = useState<Showing[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "scheduled" | "completed" | "cancelled" | "no_show">("all");
  const [filterFollowUp, setFilterFollowUp] = useState<"all" | "pending" | "sent">("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [selectedShowings, setSelectedShowings] = useState<string[]>([]);
  const [followUpData, setFollowUpData] = useState({
    emailTemplate: "",
    customMessage: "",
    tone: "professional" as "professional" | "casual" | "urgent",
    includeFeedbackRequest: true,
  });

  // Form state for creating new showing
  const [newShowing, setNewShowing] = useState({
    clientId: "",
    listingId: "",
    scheduledAt: "",
    agentNotes: "",
  });

  useEffect(() => {
    fetchShowings();
    fetchClients();
    fetchListings();
  }, [filterStatus, filterFollowUp]);

  const fetchShowings = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filterStatus !== "all") {
        params.append("status", filterStatus);
      }

      const response = await fetch(`/api/showings?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch showings");
      }

      const data = await response.json();
      let filteredShowings = data.data || [];

      // Apply follow-up filter
      if (filterFollowUp === "pending") {
        filteredShowings = filteredShowings.filter((s: Showing) => !s.followUpSent);
      } else if (filterFollowUp === "sent") {
        filteredShowings = filteredShowings.filter((s: Showing) => s.followUpSent);
      }

      setShowings(filteredShowings);
    } catch (error) {
      console.error("Error fetching showings:", error);
      setError("Failed to load showings");
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients");
      if (response.ok) {
        const data = await response.json();
        setClients(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchListings = async () => {
    try {
      const response = await fetch("/api/listings");
      if (response.ok) {
        const data = await response.json();
        setListings(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  const createShowing = async () => {
    if (!newShowing.clientId || !newShowing.listingId || !newShowing.scheduledAt) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/showings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newShowing,
          scheduledAt: new Date(newShowing.scheduledAt).toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create showing");
      }

      // Reset form and refresh
      setNewShowing({
        clientId: "",
        listingId: "",
        scheduledAt: "",
        agentNotes: "",
      });
      setShowCreateForm(false);
      await fetchShowings();
      
      alert("Showing created successfully!");
    } catch (error) {
      console.error("Error creating showing:", error);
      setError(error instanceof Error ? error.message : "Failed to create showing");
    } finally {
      setLoading(false);
    }
  };

  const updateShowingStatus = async (showingId: string, status: string) => {
    try {
      const updateData: any = { status };
      if (status === "completed") {
        updateData.completedAt = new Date().toISOString();
      }

      const response = await fetch("/api/showings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          showingId,
          ...updateData,
        }),
      });

      if (response.ok) {
        await fetchShowings();
      }
    } catch (error) {
      console.error("Error updating showing:", error);
    }
  };

  const sendFollowUpEmail = async (showingId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/showings/follow-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          showingId,
          ...followUpData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send follow-up email");
      }

      await fetchShowings();
      alert("Follow-up email sent successfully!");
    } catch (error) {
      console.error("Error sending follow-up email:", error);
      setError(error instanceof Error ? error.message : "Failed to send follow-up email");
    } finally {
      setLoading(false);
    }
  };

  const sendBulkFollowUps = async () => {
    if (selectedShowings.length === 0) {
      setError("Please select at least one showing");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/showings/follow-up/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          showingIds: selectedShowings,
          ...followUpData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send bulk follow-ups");
      }

      const data = await response.json();
      alert(`Successfully sent ${data.data.successful} follow-up emails!`);
      
      setSelectedShowings([]);
      setShowFollowUpModal(false);
      await fetchShowings();
    } catch (error) {
      console.error("Error sending bulk follow-ups:", error);
      setError(error instanceof Error ? error.message : "Failed to send bulk follow-ups");
    } finally {
      setLoading(false);
    }
  };

  const filteredShowings = showings.filter(showing => {
    const matchesSearch = 
      showing.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      showing.listing?.mlsId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      showing.listing?.address?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "no_show": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled": return <Clock className="h-4 w-4" />;
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "cancelled": return <XCircle className="h-4 w-4" />;
      case "no_show": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Showings Management</h1>
          <p className="text-gray-600 mt-2">
            Schedule, track, and automate follow-ups for property showings
          </p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={() => setShowFollowUpModal(true)}
            disabled={selectedShowings.length === 0}
            className="flex items-center"
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Follow-ups ({selectedShowings.length})
          </Button>
          <Button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Showing
          </Button>
        </div>
      </div>

      {/* Create Showing Form */}
      {showCreateForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Schedule New Showing</CardTitle>
            <CardDescription>
              Create a new property showing appointment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientId">Client *</Label>
                <Select value={newShowing.clientId} onValueChange={(value) => setNewShowing({...newShowing, clientId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} ({client.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="listingId">Property *</Label>
                <Select value={newShowing.listingId} onValueChange={(value) => setNewShowing({...newShowing, listingId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a property" />
                  </SelectTrigger>
                  <SelectContent>
                    {listings.map((listing) => (
                      <SelectItem key={listing.id} value={listing.id}>
                        MLS #{listing.mlsId} - {listing.address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledAt">Date & Time *</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={newShowing.scheduledAt}
                  onChange={(e) => setNewShowing({...newShowing, scheduledAt: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agentNotes">Agent Notes</Label>
                <Textarea
                  id="agentNotes"
                  value={newShowing.agentNotes}
                  onChange={(e) => setNewShowing({...newShowing, agentNotes: e.target.value})}
                  placeholder="Any special instructions or notes..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button onClick={createShowing} disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                {loading ? "Creating..." : "Schedule Showing"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search showings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no_show">No Show</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterFollowUp} onValueChange={(value: any) => setFilterFollowUp(value)}>
                <SelectTrigger className="w-32">
                  <Mail className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Follow-ups</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Showings List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Property Showings ({filteredShowings.length})
          </CardTitle>
          <CardDescription>
            Manage all scheduled and completed property showings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              Loading showings...
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : filteredShowings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No showings found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterStatus !== "all" || filterFollowUp !== "all"
                  ? "Try adjusting your search or filters"
                  : "Schedule your first property showing to get started"
                }
              </p>
              {!searchTerm && filterStatus === "all" && filterFollowUp === "all" && (
                <Button onClick={() => setShowCreateForm(true)} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Showing
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredShowings.map((showing) => (
                <div key={showing.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {showing.client?.name}
                          </span>
                          <span className="text-sm text-gray-500">→</span>
                          <span className="text-sm font-medium text-gray-900">
                            MLS #{showing.listing?.mlsId}
                          </span>
                        </div>
                        
                        <Badge 
                          variant="secondary" 
                          className={getStatusColor(showing.status)}
                        >
                          {getStatusIcon(showing.status)}
                          <span className="ml-1">{showing.status.replace("_", " ")}</span>
                        </Badge>

                        {showing.followUpSent && (
                          <Badge variant="outline" className="text-green-700 border-green-200">
                            <Mail className="h-3 w-3 mr-1" />
                            Follow-up Sent
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Scheduled</p>
                          <p className="font-medium text-sm">
                            {new Date(showing.scheduledAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(showing.scheduledAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Property</p>
                          <p className="font-medium text-sm">
                            {showing.listing?.address}<br />
                            <span className="text-gray-600">
                              {showing.listing?.city}, {showing.listing?.state}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Price</p>
                          <p className="font-semibold text-green-600">
                            ${showing.listing?.price?.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Beds/Baths</p>
                          <p className="font-medium text-sm">
                            {showing.listing?.bedrooms} / {showing.listing?.bathrooms}
                          </p>
                        </div>
                      </div>

                      {showing.agentNotes && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Agent Notes:</p>
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {showing.agentNotes}
                          </p>
                        </div>
                      )}

                      {showing.completedAt && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500">Completed: {new Date(showing.completedAt).toLocaleString()}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <Checkbox
                        checked={selectedShowings.includes(showing.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedShowings([...selectedShowings, showing.id]);
                          } else {
                            setSelectedShowings(selectedShowings.filter(id => id !== showing.id));
                          }
                        }}
                      />
                      
                      <div className="flex flex-col space-y-1">
                        {showing.status === "scheduled" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateShowingStatus(showing.id, "completed")}
                              className="text-green-600 border-green-200 hover:bg-green-50"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Complete
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateShowingStatus(showing.id, "cancelled")}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Cancel
                            </Button>
                          </>
                        )}
                        
                        {showing.status === "completed" && !showing.followUpSent && (
                          <Button
                            size="sm"
                            onClick={() => sendFollowUpEmail(showing.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Mail className="h-3 w-3 mr-1" />
                            Send Follow-up
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Follow-up Modal */}
      {showFollowUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Send Bulk Follow-up Emails</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowFollowUpModal(false)}
              >
                ×
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Selected Showings: {selectedShowings.length}
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  This will send personalized follow-up emails to all selected showings
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tone">Email Tone</Label>
                  <Select value={followUpData.tone} onValueChange={(value: any) => setFollowUpData({...followUpData, tone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailTemplate">Email Template (Optional)</Label>
                  <Input
                    id="emailTemplate"
                    value={followUpData.emailTemplate}
                    onChange={(e) => setFollowUpData({...followUpData, emailTemplate: e.target.value})}
                    placeholder="Enter template name or ID"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customMessage">Custom Message (Optional)</Label>
                <Textarea
                  id="customMessage"
                  value={followUpData.customMessage}
                  onChange={(e) => setFollowUpData({...followUpData, customMessage: e.target.value})}
                  placeholder="Add any personal notes or specific details..."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeFeedbackRequest"
                  checked={followUpData.includeFeedbackRequest}
                  onCheckedChange={(checked) => setFollowUpData({...followUpData, includeFeedbackRequest: !!checked})}
                />
                <Label htmlFor="includeFeedbackRequest" className="text-sm">
                  Include feedback request in emails
                </Label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setShowFollowUpModal(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={sendBulkFollowUps}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send {selectedShowings.length} Follow-ups
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

