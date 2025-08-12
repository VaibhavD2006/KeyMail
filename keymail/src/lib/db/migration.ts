import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env";
import * as schema from "./schema";
import { setupDatabase } from "./setup";

// For development with missing environment variables
const databaseUrl = env.DATABASE_URL || "postgres://postgres:password@localhost:5432/keymail";

/**
 * Run this script to create or update the database schema
 * 
 * Example:
 * node -r ts-node/register ./src/lib/db/migration.ts
 */
async function runMigration() {
  console.log("Starting database migration...");
  console.log("Using database URL:", databaseUrl.replace(/:.+@/, ":****@"));

  let migrationClient = null;
  
  try {
    // Create a new postgres client for migration
    migrationClient = postgres(databaseUrl, { 
      max: 1,
      idle_timeout: 10,
      connect_timeout: 30,
      max_lifetime: 60,
    });
    
    // Test connection
    try {
      const result = await migrationClient.unsafe("SELECT 1 as test");
      if (result && result[0]?.test === 1) {
        console.log("Migration client connection test successful");
      } else {
        console.warn("Migration client connection test returned unexpected result:", result);
      }
    } catch (connError) {
      console.error("Migration client connection test failed:", connError);
      throw connError;
    }
    
    // Create a new drizzle instance
    const db = drizzle(migrationClient, { schema });
    
    // Ensure the email_templates table exists
    console.log("Creating/updating tables...");

    // First, check if we have a drizzle directory
    const fs = require('fs');
    const path = require('path');
    const drizzleDir = path.join(process.cwd(), 'drizzle');
    
    if (fs.existsSync(drizzleDir)) {
      // If we have migration files, use them
      const { migrate } = require('drizzle-orm/postgres-js/migrator');
      await migrate(db, { migrationsFolder: './drizzle' });
      console.log("Migration completed using drizzle migration files");
    } else {
      // Otherwise, use our custom setup function
      console.log("No drizzle migration files found, using custom setup function");
      const result = await setupDatabase();
      console.log("Database setup completed with result:", result);
    }
    
    console.log("Migration completed successfully!");
    return true;
  } catch (error) {
    console.error("Migration failed:", error);
    return false;
  } finally {
    // Close the client connection
    if (migrationClient) {
      await migrationClient.end();
      console.log("Migration client connection closed");
    }
    
    // Only exit if this script is called directly
    if (require.main === module) {
      process.exit(0);
    }
  }
}

/**
 * Function to check if a database exists
 * @param url Database connection URL
 */
export async function checkDatabaseExists(url = databaseUrl) {
  let client = null;
  try {
    // Extract database name from URL
    const dbName = new URL(url.replace('postgres://', 'http://')).pathname.slice(1);
    
    // Connect to postgres database to check if our database exists
    const postgresUrl = url.replace(dbName, 'postgres');
    client = postgres(postgresUrl, { max: 1, connect_timeout: 10 });
    
    const result = await client.unsafe(`
      SELECT 1 FROM pg_database WHERE datname='${dbName}'
    `);
    
    return result.length > 0;
  } catch (error) {
    console.error("Error checking if database exists:", error);
    return false;
  } finally {
    if (client) await client.end();
  }
}

/**
 * Function to create database if it doesn't exist
 * @param url Database connection URL
 */
export async function createDatabaseIfNotExists(url = databaseUrl) {
  let client = null;
  try {
    // Extract database name from URL
    const dbName = new URL(url.replace('postgres://', 'http://')).pathname.slice(1);
    
    // Check if database exists
    const exists = await checkDatabaseExists(url);
    if (exists) {
      console.log(`Database '${dbName}' already exists`);
      return true;
    }
    
    // Connect to postgres database to create our database
    const postgresUrl = url.replace(dbName, 'postgres');
    client = postgres(postgresUrl, { max: 1 });
    
    console.log(`Creating database '${dbName}'...`);
    await client.unsafe(`CREATE DATABASE ${dbName}`);
    console.log(`Database '${dbName}' created successfully`);
    
    return true;
  } catch (error) {
    console.error("Error creating database:", error);
    return false;
  } finally {
    if (client) await client.end();
  }
}

/**
 * Run the full database setup process
 * - Check if database exists
 * - Create database if it doesn't exist
 * - Run migrations to ensure tables exist
 */
export async function ensureDatabaseSetup() {
  try {
    console.log("Starting database setup check...");
    
    // Create database if it doesn't exist
    const dbCreated = await createDatabaseIfNotExists();
    if (!dbCreated) {
      console.error("Failed to ensure database exists");
      return false;
    }
    
    // Run migrations
    const migrationSuccess = await runMigration();
    if (!migrationSuccess) {
      console.error("Failed to run migrations");
      return false;
    }
    
    console.log("Database setup completed successfully!");
    return true;
  } catch (error) {
    console.error("Database setup failed:", error);
    return false;
  }
}

// Run migration if called directly
if (require.main === module) {
  runMigration().then(() => process.exit(0)).catch(() => process.exit(1));
}

// Export functions
export { runMigration }; 