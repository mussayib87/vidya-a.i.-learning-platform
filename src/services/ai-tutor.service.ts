/**
 * AI Tutor Service - Server-side LLM integration
 * 
 * This service connects to a real language model to generate
 * AI tutor responses. The API key is kept server-side only.
 * 
 * Supported providers:
 * - OpenAI (GPT-4o, GPT-4 Turbo)
 * - Anthropic Claude (optional)
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { AITutor } from "@/data/ai-tutors";

export const AskAITutorInput = z.object({
  question: z.string().min(1).max(5000),
  tutorId: z.string().min(1),
  subjectId: z.string().min(1),
  languageId: z.string().min(2),
  conversationContext: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    }),
  ),
  tutorSystemPrompt: z.string().min(1),
  explainSimply: z.boolean().optional(),
});

export type AskAITutorInput = z.infer<typeof AskAITutorInput>;

type OpenAIMessage = {
  role: "user" | "assistant";
  content: string;
};

type OpenAIResponse = {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
};

function serverEnvironment(): {
  OPENAI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
  AI_PROVIDER?: string;
} {
  const processLike = (globalThis as typeof globalThis & {
    process?: {
      env?: {
        OPENAI_API_KEY?: string;
        ANTHROPIC_API_KEY?: string;
        AI_PROVIDER?: string;
      };
    };
  }).process;
  return processLike?.env ?? {};
}

/**
 * Build the system message for the tutor
 */
function buildSystemMessage(
  tutorSystemPrompt: string,
  languageId: string,
  explainSimply: boolean,
): string {
  let message = tutorSystemPrompt;

  if (languageId !== "en") {
    message += `\n\nIMPORTANT: The student has requested explanations in their local language. Provide your response in the student's language when possible.`;
  }

  if (explainSimply) {
    message += `\n\nIMPORTANT: The student has asked for a simpler explanation. Use even simpler language, shorter sentences, and more basic examples. Avoid jargon.`;
  }

  return message;
}

/**
 * Call OpenAI API
 */
async function callOpenAI(
  messages: OpenAIMessage[],
  systemPrompt: string,
): Promise<string> {
  const apiKey = serverEnvironment().OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "OpenAI API key is not configured. Set OPENAI_API_KEY environment variable.",
    );
  }

  let response: Response;
  try {
    response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });
  } catch (error) {
    throw new Error(
      `OpenAI API request failed: ${error instanceof Error ? error.message : "network error"}`,
    );
  }

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(
      `OpenAI API error (HTTP ${response.status}): ${errorData}`,
    );
  }

  let payload: OpenAIResponse;
  try {
    payload = (await response.json()) as OpenAIResponse;
  } catch {
    throw new Error(`OpenAI returned invalid JSON (HTTP ${response.status}).`);
  }

  const content = payload.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("OpenAI returned no response content.");
  }

  return content;
}

/**
 * Main server function to ask the AI tutor
 * Called from the frontend, but all API calls happen server-side
 */
export const askAITutor = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AskAITutorInput.parse(input))
  .handler(async ({ data }) => {
    const {
      question,
      tutorId,
      subjectId,
      languageId,
      conversationContext,
      tutorSystemPrompt,
      explainSimply,
    } = data;

    // Build the system prompt with language and complexity preferences
    const systemPrompt = buildSystemMessage(
      tutorSystemPrompt,
      languageId,
      explainSimply ?? false,
    );

    // Build the message history for context
    const messages: OpenAIMessage[] = conversationContext.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Add the current question
    messages.push({
      role: "user",
      content: question,
    });

    // Limit conversation history to last 10 messages to keep tokens reasonable
    const recentMessages = messages.slice(Math.max(0, messages.length - 10));

    // Get the AI provider to use
    const provider = serverEnvironment().AI_PROVIDER || "openai";

    let response: string;
    try {
      if (provider === "openai") {
        response = await callOpenAI(recentMessages, systemPrompt);
      } else {
        // Default to OpenAI
        response = await callOpenAI(recentMessages, systemPrompt);
      }
    } catch (error) {
      throw new Error(
        `AI tutor failed: ${error instanceof Error ? error.message : "unknown error"}`,
      );
    }

    return { response };
  });

/**
 * Server-side function to generate suggested follow-up questions
 */
export const generateFollowUpSuggestions = createServerFn({
  method: "POST",
})
  .inputValidator(
    (input: unknown) =>
      z
        .object({
          topic: z.string().min(1),
          tutorId: z.string().min(1),
          languageId: z.string().min(2),
        })
        .parse(input),
  )
  .handler(async ({ data }) => {
    const { topic, tutorId, languageId } = data;

    const prompt = `You are helping suggest follow-up learning questions for a student learning about: "${topic}"

Generate 4 follow-up questions that will deepen their understanding. Format as JSON array of strings.
Questions should be:
- Clear and specific
- Build on what they just learned
- Encourage deeper thinking
- Be appropriate for the topic

Return ONLY valid JSON in this format:
["Question 1?", "Question 2?", "Question 3?", "Question 4?"]`;

    const messages: OpenAIMessage[] = [
      {
        role: "user",
        content: prompt,
      },
    ];

    try {
      const response = await callOpenAI(messages, "You are a helpful educational assistant.");
      
      // Parse the JSON response
      const suggestions = JSON.parse(response) as string[];
      return { suggestions: suggestions.slice(0, 4) };
    } catch {
      // Fallback suggestions if AI fails
      return {
        suggestions: [
          "Can you give me an example?",
          "How is this related to what we learned before?",
          "What happens if we change one part?",
          "Can you explain that differently?",
        ],
      };
    }
  });
