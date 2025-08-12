import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// Define a helper function to make schema less strict in development
const defineSchema = <T extends z.ZodTypeAny>(schema: T) => {
  if (process.env.NODE_ENV === "development" || process.env.SKIP_ENV_VALIDATION) {
    return z.any() as T;
  }
  return schema;
};

export const env = createEnv({
  // Server variables
  server: {
    DATABASE_URL: defineSchema(z.string().url()),
    NEXTAUTH_URL: defineSchema(z.string().url()),
    NEXTAUTH_SECRET: defineSchema(z.string().min(1)),
    GOOGLE_CLIENT_ID: defineSchema(z.string().min(1)),
    GOOGLE_CLIENT_SECRET: defineSchema(z.string().min(1)),
    EMAIL_SERVER_HOST: defineSchema(z.string().min(1)),
    EMAIL_SERVER_PORT: defineSchema(z.string().min(1)),
    EMAIL_SERVER_USER: defineSchema(z.string().min(1)),
    EMAIL_SERVER_PASSWORD: defineSchema(z.string().min(1)),
    EMAIL_FROM: defineSchema(z.string().email()),
    OPENAI_API_KEY: defineSchema(z.string().min(1)),
  },
  // Client variables
  client: {
    NEXT_PUBLIC_APP_URL: defineSchema(z.string().url()),
  },
  // Shared variables (accessible on both client and server)
  shared: {
    NODE_ENV: defineSchema(z.enum(["development", "production", "test"])),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
    EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
    EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
    EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
    EMAIL_FROM: process.env.EMAIL_FROM,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NODE_ENV: process.env.NODE_ENV,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
}); 