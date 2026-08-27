import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Flame, GraduationCap, LogIn, Radio, Target, Timer } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/ui-kit/StatCard";
import { ProgressBar } from "@/components/ui-kit/ProgressBar";
import { LessonCard } from "@/components/ui-kit/LessonCard";
import { recentActivity, studyStats, upcomingTasks } from "@/data/dashboard";
import { getSubject, lessons } from "@/data/subjects";
import { useApp } from "@/hooks/useApp";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Vidya A.I." },
      {
        name: "description",
        content:
          "See your streak, daily goal, upcoming tasks and recommended lessons in your Vidya A.I. dashboard.",
      },
      { property: "og:title", content: "Dashboard — Vidya A.I." },
      {
        property: "og:description",
        content: "Your streak, daily goal, tasks and recommended lessons.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { profile, user, completedLessons } = useApp();
  const recommended = lessons
    .filter((l) => !completedLessons.includes(l.id))
    .slice(0, 4);
  const goalPercent =
    (studyStats.minutesToday / studyStats.dailyGoalMinutes) * 100;

  return (
    <AppShell>
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {profile.name || user?.name || "Student"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here's where you left off. Keep the streak alive.
        </p>

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link to="/app/live/create" className="group rounded-2xl border border-primary/20 bg-primary-soft p-5 transition-colors hover:border-primary/40">
            <Radio className="size-5 text-primary" />
            <h2 className="mt-4 font-semibold">Create a live class</h2>
            <p className="mt-1 text-sm text-muted-foreground">Teach students in their own language.</p>
            <span className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary">Start creating <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
          </Link>
          <Link to="/app/live/join" className="group rounded-2xl border border-border bg-card p-5 shadow-card transition-colors hover:border-accent/40">
            <LogIn className="size-5 text-accent" />
            <h2 className="mt-4 font-semibold">Join a live class</h2>
            <p className="mt-1 text-sm text-muted-foreground">Follow your teacher in your mother tongue.</p>
            <span className="mt-4 flex items-center gap-2 text-sm font-semibold text-accent">Enter class code <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
          </Link>
        </section>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Flame}
            label="Current streak"
            value={`${studyStats.streak} days`}
            hint="Study today to keep it going"
            accent="warning"
          />
          <StatCard
            icon={Timer}
            label="Minutes today"
            value={`${studyStats.minutesToday} / ${studyStats.dailyGoalMinutes}`}
            hint="Daily goal"
          />
          <StatCard
            icon={GraduationCap}
            label="Lessons completed"
            value={`${completedLessons.length || studyStats.lessonsCompleted}`}
            hint={`out of ${studyStats.totalLessons} lessons`}
            accent="success"
          />
          <StatCard
            icon={Target}
            label="Hours this week"
            value={`${studyStats.hoursThisWeek}h`}
            hint="Across all subjects"
            accent="accent"
          />
        </div>

        <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Today's goal</h2>
            <span className="text-sm text-muted-foreground">
              {studyStats.minutesToday} of {studyStats.dailyGoalMinutes} min
            </span>
          </div>
          <ProgressBar className="mt-3" value={goalPercent} />
        </section>

        <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-3">
          <section className="min-w-0 lg:col-span-2">

            <h2 className="font-semibold">Recommended lessons</h2>
            <div className="mt-3 space-y-3">
              {recommended.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  subjectName={getSubject(lesson.subjectId)?.name}
                  completed={completedLessons.includes(lesson.id)}
                />
              ))}
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <h2 className="font-semibold">Upcoming</h2>
              <ul className="mt-3 space-y-3">
                {upcomingTasks.map((task) => (
                  <li key={task.id}>
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {task.subject} · {task.due}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <h2 className="font-semibold">Recent activity</h2>
              <ul className="mt-3 space-y-3">
                {recentActivity.slice(0, 4).map((item) => (
                  <li key={item.id}>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.detail} · {item.time}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
