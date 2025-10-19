import { OpenAI } from 'openai';

// Initialize the OpenAI client with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to generate email content
export async function generateEmailContent({
  client,
  occasion,
  tone = "friendly",
  style = "professional",
  length = "medium",
  additionalContext = "",
}: {
  client: {
    name: string;
    email: string;
    relationship?: string;
    yearsKnown?: number;
    birthday?: string;
    closingAnniversary?: string;
    tags?: string[];
    [key: string]: any;
  };
  occasion: string;
  tone?: string;
  style?: string;
  length?: string;
  additionalContext?: string;
}): Promise<{ subject: string; content: string }> {
  try {
    // Create a system prompt that explains the task to the AI
    const systemPrompt = `You are an expert email writer for real estate agents. 
Your task is to write personalized, engaging emails to clients. 
Use the provided client information to create a customized email that feels personal and genuine.
The email should be appropriate for the specified occasion and adhere to the requested tone, style, and length.`;

    // Create a user prompt with specific instructions
    const userPrompt = `Write an email to ${client.name} for the occasion: ${occasion}.

Client Information:
- Name: ${client.name}
- Email: ${client.email}
${client.relationshipLevel ? `- Relationship Level: ${client.relationshipLevel}` : ''}
${client.yearsKnown ? `- Years Known: ${client.yearsKnown}` : ''}
${client.birthday ? `- Birthday: ${client.birthday}` : ''}
${client.closingAnniversary ? `- Closing Anniversary: ${client.closingAnniversary}` : ''}
${client.tags && client.tags.length > 0 ? `- Tags: ${client.tags.join(', ')}` : ''}

Email Parameters:
- Tone: ${tone}
- Style: ${style} 
- Length: ${length}
${additionalContext ? `- Additional Context: ${additionalContext}` : ''}

Please provide a subject line and email body. The email should sound natural and personable, 
not like a template. Include specific details about the client where appropriate.
Format your response as:
SUBJECT: [Your subject line]

[Email content]`;

    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7, // Add some creativity but keep it mostly consistent
      max_tokens: 1000, // Adjust based on your needs
    });

    // Extract the content from the response
    const generatedText = response.choices[0]?.message?.content || "";

    // Parse the response to extract subject and body
    const subjectMatch = generatedText.match(/SUBJECT: (.*?)(?=\n\n|\n|$)/i);
    const subject = subjectMatch ? subjectMatch[1].trim() : "No subject generated";

    // Extract the email body (everything after "SUBJECT: ..." line)
    const content = generatedText
      .replace(/SUBJECT: .*?(?=\n\n|\n|$)/i, "")
      .trim();

    return { subject, content };
  } catch (error) {
    console.error("Error generating email content:", error);
    throw new Error("Failed to generate email content");
  }
}

// Function to analyze email sentiment and quality
export async function analyzeEmail(content: string): Promise<{
  sentiment: string;
  formality: string;
  suggestions: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Analyze the following email for sentiment, formality, and provide suggestions for improvement. Focus on tone, clarity, and personalization.`
        },
        { role: "user", content }
      ],
      temperature: 0.3, // Keep it consistent for analysis
      max_tokens: 500,
    });

    const analysis = response.choices[0]?.message?.content || "";

    // Parse the analysis - this is a simplified version
    const sentimentMatch = analysis.match(/sentiment:?\s*(.*?)(?=\n|$)/i);
    const formalityMatch = analysis.match(/formality:?\s*(.*?)(?=\n|$)/i);
    
    // Extract suggestions - assuming they're in a list format
    const suggestionsMatch = analysis.match(/suggestions:?\s*([\s\S]*)/i);
    let suggestions: string[] = [];
    
    if (suggestionsMatch && suggestionsMatch[1]) {
      suggestions = suggestionsMatch[1]
        .split(/\n-|\n\d+\./)
        .map(s => s.trim())
        .filter(Boolean);
    }

    return {
      sentiment: sentimentMatch ? sentimentMatch[1].trim() : "neutral",
      formality: formalityMatch ? formalityMatch[1].trim() : "neutral",
      suggestions: suggestions.length > 0 ? suggestions : ["No specific suggestions."],
    };
  } catch (error) {
    console.error("Error analyzing email:", error);
    throw new Error("Failed to analyze email");
  }
}

// Function to enhance email content
export async function enhanceEmail({
  subject,
  content,
  improvements,
}: {
  subject: string;
  content: string;
  improvements: string;
}): Promise<{ subject: string; content: string }> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert email editor for real estate agents. 
Your task is to improve the provided email based on specific improvement requests.
Maintain the original intent and tone of the email while making the requested enhancements.`
        },
        {
          role: "user",
          content: `Here is an email subject line and content:

SUBJECT: ${subject}

${content}

Please improve this email with the following guidance: ${improvements}

Format your response as:
SUBJECT: [Improved subject line]

[Improved email content]`
        }
      ],
      temperature: 0.5,
      max_tokens: 1200,
    });

    const enhancedText = response.choices[0]?.message?.content || "";

    // Parse the response to extract subject and body
    const subjectMatch = enhancedText.match(/SUBJECT: (.*?)(?=\n\n|\n|$)/i);
    const newSubject = subjectMatch ? subjectMatch[1].trim() : subject;

    // Extract the email body (everything after "SUBJECT: ..." line)
    const newContent = enhancedText
      .replace(/SUBJECT: .*?(?=\n\n|\n|$)/i, "")
      .trim();

    return { subject: newSubject, content: newContent };
  } catch (error) {
    console.error("Error enhancing email:", error);
    throw new Error("Failed to enhance email");
  }
}

export default openai; 