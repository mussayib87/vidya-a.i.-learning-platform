import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const TranslateInput = z.object({
  text: z.string().min(1).max(4000),
  from: z.string().min(2).max(8),
  to: z.string().min(2).max(8),
});

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  kn: "Kannada",
  te: "Telugu",
  ta: "Tamil",
  ml: "Malayalam",
  mr: "Marathi",
  bn: "Bengali",
  ur: "Urdu",
};

/**
 * Real translation through the Lovable AI Gateway.
 * The API key never leaves the server.
 */
export const translateText = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TranslateInput.parse(input))
  .handler(async ({ data }) => {
    if (data.from === data.to) return { text: data.text };

    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("Translation service is not configured.");

    const source = LANGUAGE_NAMES[data.from] ?? data.from;
    const target = LANGUAGE_NAMES[data.to] ?? data.to;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3.7-flash",
          messages: [
            {
              role: "system",
              content: `You are a live classroom interpreter. Translate the teacher's ${source} speech into natural, simple ${target} suitable for school students. Keep technical terms accurate. Reply with the translation only — no quotes, no notes, no transliteration.`,
            },
            { role: "user", content: data.text },
          ],
        }),
      },
    );

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      if (response.status === 429)
        throw new Error("Translation is rate limited. Please slow down a little.");
      if (response.status === 402)
        throw new Error("Translation credits are exhausted. Please add credits.");
      throw new Error(`Translation failed (${response.status}). ${detail.slice(0, 200)}`);
    }

    const payload = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = payload.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("Translation returned no text.");
    return { text };
  });
