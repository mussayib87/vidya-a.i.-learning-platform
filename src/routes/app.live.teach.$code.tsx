import { useEffect, useRef, useState } from "react";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Mic, MicOff, Radio, Square } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { liveLanguage } from "@/data/live-languages";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { liveService } from "@/lib/live.service";

export const Route = createFileRoute("/app/live/teach/$code")({
  loader: async ({ params }) => {
    const liveClass = await liveService.getByCode(params.code);
    if (!liveClass) throw notFound();
    return { liveClass };
  },
  component: TeachClassPage,
});

function TeachClassPage() {
  const { liveClass } = Route.useLoaderData();
  const navigate = useNavigate();
  const [isLive, setIsLive] = useState(liveClass.is_live);
  const [messages, setMessages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const postingRef = useRef(Promise.resolve());
  const language = liveLanguage(liveClass.teacher_lang);

  const onFinal = (text: string) => {
    setMessages((current) => [...current, text]);
    postingRef.current = postingRef.current
      .then(() => liveService.postMessage(liveClass.id, text, liveClass.teacher_lang))
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Could not share that sentence.");
      });
  };

  const speech = useSpeechRecognition({ lang: language.bcp47, onFinal });

  useEffect(() => {
    if (speech.error) toast.error(speech.error);
  }, [speech.error]);

  const startClass = async () => {
    setSaving(true);
    try {
      await liveService.setLive(liveClass.id, true);
      setIsLive(true);
      await speech.start();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not start the live class.");
    } finally {
      setSaving(false);
    }
  };

  const endClass = async () => {
    speech.stop();
    setSaving(true);
    try {
      await liveService.setLive(liveClass.id, false);
      setIsLive(false);
      toast.success("Live class ended");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not end the class.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Live classroom · {liveClass.code}</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">{liveClass.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{liveClass.subject} · {liveClass.grade} · Teaching in {language.label}</p>
            </div>
            <span className="flex shrink-0 items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary"><Radio className="size-3.5" /> {isLive ? "Live" : "Ready"}</span>
          </div>
          <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex flex-col items-center py-8 text-center">
              <span className="grid size-20 place-items-center rounded-full bg-primary-soft text-primary">{speech.listening ? <Mic className="size-8" /> : <MicOff className="size-8" />}</span>
              <p className="mt-5 text-lg font-semibold">{speech.listening ? "Listening for your lesson" : "Microphone is off"}</p>
              <p className="mt-2 min-h-6 max-w-xl text-sm text-muted-foreground">{speech.interim || "Final sentences will appear here and be shared with students."}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {isLive ? <><Button variant="outline" className="rounded-xl" onClick={() => (speech.listening ? speech.stop() : void speech.start())} disabled={saving}><Mic className="size-4" /> {speech.listening ? "Stop microphone" : "Start microphone"}</Button><Button variant="destructive" className="rounded-xl" onClick={endClass} disabled={saving}><Square className="size-4" /> End live class</Button></> : <Button className="rounded-xl" onClick={startClass} disabled={saving}><Radio className="size-4" /> Start live class</Button>}
              </div>
            </div>
          </section>
          <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between"><h2 className="font-semibold">Live transcript</h2><span className="text-xs text-muted-foreground">{messages.length} shared</span></div>
            <div className="mt-4 space-y-3">{messages.length === 0 ? <p className="text-sm text-muted-foreground">Start speaking to share your first sentence.</p> : messages.map((message, index) => <p key={`${index}-${message}`} className="flex gap-2 text-sm leading-relaxed"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" /> {message}</p>)}</div>
          </section>
          <Button variant="ghost" className="mt-4" onClick={() => navigate({ to: "/app/dashboard" })}>Return to dashboard</Button>
        </div>
      </main>
    </AppShell>
  );
}