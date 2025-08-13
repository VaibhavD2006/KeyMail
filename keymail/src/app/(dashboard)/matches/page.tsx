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
  Search, 
  Users, 
  Home, 
  Mail, 
  Send, 
  RefreshCw, 
  Eye, 
  Target,
  TrendingUp,
  Filter,
  Zap
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  priceRangeMin?: number;
  priceRangeMax?: number;
  preferredNeighborhoods?: string[];
  preferredPropertyTypes?: string[];
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  totalMatches?: number;
  activeMatches?: number;
  bestMatchScore?: number;
}

interface Listing {
  id: string;
  mlsId: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: string;
  neighborhood: string;
  status: string;
}

interface PropertyMatch {
  id: string;
  clientId: string;
  listingId: string;
  matchScore: number;
  reasons: string[];
  isActive: boolean;
  sentEmailId?: string;
  client?: Client;
  listing?: Listing;
}

interface BulkEmailData {
  clients: Client[];
  listings: Listing[];
  totalMatches: number;
  activeMatches: number;
}

export default function MatchesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<PropertyMatch[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [maxMatches, setMaxMatches] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [showBulkEmail, setShowBulkEmail] = useState(false);
  const [bulkEmailData, setBulkEmailData] = useState<BulkEmailData | null>(null);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [emailTemplate, setEmailTemplate] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [tone, setTone] = useState<"professional" | "casual" | "urgent">("professional");

  useEffect(() => {
    fetchMatches();
    fetchBulkEmailData();
  }, [filterStatus]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filterStatus !== "all") {
        params.append("isActive", filterStatus === "active" ? "true" : "false");
      }

      const response = await fetch(`/api/matches?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch matches");
      }

      const data = await response.json();
      setMatches(data.data || []);
    } catch (error) {
      console.error("Error fetching matches:", error);
      setError("Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  const fetchBulkEmailData = async () => {
    try {
      const response = await fetch("/api/matches/send-bulk");
      if (response.ok) {
        const data = await response.json();
        setBulkEmailData(data.data);
      }
    } catch (error) {
      console.error("Error fetching bulk email data:", error);
    }
  };

  const generateMatches = async () => {
    if (!selectedClientId) {
      setError("Please select a client");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: selectedClientId,
          maxMatches: parseInt(maxMatches.toString()),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate matches");
      }

      const data = await response.json();
      
      // Refresh matches list
      await fetchMatches();
      
      // Show success message
      alert(`Generated ${data.data.totalFound} matches for ${data.data.client.name}`);
      
      // Reset form
      setSelectedClientId("");
      setMaxMatches(5);
    } catch (error) {
      console.error("Error generating matches:", error);
      setError(error instanceof Error ? error.message : "Failed to generate matches");
    } finally {
      setLoading(false);
    }
  };

  const sendBulkEmails = async () => {
    if (selectedClients.length === 0 || selectedListings.length === 0) {
      setError("Please select at least one client and one listing");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/matches/send-bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientIds: selectedClients,
          listingIds: selectedListings,
          emailTemplate,
          customMessage,
          tone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send bulk emails");
      }

      const data = await response.json();
      
      // Show success message
      alert(`Successfully sent ${data.data.successful} emails!`);
      
      // Reset form and refresh data
      setShowBulkEmail(false);
      setSelectedClients([]);
      setSelectedListings([]);
      setEmailTemplate("");
      setCustomMessage("");
      setTone("professional");
      
      await fetchMatches();
      await fetchBulkEmailData();
    } catch (error) {
      console.error("Error sending bulk emails:", error);
      setError(error instanceof Error ? error.message : "Failed to send bulk emails");
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = matches.filter(match => {
    const matchesSearch = 
      match.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.listing?.mlsId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.listing?.address?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const getMatchScoreColor = (score: number) => {
    if (score >= 0.8) return "bg-green-100 text-green-800";
    if (score >= 0.6) return "bg-blue-100 text-blue-800";
    if (score >= 0.4) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  const getMatchScoreLabel = (score: number) => {
    if (score >= 0.8) return "Excellent";
    if (score >= 0.6) return "Good";
    if (score >= 0.4) return "Fair";
    return "Poor";
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Buyer Match Engine</h1>
          <p className="text-gray-600 mt-2">
            Automatically match properties to clients and send personalized bulk emails
          </p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={() => setShowBulkEmail(!showBulkEmail)}
            className="flex items-center"
          >
            <Mail className="h-4 w-4 mr-2" />
            Bulk Email
          </Button>
          <Button 
            onClick={() => router.push("/clients/add")}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Users className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Match Generation */}
        <div className="lg:col-span-1 space-y-6">
          {/* Generate Matches Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Generate Matches
              </CardTitle>
              <CardDescription>
                Create new property matches for a specific client
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Client Selection */}
              <div className="space-y-2">
                <Label htmlFor="clientId">Select Client</Label>
                <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} ({client.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {clients.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No clients found.{" "}
                    <Link href="/clients/add" className="text-purple-600 hover:underline">
                      Add a client first
                    </Link>
                  </p>
                )}
              </div>

              {/* Max Matches */}
              <div className="space-y-2">
                <Label htmlFor="maxMatches">Maximum Matches</Label>
                <Select value={maxMatches.toString()} onValueChange={(value) => setMaxMatches(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 matches</SelectItem>
                    <SelectItem value="5">5 matches</SelectItem>
                    <SelectItem value="10">10 matches</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Generate Button */}
              <Button 
                onClick={generateMatches}
                disabled={loading || !selectedClientId}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Matches
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Statistics Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Match Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {matches.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Matches</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {matches.filter(m => m.isActive).length}
                  </div>
                  <div className="text-sm text-gray-600">Active Matches</div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {clients.length}
                </div>
                <div className="text-sm text-gray-600">Clients with Preferences</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Matches Display */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Home className="h-5 w-5 mr-2" />
                    Property Matches
                  </CardTitle>
                  <CardDescription>
                    View and manage all property matches
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-3">
                  {/* Filter */}
                  <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                    <SelectTrigger className="w-32">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Search */}
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search matches..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                  Loading matches...
                </div>
              ) : error ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              ) : filteredMatches.length === 0 ? (
                <div className="text-center py-8">
                  <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || filterStatus !== "all" 
                      ? "Try adjusting your search or filters"
                      : "Generate your first property matches to get started"
                    }
                  </p>
                  {!searchTerm && filterStatus === "all" && (
                    <Button onClick={() => setSelectedClientId("")} className="bg-purple-600 hover:bg-purple-700">
                      <Target className="h-4 w-4 mr-2" />
                      Generate Matches
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMatches.map((match) => (
                    <div key={match.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900">
                                {match.client?.name}
                              </span>
                              <span className="text-sm text-gray-500">→</span>
                              <span className="text-sm font-medium text-gray-900">
                                MLS #{match.listing?.mlsId}
                              </span>
                            </div>
                            <Badge 
                              variant="secondary" 
                              className={getMatchScoreColor(match.matchScore)}
                            >
                              {getMatchScoreLabel(match.matchScore)} ({Math.round(match.matchScore * 100)}%)
                            </Badge>
                            {match.sentEmailId && (
                              <Badge variant="outline" className="text-green-700 border-green-200">
                                <Mail className="h-3 w-3 mr-1" />
                                Email Sent
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-gray-500">Price</p>
                              <p className="font-semibold text-green-600">
                                ${match.listing?.price?.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Address</p>
                              <p className="font-medium text-sm">
                                {match.listing?.address}<br />
                                <span className="text-gray-600">
                                  {match.listing?.city}, {match.listing?.state}
                                </span>
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Beds/Baths</p>
                              <p className="font-medium text-sm">
                                {match.listing?.bedrooms} / {match.listing?.bathrooms}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Type</p>
                              <p className="font-medium text-sm">{match.listing?.propertyType}</p>
                            </div>
                          </div>

                          {match.reasons && match.reasons.length > 0 && (
                            <div>
                              <p className="text-xs text-gray-500 mb-2">Why this matches:</p>
                              <div className="flex flex-wrap gap-2">
                                {match.reasons.slice(0, 3).map((reason, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {reason}
                                  </Badge>
                                ))}
                                {match.reasons.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{match.reasons.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bulk Email Modal */}
      {showBulkEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Send Bulk Property Match Emails</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowBulkEmail(false)}
              >
                ×
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Client Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Select Clients</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {bulkEmailData?.clients.map((client) => (
                    <div key={client.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`client-${client.id}`}
                        checked={selectedClients.includes(client.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedClients([...selectedClients, client.id]);
                          } else {
                            setSelectedClients(selectedClients.filter(id => id !== client.id));
                          }
                        }}
                      />
                      <Label htmlFor={`client-${client.id}`} className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <span>{client.name}</span>
                          <Badge variant="secondary">
                            {client.activeMatches} matches
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{client.email}</p>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Listing Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Select Listings</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {bulkEmailData?.listings.map((listing) => (
                    <div key={listing.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`listing-${listing.id}`}
                        checked={selectedListings.includes(listing.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedListings([...selectedListings, listing.id]);
                          } else {
                            setSelectedListings(selectedListings.filter(id => id !== listing.id));
                          }
                        }}
                      />
                      <Label htmlFor={`listing-${listing.id}`} className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <span>MLS #{listing.mlsId}</span>
                          <Badge variant="outline">
                            ${listing.price.toLocaleString()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          {listing.address}, {listing.city}
                        </p>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Email Configuration */}
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Email Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tone">Email Tone</Label>
                  <Select value={tone} onValueChange={(value: any) => setTone(value)}>
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
                    value={emailTemplate}
                    onChange={(e) => setEmailTemplate(e.target.value)}
                    placeholder="Enter template name or ID"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customMessage">Custom Message (Optional)</Label>
                <Textarea
                  id="customMessage"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Add any personal notes or specific details..."
                  rows={3}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setShowBulkEmail(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={sendBulkEmails}
                disabled={loading || selectedClients.length === 0 || selectedListings.length === 0}
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
                    Send {selectedClients.length * selectedListings.length} Emails
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

