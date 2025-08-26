import { OpenAIApi, Configuration } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function generateEmail({ prompt, template }: { prompt: string; template: string }) {
  const completion = await openai.createChatCompletion({
    model: 'gpt-4-1106-preview',
    messages: [
      { role: 'system', content: `You are an expert email writer. Use the following template: ${template}` },
      { role: 'user', content: prompt },
    ],
    max_tokens: 500,
  });
  return completion.data.choices[0].message?.content || '';
}
