/**
 * This is a test script for validating your Google OAuth credentials.
 * You can run this script with: npx tsx test-auth.ts
 */

console.log("Validating Google OAuth Credentials...");

// Load environment variables
const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "";

// Check if credentials exist
if (!googleClientId || googleClientId === "your-google-client-id") {
  console.error("❌ Missing GOOGLE_CLIENT_ID in .env.local");
  process.exit(1);
}

if (!googleClientSecret || googleClientSecret === "your-google-client-secret") {
  console.error("❌ Missing GOOGLE_CLIENT_SECRET in .env.local");
  process.exit(1);
}

// Check for common mistakes in client secret
if (googleClientSecret.includes("GOCSPX-")) {
  // Check for duplicated text
  if (googleClientSecret.indexOf("GOCSPX-") !== googleClientSecret.lastIndexOf("GOCSPX-")) {
    console.error("❌ Your GOOGLE_CLIENT_SECRET appears to contain duplicated text");
    console.error(`   Actual length: ${googleClientSecret.length}, Expected length: ~24-27 characters`);
    process.exit(1);
  }
  
  console.log("✓ GOOGLE_CLIENT_SECRET format appears valid");
} else {
  console.warn("⚠️ GOOGLE_CLIENT_SECRET doesn't start with 'GOCSPX-'. This might be fine, but double-check it.");
}

// Check client ID format
if (googleClientId.endsWith(".apps.googleusercontent.com")) {
  console.log("✓ GOOGLE_CLIENT_ID format appears valid");
} else {
  console.error("❌ GOOGLE_CLIENT_ID doesn't end with '.apps.googleusercontent.com'");
  process.exit(1);
}

console.log("\n✓ Basic validation passed");
console.log("\nImportant reminders:");
console.log("1. Make sure you've added http://localhost:3000/api/auth/callback/google as an authorized redirect URI in your Google Cloud Console");
console.log("2. Ensure you've enabled the Google OAuth API in your Google Cloud Console");
console.log("3. Check that your app is not in testing mode, or if it is, your test email is on the allowed testers list");

console.log("\nIf you're still having issues, try these steps:");
console.log("1. Clear your browser cookies for localhost");
console.log("2. Restart your Next.js development server");
console.log("3. Open the browser console for error messages while signing in");
console.log("4. Check the server console for NextAuth.js debug messages"); 