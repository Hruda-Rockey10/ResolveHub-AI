import OpenAI from "openai";

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Model to use - change to any OpenRouter-supported model
const MODEL = "openrouter/hunter-alpha";

export async function suggestTagsAndDifficulty(input: {
  title: string;
  description: string;
}) {
  const prompt = `
You are helping classify a technical question.

Given the following question:
Title: ${input.title}
Description: ${input.description}

Return ONLY valid JSON in this exact format:
{
  "tags": ["tag1", "tag2", "tag3"],
  "difficulty": "EASY" | "MEDIUM" | "HARD"
}

Rules:
- Max 5 tags
- Tags should be short lowercase words
- Difficulty must be exactly one of EASY, MEDIUM, HARD
- No markdown
- No explanation
`;

  const completion = await openrouter.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.2,
  });

  const text = completion.choices[0]?.message?.content || "{}";

  try {
    return JSON.parse(text);
  } catch {
    return {
      tags: [],
      difficulty: "MEDIUM",
    };
  }
}

export async function generateDraftAnswer(input: {
  title: string;
  description: string;
}) {
  const prompt = `
You are an expert technical assistant.

Write a concise, helpful draft answer for this question:

Title: ${input.title}
Description: ${input.description}

Rules:
- Keep it practical
- 5 to 12 lines
- No markdown code fences
- Plain text only
- Avoid hallucinating libraries unless strongly implied
`;

  const completion = await openrouter.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.4,
  });

  return completion.choices[0]?.message?.content || "";
}
