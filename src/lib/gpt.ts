import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateEmail({ prompt, template }: { prompt: string; template: string }) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: `You are an expert email writer. Use the following template: ${template}` },
      { role: "user", content: prompt },
    ],
    max_tokens: 500,
  });
  return completion.choices[0]?.message?.content || "";
}
