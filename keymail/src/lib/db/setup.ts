import { db } from "./index";
import { emailTemplates, templateStatusEnum } from "./schema";
import { sql } from "drizzle-orm";

/**
 * Ensures the email_templates table exists
 * Creates it if it doesn't exist
 */
export async function ensureEmailTemplatesTable() {
  try {
    console.log("Checking if email_templates table exists...");
    
    // Check if the table exists by attempting to query it
    try {
      const result = await db.select({ count: sql`count(*)` }).from(emailTemplates).limit(1);
      console.log("email_templates table exists", result);
      return true;
    } catch (error) {
      console.log("email_templates table doesn't exist or had error:", error);
      
      // Create the enum type first
      try {
        console.log("Creating template_status enum type...");
        await db.execute(sql`
          DO $$
          BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'template_status') THEN
              CREATE TYPE template_status AS ENUM ('draft', 'active', 'archived');
            END IF;
          END
          $$;
        `);
        console.log("template_status enum type created successfully");
      } catch (enumError) {
        console.error("Error creating enum type:", enumError);
        throw enumError;
      }
      
      // Create the email_templates table
      try {
        console.log("Creating email_templates table...");
        await db.execute(sql`
          CREATE TABLE IF NOT EXISTS email_templates (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id TEXT NOT NULL,
            name TEXT NOT NULL,
            occasion TEXT,
            subject TEXT NOT NULL,
            content TEXT NOT NULL,
            status template_status NOT NULL DEFAULT 'active',
            tags TEXT[],
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `);
        console.log("email_templates table created successfully");
        return true;
      } catch (tableError) {
        console.error("Error creating email_templates table:", tableError);
        throw tableError;
      }
    }
  } catch (error) {
    console.error("Error in ensureEmailTemplatesTable:", error);
    return false;
  }
}

/**
 * Sets up the database schema
 * This ensures all required tables exist
 */
export async function setupDatabase() {
  try {
    console.log("Starting database setup...");
    
    // Setup email templates table
    const templatesResult = await ensureEmailTemplatesTable();
    
    // Add more table setup functions here as needed
    
    return {
      emailTemplates: templatesResult
    };
  } catch (error) {
    console.error("Error in setupDatabase:", error);
    throw error;
  }
} 