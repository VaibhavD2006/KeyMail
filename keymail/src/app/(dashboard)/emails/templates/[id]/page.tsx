"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { templateStorage } from "@/lib/utils";

interface TemplateParams {
  params: {
    id: string;
  };
}

export default function TemplateDetailPage({ params }: TemplateParams) {
  const router = useRouter();
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [name, setName] = useState("");
  const [occasion, setOccasion] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  
  // Check if this is a local-only template
  const isLocalTemplate = params.id.startsWith('local-');
  
  useEffect(() => {
    const fetchTemplate = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // First check if we have this template in localStorage
        const localTemplate = templateStorage.getTemplate(params.id);
        
        // If it's a local-only template or we're offline, use the local version
        if (isLocalTemplate || localTemplate) {
          console.log("Loading template from localStorage", params.id);
          if (localTemplate) {
            setTemplate(localTemplate);
            setName(localTemplate.name || "");
            setOccasion(localTemplate.occasion || "");
            setSubject(localTemplate.subject || "");
            setContent(localTemplate.content || "");
            setTags(localTemplate.tags ? localTemplate.tags.join(", ") : "");
            setLoading(false);
            
            // If it's not a local-only template, still try the API for the most up-to-date version
            if (!isLocalTemplate) {
              console.log("Also fetching from API for most recent version");
            } else {
              // For local-only templates, we're done
              return;
            }
          }
        }
        
        // Skip API call for local-only templates
        if (isLocalTemplate) {
          if (!localTemplate) {
            throw new Error("Local template not found");
          }
          return;
        }
        
        // Fetch from API
        console.log("Fetching template from API", params.id);
        const response = await fetch(`/api/templates/${params.id}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch template");
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
          // Save to localStorage for offline access
          const apiTemplate = {
            id: data.data.id,
            name: data.data.name,
            occasion: data.data.occasion || "",
            subject: data.data.subject,
            content: data.data.content,
            status: data.data.status,
            tags: data.data.tags || [],
            createdAt: data.data.created_at,
            updatedAt: data.data.updated_at,
          };
          
          templateStorage.addTemplate(apiTemplate);
          
          // Update the UI
          setTemplate(apiTemplate);
          setName(apiTemplate.name || "");
          setOccasion(apiTemplate.occasion || "");
          setSubject(apiTemplate.subject || "");
          setContent(apiTemplate.content || "");
          setTags(apiTemplate.tags ? apiTemplate.tags.join(", ") : "");
        } else {
          throw new Error(data.error || "Failed to fetch template data");
        }
      } catch (err) {
        console.error("Error fetching template:", err);
        
        // If we already loaded from localStorage, show a warning but don't block the UI
        if (template) {
          setError("Could not fetch the latest version from the server. Showing locally stored version.");
        } else {
          setError((err instanceof Error) ? err.message : String(err));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [params.id, isLocalTemplate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name.trim() || !subject.trim() || !content.trim()) {
      setSaveError("Please fill in all required fields");
      return;
    }
    
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    
    // Prepare template data
    const templateData = {
      id: params.id,
      name,
      occasion,
      subject,
      content,
      tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
    };
    
    // Always update localStorage
    templateStorage.addTemplate({
      ...templateData,
      status: template?.status || "active",
      createdAt: template?.createdAt,
      updatedAt: new Date().toISOString(),
    });
    
    // If it's a local-only template, we only save to localStorage
    if (isLocalTemplate) {
      setSaveSuccess(true);
      setSaving(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
      return;
    }
    
    try {
      const response = await fetch(`/api/templates/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update template");
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Failed to update template");
      }
      
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error updating template:", err);
      setSaveError((err instanceof Error) ? err.message : String(err));
      
      // If localStorage update succeeded but API failed, show a notification
      setSaveError("Failed to save to server, but saved locally");
      
      // Hide error message after 3 seconds
      setTimeout(() => {
        setSaveError(null);
      }, 3000);
    } finally {
      setSaving(false);
    }
  };

  const useTemplate = () => {
    router.push(`/emails/compose?template=${params.id}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading template...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Link href="/emails/templates" className="flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Templates
        </Link>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {isLocalTemplate ? "Edit Local Template" : "Edit Template"}
            {template && isLocalTemplate && (
              <span className="ml-2 text-xs bg-amber-100 text-amber-800 py-1 px-2 rounded-full">
                Local Only
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g., Follow-up Email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="occasion">Occasion</Label>
              <Input
                id="occasion"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="E.g., Client Follow-up, Thank You"
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
                placeholder="Enter the email content..."
                className="min-h-[250px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="E.g., client, follow-up, professional"
              />
            </div>

            {saveSuccess && (
              <Alert className="bg-green-50 text-green-700 border-green-200">
                <AlertDescription>
                  Template saved successfully!
                </AlertDescription>
              </Alert>
            )}

            {saveError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{saveError}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={useTemplate}>
                Use Template
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 