import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useApp } from "@/hooks/useApp";
import { classLevels, languages, labelFor, learningGoals, studyTimes, difficultyLevels, learningStyles } from "@/data/catalog";
import { subjects } from "@/data/subjects";

export const Route = createFileRoute("/onboarding/review")({
  head: () => ({
    meta: [
      { title: "Review profile — Vidya A.I." },
      { name: "description", content: "Review your learning profile before starting with Vidya A.I." },
      { property: "og:title", content: "Review profile — Vidya A.I." },
      { property: "og:description", content: "Review your learning profile before starting with Vidya A.I." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReviewStep,
});

function ReviewItem({ label, value, to }: { label: string; value: string; to: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-background p-4">
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground">{value}</p>
      </div>
      <Button variant="ghost" size="sm" asChild>
        <Link to={to} className="inline-flex items-center gap-1.5">
          <Pencil className="size-3.5" />
          Edit
        </Link>
      </Button>
    </div>
  );
}

function ReviewStep() {
  const navigate = useNavigate();
  const { profile } = useApp();

  const subjectNames = subjects
    .filter((s) => profile.subjects.includes(s.id))
    .map((s) => s.name)
    .join(", ") || "No subjects selected";

  const goalLabels = learningGoals
    .filter((g) => profile.goals.includes(g.id))
    .map((g) => g.label)
    .join(", ") || "No goals selected";

  return (
    <div>
      <div className="mb-6 text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="size-6" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-foreground">Review your profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">Make sure everything looks right.</p>
      </div>

      <div className="space-y-3">
        <ReviewItem label="Class / level" value={labelFor(classLevels, profile.classLevel)} to="/onboarding/class" />
        <ReviewItem label="Preferred language" value={labelFor(languages, profile.language)} to="/onboarding/language" />
        <ReviewItem label="Subjects" value={subjectNames} to="/onboarding/subjects" />
        <ReviewItem label="Learning goals" value={goalLabels} to="/onboarding/preferences" />
        <ReviewItem label="Daily study time" value={labelFor(studyTimes, profile.dailyMinutes)} to="/onboarding/preferences" />
        <ReviewItem label="Difficulty" value={labelFor(difficultyLevels, profile.difficulty)} to="/onboarding/preferences" />
        <ReviewItem label="Learning style" value={labelFor(learningStyles, profile.learningStyle)} to="/onboarding/preferences" />
      </div>

      <div className="mt-8 flex gap-3">
        <Button variant="outline" className="flex-1" asChild>
          <Link to="/onboarding/preferences">
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Link>
        </Button>
        <Button className="group flex-1" onClick={() => navigate({ to: "/onboarding/complete" })}>
          Confirm
          <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}
