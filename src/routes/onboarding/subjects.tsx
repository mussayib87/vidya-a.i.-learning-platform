import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BookOpen, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useApp } from "@/hooks/useApp";
import { subjects } from "@/data/subjects";

export const Route = createFileRoute("/onboarding/subjects")({
  head: () => ({
    meta: [
      { title: "Select subjects — Vidya A.I." },
      { name: "description", content: "Choose the subjects you want to study on Vidya A.I." },
      { property: "og:title", content: "Select subjects — Vidya A.I." },
      { property: "og:description", content: "Choose the subjects you want to study on Vidya A.I." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SubjectsStep,
});

function SubjectsStep() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useApp();
  const selected = new Set(profile.subjects);

  function toggleSubject(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    updateProfile({ subjects: Array.from(next) });
  }

  function handleNext() {
    navigate({ to: "/onboarding/preferences" });
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-primary-soft text-primary">
          <BookOpen className="size-6" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-foreground">Pick your subjects</h2>
        <p className="mt-1 text-sm text-muted-foreground">Select at least one subject to study.</p>
      </div>

      <div className="grid gap-3">
        {subjects.map((subject) => {
          const isSelected = selected.has(subject.id);
          return (
            <button
              key={subject.id}
              type="button"
              onClick={() => toggleSubject(subject.id)}
              className={`flex items-center justify-between rounded-xl border p-4 text-left transition-colors ${
                isSelected
                  ? "border-primary bg-primary-soft"
                  : "border-border bg-background hover:bg-muted"
              }`}
            >
              <div>
                <p className="font-medium text-foreground">{subject.name}</p>
                <p className="text-xs text-muted-foreground">{subject.description}</p>
              </div>
              {isSelected && <Check className="size-5 text-primary" />}
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex gap-3">
        <Button variant="outline" className="flex-1" asChild>
          <Link to="/onboarding/language">
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Link>
        </Button>
        <Button className="group flex-1" disabled={selected.size === 0} onClick={handleNext}>
          Next
          <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}
