import { Link } from "@tanstack/react-router";
import { CheckCircle2, Clock, PlayCircle } from "lucide-react";
import type { Lesson } from "@/data/subjects";
import { cn } from "@/lib/utils";

export function LessonCard({
  lesson,
  subjectName,
  completed,
}: {
  lesson: Lesson;
  subjectName?: string;
  completed: boolean;
}) {
  return (
    <Link
      to="/app/lessons/$lessonId"
      params={{ lessonId: lesson.id }}
      className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-float"
    >
      <span
        className={cn(
          "grid size-11 shrink-0 place-items-center rounded-xl",
          completed
            ? "bg-success/15 text-success"
            : "bg-primary-soft text-primary",
        )}
      >
        {completed ? (
          <CheckCircle2 className="size-5" />
        ) : (
          <PlayCircle className="size-5" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="truncate font-semibold group-hover:text-primary">
            {lesson.title}
          </h4>
          {subjectName && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {subjectName}
            </span>
          )}
        </div>
        <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
          {lesson.summary}
        </p>
      </div>
      <span className="hidden shrink-0 items-center gap-1 text-xs text-muted-foreground sm:inline-flex">
        <Clock className="size-3.5" />
        {lesson.duration} min
      </span>
    </Link>
  );
}
