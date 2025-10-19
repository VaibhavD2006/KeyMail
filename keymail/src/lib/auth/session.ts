import { getServerSession } from "next-auth/next";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { getUserByEmail, createUser } from "../db/queries-mongodb";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // In a real application, you would validate the credentials
        // against your database here
        
        // For now, we'll just check if the user exists
        const user = await getUserByEmail(credentials.email);
        
        if (!user) {
          throw new Error("User not found");
        }
        
        // In a real application, you would verify the password here
        
        return {
          id: user._id ? user._id.toString() : user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      console.log("JWT Callback - Token:", token);
      console.log("JWT Callback - User:", user);
      console.log("JWT Callback - Account:", account);
      
      if (user) {
        // Handle both MongoDB _id and regular id
        token.id = (user as any)._id ? (user as any)._id.toString() : user.id;
        // Add user role or plan information
        token.plan = user.plan || "free";
      }
      
      // Keep the account info to identify the provider
      if (account) {
        token.provider = account.provider;
      }
      
      return token;
    },
    async session({ session, token }) {
      console.log("Session Callback - Session:", session);
      console.log("Session Callback - Token:", token);
      
      if (token && session.user) {
        session.user.id = token.id as string;
        // Add additional user data to session
        session.user.plan = token.plan as string;
        session.user.provider = token.provider as string;
      }
      
      return session;
    },
    async signIn({ user, account, profile }) {
      console.log("SignIn Callback - User:", user);
      console.log("SignIn Callback - Account:", account);
      console.log("SignIn Callback - Profile:", profile);
      
      try {
        if (account?.provider === "google") {
          if (!user.email) {
            console.error("No email provided from Google");
            return false;
          }
          
          // Check if user exists
          const existingUser = await getUserByEmail(user.email);
          
          if (!existingUser) {
            console.log("Creating new user for:", user.email);
            // Create new user
            await createUser({
              email: user.email,
              name: user.name || "User",
              plan: "free",
              settings: {
                timezone: "UTC"
              }
            });
          } else {
            console.log("User already exists:", existingUser.email);
          }
        }
        
        return true;
      } catch (error) {
        console.error("Error during sign in:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect Callback - URL:", url);
      console.log("Redirect Callback - BaseURL:", baseUrl);
      
      // If the URL starts with the base URL, it's safe to redirect
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // If it's an absolute URL for a different origin, redirect to the homepage
      else if (url.startsWith("http")) {
        return baseUrl;
      }
      // Otherwise, it's a relative URL, so we can safely redirect
      return `${baseUrl}${url}`;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug mode to help troubleshoot
};

export const getSession = () => getServerSession(authOptions); 