import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  GraduationCap,
  Languages,
  Loader2,
  RotateCcw,
  Send,
  Sparkle,
  User,
} from "lucide-react";
import { languages } from "@/data/catalog";
import { subjects } from "@/data/subjects";
import { suggestedQuestions } from "@/data/tutor";
import { tutorService } from "@/services/tutor.service";
import { chatService, type ChatMessage } from "@/services/chat.service";
import { useApp } from "@/hooks/useApp";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/app/tutor")({
  head: () => ({
    meta: [
      { title: "AI Tutor — Vidya A.I." },
      {
        name: "description",
        content:
          "Ask questions in your own language and get step-by-step explanations from the Vidya A.I. tutor.",
      },
      { property: "og:title", content: "AI Tutor — Vidya A.I." },
      {
        property: "og:description",
        content:
          "Ask study questions and get clear, step-by-step explanations with Vidya A.I.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TutorPage,
});

function TutorPage() {
  const { profile } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [subjectId, setSubjectId] = useState(subjects[0].id);
  const [languageId, setLanguageId] = useState("en");
  const [simple, setSimple] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(chatService.list());
    if (profile.language) setLanguageId(profile.language);
    if (profile.subjects.length) setSubjectId(profile.subjects[0]);
    inputRef.current?.focus();
  }, [profile.language, profile.subjects]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, pending]);

  const send = useCallback(
    async (text: string) => {
      const question = text.trim();
      if (!question || pending) return;

      const userMessage = chatService.create("user", question, subjectId);
      const withUser = [...chatService.list(), userMessage];
      setMessages(withUser);
      chatService.save(withUser);
      setInput("");
      setPending(true);

      try {
        const answer = await tutorService.ask({
          question,
          subjectId,
          languageId,
          simple,
          translate: languageId !== "en",
        });
        const reply = chatService.create("assistant", answer, subjectId);
        const next = [...withUser, reply];
        setMessages(next);
        chatService.save(next);
      } finally {
        setPending(false);
        inputRef.current?.focus();
      }
    },
    [languageId, pending, simple, subjectId],
  );

  const reset = () => {
    chatService.clear();
    setMessages([]);
    inputRef.current?.focus();
  };

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-6 md:py-10">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Tutor</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ask anything from your syllabus. Answers are curated samples until a
            language model is connected.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={reset}
          disabled={!messages.length || pending}
        >
          <RotateCcw className="size-4" />
          New chat
        </Button>
      </header>

      <section className="grid gap-3 rounded-2xl border bg-card p-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="subject" className="text-xs text-muted-foreground">
            <GraduationCap className="size-3.5" /> Subject
          </Label>
          <select
            id="subject"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="h-9 w-full rounded-lg border bg-background px-3 text-sm"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="language" className="text-xs text-muted-foreground">
            <Languages className="size-3.5" /> Language
          </Label>
          <select
            id="language"
            value={languageId}
            onChange={(e) => setLanguageId(e.target.value)}
            className="h-9 w-full rounded-lg border bg-background px-3 text-sm"
          >
            {languages.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label} — {l.native}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-2">
          <Switch id="simple" checked={simple} onCheckedChange={setSimple} />
          <Label htmlFor="simple" className="pb-1.5 text-sm">
            Explain simply
          </Label>
        </div>
      </section>

      <section className="flex min-h-[24rem] flex-col gap-4 rounded-2xl border bg-card p-4">
        {messages.length === 0 && !pending ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-8 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
              <Sparkle className="size-6" />
            </span>
            <div>
              <p className="font-semibold">Start with a question</p>
              <p className="text-sm text-muted-foreground">
                Pick a prompt below or type your own.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => void send(q)}
                  className="rounded-full border px-3 py-1.5 text-sm text-muted-foreground transition hover:border-primary hover:text-foreground"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-4">
            {messages.map((m) => (
              <MessageRow key={m.id} message={m} />
            ))}
            {pending && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Thinking…
              </div>
            )}
          </div>
        )}
        <div ref={endRef} />
      </section>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className="rounded-2xl border bg-card p-2"
      >
        <Textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send(input);
            }
          }}
          rows={2}
          placeholder="Ask a question from your chapter…"
          className="resize-none border-0 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center justify-between gap-2 px-2 pb-1">
          <span className="text-xs text-muted-foreground">
            Enter to send · Shift + Enter for a new line
          </span>
          <Button type="submit" size="icon" disabled={!input.trim() || pending}>
            {pending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </form>
    </main>
  );
}

function MessageRow({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={isUser ? "flex justify-end" : "flex gap-3"}>
      {!isUser && (
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <Sparkle className="size-4" />
        </span>
      )}
      <div
        className={
          isUser
            ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground"
            : "max-w-[85%] whitespace-pre-wrap text-sm leading-relaxed text-foreground"
        }
      >
        {message.content}
      </div>
      {isUser && (
        <span className="ml-2 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <User className="size-4" />
        </span>
      )}
    </div>
  );
}
