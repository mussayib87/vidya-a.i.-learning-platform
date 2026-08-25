import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { classLevels, languages, difficultyLevels } from "@/data/catalog";
import { subjects } from "@/data/subjects";
import { useApp } from "@/hooks/useApp";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/app/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Vidya A.I." },
      {
        name: "description",
        content:
          "Update your name, class, learning language, subjects and notification preferences on Vidya A.I.",
      },
      { property: "og:title", content: "Profile — Vidya A.I." },
      {
        property: "og:description",
        content: "Manage your learning preferences and notifications.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, updateProfile } = useApp();

  const toggleSubject = (id: string) => {
    const next = profile.subjects.includes(id)
      ? profile.subjects.filter((s) => s !== id)
      : [...profile.subjects, id];
    updateProfile({ subjects: next });
  };

  return (
    <AppShell>
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="mt-1 text-muted-foreground">
          Your details and learning preferences.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h2 className="font-semibold">Account</h2>
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  className="mt-1.5"
                  value={profile.name}
                  onChange={(e) => updateProfile({ name: e.target.value })}
                  placeholder="Your name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  className="mt-1.5"
                  value={profile.email}
                  onChange={(e) => updateProfile({ email: e.target.value })}
                  placeholder="you@example.com"
                />
              </div>
              <Button
                className="rounded-xl"
                onClick={() => toast.success("Profile saved")}
              >
                Save changes
              </Button>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h2 className="font-semibold">Learning preferences</h2>
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="class">Class</Label>
                <select
                  id="class"
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                  value={profile.classLevel ?? ""}
                  onChange={(e) =>
                    updateProfile({ classLevel: e.target.value || null })
                  }
                >
                  <option value="">Select a class</option>
                  {classLevels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="language">Learning language</Label>
                <select
                  id="language"
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                  value={profile.language}
                  onChange={(e) => updateProfile({ language: e.target.value })}
                >
                  {languages.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.label} · {lang.native}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <select
                  id="difficulty"
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                  value={profile.difficulty}
                  onChange={(e) =>
                    updateProfile({ difficulty: e.target.value })
                  }
                >
                  {difficultyLevels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h2 className="font-semibold">Subjects you follow</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {subjects.map((subject) => {
                const active = profile.subjects.includes(subject.id);
                return (
                  <button
                    key={subject.id}
                    type="button"
                    onClick={() => toggleSubject(subject.id)}
                    aria-pressed={active}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm transition-colors",
                      active
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-border text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {subject.name}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h2 className="font-semibold">Notifications</h2>
            <div className="mt-4 space-y-4">
              {(
                [
                  ["dailyReminder", "Daily study reminder"],
                  ["weeklyReport", "Weekly progress report"],
                  ["achievements", "Achievement unlocked alerts"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <Label htmlFor={key} className="font-normal">
                    {label}
                  </Label>
                  <Switch
                    id={key}
                    checked={profile.notifications[key]}
                    onCheckedChange={(checked) =>
                      updateProfile({
                        notifications: {
                          ...profile.notifications,
                          [key]: checked,
                        },
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </AppShell>
  );
}
