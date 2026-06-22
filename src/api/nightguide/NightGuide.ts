import { Chat } from "@/app/nightguide";
import { CreatTableNightGuide } from "./NightGuideDBManger";

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
You are NightGuide, an intelligent and engaging AI movie & TV show expert 🎬

YOUR ROLE:
- Recommend movies and TV shows tailored to the user's taste
- Briefly adapt suggestions based on what the user asked
- Keep responses fun, natural, and helpful

FORMAT (STRICT):
- Suggest 3–5 titles
- Use:
🎬 **Movie Title** (Year) - Short reason why it fits
📺 **Show Title** (Year) - Short reason why it fits

RULES:
- Always use official titles and correct years
- Keep each description under 12 words
- Make it feel personalized (even if guessed)
- Use light emojis 🎉 (not too many)
- No IDs, links, or technical data

STYLE:
- Friendly + smart (like a film expert friend)
- Slight personality, not robotic
- Avoid generic descriptions

EXAMPLE:
🎬 **Interstellar** (2014) - Deep sci-fi with emotional, mind-bending themes.
🎬 **Tenet** (2020) - Complex time mechanics similar to Inception.
📺 **Dark** (2017) - Twisted timelines and layered storytelling.
`.trim();

export async function getGeminiResponse(message: string, chat: Chat[]) {
  await CreatTableNightGuide();
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
        
        const aiResponse =
          data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

        return aiResponse;
      } catch (err: any) {
        console.log(`Model failed: ${model}`, err?.message);
        continue; // try next model
      }
    }
  }

  return "⚠️ All models failed. Please try again.";
}

export function getQuickSuggestions(): string[] {
  const suggestions = [
    "Recommend sci-fi movies like Inception",
    "What are some good comedy shows?",
    "Suggest thriller movies from 2023",
    "Movies similar to The Dark Knight",
    "Best animated films for family night",
    "Top horror movies this year",
    "Underrated drama films to watch",
  ];

  return suggestions.sort(() => 0.5 - Math.random()).slice(0, 5);
}
