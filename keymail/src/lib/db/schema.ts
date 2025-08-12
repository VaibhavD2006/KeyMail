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

// Enum for client relationship level
export const relationshipLevelEnum = pgEnum("relationship_level", [
  "cold_lead",
  "warm_lead",
  "prospect",
  "current_client",
  "past_client",
  "advocate",
]);

// Enum for client status
export const clientStatusEnum = pgEnum("client_status", [
  "active",
  "inactive",
  "pending",
  "archived",
]);

// Enum for email status
export const emailStatusEnum = pgEnum("email_status", [
  "draft",
  "scheduled",
  "sent",
  "archived",
]);

// Template status enum
export const templateStatusEnum = pgEnum("template_status", [
  "draft",
  "active",
  "archived",
]);

// Users table
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Accounts table (for OAuth)
export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Clients table
export const clients = pgTable("clients", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  address: text("address"),
  notes: text("notes"),
  relationshipLevel: relationshipLevelEnum("relationship_level"),
  status: clientStatusEnum("status").default("active"),
  birthdate: timestamp("birthdate"),
  anniversaryDate: timestamp("anniversary_date"),
  closingDate: timestamp("closing_date"),
  preferredContactMethod: text("preferred_contact_method"),
  communicationFrequency: text("communication_frequency"),
  tags: json("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Emails table
export const emails = pgTable("emails", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  status: emailStatusEnum("status").default("draft"),
  scheduledDate: timestamp("scheduled_date"),
  sentDate: timestamp("sent_date"),
  isFavorite: boolean("is_favorite").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Email Templates table
export const emailTemplates = pgTable("email_templates", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  occasion: text("occasion").notNull().default("check_in"),
  subject: text("subject").notNull(),
  generatedContent: text("generated_content").notNull(),
  editedContent: text("edited_content"),
  status: templateStatusEnum("status").default("active").notNull(),
  tags: json("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Define relations
export const userRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
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