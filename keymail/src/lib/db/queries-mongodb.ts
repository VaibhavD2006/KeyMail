import dbConnect from './mongodb';
import { User, Client, Email, Template, Milestone, Listing, PropertyMatch } from './models';

// User queries - Using MongoDB
export async function getUserById(id: string) {
  try {
    await dbConnect();
    const user = await User.findById(id);
    return user;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    await dbConnect();
    const user = await User.findOne({ email: email.toLowerCase() });
    return user;
  } catch (error) {
    console.error("Error getting user by email:", error);
    throw error;
  }
}

export async function createUser(userData: any) {
  try {
    console.log("Creating user with data:", userData);
    await dbConnect();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
    if (existingUser) {
      console.log("User already exists:", existingUser);
      return existingUser;
    }
    
    // Create new user
    const user = await User.create({
      email: userData.email,
      name: userData.name || "User",
      plan: userData.plan || "free",
      settings: userData.settings || {}
    });
    
    console.log("User created successfully:", user);
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function updateUser(id: string, userData: any) {
  try {
    await dbConnect();
    const user = await User.findByIdAndUpdate(
      id,
      { $set: userData },
      { new: true }
    );
    return user;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

// Client queries
export async function saveClient(clientData: any) {
  try {
    console.log("Saving client with data:", clientData);
    await dbConnect();
    
    const client = await Client.create(clientData);
    console.log("Client saved successfully:", client);
    return client;
  } catch (error) {
    console.error("Error saving client:", error);
    throw error;
  }
}

export async function getClientsByUserId(userId: string) {
  try {
    await dbConnect();
    const clients = await Client.find({ userId }).sort({ createdAt: -1 });
    return clients;
  } catch (error) {
    console.error("Error getting clients by user ID:", error);
    throw error;
  }
}

export async function getClientById(id: string) {
  try {
    await dbConnect();
    const client = await Client.findById(id);
    return client;
  } catch (error) {
    console.error("Error getting client by ID:", error);
    throw error;
  }
}

export async function updateClient(id: string, updateData: any) {
  try {
    await dbConnect();
    const client = await Client.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    return client;
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
}

export async function deleteClient(id: string) {
  try {
    await dbConnect();
    const client = await Client.findByIdAndDelete(id);
    return client;
  } catch (error) {
    console.error("Error deleting client:", error);
    throw error;
  }
}

// Email queries
export async function getEmailsByUserId(
  userId: string,
  page = 1,
  limit = 10,
  status?: string,
  clientId?: string
) {
  try {
    await dbConnect();
    
    const query: any = { userId };
    if (status) query.status = status;
    if (clientId) query.clientId = clientId;
    
    const skip = (page - 1) * limit;
    
    const [emails, total] = await Promise.all([
      Email.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Email.countDocuments(query)
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
    await dbConnect();
    const email = await Email.findOne({ _id: id, userId });
    return email;
  } catch (error) {
    console.error("Error getting email by ID:", error);
    throw error;
  }
}

export async function createEmail(emailData: any) {
  try {
    await dbConnect();
    const email = await Email.create(emailData);
    return email;
  } catch (error) {
    console.error("Error creating email:", error);
    throw error;
  }
}

export async function updateEmail(id: string, userId: string, emailData: any) {
  try {
    await dbConnect();
    const email = await Email.findOneAndUpdate(
      { _id: id, userId },
      { $set: emailData },
      { new: true }
    );
    return email;
  } catch (error) {
    console.error("Error updating email:", error);
    throw error;
  }
}

export async function deleteEmail(id: string, userId: string) {
  try {
    await dbConnect();
    const email = await Email.findOneAndDelete({ _id: id, userId });
    return email;
  } catch (error) {
    console.error("Error deleting email:", error);
    throw error;
  }
}

// Template queries
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

    await dbConnect();
    
    const template = await Template.create({
      userId,
      name,
      occasion,
      subject,
      generatedContent,
      editedContent,
      tags,
      status: "active"
    });
    
    console.log("Template created successfully with ID:", template._id);
    return template;
  } catch (error) {
    console.error('Error saving email template:', error);
    throw new Error('Failed to save email template');
  }
}

export async function getEmailTemplatesByUserId(userId: string) {
  try {
    await dbConnect();
    const templates = await Template.find({ userId }).sort({ createdAt: -1 });
    return templates;
  } catch (error) {
    console.error('Error fetching email templates:', error);
    throw new Error('Failed to fetch email templates');
  }
}

export async function getEmailTemplateById(id: string, userId: string) {
  try {
    await dbConnect();
    const template = await Template.findOne({ _id: id, userId });
    return template || null;
  } catch (error) {
    console.error('Error fetching email template:', error);
    throw new Error('Failed to fetch email template');
  }
}

export async function getTemplatesByUserId(
  userId: string,
  page = 1,
  limit = 10,
  category?: string
) {
  try {
    await dbConnect();
    
    const query: any = { userId };
    if (category) query.category = category;
    
    const skip = (page - 1) * limit;
    
    const [templates, total] = await Promise.all([
      Template.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Template.countDocuments(query)
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
    await dbConnect();
    const template = await Template.findOne({ _id: id, userId });
    return template;
  } catch (error) {
    console.error("Error getting template by ID:", error);
    throw error;
  }
}

export async function createTemplate(templateData: any) {
  try {
    await dbConnect();
    const template = await Template.create(templateData);
    return template;
  } catch (error) {
    console.error("Error creating template:", error);
    throw error;
  }
}

export async function updateTemplate(id: string, userId: string, templateData: any) {
  try {
    await dbConnect();
    const template = await Template.findOneAndUpdate(
      { _id: id, userId },
      { $set: templateData },
      { new: true }
    );
    return template;
  } catch (error) {
    console.error("Error updating template:", error);
    throw error;
  }
}

export async function deleteTemplate(id: string, userId: string) {
  try {
    await dbConnect();
    const template = await Template.findOneAndDelete({ _id: id, userId });
    return template;
  } catch (error) {
    console.error("Error deleting template:", error);
    throw error;
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
    await dbConnect();
    
    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name;
    if (occasion !== undefined) updateData.occasion = occasion;
    if (subject !== undefined) updateData.subject = subject;
    if (generatedContent !== undefined) updateData.generatedContent = generatedContent;
    if (editedContent !== undefined) updateData.editedContent = editedContent;
    if (status !== undefined) updateData.status = status;
    if (tags !== undefined) updateData.tags = tags;

    const updatedTemplate = await Template.findOneAndUpdate(
      { _id: id, userId },
      { $set: updateData },
      { new: true }
    );
    
    return updatedTemplate;
  } catch (error) {
    console.error('Error updating email template:', error);
    throw new Error('Failed to update email template');
  }
}

export async function deleteEmailTemplate(id: string, userId: string) {
  try {
    await dbConnect();
    await Template.findOneAndDelete({ _id: id, userId });
    return true;
  } catch (error) {
    console.error('Error deleting email template:', error);
    throw new Error('Failed to delete email template');
  }
}

// Milestone queries - Using MongoDB
export async function saveMilestone(milestoneData: any) {
  try {
    console.log("Saving milestone with data:", milestoneData);
    await dbConnect();
    
    const milestone = await Milestone.create(milestoneData);
    console.log("Milestone saved successfully:", milestone._id);
    return milestone;
  } catch (error) {
    console.error("Error saving milestone:", error);
    throw error;
  }
}

export async function getMilestonesByUserId(userId: string) {
  try {
    await dbConnect();
    const milestones = await Milestone.find({ userId })
      .sort({ nextSendDate: 1 })
      .exec();
    
    console.log(`Retrieved ${milestones.length} milestones for user ${userId}`);
    return milestones;
  } catch (error) {
    console.error("Error getting milestones by user ID:", error);
    throw error;
  }
}

export async function getUpcomingMilestones(userId: string, days: number = 30) {
  try {
    await dbConnect();
    
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    const milestones = await Milestone.find({
      userId,
      isActive: true,
      nextSendDate: {
        $gte: new Date(),
        $lte: futureDate
      }
    })
      .sort({ nextSendDate: 1 })
      .exec();
    
    console.log(`Retrieved ${milestones.length} upcoming milestones for user ${userId} (next ${days} days)`);
    return milestones;
  } catch (error) {
    console.error("Error getting upcoming milestones:", error);
    throw error;
  }
}

export async function updateMilestoneLastSent(id: string) {
  try {
    await dbConnect();
    
    const milestone = await Milestone.findByIdAndUpdate(
      id,
      { 
        $set: { 
          lastSent: new Date()
        }
      },
      { new: true }
    );
    
    console.log(`Updated milestone ${id} last sent date`);
    return milestone;
  } catch (error) {
    console.error("Error updating milestone last sent:", error);
    throw error;
  }
}

export async function getMilestoneById(id: string) {
  try {
    await dbConnect();
    const milestone = await Milestone.findById(id);
    return milestone;
  } catch (error) {
    console.error("Error getting milestone by ID:", error);
    throw error;
  }
}

export async function updateMilestone(id: string, updateData: any) {
  try {
    await dbConnect();
    const milestone = await Milestone.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    return milestone;
  } catch (error) {
    console.error("Error updating milestone:", error);
    throw error;
  }
}

export async function deleteMilestone(id: string) {
  try {
    await dbConnect();
    const milestone = await Milestone.findByIdAndDelete(id);
    return milestone;
  } catch (error) {
    console.error("Error deleting milestone:", error);
    throw error;
  }
}

export async function getMilestonesByClientId(clientId: string) {
  try {
    await dbConnect();
    const milestones = await Milestone.find({ clientId })
      .sort({ nextSendDate: 1 })
      .exec();
    return milestones;
  } catch (error) {
    console.error("Error getting milestones by client ID:", error);
    throw error;
  }
}

// Email History queries
export async function saveEmailHistory(emailData: any) {
  try {
    await dbConnect();
    const email = await Email.create(emailData);
    return email;
  } catch (error) {
    console.error("Error saving email history:", error);
    throw error;
  }
}

// Listing queries
export async function saveListing(listingData: any) {
  try {
    console.log("Saving listing with data:", listingData);
    await dbConnect();
    
    const listing = await Listing.create(listingData);
    console.log("Listing saved successfully:", listing._id);
    return listing;
  } catch (error) {
    console.error("Error saving listing:", error);
    throw error;
  }
}

export async function getListingsByUserId(userId: string) {
  try {
    await dbConnect();
    const listings = await Listing.find({ userId })
      .sort({ createdAt: -1 })
      .exec();
    return listings;
  } catch (error) {
    console.error("Error getting listings by user ID:", error);
    throw error;
  }
}

export async function getListingById(id: string) {
  try {
    await dbConnect();
    const listing = await Listing.findById(id);
    return listing;
  } catch (error) {
    console.error("Error getting listing by ID:", error);
    throw error;
  }
}

export async function getListingByMlsId(mlsId: string) {
  try {
    await dbConnect();
    const listing = await Listing.findOne({ mlsId });
    return listing;
  } catch (error) {
    console.error("Error getting listing by MLS ID:", error);
    throw error;
  }
}

// Property Match queries
export async function savePropertyMatch(matchData: any) {
  try {
    await dbConnect();
    const match = await PropertyMatch.create(matchData);
    return match;
  } catch (error) {
    console.error("Error saving property match:", error);
    throw error;
  }
}

export async function getPropertyMatchesByClientId(clientId: string) {
  try {
    await dbConnect();
    const matches = await PropertyMatch.find({
      clientId,
      isActive: true
    })
      .sort({ matchScore: -1 })
      .exec();
    return matches;
  } catch (error) {
    console.error("Error getting property matches by client ID:", error);
    throw error;
  }
}

export async function getPropertyMatchesByUserId(userId: string, filters?: any) {
  try {
    await dbConnect();
    
    const query: any = { userId };
    if (filters?.clientId) query.clientId = filters.clientId;
    if (filters?.isActive !== undefined) query.isActive = filters.isActive;
    
    const matches = await PropertyMatch.find(query)
      .sort({ matchScore: -1 })
      .exec();
    return matches;
  } catch (error) {
    console.error("Error getting property matches by user ID:", error);
    throw error;
  }
}

export async function getPropertyMatchById(id: string) {
  try {
    await dbConnect();
    const match = await PropertyMatch.findById(id);
    return match;
  } catch (error) {
    console.error("Error getting property match by ID:", error);
    throw error;
  }
}

export async function updatePropertyMatch(id: string, updateData: any) {
  try {
    await dbConnect();
    const match = await PropertyMatch.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    return match;
  } catch (error) {
    console.error("Error updating property match:", error);
    throw error;
  }
}

export async function deletePropertyMatch(id: string) {
  try {
    await dbConnect();
    const match = await PropertyMatch.findByIdAndDelete(id);
    return match;
  } catch (error) {
    console.error("Error deleting property match:", error);
    throw error;
  }
}

