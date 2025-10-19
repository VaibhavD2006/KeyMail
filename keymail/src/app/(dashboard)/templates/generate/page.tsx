"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, SparkleIcon, Loader2 } from "lucide-react";
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

const toneOptions = [
  { value: "friendly", label: "Friendly" },
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "formal", label: "Formal" },
  { value: "enthusiastic", label: "Enthusiastic" },
  { value: "empathetic", label: "Empathetic" },
];

const styleOptions = [
  { value: "concise", label: "Concise" },
  { value: "detailed", label: "Detailed" },
  { value: "conversational", label: "Conversational" },
  { value: "informative", label: "Informative" },
  { value: "persuasive", label: "Persuasive" },
];

const lengthOptions = [
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long" },
];

export default function GenerateTemplatePage() {
  const router = useRouter();

  // Form state
  const [name, setName] = useState("");
  const [occasion, setOccasion] = useState("check_in");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  
  // Generation parameters
  const [tone, setTone] = useState("professional");
  const [style, setStyle] = useState("conversational");
  const [length, setLength] = useState("medium");
  const [prompt, setPrompt] = useState("");
  
  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationComplete, setGenerationComplete] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please provide a description or instructions for the AI");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationComplete(false);

    try {
      // Call the template generation API
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
          additionalContext: prompt,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate template");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Generation failed");
      }

      // Set the generated content
      setSubject(data.data.subject || "");
      setContent(data.data.content || "");
      
      // Set a default name based on occasion and tone
      if (!name) {
        const occasionLabel = occasionOptions.find(o => o.value === occasion)?.label || occasion;
        const toneLabel = toneOptions.find(t => t.value === tone)?.label || tone;
        setName(`${occasionLabel} - ${toneLabel}`);
      }
      
      // Set a default tag based on occasion
      if (!tags && occasion !== "custom") {
        setTags(occasion);
      }
      
      setGenerationComplete(true);
    } catch (err) {
      console.error("Error generating template:", err);
      setError(typeof err === "string" ? err : (err as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !subject.trim() || !content.trim()) {
      setError("Please ensure name, subject, and content are filled in");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Prepare the template data
      const templateData = {
        name,
        occasion,
        subject,
        generatedContent: content,
        tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
      };

      // Save to localStorage first as a backup
      const localTemplate = templateStorage.addTemplate({
        ...templateData,
        id: `local-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "active",
      });

      // Then try to save to the database
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateData),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = data.error || "Failed to save template";
        
        // If API failed but localStorage succeeded, show a message
        if (localTemplate) {
          errorMessage += "\n\nHowever, your template was saved locally and will be available in the templates list.";
        }
        
        throw new Error(errorMessage);
      }

      // Navigate back to templates list
      router.push("/templates");
    } catch (err) {
      console.error("Error saving template:", err);
      setError(typeof err === "string" ? err : (err as Error).message);
      
      // Wait a bit, then navigate if we have local save
      if (error?.includes("saved locally")) {
        setTimeout(() => {
          router.push("/templates");
        }, 2000);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Link href="/templates" className="flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Templates
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Template with AI</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="occasion">Occasion</Label>
                  <select
                    id="occasion"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  >
                    {occasionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <select
                    id="tone"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  >
                    {toneOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="style">Style</Label>
                  <select
                    id="style"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  >
                    {styleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="length">Length</Label>
                  <select
                    id="length"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  >
                    {lengthOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt">Generation Instructions</Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want in the template. For example: 'A follow-up email to a client who showed interest in our property listing last week.'"
                rows={4}
                required
              />
            </div>

            <Button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <SparkleIcon className="mr-2 h-4 w-4" />
                  Generate Template
                </>
              )}
            </Button>
          </div>

          {generationComplete && (
            <div className="mt-8 border-t pt-6 space-y-6">
              <h3 className="text-lg font-medium">Generated Template</h3>

              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter a name for this template"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject Line</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject line"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Email Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Email content"
                  rows={8}
                  required
                />
                <p className="text-xs text-gray-500">
                  Feel free to edit this content before saving.
                </p>
              </div>

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
                  onClick={() => router.push("/templates")}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || !name.trim() || !subject.trim() || !content.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Template"
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 