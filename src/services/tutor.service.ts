/**
 * AI tutor service.
 *
 * IMPORTANT: no AI provider is connected. Replies below are curated mock
 * content selected by keyword so the interface can be evaluated end to end.
 * Replace `ask` with a server-function call when a model is wired up.
 */
import { fallbackReply, tutorReplies } from "@/data/tutor";
import { languages } from "@/data/catalog";

export type AskOptions = {
  question: string;
  subjectId: string;
  languageId: string;
  simple?: boolean;
  translate?: boolean;
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const tutorService = {
  isLive: false,

  async ask({
    question,
    languageId,
    simple,
    translate,
  }: AskOptions): Promise<string> {
    await delay(700 + Math.random() * 500);
    const q = question.toLowerCase();
    const match = tutorReplies.find((r) =>
      r.keywords.some((k) => q.includes(k)),
    );
    const base = match
      ? simple
        ? match.simple
        : match.answer
      : simple
        ? fallbackReply.simple
        : fallbackReply.answer;

    if (translate && languageId !== "en") {
      const lang = languages.find((l) => l.id === languageId);
      return `${base}\n\n(Sample response — translation into ${lang?.label ?? "your language"} (${lang?.native ?? ""}) will be generated once a language model is connected.)`;
    }
    return base;
  },
};
