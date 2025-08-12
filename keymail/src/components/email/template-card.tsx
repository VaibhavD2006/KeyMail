"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, Tag, Edit, Trash2, ExternalLink, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { templateStorage } from "@/lib/utils";

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

interface EmailTemplateCardProps {
  template: Template;
}

export function EmailTemplateCard({ template }: EmailTemplateCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete the template "${template.name}"?`)) {
      return;
    }
    
    setIsDeleting(true);
    setError(null);
    
    try {
      // Remove from local storage first
      templateStorage.removeTemplate(template.id);
      
      // Then try to remove from the server
      const response = await fetch(`/api/templates/${template.id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete template");
      }
      
      // Force a refresh of the templates list
      router.refresh();
    } catch (err) {
      console.error("Error deleting template:", err);
      setError("Failed to delete from server, but removed from local storage");
      
      // Wait a bit then hide the error
      setTimeout(() => {
        setError(null);
        router.refresh(); // Refresh anyway to remove from UI
      }, 3000);
    } finally {
      setIsDeleting(false);
    }
  };

  const useTemplate = () => {
    // Navigate to compose email with this template
    router.push(`/emails/compose?template=${template.id}`);
  };

  // Check if this is a local-only template
  const isLocalOnly = template.id.startsWith('local-');
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-start">
          <div className="truncate mr-2">{template.name}</div>
          {isLocalOnly && (
            <Badge variant="outline" className="text-xs bg-amber-100 border-amber-300 text-amber-800">
              Local Only
            </Badge>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground truncate">{template.subject}</p>
      </CardHeader>
      
      <CardContent className="flex-grow pb-2">
        <div className="space-y-1 text-sm">
          {template.occasion && (
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span className="truncate">{template.occasion}</span>
            </div>
          )}
          
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>Updated {formatDate(template.updatedAt)}</span>
          </div>
        </div>
        
        {template.tags && template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {template.tags.map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {error && (
          <div className="mt-3 p-2 text-xs bg-red-50 text-red-600 rounded">
            {error}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between">
        <Button 
          variant="secondary" 
          size="sm" 
          className="flex-1 mr-1"
          onClick={useTemplate}
        >
          <Mail className="h-3.5 w-3.5 mr-1" />
          Use
        </Button>
        
        <div className="flex">
          <Link href={`/emails/templates/${template.id}`} className="mr-1">
            <Button variant="outline" size="sm" className="h-9 w-9 p-0">
              <Edit className="h-3.5 w-3.5" />
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            size="sm"
            className="h-9 w-9 p-0"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className="h-3.5 w-3.5 animate-spin">×</span>
            ) : (
              <Trash2 className="h-3.5 w-3.5 text-red-500" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 