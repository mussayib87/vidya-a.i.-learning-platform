import { createFileRoute } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ProgressBar } from "@/components/ui-kit/ProgressBar";
import {
  achievements,
  quizPerformance,
  studyStats,
  weeklyStudy,
} from "@/data/dashboard";
import { lessonsBySubject, subjects } from "@/data/subjects";
import { useApp } from "@/hooks/useApp";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/progress")({
  head: () => ({
    meta: [
      { title: "Progress — Vidya A.I." },
      {
        name: "description",
        content:
          "Track weekly study time, quiz scores, subject completion and achievements on Vidya A.I.",
      },
      { property: "og:title", content: "Progress — Vidya A.I." },
      {
        property: "og:description",
        content: "Weekly study time, quiz scores and achievements.",
      },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const { completedLessons } = useApp();
  const maxMinutes = Math.max(...weeklyStudy.map((d) => d.minutes));

  return (
    <AppShell>
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight">Progress</h1>
        <p className="mt-1 text-muted-foreground">
          {studyStats.hoursThisWeek} hours studied this week across your
          subjects.
        </p>

        <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-semibold">Study time this week</h2>
          <div className="mt-4 flex h-40 items-end gap-3">
            {weeklyStudy.map((day) => (
              <div key={day.day} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-gradient-brand"
                  style={{ height: `${(day.minutes / maxMinutes) * 100}%` }}
                  aria-label={`${day.day}: ${day.minutes} minutes`}
                />
                <span className="text-xs text-muted-foreground">{day.day}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h2 className="font-semibold">Subject completion</h2>
            <div className="mt-4 space-y-4">
              {subjects.map((subject) => {
                const subjectLessons = lessonsBySubject(subject.id);
                const done = subjectLessons.filter((l) =>
                  completedLessons.includes(l.id),
                ).length;
                const percent = subjectLessons.length
                  ? (done / subjectLessons.length) * 100
                  : 0;
                return (
                  <div key={subject.id}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span>{subject.name}</span>
                      <span className="text-muted-foreground">
                        {done}/{subjectLessons.length}
                      </span>
                    </div>
                    <ProgressBar value={percent} size="sm" />
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h2 className="font-semibold">Quiz performance</h2>
            <div className="mt-4 space-y-4">
              {quizPerformance.map((row) => (
                <div key={row.subject}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span>{row.subject}</span>
                    <span className="font-semibold">{row.score}%</span>
                  </div>
                  <ProgressBar value={row.score} size="sm" />
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-6">
          <h2 className="font-semibold">Achievements</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {achievements.map((item) => {
              const Icon =
                (Icons as unknown as Record<string, Icons.LucideIcon>)[
                  item.icon
                ] ?? Icons.Award;
              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-card",
                    !item.unlocked && "opacity-60",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-10 shrink-0 place-items-center rounded-xl",
                      item.unlocked
                        ? "bg-primary-soft text-primary"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </AppShell>
  );
}
