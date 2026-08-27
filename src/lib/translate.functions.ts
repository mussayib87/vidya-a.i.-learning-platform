import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const TranslateInput = z.object({
  text: z.string().min(1).max(2000),
  from: z.string().min(2).max(8),
  to: z.string().min(2).max(8),
});

type SarvamResponse = {
  translated_text?: string;
  error?: { message?: string };
};

function sarvamLanguageCode(language: string): string {
  const normalized = language.trim().toLowerCase();
  return normalized.includes("-") ? normalized : `${normalized}-IN`;
}

function serverEnvironment(): { SARVAM_API_KEY?: string } {
  const processLike = (globalThis as typeof globalThis & {
    process?: { env?: { SARVAM_API_KEY?: string } };
  }).process;
  return processLike?.env ?? {};
}

export const translateText = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TranslateInput.parse(input))
  .handler(async ({ data }) => {
    const sourceLanguageCode = sarvamLanguageCode(data.from);
    const targetLanguageCode = sarvamLanguageCode(data.to);
    if (sourceLanguageCode === targetLanguageCode) return { text: data.text };

    const apiKey = serverEnvironment().SARVAM_API_KEY?.trim();
    if (!apiKey) {
      throw new Error("Sarvam AI translation is not configured on the server.");
    }

    let response: Response;
    try {
      response = await fetch("https://api.sarvam.ai/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-subscription-key": apiKey,
        },
        body: JSON.stringify({
          input: data.text,
          source_language_code: sourceLanguageCode,
          target_language_code: targetLanguageCode,
          model: "sarvam-translate:v1",
        }),
      });
    } catch (error) {
      throw new Error(
        `Sarvam AI translation request failed: ${error instanceof Error ? error.message : "network error"}`,
      );
    }

    let payload: SarvamResponse;
    try {
      payload = (await response.json()) as SarvamResponse;
    } catch {
      throw new Error(`Sarvam AI returned invalid JSON (HTTP ${response.status}).`);
    }

    if (!response.ok) {
      throw new Error(
        `Sarvam AI translation failed with HTTP ${response.status}${payload.error?.message ? `: ${payload.error.message}` : "."}`,
      );
    }

    const text = payload.translated_text?.trim();
    if (!text) throw new Error("Sarvam AI returned no translated text.");
    return { text };
  });
