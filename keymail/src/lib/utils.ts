import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  if (!date) return ""; // Handle null or undefined
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }
  
  const now = new Date();
  const diff = now.getTime() - dateObj.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: now.getFullYear() !== dateObj.getFullYear() ? "numeric" : undefined,
    }).format(dateObj);
  }

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }

  return "Just now";
}

export function formatDateTime(date: Date | string): string {
  if (!date) return ""; // Handle null or undefined
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }
  
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(dateObj);
}

export function timeAgo(date: Date | string): string {
  if (!date) return ""; // Handle null or undefined
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }
  
  const now = new Date();
  const seconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  let interval = seconds / 31536000; // seconds in a year
  
  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  
  interval = seconds / 2592000; // seconds in a month
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  
  interval = seconds / 86400; // seconds in a day
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  
  interval = seconds / 3600; // seconds in an hour
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  
  interval = seconds / 60; // seconds in a minute
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  
  return Math.floor(seconds) + " seconds ago";
}

export function truncate(str: string, length: number): string {
  if (!str) return ""; // Handle null or undefined
  
  if (str.length <= length) {
    return str;
  }
  return str.slice(0, length) + "...";
}

// Client storage utility functions
export const clientStorage = {
  // Save clients to localStorage
  saveClients: (clients: any[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('keymail_mock_clients', JSON.stringify(clients));
        return true;
      } catch (err) {
        console.error('Error saving clients to localStorage:', err);
        return false;
      }
    }
    return false;
  },

  // Load clients from localStorage
  loadClients: () => {
    if (typeof window !== 'undefined') {
      try {
        const savedClients = localStorage.getItem('keymail_mock_clients');
        if (savedClients) {
          return JSON.parse(savedClients);
        }
      } catch (err) {
        console.error('Error loading clients from localStorage:', err);
      }
    }
    return null;
  },

  // Add a single client to localStorage
  addClient: (client: any) => {
    if (typeof window !== 'undefined') {
      try {
        const savedClients = localStorage.getItem('keymail_mock_clients');
        const clients = savedClients ? JSON.parse(savedClients) : [];
        clients.unshift(client);
        localStorage.setItem('keymail_mock_clients', JSON.stringify(clients));
        return true;
      } catch (err) {
        console.error('Error adding client to localStorage:', err);
        return false;
      }
    }
    return false;
  },

  // Remove a client from localStorage
  removeClient: (clientId: string) => {
    if (typeof window !== 'undefined') {
      try {
        const savedClients = localStorage.getItem('keymail_mock_clients');
        if (savedClients) {
          const clients = JSON.parse(savedClients);
          const filteredClients = clients.filter((c: any) => c.id !== clientId);
          localStorage.setItem('keymail_mock_clients', JSON.stringify(filteredClients));
          return true;
        }
      } catch (err) {
        console.error('Error removing client from localStorage:', err);
      }
    }
    return false;
  }
};

// Client storage utility for email templates
export const templateStorage = {
  // Key for storing email templates in localStorage
  storageKey: "keymail_templates",
  
  // Get all templates from localStorage - combined from all storage locations
  getTemplates: () => {
    if (typeof window === "undefined") return [];
    
    try {
      let allTemplates = [];
      
      // Try the main storage key first
      const keymailTemplatesJson = localStorage.getItem(templateStorage.storageKey);
      if (keymailTemplatesJson) {
        try {
          const parsed = JSON.parse(keymailTemplatesJson);
          if (Array.isArray(parsed)) {
            allTemplates = [...parsed];
            console.log(`Loaded ${parsed.length} templates from ${templateStorage.storageKey}`);
          }
        } catch (parseError) {
          console.error(`Error parsing templates from ${templateStorage.storageKey}:`, parseError);
        }
      }
      
      // Then try the emailTemplates key
      const emailTemplatesJson = localStorage.getItem("emailTemplates");
      if (emailTemplatesJson) {
        try {
          const parsed = JSON.parse(emailTemplatesJson);
          if (Array.isArray(parsed)) {
            // Add only templates that don't already exist in the main storage
            const existingIds = new Set(allTemplates.map(t => t.id));
            const uniqueTemplates = parsed.filter(t => !existingIds.has(t.id));
            
            if (uniqueTemplates.length > 0) {
              allTemplates = [...allTemplates, ...uniqueTemplates];
              console.log(`Added ${uniqueTemplates.length} unique templates from emailTemplates`);
              
              // Sync to main storage for future use
              localStorage.setItem(templateStorage.storageKey, JSON.stringify(allTemplates));
            }
          }
        } catch (parseError) {
          console.error("Error parsing templates from emailTemplates:", parseError);
        }
      }
      
      return allTemplates;
    } catch (error) {
      console.error("Error getting templates from localStorage:", error);
      return [];
    }
  },
  
  // Add or update a template in localStorage
  addTemplate: (template) => {
    if (typeof window === "undefined" || !template) return null;
    
    try {
      // Ensure the template has an ID
      if (!template.id) {
        template.id = `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      }
      
      const templates = templateStorage.getTemplates();
      
      // Find if template with same ID already exists
      const existingIndex = templates.findIndex(t => t.id === template.id);
      
      if (existingIndex >= 0) {
        // Update existing template
        templates[existingIndex] = {
          ...templates[existingIndex],
          ...template,
          updatedAt: new Date().toISOString()
        };
        console.log(`Updated template in localStorage with ID: ${template.id}`);
      } else {
        // Add new template
        templates.push({
          ...template,
          createdAt: template.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        console.log(`Added new template to localStorage with ID: ${template.id}`);
      }
      
      // Save to both storage locations for maximum compatibility
      localStorage.setItem(templateStorage.storageKey, JSON.stringify(templates));
      localStorage.setItem("emailTemplates", JSON.stringify(templates));
      
      return template;
    } catch (error) {
      console.error("Error adding template to localStorage:", error);
      return null;
    }
  },
  
  // Get a specific template by ID
  getTemplate: (id) => {
    if (typeof window === "undefined" || !id) return null;
    
    try {
      const templates = templateStorage.getTemplates();
      return templates.find(template => template.id === id) || null;
    } catch (error) {
      console.error("Error getting template from localStorage:", error);
      return null;
    }
  },
  
  // Remove a template by ID
  removeTemplate: (id) => {
    if (typeof window === "undefined" || !id) return false;
    
    try {
      // First, check in the main storage key
      const templates = templateStorage.getTemplates();
      const filteredTemplates = templates.filter(template => template.id !== id);
      
      let removed = templates.length !== filteredTemplates.length;
      
      // Save changes to both storage locations
      if (removed) {
        localStorage.setItem(templateStorage.storageKey, JSON.stringify(filteredTemplates));
        localStorage.setItem("emailTemplates", JSON.stringify(filteredTemplates));
        console.log(`Removed template with ID ${id} from localStorage`);
      } else {
        console.warn(`Template with ID ${id} not found in localStorage`);
      }
      
      return removed;
    } catch (error) {
      console.error("Error removing template from localStorage:", error);
      return false;
    }
  },
  
  // Clear all templates
  clearTemplates: () => {
    if (typeof window === "undefined") return false;
    
    try {
      localStorage.removeItem(templateStorage.storageKey);
      localStorage.removeItem("emailTemplates");
      console.log("Cleared all templates from localStorage");
      return true;
    } catch (error) {
      console.error("Error clearing templates from localStorage:", error);
      return false;
    }
  }
};
