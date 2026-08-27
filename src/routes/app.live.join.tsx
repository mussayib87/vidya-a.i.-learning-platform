import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogIn } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { liveLanguages } from "@/data/live-languages";
import { liveService } from "@/lib/live.service";

export const Route = createFileRoute("/app/live/join")({
  head: () => ({
    meta: [
      { title: "Join a live class — Vidya A.I." },
      {
        name: "description",
        content:
          "Enter a Vidya A.I. class code and your mother tongue to join a live class and follow the teacher in your own language.",
      },
      { property: "og:title", content: "Join a live class — Vidya A.I." },
      {
        property: "og:description",
        content: "Follow any live class in your own mother tongue, in real time.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JoinClassPage,
});

function JoinClassPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [lang, setLang] = useState("hi");
  const [joining, setJoining] = useState(false);

  const handleJoin = async () => {
    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      toast.error("Enter the class code your teacher shared.");
      return;
    }
    setJoining(true);
    try {
      const cls = await liveService.getByCode(normalized);
      if (!cls) {
        toast.error("No class found with that code.");
        return;
      }
      if (!cls.is_live) {
        toast.error("This class has not started or has already ended.");
        return;
      }
      navigate({
        to: "/app/live/watch/$code",
        params: { code: cls.code },
        search: { lang },
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not join the class.");
    } finally {
      setJoining(false);
    }
  };

  return (
    <AppShell>
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-lg">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-accent/10 text-accent">
              <LogIn className="size-5" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Join a live class</h1>
              <p className="text-sm text-muted-foreground">
                Learn in your mother tongue, live.
              </p>
            </div>
          </div>

          <section className="mt-8 space-y-5 rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="space-y-2">
              <Label htmlFor="code">Class code</Label>
              <Input
                id="code"
                value={code}
                placeholder="VIDYA-1234"
                autoCapitalize="characters"
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleJoin();
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Your mother tongue</Label>
              <Select value={lang} onValueChange={setLang}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {liveLanguages.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.label} — {l.native}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full rounded-xl" disabled={joining} onClick={handleJoin}>
              {joining ? "Joining…" : "Join class"}
            </Button>
          </section>
        </div>
      </main>
    </AppShell>
  );
}
