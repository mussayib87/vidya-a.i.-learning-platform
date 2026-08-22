import { Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { ArrowRight } from "lucide-react";
import type { Subject } from "@/data/subjects";
import { ProgressBar } from "./ProgressBar";
import { Button } from "@/components/ui/button";

export function SubjectCard({
  subject,
  progress,
  completed,
  pending,
}: {
  subject: Subject;
  progress: number;
  completed: number;
  pending: number;
}) {
  const Icon =
    (Icons as unknown as Record<string, Icons.LucideIcon>)[subject.icon] ??
    Icons.BookOpen;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-float">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-soft text-primary">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <h3 className="truncate font-semibold">{subject.name}</h3>
          <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
            {subject.description}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-semibold">{Math.round(progress)}%</span>
        </div>
        <ProgressBar value={progress} size="sm" />
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Icons.CheckCircle2 className="size-3.5 text-success" />
          {completed} completed
        </span>
        <span className="inline-flex items-center gap-1">
          <Icons.Clock className="size-3.5" />
          {pending} pending
        </span>
      </div>

      <Button asChild className="mt-5 w-full rounded-xl">
        <Link to="/app/subjects/$subjectId" params={{ subjectId: subject.id }}>
          Continue <ArrowRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
}
