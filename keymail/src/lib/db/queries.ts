import { ApiResponse, PaginatedResponse } from '@/types';
import { db } from './index';
import { 
  clients, 
  emailTemplates, 
  milestones, 
  listings, 
  showings, 
  showingFeedback, 
  emailHistory, 
  mlsCache, 
  propertyMatches 
} from "./schema";
import { eq, and, gte, lte, desc, asc, sql } from "drizzle-orm";

// User queries - Using Drizzle ORM
export async function getUserById(id: string) {
  try {
    const result = await db
      .select()
      .from(clients) // Using clients table as users for now
      .where(eq(clients.id, id))
      .limit(1);
    
    return result[0] || null;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const result = await db
      .select()
      .from(clients) // Using clients table as users for now
      .where(eq(clients.email, email))
      .limit(1);
    
    return result[0] || null;
  } catch (error) {
    console.error("Error getting user by email:", error);
    throw error;
  }
}

export async function createUser(userData: any) {
  try {
    console.log("Creating user with data:", userData);
    
    // Check if user already exists
    const existingUser = await getUserByEmail(userData.email);
    if (existingUser) {
      console.log("User already exists:", existingUser);
      return existingUser;
    }
    
    // Create new user (using clients table for now)
    const result = await db.insert(clients).values({
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    
    console.log("User created successfully:", result[0]);
    return result[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function updateUser(id: string, userData: any) {
  try {
    const result = await db
      .update(clients)
      .set({
        ...userData,
        updatedAt: new Date(),
      })
      .where(eq(clients.id, id))
      .returning();
    
    return result[0] || null;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

// Existing client queries
export async function saveClient(clientData: any) {
  try {
    console.log("Saving client with data:", clientData);
    
    const result = await db.insert(clients).values({
      ...clientData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    
    console.log("Client saved successfully:", result[0]);
    return result[0];
  } catch (error) {
    console.error("Error saving client:", error);
    throw error;
  }
}

export async function getClientsByUserId(userId: string) {
  try {
    const result = await db
      .select()
      .from(clients)
      .where(eq(clients.userId, userId))
      .orderBy(desc(clients.createdAt));
    
    return result;
  } catch (error) {
    console.error("Error getting clients by user ID:", error);
    throw error;
  }
}

export async function getClientById(id: string) {
  try {
    const result = await db
      .select()
      .from(clients)
      .where(eq(clients.id, id))
      .limit(1);
    
    return result[0] || null;
  } catch (error) {
    console.error("Error getting client by ID:", error);
    throw error;
  }
}

export async function updateClient(id: string, updateData: any) {
  try {
    const result = await db
      .update(clients)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(clients.id, id))
      .returning();
    
    return result[0] || null;
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
}

export async function deleteClient(id: string) {
  try {
    const result = await db
      .delete(clients)
      .where(eq(clients.id, id))
      .returning();
    
    return result[0] || null;
  } catch (error) {
    console.error("Error deleting client:", error);
    throw error;
  }
}

// Email queries - Using Drizzle ORM
export async function getEmailsByUserId(
  userId: string,
  page = 1,
  limit = 10,
  status?: string,
  clientId?: string
): Promise<PaginatedResponse<any>> {
  try {
    let query = db
      .select()
      .from(emailHistory)
      .where(eq(emailHistory.userId, userId));
    
    if (status) {
      query = query.where(eq(emailHistory.status, status));
    }
    
    if (clientId) {
      query = query.where(eq(emailHistory.clientId, clientId));
    }
    
    const skip = (page - 1) * limit;
    
    const [emails, total] = await Promise.all([
      query.orderBy(desc(emailHistory.createdAt))
        .limit(limit)
        .offset(skip),
      db.select({ count: sql<number>`count(*)` })
        .from(emailHistory)
        .where(eq(emailHistory.userId, userId))
        .then(result => result[0]?.count || 0)
    ]);
    
    return {
      items: emails,
      total,
      page,
      limit,
      hasMore: total > skip + emails.length,
    };
  } catch (error) {
    console.error("Error getting emails by user ID:", error);
    throw error;
  }
}

export async function getEmailById(id: string, userId: string) {
  try {
    const result = await db
      .select()
      .from(emailHistory)
      .where(and(
        eq(emailHistory.id, id),
        eq(emailHistory.userId, userId)
      ))
      .limit(1);
    
    return result[0] || null;
  } catch (error) {
    console.error("Error getting email by ID:", error);
    throw error;
  }
}

export async function createEmail(emailData: any) {
  try {
    const result = await db
      .insert(emailHistory)
      .values({
        ...emailData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    
    return result[0];
  } catch (error) {
    console.error("Error creating email:", error);
    throw error;
  }
}

export async function updateEmail(id: string, userId: string, emailData: any) {
  try {
    const result = await db
      .update(emailHistory)
      .set({
        ...emailData,
        updatedAt: new Date(),
      })
      .where(and(
        eq(emailHistory.id, id),
        eq(emailHistory.userId, userId)
      ))
      .returning();
    
    return result[0] || null;
  } catch (error) {
    console.error("Error updating email:", error);
    throw error;
  }
}

export async function deleteEmail(id: string, userId: string) {
  try {
    const result = await db
      .delete(emailHistory)
      .where(and(
        eq(emailHistory.id, id),
        eq(emailHistory.userId, userId)
      ))
      .returning();
    
    return result[0] || null;
  } catch (error) {
    console.error("Error deleting email:", error);
    throw error;
  }
}







// NEW: Milestone queries
export async function saveMilestone(milestoneData: any) {
  try {
    console.log("Saving milestone with data:", milestoneData);
    
    const result = await db.insert(milestones).values({
      ...milestoneData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    
    console.log("Milestone saved successfully:", result[0]);
    return result[0];
  } catch (error) {
    console.error("Error saving milestone:", error);
    throw error;
  }
}

export async function getMilestonesByUserId(userId: string) {
  try {
    const result = await db
      .select()
      .from(milestones)
      .where(eq(milestones.userId, userId))
      .orderBy(asc(milestones.nextSendDate));
    
    return result;
  } catch (error) {
    console.error("Error getting milestones by user ID:", error);
    throw error;
  }
}

export async function getUpcomingMilestones(userId: string, days: number = 30) {
  try {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    const result = await db
      .select()
      .from(milestones)
      .where(
        and(
          eq(milestones.userId, userId),
          eq(milestones.isActive, true),
          gte(milestones.nextSendDate, new Date()),
          lte(milestones.nextSendDate, futureDate)
        )
      )
      .orderBy(asc(milestones.nextSendDate));
    
    return result;
  } catch (error) {
    console.error("Error getting upcoming milestones:", error);
    throw error;
  }
}

export async function updateMilestoneLastSent(id: string) {
  try {
    const result = await db
      .update(milestones)
      .set({
        lastSent: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(milestones.id, id))
      .returning();
    
    return result[0] || null;
  } catch (error) {
    console.error("Error updating milestone last sent:", error);
    throw error;
  }
}

// NEW: Listing queries
export async function saveListing(listingData: any) {
  try {
    console.log("Saving listing with data:", listingData);
    
    const result = await db.insert(listings).values({
      ...listingData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    
    console.log("Listing saved successfully:", result[0]);
    return result[0];
  } catch (error) {
    console.error("Error saving listing:", error);
    throw error;
  }
}

export async function getListingsByUserId(userId: string) {
  try {
    const result = await db
      .select()
      .from(listings)
      .where(eq(listings.userId, userId))
      .orderBy(desc(listings.createdAt));
    
    return result;
  } catch (error) {
    console.error("Error getting listings by user ID:", error);
    throw error;
  }
}

export async function getListingByMlsId(mlsId: string) {
  try {
    const result = await db
      .select()
      .from(listings)
      .where(eq(listings.mlsId, mlsId))
      .limit(1);
    
    return result[0] || null;
  } catch (error) {
    console.error("Error getting listing by MLS ID:", error);
    throw error;
  }
}

// NEW: MLS Cache queries
export async function saveMlsCache(mlsId: string, data: any, expiresInHours: number = 24) {
  try {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);
    
    const result = await db.insert(mlsCache).values({
      mlsId,
      data,
      expiresAt,
      createdAt: new Date(),
    }).returning();
    
    return result[0];
  } catch (error) {
    console.error("Error saving MLS cache:", error);
    throw error;
  }
}

export async function getMlsCache(mlsId: string) {
  try {
    const result = await db
      .select()
      .from(mlsCache)
      .where(
        and(
          eq(mlsCache.mlsId, mlsId),
          gte(mlsCache.expiresAt, new Date())
        )
      )
      .limit(1);
    
    return result[0] || null;
  } catch (error) {
    console.error("Error getting MLS cache:", error);
    throw error;
  }
}

// NEW: Property matching queries
export async function savePropertyMatch(matchData: any) {
  try {
    const result = await db.insert(propertyMatches).values({
      ...matchData,
      createdAt: new Date(),
    }).returning();
    
    return result[0];
  } catch (error) {
    console.error("Error saving property match:", error);
    throw error;
  }
}

export async function getPropertyMatchesByClientId(clientId: string) {
  try {
    const result = await db
      .select()
      .from(propertyMatches)
      .where(
        and(
          eq(propertyMatches.clientId, clientId),
          eq(propertyMatches.isActive, true)
        )
      )
      .orderBy(desc(propertyMatches.matchScore));
    
    return result;
  } catch (error) {
    console.error("Error getting property matches by client ID:", error);
    throw error;
  }
}

// NEW: Showing queries
export async function saveShowing(showingData: any) {
  try {
    const result = await db.insert(showings).values({
      ...showingData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    
    return result[0];
  } catch (error) {
    console.error("Error saving showing:", error);
    throw error;
  }
}

export async function getShowingsByUserId(userId: string) {
  try {
    const result = await db
      .select()
      .from(showings)
      .where(eq(showings.userId, userId))
      .orderBy(desc(showings.scheduledAt));
    
    return result;
  } catch (error) {
    console.error("Error getting showings by user ID:", error);
    throw error;
  }
}

export async function getCompletedShowingsForFollowUp(startTime: Date, endTime: Date) {
  try {
    const result = await db
      .select()
      .from(showings)
      .where(
        and(
          eq(showings.status, "completed"),
          gte(showings.completedAt, startTime),
          lte(showings.completedAt, endTime),
          eq(showings.followUpSent, false)
        )
      );
    
    return result;
  } catch (error) {
    console.error("Error getting completed showings for follow-up:", error);
    throw error;
  }
}

// NEW: Email history queries
export async function saveEmailHistory(emailData: any) {
  try {
    const result = await db.insert(emailHistory).values({
      ...emailData,
      createdAt: new Date(),
    }).returning();
    
    return result[0];
  } catch (error) {
    console.error("Error saving email history:", error);
    throw error;
  }
}

export async function updateEmailStatus(emailId: string, status: string, openRate?: boolean, clickRate?: boolean) {
  try {
    const updateData: any = { status };
    if (openRate !== undefined) updateData.openRate = openRate;
    if (clickRate !== undefined) updateData.clickRate = clickRate;
    
    const result = await db
      .update(emailHistory)
      .set(updateData)
      .where(eq(emailHistory.id, emailId))
      .returning();
    
    return result[0] || null;
  } catch (error) {
    console.error("Error updating email status:", error);
    throw error;
  }
}

// Template queries - Using Drizzle ORM
export async function getTemplatesByUserId(
  userId: string,
  page = 1,
  limit = 10,
  category?: string
): Promise<PaginatedResponse<any>> {
  try {
    let query = db
      .select()
      .from(emailTemplates)
      .where(eq(emailTemplates.userId, userId));
    
    if (category) {
      query = query.where(eq(emailTemplates.category, category));
    }
    
    const skip = (page - 1) * limit;
    
    const [templates, total] = await Promise.all([
      query.orderBy(desc(emailTemplates.createdAt))
        .limit(limit)
        .offset(skip),
      db.select({ count: sql<number>`count(*)` })
        .from(emailTemplates)
        .where(eq(emailTemplates.userId, userId))
        .then(result => result[0]?.count || 0)
    ]);
    
    return {
      items: templates,
      total,
      page,
      limit,
      hasMore: total > skip + templates.length,
    };
  } catch (error) {
    console.error("Error getting templates by user ID:", error);
    throw error;
  }
}

export async function getTemplateById(id: string, userId: string) {
  try {
    const result = await db
      .select()
      .from(emailTemplates)
      .where(and(
        eq(emailTemplates.id, id),
        eq(emailTemplates.userId, userId)
      ))
      .limit(1);
    
    return result[0] || null;
  } catch (error) {
    console.error("Error getting template by ID:", error);
    throw error;
  }
}

export async function createTemplate(templateData: any) {
  try {
    const result = await db
      .insert(emailTemplates)
      .values({
        ...templateData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    
    return result[0];
  } catch (error) {
    console.error("Error creating template:", error);
    throw error;
  }
}

export async function updateTemplate(id: string, userId: string, templateData: any) {
  try {
    const result = await db
      .update(emailTemplates)
      .set({
        ...templateData,
        updatedAt: new Date(),
      })
      .where(and(
        eq(emailTemplates.id, id),
        eq(emailTemplates.userId, userId)
      ))
      .returning();
    
    return result[0] || null;
  } catch (error) {
    console.error("Error updating template:", error);
    throw error;
  }
}

export async function deleteTemplate(id: string, userId: string) {
  try {
    const result = await db
      .delete(emailTemplates)
      .where(and(
        eq(emailTemplates.id, id),
        eq(emailTemplates.userId, userId)
      ))
      .returning();
    
    return result[0] || null;
  } catch (error) {
    console.error("Error deleting template:", error);
    throw error;
  }
}

// Analytics queries - Using Drizzle ORM (placeholder for now)
export async function getAnalyticsByUserId(
  userId: string,
  period: 'daily' | 'weekly' | 'monthly',
  startDate: Date,
  endDate: Date
) {
  try {
    // TODO: Implement analytics queries when analytics table is created
    console.log("Analytics queries not yet implemented");
    return [];
  } catch (error) {
    console.error("Error getting analytics by user ID:", error);
    throw error;
  }
}

export async function createOrUpdateAnalytics(
  userId: string,
  period: 'daily' | 'weekly' | 'monthly',
  date: Date,
  metrics: any
) {
  try {
    // TODO: Implement analytics creation/update when analytics table is created
    console.log("Analytics creation/update not yet implemented");
    return null;
  } catch (error) {
    console.error("Error creating/updating analytics:", error);
    throw error;
  }
}

// Email Template Queries
export async function saveEmailTemplate({
  userId,
  name,
  occasion,
  subject,
  generatedContent,
  editedContent = null,
  tags = [],
}: {
  userId: string;
  name: string;
  occasion: string;
  subject: string;
  generatedContent: string;
  editedContent?: string | null;
  tags?: string[];
}) {
  try {
    console.log("Attempting to save email template with data:", {
      userId,
      name,
      occasion,
      subject,
      contentLength: generatedContent?.length || 0,
      hasEditedContent: editedContent !== null,
      tagsCount: tags?.length || 0
    });

    // Ensure all required fields are present
    if (!userId) throw new Error("User ID is required");
    if (!name) throw new Error("Template name is required");
    if (!occasion) throw new Error("Occasion is required");
    if (!subject) throw new Error("Subject is required");
    if (!generatedContent) throw new Error("Content is required");

    // Add default values if needed
    const timestamp = new Date();
    const defaultStatus = "active";

    // Insert the template
    const result = await db
      .insert(emailTemplates)
      .values({
        userId,
        name,
        occasion,
        subject,
        generatedContent,
        editedContent,
        tags: tags || [],
        status: defaultStatus,
        createdAt: timestamp,
        updatedAt: timestamp
      })
      .returning();
    
    if (!result || result.length === 0) {
      throw new Error("Database operation returned no results");
    }
    
    const template = result[0];
    console.log("Template created successfully with ID:", template.id);
    return template;
  } catch (error) {
    console.error('Error saving email template:', error);
    
    // Get more specific error information
    let errorMessage = 'Failed to save email template';
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
      console.error('Error stack:', error.stack);
    }
    
    // Rethrow with more context
    throw new Error(errorMessage);
  }
}

export async function getEmailTemplatesByUserId(userId: string) {
  try {
    const templates = await db
      .select()
      .from(emailTemplates)
      .where(eq(emailTemplates.userId, userId))
      .orderBy(desc(emailTemplates.createdAt));
    
    return templates;
  } catch (error) {
    console.error('Error fetching email templates:', error);
    throw new Error('Failed to fetch email templates');
  }
}

export async function getEmailTemplateById(id: string, userId: string) {
  try {
    const [template] = await db
      .select()
      .from(emailTemplates)
      .where(and(
        eq(emailTemplates.id, id),
        eq(emailTemplates.userId, userId)
      ));
    
    return template || null;
  } catch (error) {
    console.error('Error fetching email template:', error);
    throw new Error('Failed to fetch email template');
  }
}

export async function updateEmailTemplate({
  id,
  userId,
  name,
  occasion,
  subject,
  generatedContent,
  editedContent,
  status,
  tags,
}: {
  id: string;
  userId: string;
  name?: string;
  occasion?: string;
  subject?: string;
  generatedContent?: string;
  editedContent?: string | null;
  status?: 'draft' | 'active' | 'archived';
  tags?: string[];
}) {
  try {
    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    };
    
    if (name !== undefined) updateData.name = name;
    if (occasion !== undefined) updateData.occasion = occasion;
    if (subject !== undefined) updateData.subject = subject;
    if (generatedContent !== undefined) updateData.generatedContent = generatedContent;
    if (editedContent !== undefined) updateData.editedContent = editedContent;
    if (status !== undefined) updateData.status = status;
    if (tags !== undefined) updateData.tags = tags;

    const [updatedTemplate] = await db
      .update(emailTemplates)
      .set(updateData)
      .where(and(
        eq(emailTemplates.id, id),
        eq(emailTemplates.userId, userId)
      ))
      .returning();
    
    return updatedTemplate;
  } catch (error) {
    console.error('Error updating email template:', error);
    throw new Error('Failed to update email template');
  }
}

export async function deleteEmailTemplate(id: string, userId: string) {
  try {
    await db
      .delete(emailTemplates)
      .where(and(
        eq(emailTemplates.id, id),
        eq(emailTemplates.userId, userId)
      ));
    
    return true;
  } catch (error) {
    console.error('Error deleting email template:', error);
    throw new Error('Failed to delete email template');
  }
} 