"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Tag, Mail, Trash2, Edit, Clock, Plus } from "lucide-react";
import { templateStorage } from "@/lib/utils";
import { EmailTemplateCard } from "@/components/email/template-card";
import { Loader2 } from "lucide-react";

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

export default function EmailTemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // First try to load templates from localStorage
    try {
      console.log("Attempting to load templates from localStorage");
      const localTemplates = templateStorage.getTemplates() || [];
      
      if (localTemplates.length > 0) {
        console.log(`Loaded ${localTemplates.length} templates from localStorage`);
        setTemplates(localTemplates);
        setFilteredTemplates(localTemplates);
        setLoading(false); // Stop loading indicator since we have local data
      }
    } catch (localErr) {
      console.error("Error loading templates from localStorage:", localErr);
    }
    
    // Then fetch from API (which might update or add to the local templates)
    const fetchTemplates = async () => {
      try {
        console.log("Fetching templates from API");
        const response = await fetch("/api/templates");
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch templates");
        }
        
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
          console.log(`Fetched ${data.data.length} templates from API`);
          
          // Format the templates from API
          const apiTemplates = data.data.map((template: any) => ({
            id: template.id,
            name: template.name,
            occasion: template.occasion || "",
            subject: template.subject,
            content: template.content,
            status: template.status,
            tags: template.tags || [],
            createdAt: template.created_at,
            updatedAt: template.updated_at,
          }));
          
          // Save to localStorage
          apiTemplates.forEach(template => {
            templateStorage.addTemplate(template);
          });
          
          // Combine with any local-only templates
          const localTemplates = templateStorage.getTemplates() || [];
          const localOnlyTemplates = localTemplates.filter(
            local => !apiTemplates.some(api => api.id === local.id)
          );
          
          setTemplates([...apiTemplates, ...localOnlyTemplates]);
          setFilteredTemplates([...apiTemplates, ...localOnlyTemplates]);
        } else {
          // If API returned nothing, keep using local data
          console.log("API returned no templates, using only local data");
        }
      } catch (err) {
        console.error("Error fetching templates:", err);
        
        // If we have local templates, show a warning but don't block the UI
        if (templates.length > 0) {
          setError("Could not connect to the server. Showing locally stored templates.");
        } else {
          setError("Failed to load templates. Please try again later.");
          
          // As a final fallback, try to load from localStorage
          try {
            const localTemplates = templateStorage.getTemplates() || [];
            if (localTemplates.length > 0) {
              console.log(`Fallback to ${localTemplates.length} local templates after API error`);
              setTemplates(localTemplates);
              setFilteredTemplates(localTemplates);
            }
          } catch (localErr) {
            console.error("Error in localStorage fallback:", localErr);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Filter templates based on search term
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
      if (isLocalTemplate) {
        // Delete from localStorage
        const success = templateStorage.removeTemplate(id);
        if (success) {
          // Update local state
          setTemplates((prev) => prev.filter((template) => template.id !== id));
          setFilteredTemplates((prev) => prev.filter((template) => template.id !== id));
          alert("Template deleted successfully");
        } else {
          throw new Error("Failed to delete local template");
        }
      } else {
        // Delete from API
        const response = await fetch(`/api/templates/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete template");
        }

        const data = await response.json();
        if (data.success) {
          // Remove template from state
          setTemplates((prev) => prev.filter((template) => template.id !== id));
          setFilteredTemplates((prev) => prev.filter((template) => template.id !== id));
          alert("Template deleted successfully");
        } else {
          throw new Error(data.error || "Failed to delete template");
        }
      }
    } catch (err) {
      console.error("Error deleting template:", err);
      alert(typeof err === "string" ? err : (err as Error).message);
    } finally {
      setIsDeleting(false);
      setSelectedTemplateId(null);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Use template to create a new email
  const useTemplate = (template: Template) => {
    router.push(`/emails/compose?templateId=${template.id}`);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
          <p className="text-muted-foreground">
            Manage your email templates for various occasions
          </p>
        </div>
        <Link href="/emails/templates/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        </Link>
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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading templates...</span>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((template) => (
            <EmailTemplateCard key={template.id} template={template} />
          ))}
        </div>
      ) : (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center h-64">
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm
                ? "No templates match your search. Try different keywords."
                : "You don't have any templates yet. Create your first template to get started."}
            </p>
            {!searchTerm && (
              <Link href="/emails/templates/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Template
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 