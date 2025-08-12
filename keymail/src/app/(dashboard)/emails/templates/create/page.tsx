"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Sparkles } from "lucide-react";
import { templateStorage } from "@/lib/utils";

const occasionOptions = [
  { value: "birthday", label: "Birthday Wishes" },
  { value: "closing_anniversary", label: "Closing Anniversary" },
  { value: "holiday_greeting", label: "Holiday Greeting" },
  { value: "market_update", label: "Market Update" },
  { value: "listing_update", label: "Listing Update" },
  { value: "check_in", label: "General Check-in" },
  { value: "referral_request", label: "Referral Request" },
  { value: "thank_you", label: "Thank You" },
  { value: "life_event", label: "Life Event Congratulations" },
  { value: "custom", label: "Custom" },
];

// Define tone options for AI generation
const toneOptions = [
  { value: "friendly", label: "Friendly" },
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "formal", label: "Formal" },
  { value: "enthusiastic", label: "Enthusiastic" },
  { value: "empathetic", label: "Empathetic" },
];

// Define style options for AI generation
const styleOptions = [
  { value: "concise", label: "Concise" },
  { value: "detailed", label: "Detailed" },
  { value: "conversational", label: "Conversational" },
  { value: "informative", label: "Informative" },
  { value: "persuasive", label: "Persuasive" },
];

// Define length options for AI generation
const lengthOptions = [
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long" },
];

export default function CreateTemplatePage() {
  const router = useRouter();
  
  // Form state
  const [name, setName] = useState("");
  const [occasion, setOccasion] = useState("check_in");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  
  // AI generation parameters
  const [tone, setTone] = useState("friendly");
  const [style, setStyle] = useState("conversational");
  const [length, setLength] = useState("medium");
  const [additionalContext, setAdditionalContext] = useState("");
  const [showAiOptions, setShowAiOptions] = useState(false);
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Add state to track database setup status
  const [dbSetupAttempted, setDbSetupAttempted] = useState(false);
  
  // Attempt to setup database on component mount
  useEffect(() => {
    const setupDb = async () => {
      try {
        console.log("Attempting to setup database tables...");
        const response = await fetch("/api/setup");
        const data = await response.json();
        
        if (data.success) {
          console.log("Database setup successful:", data.message);
        } else {
          console.warn("Database setup warning:", data.error);
        }
      } catch (error) {
        console.error("Database setup error:", error);
      } finally {
        setDbSetupAttempted(true);
      }
    };
    
    setupDb();
  }, []);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name.trim() || !subject.trim() || !content.trim()) {
      setError("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    // Prepare template data
    const templateData = {
      name,
      occasion,
      subject,
      generatedContent: content,
      tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
    };
    
    console.log("Submitting template with data:", templateData);
    
    // First ensure database is setup if not attempted already
    if (!dbSetupAttempted) {
      try {
        console.log("Running database setup before submitting template...");
        const setupResponse = await fetch("/api/setup");
        const setupData = await setupResponse.json();
        console.log("Pre-submit database setup result:", setupData);
      } catch (setupError) {
        console.error("Error setting up database before submit:", setupError);
      }
    }
    
    try {
      // Always save to localStorage first as a backup
      const localTemplate = templateStorage.addTemplate({
        ...templateData,
        id: `local-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "active",
      });
      console.log("Saved template to localStorage as backup:", localTemplate?.id);
      
      // Now try to save to the database
      console.log("Sending API request to create template...");
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateData),
      });
      
      const data = await response.json();
      console.log("API response:", data);
      
      if (!response.ok) {
        let errorMessage = data.error || "Failed to create template";
        if (data.details) {
          console.error("API error details:", data.details);
          errorMessage += " (See console for details)";
        }
        
        // If API failed but localStorage succeeded, show a message
        if (localTemplate) {
          errorMessage += "\n\nHowever, your template was saved locally and will be available in the templates list.";
        }
        
        throw new Error(errorMessage);
      }
      
      if (!data.success) {
        throw new Error(data.error || "Failed to create template");
      }
      
      console.log("Template created successfully in database:", data.data?.id);
      
      // Navigate back to templates list
      router.push("/emails/templates");
      router.refresh();
    } catch (err) {
      console.error("Error creating template:", err);
      
      // Handle the error message
      const errorMessage = (err instanceof Error) ? err.message : String(err);
      setError(errorMessage);
      
      // If we already saved to localStorage, no need to do it again
      if (!errorMessage.includes("saved locally")) {
        try {
          console.log("Attempting to save template to localStorage as fallback");
          const savedTemplate = templateStorage.addTemplate({
            ...templateData,
            id: `local-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: "active",
          });
          
          if (savedTemplate) {
            setError(errorMessage + " (Template saved locally as fallback)");
            
            // Wait a bit to show the message, then navigate
            setTimeout(() => {
              router.push("/emails/templates");
              router.refresh();
            }, 2000);
          }
        } catch (localError) {
          console.error("Error saving to localStorage:", localError);
        }
      } else {
        // Wait a bit to show the message, then navigate
        setTimeout(() => {
          router.push("/emails/templates");
          router.refresh();
        }, 2000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate template content using AI
  const handleGenerateContent = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/templates/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          occasion,
          tone,
          style,
          length,
          additionalContext,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate template content");
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to generate template content");
      }

      setSubject(data.data.subject);
      setContent(data.data.content);
    } catch (err) {
      console.error("Error generating template content:", err);
      setError(typeof err === "string" ? err : (err as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link href="/emails/templates" className="flex items-center text-purple-600 hover:text-purple-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Templates
        </Link>
      </div>
      
      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle>Create New Template</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Error display */}
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter a name for this template"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="occasion">Occasion *</Label>
              <select
                id="occasion"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                required
              >
                {occasionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject *</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter the email subject line"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Email Content *</Label>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Write your content or use AI to generate it</span>
                <Button
                  type="button"
                  variant="outline"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50 flex items-center"
                  onClick={() => setShowAiOptions(!showAiOptions)}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {showAiOptions ? "Hide AI Options" : "Show AI Options"}
                </Button>
              </div>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter the email content"
                rows={10}
                required
              />
              <p className="text-xs text-gray-500">
                Use {"{client_name}"}, {"{client_email}"}, etc. as placeholders for client information.
              </p>
            </div>
            
            {/* AI Generation Options */}
            {showAiOptions && (
              <div className="bg-gray-50 p-4 rounded-md space-y-4">
                <h3 className="font-medium">AI Content Generation Options</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="tone">Tone</Label>
                    <select
                      id="tone"
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    >
                      {toneOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="style">Style</Label>
                    <select
                      id="style"
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    >
                      {styleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="length">Length</Label>
                    <select
                      id="length"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    >
                      {lengthOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="additionalContext">Additional Context (Optional)</Label>
                  <Textarea
                    id="additionalContext"
                    value={additionalContext}
                    onChange={(e) => setAdditionalContext(e.target.value)}
                    placeholder="Add any specific details or instructions for the AI..."
                    className="w-full mt-1"
                    rows={3}
                  />
                </div>
                
                <Button
                  type="button"
                  onClick={handleGenerateContent}
                  disabled={isGenerating}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isGenerating ? "Generating..." : "Generate with AI"}
                </Button>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. important, follow-up, seasonal"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/emails/templates")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Template"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 