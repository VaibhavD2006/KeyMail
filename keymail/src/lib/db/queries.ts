import dbConnect from './mongodb';
import { User, Client, Email, Template, Analytics } from './models';
import { ApiResponse, PaginatedResponse } from '@/types';
import { emailTemplates } from './schema';
import { eq, desc, and } from 'drizzle-orm';
import { db } from './index';

// User queries
export async function getUserById(id: string) {
  await dbConnect();
  return User.findById(id);
}

export async function getUserByEmail(email: string) {
  await dbConnect();
  return User.findOne({ email });
}

export async function createUser(userData: any) {
  try {
    console.log("Creating user with data:", userData);
    await dbConnect();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      console.log("User already exists:", existingUser);
      return existingUser;
    }
    
    // Create new user
    const newUser = await User.create(userData);
    console.log("User created successfully:", newUser);
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function updateUser(id: string, userData: any) {
  await dbConnect();
  return User.findByIdAndUpdate(id, userData, { new: true });
}

// Client queries
export async function getClientsByUserId(
  userId: string,
  page = 1,
  limit = 10,
  search?: string,
  filters?: Record<string, any>
): Promise<PaginatedResponse<any>> {
  await dbConnect();
  
  const query: Record<string, any> = { userId };
  
  // Add search functionality
  if (search) {
    query.$text = { $search: search };
  }
  
  // Add filters
  if (filters) {
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        query[key] = filters[key];
      }
    });
  }
  
  const skip = (page - 1) * limit;
  
  const [clients, total] = await Promise.all([
    Client.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Client.countDocuments(query),
  ]);
  
  return {
    items: clients,
    total,
    page,
    limit,
    hasMore: total > skip + clients.length,
  };
}

export async function getClientById(id: string, userId: string) {
  await dbConnect();
  return Client.findOne({ _id: id, userId });
}

export async function createClient(clientData: any) {
  await dbConnect();
  return Client.create(clientData);
}

export async function updateClient(id: string, userId: string, clientData: any) {
  await dbConnect();
  return Client.findOneAndUpdate(
    { _id: id, userId },
    clientData,
    { new: true }
  );
}

export async function deleteClient(id: string, userId: string) {
  await dbConnect();
  return Client.findOneAndDelete({ _id: id, userId });
}

// Email queries
export async function getEmailsByUserId(
  userId: string,
  page = 1,
  limit = 10,
  status?: string,
  clientId?: string
): Promise<PaginatedResponse<any>> {
  await dbConnect();
  
  const query: Record<string, any> = { userId };
  
  if (status) {
    query.status = status;
  }
  
  if (clientId) {
    query.clientId = clientId;
  }
  
  const skip = (page - 1) * limit;
  
  const [emails, total] = await Promise.all([
    Email.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('clientId', 'name email')
      .lean(),
    Email.countDocuments(query),
  ]);
  
  return {
    items: emails,
    total,
    page,
    limit,
    hasMore: total > skip + emails.length,
  };
}

export async function getEmailById(id: string, userId: string) {
  await dbConnect();
  return Email.findOne({ _id: id, userId }).populate('clientId', 'name email');
}

export async function createEmail(emailData: any) {
  await dbConnect();
  return Email.create(emailData);
}

export async function updateEmail(id: string, userId: string, emailData: any) {
  await dbConnect();
  return Email.findOneAndUpdate(
    { _id: id, userId },
    emailData,
    { new: true }
  );
}

export async function deleteEmail(id: string, userId: string) {
  await dbConnect();
  return Email.findOneAndDelete({ _id: id, userId });
}

// Template queries
export async function getTemplatesByUserId(
  userId: string,
  page = 1,
  limit = 10,
  category?: string
): Promise<PaginatedResponse<any>> {
  await dbConnect();
  
  const query: Record<string, any> = { userId };
  
  if (category) {
    query.category = category;
  }
  
  const skip = (page - 1) * limit;
  
  const [templates, total] = await Promise.all([
    Template.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Template.countDocuments(query),
  ]);
  
  return {
    items: templates,
    total,
    page,
    limit,
    hasMore: total > skip + templates.length,
  };
}

export async function getTemplateById(id: string, userId: string) {
  await dbConnect();
  return Template.findOne({ _id: id, userId });
}

export async function createTemplate(templateData: any) {
  await dbConnect();
  return Template.create(templateData);
}

export async function updateTemplate(id: string, userId: string, templateData: any) {
  await dbConnect();
  return Template.findOneAndUpdate(
    { _id: id, userId },
    templateData,
    { new: true }
  );
}

export async function deleteTemplate(id: string, userId: string) {
  await dbConnect();
  return Template.findOneAndDelete({ _id: id, userId });
}

// Analytics queries
export async function getAnalyticsByUserId(
  userId: string,
  period: 'daily' | 'weekly' | 'monthly',
  startDate: Date,
  endDate: Date
) {
  await dbConnect();
  
  return Analytics.find({
    userId,
    period,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  }).sort({ date: 1 });
}

export async function createOrUpdateAnalytics(
  userId: string,
  period: 'daily' | 'weekly' | 'monthly',
  date: Date,
  metrics: any
) {
  await dbConnect();
  
  return Analytics.findOneAndUpdate(
    { userId, period, date },
    { $set: { metrics } },
    { new: true, upsert: true }
  );
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