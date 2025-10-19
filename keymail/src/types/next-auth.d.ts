import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extend the built-in session types
   */
  interface Session {
    user: {
      id: string;
      plan: string;
      provider: string;
    } & DefaultSession["user"];
  }

  /**
   * Extend the built-in user types
   */
  interface User {
    id: string;
    plan?: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extend the JWT types
   */
  interface JWT {
    id: string;
    plan?: string;
    provider?: string;
  }
} 