import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, School } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useApp } from "@/hooks/useApp";
import { classLevels } from "@/data/catalog";

export const Route = createFileRoute("/onboarding/class")({
  head: () => ({
    meta: [
      { title: "Select class — Vidya A.I." },
      { name: "description", content: "Choose your class or grade level on Vidya A.I." },
      { property: "og:title", content: "Select class — Vidya A.I." },
      { property: "og:description", content: "Choose your class or grade level on Vidya A.I." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClassStep,
});

function ClassStep() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useApp();
  const selected = profile.classLevel ?? "";

  function setClass(value: string) {
    updateProfile({ classLevel: value });
  }

  function handleNext() {
    navigate({ to: "/onboarding/language" });
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-primary-soft text-primary">
          <School className="size-6" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-foreground">Which class or level are you in?</h2>
        <p className="mt-1 text-sm text-muted-foreground">We&apos;ll match content to your level.</p>
      </div>

      <RadioGroup value={selected} onValueChange={setClass} className="grid gap-3">
        {classLevels.map((level) => (
          <div key={level.id}>
            <RadioGroupItem value={level.id} id={level.id} className="peer sr-only" />
            <Label
              htmlFor={level.id}
              className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-background p-4 transition-colors hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary-soft"
            >
              <span className="font-medium text-foreground">{level.label}</span>
              <span className="text-xs text-muted-foreground">{level.group}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <div className="mt-8 flex gap-3">
        <Button variant="outline" className="flex-1" asChild>
          <Link to="/onboarding/welcome">
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Link>
        </Button>
        <Button className="group flex-1" disabled={!selected} onClick={handleNext}>
          Next
          <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}
