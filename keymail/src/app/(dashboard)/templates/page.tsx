"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, SparkleIcon, Loader2, Trash2, Send } from "lucide-react";
import { templateStorage } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

interface Template {
  id: string;
  name: string;
  occasion: string;
  subject: string;
  content: string;
  status: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  // Add this function to load templates from localStorage
  const loadTemplatesFromLocalStorage = () => {
    try {
      // Try to gather templates from both storage locations
      let allTemplates = [];
      let templatesFromMainStorage = [];
      let templatesFromEmailTemplates = [];
      
      // Check the main keymail_templates storage
      const keymailTemplatesJson = localStorage.getItem("keymail_templates");
      if (keymailTemplatesJson) {
        try {
          const parsed = JSON.parse(keymailTemplatesJson);
          if (Array.isArray(parsed)) {
            templatesFromMainStorage = parsed;
            console.log(`Loaded ${parsed.length} templates from keymail_templates`);
          }
        } catch (parseError) {
          console.error("Error parsing keymail_templates:", parseError);
        }
      }
      
      // Check the emailTemplates storage used in other parts of the app
      const emailTemplatesJson = localStorage.getItem("emailTemplates");
      if (emailTemplatesJson) {
        try {
          const parsed = JSON.parse(emailTemplatesJson);
          if (Array.isArray(parsed)) {
            templatesFromEmailTemplates = parsed;
            console.log(`Loaded ${parsed.length} templates from emailTemplates`);
          }
        } catch (parseError) {
          console.error("Error parsing emailTemplates:", parseError);
        }
      }
      
      // Combine templates from both sources, preferring main storage for duplicates
      const mainTemplateIds = new Set(templatesFromMainStorage.map(t => t.id));
      
      // Add templates from main storage
      allTemplates = [...templatesFromMainStorage];
      
      // Add templates from emailTemplates that don't exist in main storage
      const uniqueEmailTemplates = templatesFromEmailTemplates.filter(t => !mainTemplateIds.has(t.id));
      allTemplates = [...allTemplates, ...uniqueEmailTemplates];
      
      // If we haven't found any templates, just return an empty array
      if (allTemplates.length === 0) return [];
      
      // Map all templates to a consistent format
      return allTemplates.map(template => ({
        id: template.id,
        name: template.name,
        occasion: template.occasion || "",
        subject: template.subject,
        content: template.generatedContent || template.content || template.editedContent,
        status: template.status || "active",
        tags: template.tags || [],
        created_at: template.createdAt || template.created_at || new Date().toISOString(),
        updated_at: template.updatedAt || template.updated_at || new Date().toISOString(),
        fromLocalStorage: true
      }));
    } catch (error) {
      console.error("Error loading templates from localStorage:", error);
      return [];
    }
  };

  // In the useEffect where you load templates, modify it like this:
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // First try to load from localStorage
        const localTemplates = loadTemplatesFromLocalStorage();
        
        // Then try to load from the API
        const response = await fetch("/api/templates");
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to load templates");
        }
        
        if (data.fromLocalStorage || !data.databaseHealthy) {
          // If API is using localStorage or database is unhealthy, use our local data
          setTemplates(localTemplates);
          console.log("Using templates from localStorage due to database issues");
          
          if (data.databaseError) {
            console.warn("Database error:", data.databaseError);
            setError(data.databaseError);
          }
        } else if (Array.isArray(data.data) && data.data.length > 0) {
          // If database returned templates, use them
          setTemplates(data.data);
          console.log(`Loaded ${data.data.length} templates from database`);
          
          // Also update localStorage with the database data for offline access
          try {
            localStorage.setItem("emailTemplates", JSON.stringify(
              data.data.map(dbTemplate => ({
                ...dbTemplate,
                createdAt: dbTemplate.created_at || dbTemplate.createdAt || new Date().toISOString(),
                updatedAt: dbTemplate.updated_at || dbTemplate.updatedAt || new Date().toISOString(),
                dbSaved: true
              }))
            ));
          } catch (lsError) {
            console.error("Error updating localStorage with DB templates:", lsError);
          }
        } else if (localTemplates.length > 0) {
          // Database returned empty but we have local templates
          setTemplates(localTemplates);
          console.log("Using templates from localStorage (database returned empty array)");
        } else {
          // No templates found anywhere
          setTemplates([]);
          console.log("No templates found");
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
        setError("Failed to load templates from server. Showing locally saved templates if available.");
        
        // Use localStorage as fallback on any error
        const localTemplates = loadTemplatesFromLocalStorage();
        setTemplates(localTemplates);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Filter templates based on search term
  useEffect(() => {
    const filtered = templates.filter(template => {
      if (!searchTerm.trim()) return true;
      const search = searchTerm.toLowerCase();
      return (
        template.name.toLowerCase().includes(search) ||
        template.occasion.toLowerCase().includes(search) ||
        template.subject.toLowerCase().includes(search) ||
        template.tags.some(tag => tag.toLowerCase().includes(search))
      );
    });
    
    setFilteredTemplates(filtered);
  }, [templates, searchTerm]);

  // Handle template deletion
  const handleDeleteTemplate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) {
      return;
    }

    setIsDeleting(true);
    setSelectedTemplateId(id);

    // Check if it's a local template
    const isLocalTemplate = id.startsWith('local-');

    try {
      // Delete from localStorage first
      console.log("Attempting to delete template from localStorage:", id);
      
      // Direct localStorage operation as a fallback if the utility fails
      let success = templateStorage.removeTemplate(id);
      
      if (!success) {
        // Try direct manipulation of localStorage as a last resort
        try {
          console.log("Template storage utility failed, trying direct localStorage manipulation");
          const emailTemplatesJson = localStorage.getItem("emailTemplates");
          if (emailTemplatesJson) {
            const emailTemplates = JSON.parse(emailTemplatesJson);
            if (Array.isArray(emailTemplates)) {
              const filteredTemplates = emailTemplates.filter(template => template.id !== id);
              if (filteredTemplates.length !== emailTemplates.length) {
                localStorage.setItem("emailTemplates", JSON.stringify(filteredTemplates));
                success = true;
                console.log("Successfully deleted template via direct localStorage manipulation");
              }
            }
          }
        } catch (directError) {
          console.error("Error with direct localStorage manipulation:", directError);
        }
      }
      
      if (!success) {
        throw new Error("Failed to delete template from local storage");
      }
      
      // Update UI immediately
      setTemplates((prev) => prev.filter((template) => template.id !== id));
      // No need to update filteredTemplates here as it will be updated by the useEffect
      
      // If it's not a local template, also delete from the server
      if (!isLocalTemplate) {
        try {
          const response = await fetch(`/api/templates/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            const data = await response.json();
            console.warn("Server deletion failed but local deletion succeeded:", data.error);
            // Don't throw here - we succeeded locally so consider it a partial success
          } else {
            console.log("Template successfully deleted from server");
          }
        } catch (serverError) {
          console.warn("Error deleting from server but local deletion succeeded:", serverError);
          // Don't throw here - we succeeded locally so consider it a partial success
        }
      }
    } catch (err) {
      console.error("Error deleting template:", err);
      setError(typeof err === "string" ? err : (err as Error).message);
      
      // Show error for 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setIsDeleting(false);
      setSelectedTemplateId(null);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
          <p className="text-muted-foreground">
            Create and manage reusable email templates
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => router.push("/templates/generate")}
            className="bg-amber-500 hover:bg-amber-600"
          >
            <SparkleIcon className="mr-2 h-4 w-4" />
            Generate with AI
          </Button>
          <Button onClick={() => router.push("/templates/create")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        </div>
      </div>

      {error && (
        <Card className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <CardContent className="pt-6">
            <p className="text-yellow-700 dark:text-yellow-400">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Templates</CardTitle>
          <CardDescription>
            Find templates by name, occasion, or tags
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>
      
      <div className="mb-6 flex gap-4">
        <Card className="flex-1 hover:bg-gray-50 cursor-pointer transition-colors">
          <Link href="/templates/create" className="block p-6">
            <div className="flex flex-col items-center justify-center h-32">
              <PlusCircle className="h-10 w-10 text-purple-500 mb-2" />
              <h3 className="font-medium text-lg">Create Template</h3>
              <p className="text-sm text-muted-foreground text-center">
                Create a new email template from scratch
              </p>
            </div>
          </Link>
        </Card>
        
        <Card className="flex-1 hover:bg-gray-50 cursor-pointer transition-colors">
          <Link href="/templates/generate" className="block p-6">
            <div className="flex flex-col items-center justify-center h-32">
              <SparkleIcon className="h-10 w-10 text-amber-500 mb-2" />
              <h3 className="font-medium text-lg">Generate with AI</h3>
              <p className="text-sm text-muted-foreground text-center">
                Use AI to generate a template for you
              </p>
            </div>
          </Link>
        </Card>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-0">
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="pb-3 pt-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <div className="px-6 pb-4 pt-0 flex justify-between">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
              </div>
            </Card>
          ))}
        </div>
      ) : filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <CardDescription>
                  {template.occasion ? `Occasion: ${template.occasion}` : ""}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-gray-500 truncate">{template.subject}</p>
                <div className="mt-2">
                  {template.tags && template.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {template.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/templates/${template.id}`)}
                >
                  View
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleDeleteTemplate(template.id)}
                    disabled={isDeleting && selectedTemplateId === template.id}
                  >
                    {isDeleting && selectedTemplateId === template.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/emails/compose?template=${template.id}`)}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Use
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No templates found</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {templates.length === 0
              ? "Create your first email template to get started."
              : "No templates match your search criteria."}
          </p>
          {templates.length === 0 && (
            <div className="flex justify-center gap-4">
              <Button 
                onClick={() => router.push("/templates/generate")}
                className="bg-amber-500 hover:bg-amber-600"
              >
                <SparkleIcon className="mr-2 h-4 w-4" />
                Generate with AI
              </Button>
              <Button onClick={() => router.push("/templates/create")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create manually
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 