import { Chat } from "../../../app/nightguide";

const GEMINI_API_KEYS = [
  process.env.EXPO_PUBLIC_GEMINI_API_KEY,
  process.env.EXPO_PUBLIC_GEMINI_API_KEY2,
].filter(Boolean);

if (!GEMINI_API_KEYS.length) {
  console.error("⚠️ No Gemini API keys found.");
}

const MODEL_PRIORITY = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-1.5-flash",
];

const SYSTEM_PROMPT = `
You are NightGuide, a friendly and knowledgeable AI assistant specializing in movies and TV shows. 🎬

YOUR ONLY JOB:
- Recommend great movies and TV shows based on the user's request
- Use your knowledge to pick the best, most relevant titles
- You do NOT have access to a database — just your training knowledge

RESPONSE FORMAT (STRICT — ALWAYS FOLLOW):
For movies:
🎬 **Exact Movie Title** (Year) - One-line description.

For TV shows:
📺 **Exact Show Title** (Year) - One-line description.

RULES:
- Always suggest 3–5 options
- Use the EXACT, OFFICIAL title (e.g. "The Dark Knight", not "dark knight")
- The year must be the correct release year
- Be concise and engaging
- Use emoji to keep it lively 🎉
- NEVER include IDs, URLs, or technical data — just title and year
- NEVER say "I can't find" or refuse to help — always provide recommendations

Examples:
🎬 **Inception** (2010) - A mind-bending heist inside the world of dreams.
🎬 **The Dark Knight** (2008) - A gritty superhero thriller with an iconic villain.
📺 **Breaking Bad** (2008) - A chemistry teacher transforms into a drug lord.
`.trim();

const MAX_HISTORY = 20;

export async function getGeminiResponse(message: string, chat: Chat[]) {
  for (const key of GEMINI_API_KEYS) {
    for (const model of MODEL_PRIORITY) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              system_instruction: {
                parts: [{ text: SYSTEM_PROMPT }],
              },
              contents: [
                ...chat.map((m) => ({
                  role: m.role === "user" ? "user" : "model",
                  parts: [{ text: m.message }],
                })),
                {
                  role: "user",
                  parts: [{ text: message }],
                },
              ],
            }),
          },
        );

        const data = await res.json();

        if (data?.error) {
          throw new Error(data.error.message);
        }

        return (
          data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response"
        );
      } catch (err: any) {
        console.log(`Model failed: ${model}`, err?.message);
        continue; // try next model
      }
    }
  }

  return "⚠️ All models failed. Please try again.";
}


export function getQuickSuggestions(): string[] {
  return [
    "Recommend sci-fi movies like Inception",
    "What are some good comedy shows?",
    "Suggest thriller movies from 2023",
    "Movies similar to The Dark Knight",
    "Best animated films for family night",
  ];
}

