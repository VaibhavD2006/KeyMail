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
import { ArrowLeft, Search, Mail, Send, RefreshCw, Eye, Edit3 } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  priceRangeMin?: number;
  priceRangeMax?: number;
  preferredNeighborhoods?: string[];
  preferredPropertyTypes?: string[];
}

interface MLSListing {
  mlsId: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  description: string;
  photos: string[];
  features: string[];
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  lotSize: number;
  propertyType: string;
  neighborhood: string;
}

interface GeneratedEmail {
  subject: string;
  content: string;
  listing: MLSListing;
  client: Client;
}

export default function MLSBuilderPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mlsId, setMlsId] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [tone, setTone] = useState<"professional" | "casual" | "urgent">("professional");
  const [customMessage, setCustomMessage] = useState("");
  const [listingData, setListingData] = useState<MLSListing | null>(null);
  const [generatedEmail, setGeneratedEmail] = useState<GeneratedEmail | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients");
      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }
      const data = await response.json();
      setClients(data.data || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setError("Failed to load clients");
    }
  };

  const fetchMLSData = async () => {
    if (!mlsId.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/emails/generate-mls?mlsId=${encodeURIComponent(mlsId)}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch MLS data");
      }
      
      const data = await response.json();
      setListingData(data.data);
    } catch (error) {
      console.error("Error fetching MLS data:", error);
      setError("Failed to fetch MLS listing data. Please check the MLS ID and try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateEmail = async () => {
    if (!mlsId || !selectedClientId || !listingData) {
      setError("Please fill in all required fields and fetch MLS data first");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/emails/generate-mls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mlsId,
          clientId: selectedClientId,
          tone,
          customMessage,
          listingData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate email");
      }

      const data = await response.json();
      setGeneratedEmail(data.data);
      setIsPreviewMode(true);
    } catch (error) {
      console.error("Error generating email:", error);
      setError(error instanceof Error ? error.message : "Failed to generate email");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!generatedEmail) return;

    try {
      setLoading(true);
      // TODO: Implement actual email sending
      console.log("Sending email:", generatedEmail);
      
      // For now, just show success message
      alert("Email sent successfully! (This is a demo - no actual email was sent)");
    } catch (error) {
      console.error("Error sending email:", error);
      setError("Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setMlsId("");
    setSelectedClientId("");
    setTone("professional");
    setCustomMessage("");
    setListingData(null);
    setGeneratedEmail(null);
    setIsPreviewMode(false);
    setError(null);
  };

  const getToneDescription = (selectedTone: string) => {
    switch (selectedTone) {
      case "professional":
        return "Formal and business-like, perfect for corporate clients";
      case "casual":
        return "Friendly and approachable, great for personal relationships";
      case "urgent":
        return "Time-sensitive and action-oriented, for hot properties";
      default:
        return "";
    }
  };

  if (isPreviewMode && generatedEmail) {
    return (
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={() => setIsPreviewMode(false)} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Builder
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Email Preview</h1>
              <p className="text-gray-600 mt-2">
                Review and send your generated email
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setIsPreviewMode(false)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button onClick={handleSendEmail} disabled={loading} className="bg-purple-600 hover:bg-purple-700">
              <Send className="h-4 w-4 mr-2" />
              {loading ? "Sending..." : "Send Email"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Email Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Generated Email
              </CardTitle>
              <CardDescription>
                AI-generated email for {generatedEmail.client.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Subject</Label>
                <p className="text-lg font-semibold text-gray-900 mt-1">{generatedEmail.subject}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Content</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg border">
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: generatedEmail.content }} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Property Details
              </CardTitle>
              <CardDescription>
                MLS #{generatedEmail.listing.mlsId}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Address</Label>
                <p className="text-gray-900 mt-1">
                  {generatedEmail.listing.address}<br />
                  {generatedEmail.listing.city}, {generatedEmail.listing.state} {generatedEmail.listing.zipCode}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Price</Label>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    ${generatedEmail.listing.price.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Property Type</Label>
                  <p className="text-gray-900 mt-1">{generatedEmail.listing.propertyType}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Bedrooms</Label>
                  <p className="text-xl font-semibold text-gray-900 mt-1">{generatedEmail.listing.bedrooms}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Bathrooms</Label>
                  <p className="text-xl font-semibold text-gray-900 mt-1">{generatedEmail.listing.bathrooms}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Square Feet</Label>
                  <p className="text-xl font-semibold text-gray-900 mt-1">{generatedEmail.listing.squareFeet.toLocaleString()}</p>
                </div>
              </div>

              {generatedEmail.listing.features.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Key Features</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {generatedEmail.listing.features.map((feature, index) => (
                      <Badge key={index} variant="secondary">{feature}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Link href="/emails">
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Emails
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">MLS Email Builder</h1>
          <p className="text-gray-600 mt-2">
            Generate personalized property emails instantly with MLS integration
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              MLS Email Generator
            </CardTitle>
            <CardDescription>
              Enter an MLS ID and select a client to generate a personalized property email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* MLS ID Input */}
            <div className="space-y-2">
              <Label htmlFor="mlsId">MLS ID *</Label>
              <div className="flex space-x-3">
                <Input
                  id="mlsId"
                  value={mlsId}
                  onChange={(e) => setMlsId(e.target.value)}
                  placeholder="Enter MLS number (e.g., 12345678)"
                  className="flex-1"
                />
                <Button 
                  onClick={fetchMLSData} 
                  disabled={!mlsId.trim() || loading}
                  variant="outline"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Enter the MLS ID to fetch property details
              </p>
            </div>

            {/* Client Selection */}
            <div className="space-y-2">
              <Label htmlFor="clientId">Client *</Label>
              <Select
                value={selectedClientId}
                onValueChange={setSelectedClientId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a client to send the email to" />
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

            {/* Tone Selection */}
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
              <p className="text-sm text-gray-500">
                {getToneDescription(tone)}
              </p>
            </div>

            {/* Custom Message */}
            <div className="space-y-2">
              <Label htmlFor="customMessage">Custom Message (Optional)</Label>
              <Textarea
                id="customMessage"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Add any personal notes or specific details you'd like included in the email..."
                rows={3}
              />
              <p className="text-sm text-gray-500">
                This message will be incorporated into the AI-generated email
              </p>
            </div>

            {/* Property Preview */}
            {listingData && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-blue-800">Property Found</CardTitle>
                  <CardDescription>
                    MLS #{listingData.mlsId} - {listingData.address}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="font-semibold text-green-600">${listingData.price.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Beds</p>
                      <p className="font-semibold">{listingData.bedrooms}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Baths</p>
                      <p className="font-semibold">{listingData.bathrooms}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Sq Ft</p>
                      <p className="font-semibold">{listingData.squareFeet.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={resetForm}>
                Reset
              </Button>
              <Button 
                onClick={generateEmail}
                disabled={loading || !mlsId || !selectedClientId || !listingData}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Generate Email
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                <strong>1. Enter MLS ID:</strong> Paste the MLS number of the property you want to feature
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                <strong>2. Select Client:</strong> Choose which client to send the personalized email to
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                <strong>3. Customize:</strong> Set the tone and add any personal messages
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                <strong>4. Generate:</strong> AI creates a personalized email highlighting why this property matches their preferences
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

