import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { SubjectCard } from "@/components/ui-kit/SubjectCard";
import { lessonsBySubject, subjects } from "@/data/subjects";
import { useApp } from "@/hooks/useApp";

export const Route = createFileRoute("/app/subjects/")({
  head: () => ({
    meta: [
      { title: "Subjects — Vidya A.I." },
      {
        name: "description",
        content:
          "Browse every Vidya A.I. subject, track your progress and jump back into the next lesson.",
      },
      { property: "og:title", content: "Subjects — Vidya A.I." },
      {
        property: "og:description",
        content: "Every subject, your progress and the next lesson to take.",
      },
    ],
  }),
  component: SubjectsPage,
});

function SubjectsPage() {
  const { completedLessons } = useApp();

  return (
    <AppShell>
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight">Subjects</h1>
        <p className="mt-1 text-muted-foreground">
          Pick a subject and continue where you left off.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {subjects.map((subject) => {
            const subjectLessons = lessonsBySubject(subject.id);
            const completed = subjectLessons.filter((l) =>
              completedLessons.includes(l.id),
            ).length;
            const total = subjectLessons.length;
            return (
              <SubjectCard
                key={subject.id}
                subject={subject}
                progress={total ? (completed / total) * 100 : 0}
                completed={completed}
                pending={total - completed}
              />
            );
          })}
        </div>
      </main>
    </AppShell>
  );
}
