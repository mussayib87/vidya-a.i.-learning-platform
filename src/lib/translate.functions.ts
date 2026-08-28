import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";

const TranslateInput = z.object({
  text: z.string().min(1).max(2000),
  from: z.string().min(2).max(20),
  to: z.string().min(2).max(20),
});

function serverEnvironment(): { GEMINI_API_KEY?: string } {
  const processLike = (globalThis as typeof globalThis & {
    process?: { env?: { GEMINI_API_KEY?: string } };
  }).process;

  return processLike?.env ?? {};
}

function languageName(language: string): string {
  const normalized = language.trim().toLowerCase();

  const languages: Record<string, string> = {
    en: "English",
    hi: "Hindi",
    kn: "Kannada",
    te: "Telugu",
    ta: "Tamil",
    ml: "Malayalam",
    mr: "Marathi",
    bn: "Bengali",
    gu: "Gujarati",
    pa: "Punjabi",
    ur: "Urdu",
  };

  return languages[normalized] ?? language;
}

export const translateText = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TranslateInput.parse(input))
  .handler(async ({ data }) => {
    const sourceLanguage = languageName(data.from);
    const targetLanguage = languageName(data.to);

    if (sourceLanguage === targetLanguage) {
      return { text: data.text };
    }

    const apiKey = serverEnvironment().GEMINI_API_KEY?.trim();

    if (!apiKey) {
      throw new Error(
        "Gemini API is not configured. Add GEMINI_API_KEY to the server environment."
      );
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: `Translate the following text from ${sourceLanguage} to ${targetLanguage}.

Rules:
- Return ONLY the translated text.
- Do not explain the translation.
- Do not add quotation marks.
- Preserve the original meaning.
- Keep names, numbers, and important technical terms accurate.

Text:
${data.text}`,
      });

      const translatedText = response.text?.trim();

      if (!translatedText) {
        throw new Error("Gemini returned no translated text.");
      }

      return { text: translatedText };
    } catch (error) {
      throw new Error(
        `Gemini translation failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  });
