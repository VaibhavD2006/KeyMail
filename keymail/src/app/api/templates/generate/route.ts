import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { occasion, tone, style, length, additionalContext } = body;

    // Validate required fields
    if (!occasion) {
      return NextResponse.json(
        { success: false, error: "Occasion is required" },
        { status: 400 }
      );
    }

    // Mock AI response for now - in a real application, this would call an AI service like OpenAI
    // This is a placeholder implementation
    const subject = generateSubject(occasion);
    const content = generateContent(occasion, tone, style, length, additionalContext);

    return NextResponse.json({
      success: true,
      data: {
        subject,
        content,
      },
    });
  } catch (error) {
    console.error("Error generating template content:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate template content" },
      { status: 500 }
    );
  }
}

// Helper function to generate a subject line based on occasion
function generateSubject(occasion: string): string {
  const subjectsByOccasion: Record<string, string[]> = {
    birthday: [
      "Happy Birthday from Your Real Estate Partner!",
      "Wishing You a Wonderful Birthday Celebration",
      "Special Birthday Wishes Just for You"
    ],
    closing_anniversary: [
      "Happy Home Anniversary!",
      "Celebrating Your Home Milestone",
      "One Year in Your Dream Home!"
    ],
    holiday_greeting: [
      "Warm Holiday Wishes",
      "Season's Greetings from Your Real Estate Partner",
      "Happy Holidays to You and Your Family"
    ],
    market_update: [
      "Your Neighborhood Market Update",
      "Important Real Estate Trends in Your Area",
      "Market Insights You Should Know About"
    ],
    listing_update: [
      "Update on Your Property Listing",
      "New Developments for Your Home Sale",
      "Your Listing Progress Report"
    ],
    check_in: [
      "Checking In - How Are You Enjoying Your Home?",
      "Just Touching Base",
      "A Quick Hello from Your Real Estate Partner"
    ],
    referral_request: [
      "Your Referrals Mean the World to Me",
      "I Value Your Support and Connections",
      "Helping More People Like You"
    ],
    thank_you: [
      "A Heartfelt Thank You",
      "Expressing My Gratitude",
      "Thank You for Your Trust and Support"
    ],
    life_event: [
      "Congratulations on Your Special Milestone!",
      "Celebrating Your Wonderful News",
      "So Happy for Your Recent Achievement"
    ],
    custom: [
      "A Special Message Just for You",
      "Reaching Out with Important Information",
      "Staying Connected with You"
    ],
  };

  // Default to check_in if the occasion doesn't match
  const subjects = subjectsByOccasion[occasion] || subjectsByOccasion.check_in;
  
  // Return a random subject from the array
  return subjects[Math.floor(Math.random() * subjects.length)];
}

// Helper function to generate content based on parameters
function generateContent(
  occasion: string,
  tone: string = "friendly",
  style: string = "conversational",
  length: string = "medium",
  additionalContext: string = ""
): string {
  // Sample content templates that use {client_name} placeholders
  const contentByOccasion: Record<string, string> = {
    birthday: `Dear {client_name},

Wishing you a wonderful birthday filled with joy and celebration! May your day be as special as you are, and may the coming year bring you continued happiness, good health, and prosperity.

It's been a pleasure working with you, and I wanted to take this opportunity to express my gratitude for our relationship. Your trust means the world to me.

If there's anything I can assist you with regarding real estate or your home needs, please don't hesitate to reach out.

Enjoy your special day!

Warm regards,
{agent_name}`,
    
    closing_anniversary: `Dear {client_name},

Can you believe it's already been a year since you moved into your home? Happy home anniversary!

I hope this past year has been filled with wonderful memories and that your home continues to be everything you hoped for. It was such a pleasure helping you find this special place, and I'm so glad you're enjoying it.

As always, I'm here if you need any recommendations for home maintenance, renovation ideas, or if you're curious about how your home's value has changed in the current market.

Here's to many more happy years in your home!

Best wishes,
{agent_name}`,
    
    check_in: `Dear {client_name},

I hope this message finds you well. I'm reaching out to check in and see how you've been doing lately.

It's important to me to maintain connections with valued clients like you, even when we're not actively working on a real estate transaction. I'm curious to know how everything is going with your home and if there's anything I can help with.

The real estate market in your area has seen some interesting changes lately, and I'd be happy to share insights if you're curious.

Feel free to reply with any questions or just to catch up. I'm always here to help.

Warm regards,
{agent_name}`,
    
    // Default template for custom or undefined occasions
    custom: `Dear {client_name},

I hope this message finds you well. It's always a pleasure to stay connected with you.

I wanted to reach out personally to check in and see how you've been. Your relationship is valuable to me, and I'm committed to providing ongoing support even outside of our direct real estate transactions.

Please let me know if there's anything I can assist you with, whether it's related to your current property, future plans, or any real estate questions you might have.

I look forward to hearing from you soon.

Best regards,
{agent_name}`
  };
  
  // Get content for the occasion, or use custom as default
  let content = contentByOccasion[occasion] || contentByOccasion.custom;
  
  // Adjust length based on preference
  if (length === "short") {
    // For short, remove some sentences and keep it concise
    content = content.split('\n\n').slice(0, 3).join('\n\n');
  } else if (length === "long") {
    // For long, add more detailed paragraphs
    const marketInsight = `\nBy the way, the real estate market in our area has been showing some interesting trends lately. Property values have been steadily appreciating, and inventory levels have been fluctuating. If you're curious about how these changes might affect your property's value or if you're considering any real estate moves in the future, I'd be happy to provide a detailed analysis tailored to your situation.`;
    
    const additionalGreeting = `\nI also wanted to mention that I greatly value our professional relationship and am always here to answer any questions or address any concerns you might have - whether they're related to your current property or future real estate plans.`;
    
    // Insert additional paragraphs before the sign-off
    const contentParts = content.split('Best regards,');
    content = contentParts[0] + marketInsight + '\n\n' + additionalGreeting + '\n\nBest regards,' + contentParts[1];
  }
  
  // Incorporate additional context if provided
  if (additionalContext) {
    const contextParagraph = `\n\n${additionalContext}\n\n`;
    const contentParts = content.split('Best regards,');
    content = contentParts[0] + contextParagraph + 'Best regards,' + contentParts[1];
  }
  
  // Finally, return the template with placeholders intact
  return content;
} 