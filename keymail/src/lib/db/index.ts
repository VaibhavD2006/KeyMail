import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import { env } from "@/lib/env";

// Note: PostgreSQL is disabled - using MongoDB instead
// If you want to re-enable PostgreSQL, uncomment the code below

// Use environment variable or fallback for development
const connectionString = env.DATABASE_URL || "postgres://postgres:password@localhost:5432/keymail";

console.log(`⚠️  PostgreSQL disabled - using MongoDB instead`);

// Declare variables outside the try-catch
let client;
let db;
let connectionError = null;
let usingLocalStorageFallback = false;

const createMockClient = () => {
  console.warn("Creating mock database client - operations will use localStorage fallback");
  
  // This mock client will use localStorage through our API layer
  usingLocalStorageFallback = true;
  
  return {
    async query() { 
      console.log("Mock database client used - returning empty result");
      return []; 
    },
    async unsafe() {
      return [{ test: 1 }]; // Pretend to be healthy for basic checks
    },
    async end() { return; },
    // Add a method to check if this is a mock client
    isMockClient: true
  } as any;
};

try {
  // PostgreSQL is disabled - using MongoDB
  console.log("📦 Using MongoDB for database operations");
  
  // Create a mock client for compatibility (DO NOT initialize Drizzle)
  client = createMockClient();
  db = null as any; // No Drizzle initialization when using MongoDB
  connectionError = new Error("PostgreSQL disabled - using MongoDB");
  
  /* Uncomment to re-enable PostgreSQL:
  // Set PostgreSQL client with more resilient settings
  client = postgres(connectionString, {
    max: 5, // Reduced connections
    idle_timeout: 20, 
    connect_timeout: 10, // Faster timeout
    max_lifetime: 60 * 60,
    application_name: "keymail",
    connect_retry: 0, // Don't retry - fail fast and use fallback
  });
  
  console.log("PostgreSQL client initialized");
  
  // Initialize drizzle
  db = drizzle(client, { schema });
  
  console.log("Drizzle ORM initialized with schema");
  
  // Test connection immediately
  testConnection().catch(error => {
    console.error("Initial connection test failed:", error);
    connectionError = error;
    
    // If initial test fails, create a mock client with localStorage fallback
    client = createMockClient();
    db = drizzle(client, { schema });
    
    console.log("⚠️ PostgreSQL connection failed - using localStorage fallback");
  });
  */
} catch (error) {
  connectionError = error;
  console.error("Failed to initialize database connection:", error);
  
  // Create a mock client with localStorage fallback (DO NOT initialize Drizzle)
  client = createMockClient();
  db = null as any; // No Drizzle initialization when using MongoDB
  console.error("CRITICAL: Database connection unavailable. Using MongoDB instead.");
}

/**
 * Test the database connection
 */
async function testConnection() {
  try {
    const result = await client.unsafe("SELECT 1 as test");
    if (result && result[0]?.test === 1) {
      console.log("Database connection test successful");
      connectionError = null;
      return true;
    } else {
      console.warn("Database connection test returned unexpected result:", result);
      return false;
    }
  } catch (error) {
    console.error("Database connection test failed:", error);
    connectionError = error;
    return false;
  }
}

/**
 * Check the health of the database connection
 * @returns Object with healthy status and error message if applicable
 */
export async function checkDatabaseHealth() {
  // If we're using localStorage fallback
  if (usingLocalStorageFallback) {
    return {
      healthy: false,
      usingFallback: true,
      fallbackType: "localStorage",
      error: "Using localStorage fallback due to database connection failure"
    };
  }
  
  // If we already know the connection is bad, don't even try
  if (connectionError || client?.isMockClient) {
    return { 
      healthy: false, 
      error: connectionError ? `Connection error: ${connectionError.code || connectionError}` : "Using mock database client"
    };
  }
  
  try {
    const startTime = Date.now();
    const result = await client.unsafe("SELECT 1 as test");
    const responseTime = Date.now() - startTime;
    
    if (result && result[0]?.test === 1) {
      return { 
        healthy: true, 
        responseTime 
      };
    } else {
      return { 
        healthy: false, 
        error: `Unexpected result: ${JSON.stringify(result)}` 
      };
    }
  } catch (error) {
    connectionError = error;
    return { 
      healthy: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Try to reconnect to the database if the connection was lost
 */
export async function attemptReconnect() {
  // If we're using localStorage fallback, no need to reconnect
  if (usingLocalStorageFallback) return false;
  
  if (!connectionError) return true; // No need to reconnect
  
  try {
    console.log("Attempting to reconnect to database...");
    
    // Close existing client if it exists and isn't a mock
    if (client && !client.isMockClient) {
      try {
        await client.end();
        console.log("Closed existing database connection");
      } catch (endError) {
        console.warn("Error closing existing connection:", endError);
      }
    }
    
    // Create a new connection
    client = postgres(connectionString, {
      max: 1,
      idle_timeout: 10,
      connect_timeout: 5,
      application_name: "keymail-reconnect",
    });
    
    // Test it
    const result = await client.unsafe("SELECT 1 as test");
    if (result && result[0]?.test === 1) {
      console.log("Database reconnection successful!");
      connectionError = null;
      db = drizzle(client, { schema });
      return true;
    }
    return false;
  } catch (error) {
    console.error("Database reconnection failed:", error);
    // Update the connection error
    connectionError = error;
    
    // Make sure we're using a mock client
    if (!client?.isMockClient) {
      client = createMockClient();
      db = drizzle(client, { schema });
    }
    return false;
  }
}

export { db };
export const isDatabaseAvailable = () => !connectionError && !client?.isMockClient;
export const isUsingLocalStorageFallback = () => usingLocalStorageFallback;

// Utility to convert snake_case to camelCase
export function snakeToCamel<T>(obj: Record<string, any>): T {
  const result: Record<string, any> = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = obj[key];
    }
  }
  
  return result as T;
} 