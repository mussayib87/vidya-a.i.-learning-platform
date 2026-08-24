/**
 * Local chat transcript store for the AI Tutor.
 *
 * Messages are kept in localStorage so a conversation survives reloads.
 * Swap these calls for Supabase (tables: conversations, messages) when the
 * backend is connected.
 */

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  subjectId: string;
  createdAt: number;
};

const CHAT_KEY = "vidya.tutorMessages";

const newId = () =>
  `msg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

export const chatService = {
  list(): ChatMessage[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(CHAT_KEY);
      return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
    } catch {
      return [];
    }
  },

  save(messages: ChatMessage[]) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
  },

  create(
    role: ChatRole,
    content: string,
    subjectId: string,
  ): ChatMessage {
    return { id: newId(), role, content, subjectId, createdAt: Date.now() };
  },

  clear() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(CHAT_KEY);
  },
};
