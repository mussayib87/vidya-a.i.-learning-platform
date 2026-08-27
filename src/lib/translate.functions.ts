import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const TranslateInput = z.object({
  text: z.string().min(1).max(4000),
  from: z.string().min(2).max(8),
  to: z.string().min(2).max(8),
});

type MyMemoryResponse = {
  responseStatus?: number;
  responseDetails?: string;
  responseData?: { translatedText?: string };
};

export const translateText = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TranslateInput.parse(input))
  .handler(async ({ data }) => {
    if (data.from === data.to) return { text: data.text };

    const endpoint = new URL("https://api.mymemory.translated.net/get");
    endpoint.searchParams.set("q", data.text);
    endpoint.searchParams.set("langpair", `${data.from}|${data.to}`);

    let response: Response;
    try {
      response = await fetch(endpoint);
    } catch (error) {
      throw new Error(
        `Translation request failed: ${error instanceof Error ? error.message : "network error"}`,
      );
    }

    if (!response.ok) {
      throw new Error(`Translation service failed with HTTP ${response.status}.`);
    }

    let payload: MyMemoryResponse;
    try {
      payload = (await response.json()) as MyMemoryResponse;
    } catch {
      throw new Error("Translation service returned invalid JSON.");
    }

    if (payload.responseStatus !== 200) {
      throw new Error(
        `Translation service returned an error${payload.responseDetails ? `: ${payload.responseDetails}` : "."}`,
      );
    }

    const text = payload.responseData?.translatedText?.trim();
    if (!text) throw new Error("Translation service returned no translated text.");
    return { text };
  });
