import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { 
  getEmailTemplatesByUserId, 
  saveEmailTemplate 
} from "@/lib/db/queries-mongodb";
import { db, checkDatabaseHealth, isUsingLocalStorageFallback } from "@/lib/db";
import { emailTemplates, templateStatusEnum } from "@/lib/db/schema";
import { sql, eq } from "drizzle-orm";
import { templateStorage } from "@/lib/utils";

/**
 * GET /api/templates - Retrieve templates for the current user
 */
export async function GET(req: NextRequest) {
  console.log("GET /api/templates - Retrieving templates");
  
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.warn("GET /api/templates - Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;
    console.log(`Fetching templates for user: ${userId}`);
    
    // Check database health before attempting to fetch
    const dbHealth = await checkDatabaseHealth();
    
    // Early return for localStorage fallback
    if (isUsingLocalStorageFallback() || !dbHealth.healthy) {
      console.log("Using localStorage fallback for templates");
      return NextResponse.json({ 
        data: [], // Return empty array, client will use localStorage
        fromLocalStorage: true,
        databaseHealthy: false,
        databaseError: dbHealth.error || "Database unavailable, using localStorage"
      });
    }
    
    try {
      const templates = await getEmailTemplatesByUserId(userId);
      console.log(`Retrieved ${templates.length} templates from database`);
      
      return NextResponse.json({ 
        data: templates,
        fromLocalStorage: false,
        databaseHealthy: true
      });
    } catch (dbError) {
      console.error("Error fetching templates from database:", dbError);
      
      return NextResponse.json({ 
        data: [], // Return empty array, client will use localStorage
        fromLocalStorage: true,
        databaseHealthy: false,
        databaseError: String(dbError)
      });
    }
  } catch (error) {
    console.error("Error in GET /api/templates:", error);
    return NextResponse.json(
      { 
        error: "Failed to retrieve templates", 
        details: String(error),
        fromLocalStorage: true 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/templates - Create a new email template
 */
export async function POST(req: NextRequest) {
  console.log("POST /api/templates - Creating new template");
  
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.warn("POST /api/templates - Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Parse request body
    const body = await req.json();
    
    // Validate required fields
    const requiredFields = ["name", "subject", "generatedContent"];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      const errorMsg = `Missing required fields: ${missingFields.join(", ")}`;
      console.warn(`POST /api/templates - ${errorMsg}`);
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }
    
    // Prepare template data
    const templateData = {
      userId,
      name: body.name,
      occasion: body.occasion || null,
      subject: body.subject,
      generatedContent: body.generatedContent,
      editedContent: body.editedContent || body.generatedContent,
      status: body.status || "active",
      tags: body.tags || [],
    };
    
    // Check database health before attempting to save
    const dbHealth = await checkDatabaseHealth();
    
    // Early return for localStorage fallback
    if (isUsingLocalStorageFallback() || !dbHealth.healthy) {
      console.log("Using localStorage fallback for template creation");
      return NextResponse.json({
        success: false,
        error: "Database unavailable, please use localStorage",
        details: dbHealth.error || "Database connection failed",
        fromLocalStorage: true,
      }, { status: 503 });
    }
    
    // Attempt to save to the database
    try {
      console.log("Saving template to database:", templateData);
      const result = await saveEmailTemplate(templateData);
      
      console.log("Template saved successfully to database with ID:", result.id);
      return NextResponse.json({
        success: true,
        data: result,
        message: "Template created successfully"
      });
    } catch (dbError) {
      console.error("Error saving template to database:", dbError);
      
      // Return a response that indicates template was saved locally but not to DB
      return NextResponse.json({
        error: "Failed to save template to database",
        details: String(dbError),
        success: false,
        fromLocalStorage: true,
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in POST /api/templates:", error);
    return NextResponse.json(
      { error: "Failed to create template", details: String(error) },
      { status: 500 }
    );
  }
} 