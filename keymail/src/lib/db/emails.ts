import { and, desc, eq, ilike, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { emails, clients } from "@/lib/db/schema";
import { Email, EmailFormData } from "@/types";

// Get emails for a user with pagination, filtering, and sorting
export async function getEmails(userId: string, options?: {
  page?: number;
  limit?: number;
  clientId?: string;
  status?: string | string[];
  search?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  includeClient?: boolean;
}) {
  const {
    page = 1,
    limit = 10,
    clientId,
    status,
    search,
    sortBy = "createdAt",
    sortDirection = "desc",
    includeClient = false,
  } = options || {};

  const offset = (page - 1) * limit;
  
  // Build where conditions
  let whereConditions = [eq(emails.userId, userId)];
  
  if (clientId) {
    whereConditions.push(eq(emails.clientId, clientId));
  }
  
  if (status) {
    if (Array.isArray(status)) {
      whereConditions.push(inArray(emails.status, status));
    } else {
      whereConditions.push(eq(emails.status, status));
    }
  }
  
  if (search) {
    whereConditions.push(
      sql`(${emails.subject} ILIKE ${`%${search}%`} OR ${emails.content} ILIKE ${`%${search}%`})`
    );
  }

  // Build query
  let query = db
    .select()
    .from(emails)
    .where(and(...whereConditions))
    .limit(limit)
    .offset(offset);

  // Add client join if requested
  if (includeClient) {
    query = db
      .select({
        email: emails,
        client: clients,
      })
      .from(emails)
      .leftJoin(clients, eq(emails.clientId, clients.id))
      .where(and(...whereConditions))
      .limit(limit)
      .offset(offset);
  }

  // Add sorting
  if (sortBy === "createdAt") {
    query = sortDirection === "asc" 
      ? query.orderBy(emails.createdAt)
      : query.orderBy(desc(emails.createdAt));
  } else if (sortBy === "updatedAt") {
    query = sortDirection === "asc"
      ? query.orderBy(emails.updatedAt)
      : query.orderBy(desc(emails.updatedAt));
  } else if (sortBy === "scheduledDate") {
    query = sortDirection === "asc"
      ? query.orderBy(emails.scheduledDate)
      : query.orderBy(desc(emails.scheduledDate));
  }

  // Execute query
  const results = await query;

  // Count total emails matching criteria (without pagination)
  const countQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(emails)
    .where(and(...whereConditions));
  
  const [{ count }] = await countQuery;

  // Format results
  let formattedResults;
  if (includeClient) {
    formattedResults = results.map((item) => {
      const { email, client } = item as unknown as { email: any, client: any };
      return {
        ...email,
        client,
      };
    });
  } else {
    formattedResults = results;
  }

  return {
    data: formattedResults as Email[],
    pagination: {
      page,
      limit,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
    },
  };
}

// Get a single email by ID
export async function getEmailById(id: string, userId: string, includeClient: boolean = false) {
  if (includeClient) {
    const result = await db
      .select({
        email: emails,
        client: clients,
      })
      .from(emails)
      .leftJoin(clients, eq(emails.clientId, clients.id))
      .where(and(eq(emails.id, id), eq(emails.userId, userId)))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const { email, client } = result[0] as unknown as { email: any, client: any };
    return { ...email, client } as Email;
  } else {
    const result = await db
      .select()
      .from(emails)
      .where(and(eq(emails.id, id), eq(emails.userId, userId)))
      .limit(1);

    return result.length > 0 ? result[0] as Email : null;
  }
}

// Create a new email
export async function createEmail(data: EmailFormData, userId: string) {
  const result = await db.insert(emails).values({
    ...data,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning();

  return result[0] as Email;
}

// Update an existing email
export async function updateEmail(id: string, data: Partial<EmailFormData>, userId: string) {
  const result = await db
    .update(emails)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(emails.id, id), eq(emails.userId, userId)))
    .returning();

  return result.length > 0 ? result[0] as Email : null;
}

// Delete an email
export async function deleteEmail(id: string, userId: string) {
  const result = await db
    .delete(emails)
    .where(and(eq(emails.id, id), eq(emails.userId, userId)))
    .returning();

  return result.length > 0 ? result[0] as Email : null;
}

// Mark email as sent
export async function markEmailAsSent(id: string, userId: string) {
  const result = await db
    .update(emails)
    .set({
      status: "sent",
      sentDate: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(emails.id, id), eq(emails.userId, userId)))
    .returning();

  return result.length > 0 ? result[0] as Email : null;
}

// Toggle email favorite status
export async function toggleEmailFavorite(id: string, userId: string) {
  // First get the current favorite status
  const email = await getEmailById(id, userId);
  if (!email) return null;

  // Toggle it
  const result = await db
    .update(emails)
    .set({
      isFavorite: !email.isFavorite,
      updatedAt: new Date(),
    })
    .where(and(eq(emails.id, id), eq(emails.userId, userId)))
    .returning();

  return result.length > 0 ? result[0] as Email : null;
} 