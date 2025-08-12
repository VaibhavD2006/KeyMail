// User types
export interface User {
  id: string;
  email: string;
  name: string;
  companyName?: string;
  plan: "free" | "premium" | "enterprise";
  createdAt: Date;
  settings: UserSettings;
  emailIntegration?: EmailIntegration;
}

export interface UserSettings {
  timezone: string;
  emailSignature?: string;
  defaultEmailTemplate?: string;
}

export interface EmailIntegration {
  provider: "gmail" | "outlook" | "mailchimp";
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

// Client types
export interface Client {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  birthday?: Date;
  closingAnniversary?: Date;
  yearsKnown?: number;
  relationshipLevel?: "new" | "established" | "close";
  tags?: string[];
  customFields?: Record<string, any>;
  preferences?: ClientPreferences;
  lastContactDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientPreferences {
  communicationFrequency?: "weekly" | "monthly" | "quarterly";
  preferredContactMethod?: "email" | "phone" | "text";
}

// Email types
export interface Email {
  id: string;
  userId: string;
  clientId: string;
  occasion: string;
  subject: string;
  generatedContent: string;
  editedContent?: string;
  status: "draft" | "pending" | "approved" | "sent" | "failed";
  scheduledDate?: Date;
  sentDate?: Date;
  metadata: EmailMetadata;
  analytics?: EmailAnalytics;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailMetadata {
  templateId?: string;
  aiParameters?: {
    tone?: string;
    style?: string;
    length?: string;
  };
}

export interface EmailAnalytics {
  opened?: boolean;
  openedAt?: Date;
  clicked?: boolean;
  clickedAt?: Date;
}

// Template types
export interface Template {
  id: string;
  userId: string;
  name: string;
  category: string;
  content: string;
  variables: string[];
  isDefault: boolean;
  metadata: TemplateMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateMetadata {
  tone?: string;
  occasion?: string;
  suggestedUse?: string;
}

// Analytics types
export interface Analytics {
  id: string;
  userId: string;
  period: "daily" | "weekly" | "monthly";
  date: Date;
  metrics: {
    emailsSent: number;
    emailsOpened: number;
    clickThroughRate: number;
    clientEngagement: number;
  };
  createdAt: Date;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Pagination types
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Form types
export interface ClientFormData {
  name: string;
  email: string;
  phone?: string;
  birthday?: string;
  closingAnniversary?: string;
  yearsKnown?: number;
  relationshipLevel?: "new" | "established" | "close";
  tags?: string[];
  customFields?: Record<string, any>;
  preferences?: {
    communicationFrequency?: "weekly" | "monthly" | "quarterly";
    preferredContactMethod?: "email" | "phone" | "text";
  };
}

export interface EmailFormData {
  clientId: string;
  occasion: string;
  subject: string;
  content: string;
  scheduledDate?: string;
  templateId?: string;
  aiParameters?: {
    tone?: string;
    style?: string;
    length?: string;
  };
}

export interface TemplateFormData {
  name: string;
  category: string;
  content: string;
  variables: string[];
  isDefault: boolean;
  metadata: {
    tone?: string;
    occasion?: string;
    suggestedUse?: string;
  };
}

export type RelationshipLevel =
  | "cold_lead"
  | "warm_lead"
  | "prospect"
  | "current_client"
  | "past_client"
  | "advocate";

export type ClientStatus = "active" | "inactive" | "pending" | "archived";

export type EmailStatus = "draft" | "scheduled" | "sent" | "archived";

export type Client = {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
  relationshipLevel?: RelationshipLevel;
  status: ClientStatus;
  birthdate?: Date;
  anniversaryDate?: Date;
  closingDate?: Date;
  preferredContactMethod?: string;
  communicationFrequency?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type ClientFormData = {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
  relationshipLevel?: RelationshipLevel;
  status: ClientStatus;
  birthdate?: Date | string;
  anniversaryDate?: Date | string;
  closingDate?: Date | string;
  preferredContactMethod?: string;
  communicationFrequency?: string;
  tags: string[];
};

export type Email = {
  id: string;
  userId: string;
  clientId: string;
  subject: string;
  content: string;
  status: EmailStatus;
  scheduledDate?: Date;
  sentDate?: Date;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  client?: Client;
};

export type EmailFormData = {
  clientId: string;
  subject: string;
  content: string;
  status: EmailStatus;
  scheduledDate?: Date | string;
  isFavorite?: boolean;
}; 