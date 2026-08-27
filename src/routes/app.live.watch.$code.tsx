import { useEffect, useRef, useState } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { AlertCircle, Headphones, Radio, Volume2 } from "lucide-react";
import { z } from "zod";

import { AppShell } from "@/components/layout/AppShell";
import { liveLanguages } from "@/data/live-languages";
import { supabase } from "@/integrations/supabase/client";
import { translateText } from "@/lib/translate.functions";
import { liveService, type LiveMessage } from "@/lib/live.service";

const searchSchema = z.object({ lang: z.string().optional() });

export const Route = createFileRoute("/app/live/watch/$code")({
  validateSearch: searchSchema,
  loader: async ({ params }) => {
    const liveClass = await liveService.getByCode(params.code);
    if (!liveClass) throw notFound();
    return { liveClass };
  },
  component: WatchClassPage,
});

type DisplayMessage = LiveMessage & { translated?: string; translating?: boolean; error?: string };

function WatchClassPage() {
  const { liveClass } = Route.useLoaderData();
  const { lang } = Route.useSearch();
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [status, setStatus] = useState("Connecting to the classroom...");
  const [error, setError] = useState<string | null>(null);
  const seenRef = useRef(new Set<string>());
  const translatingRef = useRef(new Set<string>());
  const spokenRef = useRef(new Set<string>());
  const selected = liveLanguages.find((item) => item.id === lang);

  useEffect(() => {
    if (!selected) {
      setError("Choose a valid mother tongue from the join page.");
      return;
    }
    let active = true;
    const addMessage = (message: LiveMessage, shouldSpeak = true) => {
      if (!active || seenRef.current.has(message.id)) return;
      seenRef.current.add(message.id);
      setMessages((current) => [...current, { ...message, translating: true }]);
      if (translatingRef.current.has(message.id)) return;
      translatingRef.current.add(message.id);
      void translateText({ data: { text: message.source_text, from: message.source_lang, to: selected.id } })
        .then(({ text }) => {
          if (!active) return;
          setMessages((current) => current.map((item) => item.id === message.id ? { ...item, translated: text, translating: false } : item));
          if (shouldSpeak && !spokenRef.current.has(message.id) && "speechSynthesis" in window) {
            spokenRef.current.add(message.id);
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = selected.bcp47;
            window.speechSynthesis.speak(utterance);
          }
        })
        .catch((translationError) => {
          if (!active) return;
          setMessages((current) => current.map((item) => item.id === message.id ? { ...item, translating: false, error: translationError instanceof Error ? translationError.message : "Translation failed." } : item));
        });
    };
    void liveService.listMessages(liveClass.id).then((existing) => existing.forEach((message) => addMessage(message, false))).catch(() => setError("Could not load the classroom transcript."));
    const channel = supabase.channel(`live-class-${liveClass.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "live_messages", filter: `class_id=eq.${liveClass.id}` }, (payload) => addMessage(payload.new as LiveMessage))
      .subscribe((subscriptionStatus) => {
        if (subscriptionStatus === "SUBSCRIBED") setStatus("Connected live");
        if (subscriptionStatus === "CHANNEL_ERROR" || subscriptionStatus === "TIMED_OUT") setError("Live connection was interrupted. Refresh to reconnect.");
      });
    return () => {
      active = false;
      void supabase.removeChannel(channel);
      window.speechSynthesis?.cancel();
    };
  }, [liveClass.id, selected]);

  return (
    <AppShell>
      <main className="px-4 py-8 sm:px-6 lg:px-8"><div className="mx-auto w-full max-w-3xl">
        <div className="flex items-start justify-between gap-4"><div><p className="text-sm text-muted-foreground">Live classroom · {liveClass.code}</p><h1 className="mt-1 text-2xl font-bold tracking-tight">{liveClass.name}</h1><p className="mt-1 text-sm text-muted-foreground">{liveClass.subject} · Hearing in {selected?.label ?? "unknown language"}</p></div><span className="flex shrink-0 items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary"><Radio className="size-3.5" /> {status}</span></div>
        {error && <div className="mt-6 flex gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"><AlertCircle className="size-4 shrink-0" /> {error}</div>}
        <section className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-card"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-accent/10 text-accent"><Headphones className="size-5" /></span><div><h2 className="font-semibold">Teacher transcript</h2><p className="text-sm text-muted-foreground">Translations are read aloud as they arrive.</p></div></div><div className="mt-5 space-y-4">{messages.length === 0 ? <p className="text-sm text-muted-foreground">Waiting for the teacher to speak...</p> : messages.map((message) => <article key={message.id} className="border-t border-border pt-4 first:border-t-0 first:pt-0"><p className="text-sm text-muted-foreground">{message.source_text}</p><p className="mt-1 flex items-start gap-2 text-base font-medium">{message.translated ?? (message.translating ? "Translating..." : message.error)}{message.translated && <Volume2 className="mt-0.5 size-4 shrink-0 text-primary" />}</p></article>)}</div></section>
      </div></main>
    </AppShell>
  );
}