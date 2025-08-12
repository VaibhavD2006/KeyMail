"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save, Trash2, Loader2 } from "lucide-react";
import { templateStorage } from "@/lib/utils";

interface TemplateParams {
  params: {
    id: string;
  };
}

export default function TemplateDetailPage({ params }: TemplateParams) {
  const router = useRouter();
  
  // State variables
  const [template, setTemplate] = useState<any>(null);
  const [name, setName] = useState("");
  const [occasion, setOccasion] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Check if this is a local-only template
  const isLocalTemplate = params.id.startsWith("local-");

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
  }, [params.id, isLocalTemplate, template]);

  const handleSave = async () => {
    if (!name || !subject || !content) {
      setError("Name, subject, and content are required");
      return;
    }

    setSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      // Save to localStorage first as backup
      const updatedTemplate = {
        id: params.id,
        name,
        occasion,
        subject,
        content,
        status: template?.status || "active",
        tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
        createdAt: template?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      templateStorage.addTemplate(updatedTemplate);

      // If it's a local-only template, we don't need to save to API
      if (isLocalTemplate) {
        setTemplate(updatedTemplate);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        return;
      }

      // Save to API
      const response = await fetch(`/api/templates/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          occasion,
          subject,
          content,
          tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update template");
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving template:", err);
      setError(typeof err === "string" ? err : (err as Error).message);
      
      // If saved to localStorage but API failed
      if (!isLocalTemplate) {
        setError("Could not save to server, but your changes are saved locally.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this template?")) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      // Remove from localStorage first
      templateStorage.removeTemplate(params.id);

      // If it's a local-only template, we don't need to delete from API
      if (isLocalTemplate) {
        router.push("/templates");
        return;
      }

      // Delete from API
      const response = await fetch(`/api/templates/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete template");
      }

      router.push("/templates");
    } catch (err) {
      console.error("Error deleting template:", err);
      setError(typeof err === "string" ? err : (err as Error).message);
      
      // If deleted from localStorage but API failed
      if (!isLocalTemplate) {
        setError("Could not delete from server, but the template was removed locally. You can retry later.");
      }
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
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
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!template && !loading && error) {
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
            <CardTitle>Template Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
            <Button 
              className="mt-4"
              onClick={() => router.push("/templates")}
            >
              Return to Templates
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Link href="/templates" className="flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Templates
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          Template saved successfully!
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{isLocalTemplate ? "Local Template" : "Template"}</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDelete}
              disabled={deleting}
              className="text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
            <Button 
              size="sm" 
              onClick={handleSave}
              disabled={saving}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter template name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="occasion">Occasion</Label>
            <Input
              id="occasion"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              placeholder="E.g., birthday, check-in, closing anniversary"
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
              rows={10}
              required
            />
            <p className="text-xs text-gray-500">
              Use {"{client_name}"} and {"{agent_name}"} as placeholders that will be replaced when sending emails.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="E.g., important, follow-up, seasonal"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 