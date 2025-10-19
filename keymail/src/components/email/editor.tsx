"use client";

import { useState, useEffect, useRef } from "react";
import { Client } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

interface EmailEditorProps {
  client?: Client;
  initialSubject?: string;
  initialContent?: string;
  onSave: (subject: string, content: string) => Promise<void>;
  isSubmitting: boolean;
}

// Define email occasion options
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

// Define tone options
const toneOptions = [
  { value: "friendly", label: "Friendly" },
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "formal", label: "Formal" },
  { value: "enthusiastic", label: "Enthusiastic" },
  { value: "empathetic", label: "Empathetic" },
];

// Define style options
const styleOptions = [
  { value: "concise", label: "Concise" },
  { value: "detailed", label: "Detailed" },
  { value: "conversational", label: "Conversational" },
  { value: "informative", label: "Informative" },
  { value: "persuasive", label: "Persuasive" },
];

// Define length options
const lengthOptions = [
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long" },
];

export function EmailEditor({
  client,
  initialSubject = "",
  initialContent = "",
  onSave,
  isSubmitting,
}: EmailEditorProps) {
  // Email content state
  const [subject, setSubject] = useState(initialSubject);
  const [content, setContent] = useState(initialContent);

  // AI generation parameters
  const [occasion, setOccasion] = useState("check_in");
  const [tone, setTone] = useState("friendly");
  const [style, setStyle] = useState("conversational");
  const [length, setLength] = useState("medium");
  const [additionalContext, setAdditionalContext] = useState("");

  // UI states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<{
    sentiment: string;
    formality: string;
    suggestions: string[];
  } | null>(null);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [templateSaveError, setTemplateSaveError] = useState<string | null>(null);

  // Reset form if client changes
  useEffect(() => {
    if (initialSubject || initialContent) {
      setSubject(initialSubject);
      setContent(initialContent);
    } else {
      setSubject("");
      setContent("");
    }
    setAnalysis(null);
    setError(null);
  }, [client, initialSubject, initialContent]);

  // Generate email content using AI
  const handleGenerateEmail = async () => {
    if (!client) {
      setError("Please select a client before generating an email");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/emails/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: client.id,
          occasion,
          tone,
          style,
          length,
          additionalContext,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate email");
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to generate email");
      }

      setSubject(data.data.subject);
      setContent(data.data.content);
      setAnalysis(null);
    } catch (err) {
      console.error("Error generating email:", err);
      setError(typeof err === "string" ? err : (err as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Analyze email content
  const handleAnalyzeEmail = async () => {
    if (!content.trim()) {
      setError("Please generate or enter email content first");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/emails/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze email");
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to analyze email");
      }

      setAnalysis(data.data);
    } catch (err) {
      console.error("Error analyzing email:", err);
      setError(typeof err === "string" ? err : (err as Error).message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Enhance email content
  const handleEnhanceEmail = async (improvements: string) => {
    if (!subject.trim() || !content.trim()) {
      setError("Please generate or enter email content first");
      return;
    }

    setIsEnhancing(true);
    setError(null);

    try {
      const response = await fetch("/api/emails/enhance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          content,
          improvements,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to enhance email");
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to enhance email");
      }

      setSubject(data.data.subject);
      setContent(data.data.content);
      setAnalysis(null);
    } catch (err) {
      console.error("Error enhancing email:", err);
      setError(typeof err === "string" ? err : (err as Error).message);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Save email
  const handleSave = async () => {
    if (!subject.trim() || !content.trim()) {
      setError("Please enter a subject and content for the email");
      return;
    }

    try {
      await onSave(subject, content);
    } catch (err) {
      console.error("Error saving email:", err);
      setError(typeof err === "string" ? err : (err as Error).message);
    }
  };

  // Save email as template
  const handleSaveAsTemplate = async () => {
    if (!subject.trim() || !content.trim()) {
      setError("Please enter a subject and content for the template");
      return;
    }

    if (!templateName.trim()) {
      setTemplateSaveError("Please enter a name for the template");
      return;
    }

    setIsSavingTemplate(true);
    setTemplateSaveError(null);

    try {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: templateName,
          occasion: occasion || "custom",
          subject,
          generatedContent: content,
          tags: client?.tags || [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save template");
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to save template");
      }

      // Reset form and close modal
      setTemplateName("");
      setShowSaveTemplateModal(false);
      
      // Show success message
      alert("Template saved successfully!");
    } catch (err) {
      console.error("Error saving template:", err);
      setTemplateSaveError(typeof err === "string" ? err : (err as Error).message);
    } finally {
      setIsSavingTemplate(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Client information summary if client is provided */}
      {client && (
        <div className="bg-purple-50 p-4 rounded-md">
          <h3 className="font-medium mb-2">Email to: {client.name}</h3>
          <p className="text-sm text-gray-600">{client.email}</p>
          {client.relationshipLevel && (
            <p className="text-sm text-gray-600 mt-1">
              Relationship: {client.relationshipLevel}
            </p>
          )}
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md">
          <p>{error}</p>
        </div>
      )}

      {/* Email content section */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject"
            className="w-full mt-1"
          />
        </div>

        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Email content"
            className="w-full mt-1 min-h-[200px]"
          />
        </div>
      </div>

      {/* AI generation section */}
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="font-medium mb-4">AI Email Generation</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="occasion">Occasion</Label>
            <select
              id="occasion"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              {occasionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

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

        <div className="mb-4">
          <Label htmlFor="additionalContext">Additional Context (Optional)</Label>
          <Textarea
            id="additionalContext"
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            placeholder="Add any specific details or instructions for the AI..."
            className="w-full mt-1"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={handleGenerateEmail}
            disabled={isGenerating || !client}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isGenerating ? "Generating..." : "Generate Email"}
          </Button>
          
          <Button
            type="button"
            onClick={handleAnalyzeEmail}
            disabled={isAnalyzing || !content.trim()}
            variant="outline"
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Content"}
          </Button>
        </div>
      </div>

      {/* Analysis results */}
      {analysis && (
        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="font-medium mb-2">Content Analysis</h3>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Sentiment:</span> {analysis.sentiment}
            </p>
            <p>
              <span className="font-medium">Formality:</span> {analysis.formality}
            </p>
            <div>
              <p className="font-medium">Suggestions:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
            
            {/* Quick improvement buttons */}
            <div className="mt-4">
              <p className="font-medium mb-2">Quick Improvements:</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={() => handleEnhanceEmail("Make the email more personal and friendly")}
                  disabled={isEnhancing}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                >
                  More Personal
                </Button>
                <Button
                  type="button"
                  onClick={() => handleEnhanceEmail("Make the email more professional")}
                  disabled={isEnhancing}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                >
                  More Professional
                </Button>
                <Button
                  type="button"
                  onClick={() => handleEnhanceEmail("Make the email more concise")}
                  disabled={isEnhancing}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                >
                  More Concise
                </Button>
                <Button
                  type="button"
                  onClick={() => handleEnhanceEmail("Fix any grammar or spelling issues")}
                  disabled={isEnhancing}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                >
                  Fix Grammar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowSaveTemplateModal(true)}
            disabled={isSubmitting || !subject.trim() || !content.trim()}
          >
            Save as Template
          </Button>
        </div>
        <Button
          type="button"
          onClick={handleSave}
          disabled={isSubmitting || !subject.trim() || !content.trim()}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isSubmitting ? "Saving..." : "Save Email"}
        </Button>
      </div>

      {/* Save Template Modal */}
      {showSaveTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Save as Template</h3>
            
            {templateSaveError && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
                <p>{templateSaveError}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Enter a name for this template"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSaveTemplateModal(false)}
                  disabled={isSavingTemplate}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSaveAsTemplate}
                  disabled={isSavingTemplate || !templateName.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isSavingTemplate ? "Saving..." : "Save Template"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 