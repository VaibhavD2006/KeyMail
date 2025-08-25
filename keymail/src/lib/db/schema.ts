import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  uuid,
  pgEnum,
  boolean,
  json,
  integer,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

// Enums
export const templateStatusEnum = pgEnum("template_status", ["active", "inactive", "draft"]);
export const clientStatusEnum = pgEnum("client_status", ["active", "inactive", "prospect", "closed"]);
export const relationshipLevelEnum = pgEnum("relationship_level", ["vip", "regular", "prospect", "cold"]);
export const milestoneTypeEnum = pgEnum("milestone_type", ["home_anniversary", "birthday", "personal_event", "closing"]);
export const showingStatusEnum = pgEnum("showing_status", ["scheduled", "completed", "cancelled", "no_show"]);
export const propertyTypeEnum = pgEnum("property_type", ["single_family", "condo", "townhouse", "multi_family", "land"]);

// Users table (existing)
export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Emails table (needed by features and queries)
export const emails = pgTable("emails", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  clientId: text("client_id").references(() => clients.id),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  status: text("status").default("draft"),
  isFavorite: boolean("is_favorite").default(false),
  scheduledDate: timestamp("scheduled_date"),
  sentDate: timestamp("sent_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Clients table (enhanced for real estate)
export const clients = pgTable("clients", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  notes: text("notes"),
  relationshipLevel: relationshipLevelEnum("relationship_level").default("prospect"),
  status: clientStatusEnum("status").default("active"),
  tags: text("tags").array(),
  
  // Real estate specific fields
  closingDate: timestamp("closing_date"), // When they bought their home
  birthday: timestamp("birthday"),
  spouseBirthday: timestamp("spouse_birthday"),
  childrenBirthdays: timestamp("children_birthdays").array(),
  
  // Property preferences
  priceRangeMin: integer("price_range_min"),
  priceRangeMax: integer("price_range_max"),
  preferredNeighborhoods: text("preferred_neighborhoods").array(),
  preferredPropertyTypes: propertyTypeEnum("preferred_property_types").array(),
  minBedrooms: integer("min_bedrooms"),
  maxBedrooms: integer("max_bedrooms"),
  minBathrooms: integer("min_bathrooms"),
  maxBathrooms: integer("max_bathrooms"),
  mustHaves: text("must_haves").array(),
  dealBreakers: text("deal_breakers").array(),
  urgency: text("urgency").default("low"), // low, medium, high
  
  // Milestone preferences
  milestonePreferences: json("milestone_preferences").$type<{
    homeAnniversary: boolean;
    birthday: boolean;
    personalEvents: boolean;
    closing: boolean;
  }>(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Email templates table (existing)
export const emailTemplates = pgTable("email_templates", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  occasion: text("occasion"),
  subject: text("subject").notNull(),
  generatedContent: text("generated_content").notNull(),
  editedContent: text("edited_content"),
  status: templateStatusEnum("status").default("active"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// New: Milestones table
export const milestones = pgTable("milestones", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  clientId: text("client_id").references(() => clients.id, { onDelete: "cascade" }),
  type: milestoneTypeEnum("type").notNull(),
  title: text("title").notNull(),
  date: timestamp("date").notNull(),
  message: text("message"),
  lastSent: timestamp("last_sent"),
  nextSendDate: timestamp("next_send_date").notNull(),
  isActive: boolean("is_active").default(true),
  emailTemplateId: text("email_template_id").references(() => emailTemplates.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// New: MLS Listings table
export const listings = pgTable("listings", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  mlsId: text("mls_id").unique(),
  address: text("address").notNull(),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  price: integer("price"),
  description: text("description"),
  photos: text("photos").array(),
  features: text("features").array(),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  squareFeet: integer("square_feet"),
  lotSize: integer("lot_size"),
  propertyType: propertyTypeEnum("property_type"),
  neighborhood: text("neighborhood"),
  status: text("status").default("active"), // active, sold, pending, withdrawn
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// New: Showings table
export const showings = pgTable("showings", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  clientId: text("client_id").references(() => clients.id, { onDelete: "cascade" }),
  listingId: text("listing_id").references(() => listings.id, { onDelete: "cascade" }),
  scheduledAt: timestamp("scheduled_at").notNull(),
  completedAt: timestamp("completed_at"),
  agentNotes: text("agent_notes"),
  status: showingStatusEnum("status").default("scheduled"),
  followUpSent: boolean("follow_up_sent").default(false),
  followUpSentAt: timestamp("follow_up_sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// New: Showing Feedback table
export const showingFeedback = pgTable("showing_feedback", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  showingId: text("showing_id").references(() => showings.id, { onDelete: "cascade" }),
  clientId: text("client_id").references(() => clients.id, { onDelete: "cascade" }),
  rating: integer("rating"), // 1-5 stars
  liked: boolean("liked"),
  comments: text("comments"),
  followUpNeeded: boolean("follow_up_needed").default(false),
  nextAction: text("next_action"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Enhanced: Email History table
export const emailHistory = pgTable("email_history", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  clientId: text("client_id").references(() => clients.id, { onDelete: "cascade" }),
  templateId: text("template_id").references(() => emailTemplates.id),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  sentAt: timestamp("sent_at").defaultNow(),
  status: text("status").default("sent"), // sent, delivered, opened, clicked, bounced
  openRate: boolean("open_rate").default(false),
  clickRate: boolean("click_rate").default(false),
  emailProviderId: text("email_provider_id"), // SendGrid/Mailgun message ID
  metadata: json("metadata").$type<{
    milestoneType?: string;
    listingId?: string;
    showingId?: string;
    tone?: string;
    customMessage?: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// New: MLS API Cache table
export const mlsCache = pgTable("mls_cache", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  mlsId: text("mls_id").unique().notNull(),
  data: json("data").notNull(), // Cached MLS data
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// New: Property Matches table
export const propertyMatches = pgTable("property_matches", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  clientId: text("client_id").references(() => clients.id, { onDelete: "cascade" }),
  listingId: text("listing_id").references(() => listings.id, { onDelete: "cascade" }),
  matchScore: integer("match_score").notNull(), // 0-100
  reasons: text("reasons").array(), // Why this property matches
  sentEmailId: text("sent_email_id").references(() => emailHistory.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Export all tables
export const tables = {
  users,
  clients,
  emails,
  emailTemplates,
  milestones,
  listings,
  showings,
  showingFeedback,
  emailHistory,
  mlsCache,
  propertyMatches,
};

// Define relations
export const userRelations = relations(users, ({ many }) => ({
  clients: many(clients),
  emails: many(emails),
  emailTemplates: many(emailTemplates),
}));

export const clientRelations = relations(clients, ({ one, many }) => ({
  user: one(users, {
    fields: [clients.userId],
    references: [users.id],
  }),
  emails: many(emails),
}));

export const emailRelations = relations(emails, ({ one }) => ({
  user: one(users, {
    fields: [emails.userId],
    references: [users.id],
  }),
  client: one(clients, {
    fields: [emails.clientId],
    references: [clients.id],
  }),
}));

export const emailTemplateRelations = relations(emailTemplates, ({ one }) => ({
  user: one(users, {
    fields: [emailTemplates.userId],
    references: [users.id],
  }),
})); 