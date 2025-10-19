import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { 
  getEmailTemplateById, 
  updateEmailTemplate, 
  deleteEmailTemplate 
} from "@/lib/db/queries-mongodb";
import { db } from "@/lib/db";
import { emailTemplates } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { templateStorage } from "@/lib/utils";

// GET endpoint to fetch a specific template
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`GET /api/templates/${params.id} - Fetching template`);
    
    // Get the session and validate the user
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.log(`GET /api/templates/${params.id} - Unauthorized: No valid session`);
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { id } = params;
    const userId = session.user.id;
    
    // First try to fetch from database
    let template = null;
    
    try {
      // Try to get from database
      const results = await db
        .select()
        .from(emailTemplates)
        .where(
          and(
            eq(emailTemplates.id, id),
            eq(emailTemplates.userId, userId)
          )
        );
      
      if (results.length > 0) {
        const dbTemplate = results[0];
        
        // Map database fields to API response format
        template = {
          id: dbTemplate.id,
          name: dbTemplate.name,
          occasion: dbTemplate.occasion || "",
          subject: dbTemplate.subject,
          content: dbTemplate.generatedContent, // Map from generated_content
          editedContent: dbTemplate.editedContent, // Map from edited_content
          status: dbTemplate.status,
          tags: dbTemplate.tags || [],
          created_at: dbTemplate.createdAt,
          updated_at: dbTemplate.updatedAt
        };
        
        // Save to localStorage for offline access
        templateStorage.addTemplate({
          id: template.id,
          name: template.name,
          occasion: template.occasion,
          subject: template.subject,
          content: template.content,
          status: template.status,
          tags: template.tags,
          createdAt: template.created_at,
          updatedAt: template.updated_at,
        });
        
        console.log(`GET /api/templates/${params.id} - Template found in database`);
      } else {
        console.log(`GET /api/templates/${params.id} - Template not found in database`);
      }
    } catch (dbError) {
      console.error(`GET /api/templates/${params.id} - Database error:`, dbError);
    }
    
    // If not found in database, try localStorage
    if (!template) {
      console.log(`GET /api/templates/${params.id} - Trying localStorage`);
      const localTemplate = templateStorage.getTemplate(id);
      
      if (localTemplate) {
        template = {
          id: localTemplate.id,
          name: localTemplate.name,
          occasion: localTemplate.occasion || "",
          subject: localTemplate.subject,
          content: localTemplate.content,
          editedContent: null,
          status: localTemplate.status,
          tags: localTemplate.tags || [],
          created_at: localTemplate.createdAt,
          updated_at: localTemplate.updatedAt
        };
        console.log(`GET /api/templates/${params.id} - Template found in localStorage`);
      }
    }
    
    if (!template) {
      console.log(`GET /api/templates/${params.id} - Template not found anywhere`);
      return NextResponse.json(
        { success: false, error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error(`GET /api/templates/${params.id} - Error:`, error);
    
    // Try localStorage as last resort
    try {
      const localTemplate = templateStorage.getTemplate(params.id);
      
      if (localTemplate) {
        console.log(`GET /api/templates/${params.id} - Returning from localStorage after error`);
        return NextResponse.json({
          success: true,
          data: {
            id: localTemplate.id,
            name: localTemplate.name, 
            occasion: localTemplate.occasion,
            subject: localTemplate.subject,
            content: localTemplate.content,
            editedContent: null,
            status: localTemplate.status,
            tags: localTemplate.tags,
            created_at: localTemplate.createdAt,
            updated_at: localTemplate.updatedAt
          },
          source: "localStorage",
        });
      }
    } catch (localStorageError) {
      console.error(`GET /api/templates/${params.id} - LocalStorage error:`, localStorageError);
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch template",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

// PUT endpoint to update a template
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { name, occasion, subject, generatedContent, editedContent, status, tags } = body;

    // Ensure the template exists
    const existingTemplate = await getEmailTemplateById(id, session.user.id);
    if (!existingTemplate) {
      return NextResponse.json(
        { success: false, error: "Template not found" },
        { status: 404 }
      );
    }

    // Update the template
    const updatedTemplate = await updateEmailTemplate({
      id,
      userId: session.user.id,
      name,
      occasion,
      subject,
      generatedContent,
      editedContent,
      status,
      tags,
    });

    return NextResponse.json({
      success: true,
      data: updatedTemplate,
    });
  } catch (error) {
    console.error("Error updating template:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update template" },
      { status: 500 }
    );
  }
}

// DELETE endpoint to delete a template
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    // Ensure the template exists
    const existingTemplate = await getEmailTemplateById(id, session.user.id);
    if (!existingTemplate) {
      return NextResponse.json(
        { success: false, error: "Template not found" },
        { status: 404 }
      );
    }

    // Delete the template
    await deleteEmailTemplate(id, session.user.id);

    return NextResponse.json({
      success: true,
      message: "Template deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting template:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete template" },
      { status: 500 }
    );
  }
} 