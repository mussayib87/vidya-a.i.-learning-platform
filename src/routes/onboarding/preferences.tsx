import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useApp } from "@/hooks/useApp";
import { learningGoals, studyTimes, difficultyLevels, learningStyles } from "@/data/catalog";

export const Route = createFileRoute("/onboarding/preferences")({
  head: () => ({
    meta: [
      { title: "Learning preferences — Vidya A.I." },
      { name: "description", content: "Set your learning goals, study time and preferences on Vidya A.I." },
      { property: "og:title", content: "Learning preferences — Vidya A.I." },
      { property: "og:description", content: "Set your learning goals, study time and preferences on Vidya A.I." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PreferencesStep,
});

function PreferencesStep() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useApp();

  function toggleGoal(id: string) {
    const next = new Set(profile.goals);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    updateProfile({ goals: Array.from(next) });
  }

  function allSelected() {
    return (
      profile.dailyMinutes &&
      profile.difficulty &&
      profile.learningStyle &&
      profile.goals.length > 0
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-accent-soft text-accent">
          <Target className="size-6" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-foreground">Your learning preferences</h2>
        <p className="mt-1 text-sm text-muted-foreground">This helps us personalize your experience.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-base font-medium">Learning goals</Label>
          <div className="grid gap-2">
            {learningGoals.map((goal) => (
              <div key={goal.id} className="flex items-center gap-3">
                <Checkbox
                  id={goal.id}
                  checked={profile.goals.includes(goal.id)}
                  onCheckedChange={() => toggleGoal(goal.id)}
                />
                <Label htmlFor={goal.id} className="cursor-pointer text-sm font-normal">
                  {goal.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-medium">Daily study time</Label>
          <RadioGroup
            value={profile.dailyMinutes}
            onValueChange={(value) => updateProfile({ dailyMinutes: value })}
            className="grid gap-2 sm:grid-cols-2"
          >
            {studyTimes.map((time) => (
              <div key={time.id}>
                <RadioGroupItem value={time.id} id={`time-${time.id}`} className="peer sr-only" />
                <Label
                  htmlFor={`time-${time.id}`}
                  className="block cursor-pointer rounded-xl border border-border bg-background p-3 text-center text-sm transition-colors hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary-soft"
                >
                  {time.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-medium">Difficulty preference</Label>
          <RadioGroup
            value={profile.difficulty}
            onValueChange={(value) => updateProfile({ difficulty: value })}
            className="grid gap-2"
          >
            {difficultyLevels.map((level) => (
              <div key={level.id}>
                <RadioGroupItem value={level.id} id={`diff-${level.id}`} className="peer sr-only" />
                <Label
                  htmlFor={`diff-${level.id}`}
                  className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-background p-4 transition-colors hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary-soft"
                >
                  <span className="font-medium text-foreground">{level.label}</span>
                  <span className="text-xs text-muted-foreground">{level.hint}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-medium">Preferred learning style</Label>
          <RadioGroup
            value={profile.learningStyle}
            onValueChange={(value) => updateProfile({ learningStyle: value })}
            className="grid gap-2 sm:grid-cols-2"
          >
            {learningStyles.map((style) => (
              <div key={style.id}>
                <RadioGroupItem value={style.id} id={`style-${style.id}`} className="peer sr-only" />
                <Label
                  htmlFor={`style-${style.id}`}
                  className="flex cursor-pointer flex-col rounded-xl border border-border bg-background p-4 text-center transition-colors hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary-soft"
                >
                  <span className="font-medium text-foreground">{style.label}</span>
                  <span className="text-xs text-muted-foreground">{style.hint}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <Button variant="outline" className="flex-1" asChild>
          <Link to="/onboarding/subjects">
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Link>
        </Button>
        <Button className="group flex-1" disabled={!allSelected()} onClick={() => navigate({ to: "/onboarding/review" })}>
          Review
          <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}
