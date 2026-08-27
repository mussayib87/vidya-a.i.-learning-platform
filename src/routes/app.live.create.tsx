import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Copy, Radio, Sparkles } from "lucide-react";
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
import { liveGrades, liveLanguages, liveSubjects } from "@/data/live-languages";
import { liveService, type LiveClass } from "@/lib/live.service";
import { useApp } from "@/hooks/useApp";

export const Route = createFileRoute("/app/live/create")({
  head: () => ({
    meta: [
      { title: "Create a live class — Vidya A.I." },
      {
        name: "description",
        content:
          "Set up a Vidya A.I. live classroom: pick your speaking language, class, and subject, then share the class code with students.",
      },
      { property: "og:title", content: "Create a live class — Vidya A.I." },
      {
        property: "og:description",
        content: "Start a live, real-time translated classroom in your own language.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CreateClassPage,
});

function CreateClassPage() {
  const navigate = useNavigate();
  const { profile, user } = useApp();
  const [name, setName] = useState("");
  const [subject, setSubject] = useState(liveSubjects[0]!);
  const [grade, setGrade] = useState("class-10");
  const [teacherLang, setTeacherLang] = useState("en");
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState<LiveClass | null>(null);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Please give the class a name.");
      return;
    }
    setSaving(true);
    try {
      const cls = await liveService.createClass({
        name: name.trim(),
        subject,
        grade,
        teacherLang,
        teacherName: profile.name || user?.name || null,
      });
      setCreated(cls);
      toast.success("Class created");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create the class.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-primary-soft text-primary">
              <Radio className="size-5" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Create a live class</h1>
              <p className="text-sm text-muted-foreground">
                Teach in your language. Students hear it in theirs.
              </p>
            </div>
          </div>

          {created ? (
            <section className="mt-8 rounded-2xl border border-border bg-card p-6 text-center shadow-card">
              <p className="text-sm text-muted-foreground">Your Class Code</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-primary">
                {created.code}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {created.name} · {created.subject} ·{" "}
                {liveGrades.find((g) => g.id === created.grade)?.label}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(created.code);
                      toast.success("Class code copied");
                    } catch {
                      toast.error("Copy failed — note the code down manually.");
                    }
                  }}
                >
                  <Copy className="size-4" /> Copy code
                </Button>
                <Button
                  className="rounded-xl"
                  onClick={() =>
                    navigate({
                      to: "/app/live/teach/$code",
                      params: { code: created.code },
                    })
                  }
                >
                  <Sparkles className="size-4" /> Start Live Class
                </Button>
              </div>
            </section>
          ) : (
            <section className="mt-8 space-y-5 rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="space-y-2">
                <Label htmlFor="class-name">Class name</Label>
                <Input
                  id="class-name"
                  value={name}
                  placeholder="e.g. Morning Science Batch"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Your speaking language</Label>
                <Select value={teacherLang} onValueChange={setTeacherLang}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {liveLanguages.map((lang) => (
                      <SelectItem key={lang.id} value={lang.id}>
                        {lang.label} — {lang.native}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Class / grade</Label>
                  <Select value={grade} onValueChange={setGrade}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {liveGrades.map((g) => (
                        <SelectItem key={g.id} value={g.id}>
                          {g.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {liveSubjects.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button className="w-full rounded-xl" disabled={saving} onClick={handleCreate}>
                {saving ? "Creating class…" : "Generate class code"}
              </Button>
            </section>
          )}
        </div>
      </main>
    </AppShell>
  );
}
