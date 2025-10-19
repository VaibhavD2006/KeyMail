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
import { ArrowLeft, Calendar, Save } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
}

interface MilestoneFormData {
  clientId: string;
  type: "home_anniversary" | "birthday" | "personal_event" | "closing";
  title: string;
  date: string;
  message: string;
  isActive: boolean;
}

export default function CreateMilestonePage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<MilestoneFormData>({
    clientId: "",
    type: "birthday",
    title: "",
    date: "",
    message: "",
    isActive: true,
  });

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
      // Handle both response structures: data.data.items or data.data
      const clientsList = data.data?.items || data.data || [];
      setClients(Array.isArray(clientsList) ? clientsList : []);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setError("Failed to load clients");
    }
  };

  const handleInputChange = (field: keyof MilestoneFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientId || !formData.title || !formData.date) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/milestones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create milestone");
      }

      const data = await response.json();
      console.log("Milestone created:", data);
      
      // Redirect to milestones page
      router.push("/milestones");
    } catch (error) {
      console.error("Error creating milestone:", error);
      setError(error instanceof Error ? error.message : "Failed to create milestone");
    } finally {
      setLoading(false);
    }
  };

  const getMilestoneTypeDescription = (type: string) => {
    switch (type) {
      case "home_anniversary":
        return "Celebrate when clients moved into their home";
      case "birthday":
        return "Send birthday wishes to clients";
      case "closing":
        return "Mark the anniversary of their home purchase";
      case "personal_event":
        return "Custom milestone or special occasion";
      default:
        return "";
    }
  };

  const getDefaultTitle = (type: string) => {
    switch (type) {
      case "home_anniversary":
        return "Home Anniversary";
      case "birthday":
        return "Happy Birthday";
      case "closing":
        return "Home Purchase Anniversary";
      case "personal_event":
        return "Special Occasion";
      default:
        return "";
    }
  };

  // Auto-update title when type changes
  useEffect(() => {
    if (!formData.title || formData.title === getDefaultTitle(formData.type)) {
      setFormData(prev => ({
        ...prev,
        title: getDefaultTitle(formData.type)
      }));
    }
  }, [formData.type]);

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Link href="/milestones">
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Milestones
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Milestone</h1>
          <p className="text-gray-600 mt-2">
            Set up automated celebrations for your clients
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              New Milestone
            </CardTitle>
            <CardDescription>
              Create a milestone that will automatically trigger emails to keep your clients engaged
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Client Selection */}
              <div className="space-y-2">
                <Label htmlFor="clientId">Client *</Label>
                <Select
                  value={formData.clientId}
                  onValueChange={(value) => handleInputChange("clientId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients && clients.length > 0 ? (
                      clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} ({client.email})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>No clients available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {(!clients || clients.length === 0) && (
                  <p className="text-sm text-gray-500">
                    No clients found.{" "}
                    <Link href="/clients/add" className="text-purple-600 hover:underline">
                      Add a client first
                    </Link>
                  </p>
                )}
              </div>

              {/* Milestone Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Milestone Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => handleInputChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home_anniversary">Home Anniversary</SelectItem>
                    <SelectItem value="birthday">Birthday</SelectItem>
                    <SelectItem value="closing">Closing Anniversary</SelectItem>
                    <SelectItem value="personal_event">Personal Event</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  {getMilestoneTypeDescription(formData.type)}
                </p>
              </div>

              {/* Milestone Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Milestone Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter milestone title"
                  required
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">
                  This is the date the milestone will be celebrated annually
                </p>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Personal Message (Optional)</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Add a personal message or note about this milestone..."
                  rows={3}
                />
                <p className="text-sm text-gray-500">
                  This message will be included in the AI-generated email
                </p>
              </div>

              {/* Active Status */}
              <div className="flex items-center space-x-2">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange("isActive", e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <Label htmlFor="isActive">Active milestone</Label>
              </div>
              <p className="text-sm text-gray-500">
                Active milestones will automatically send emails on their anniversary dates
              </p>

              {/* Error Display */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-4">
                <Link href="/milestones">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={loading || !formData.clientId || !formData.title || !formData.date}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Milestone
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">How Milestones Work</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                <strong>Home Anniversary:</strong> Celebrates when your client moved into their home. 
                Perfect for maintaining long-term relationships.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                <strong>Birthday:</strong> Sends personalized birthday wishes. 
                Great for showing you remember the little details.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                <strong>Closing Anniversary:</strong> Marks the anniversary of their home purchase. 
                Excellent for referral generation.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                <strong>Personal Event:</strong> Custom milestones like work anniversaries, 
                children's graduations, or other special occasions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

