import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";

// For development, we'll use a simple mock auth setup without the database
const isDevelopment = process.env.NODE_ENV === "development" || process.env.SKIP_ENV_VALIDATION;

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/error",
    verifyRequest: "/verify-request",
  },
  providers: [
    ...(isDevelopment
      ? [
          // In development, use a credentials provider for easy testing
          CredentialsProvider({
            name: "Dev Credentials",
            credentials: {
              email: {
                label: "Email",
                type: "email",
                placeholder: "example@example.com",
              },
            },
            async authorize() {
              // Return a mock user
              return {
                id: "dev-user-id",
                name: "Dev User",
                email: "dev@example.com",
                image: null,
              };
            },
          }),
        ]
      : [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "dummy-client-id",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy-client-secret",
          }),
          EmailProvider({
            server: process.env.EMAIL_SERVER_HOST
              ? {
                  host: process.env.EMAIL_SERVER_HOST,
                  port: process.env.EMAIL_SERVER_PORT,
                  auth: {
                    user: process.env.EMAIL_SERVER_USER || "",
                    pass: process.env.EMAIL_SERVER_PASSWORD || "",
                  },
                }
              : "",
            from: process.env.EMAIL_FROM || "noreply@example.com",
          }),
        ]),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
    };
  }
} 