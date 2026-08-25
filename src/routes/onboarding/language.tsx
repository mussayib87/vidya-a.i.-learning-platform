import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useApp } from "@/hooks/useApp";
import { languages } from "@/data/catalog";

export const Route = createFileRoute("/onboarding/language")({
  head: () => ({
    meta: [
      { title: "Select language — Vidya A.I." },
      { name: "description", content: "Choose your preferred learning language on Vidya A.I." },
      { property: "og:title", content: "Select language — Vidya A.I." },
      { property: "og:description", content: "Choose your preferred learning language on Vidya A.I." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LanguageStep,
});

function LanguageStep() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useApp();
  const selected = profile.language;

  function setLanguage(value: string) {
    updateProfile({ language: value });
  }

  function handleNext() {
    navigate({ to: "/onboarding/subjects" });
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-accent-soft text-accent">
          <Languages className="size-6" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-foreground">What language do you learn best in?</h2>
        <p className="mt-1 text-sm text-muted-foreground">You can switch languages anytime.</p>
      </div>

      <RadioGroup value={selected} onValueChange={setLanguage} className="grid gap-3 sm:grid-cols-2">
        {languages.map((language) => (
          <div key={language.id}>
            <RadioGroupItem value={language.id} id={language.id} className="peer sr-only" />
            <Label
              htmlFor={language.id}
              className="flex cursor-pointer flex-col items-center rounded-xl border border-border bg-background p-4 text-center transition-colors hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary-soft"
            >
              <span className="text-lg font-semibold text-foreground">{language.native}</span>
              <span className="text-xs text-muted-foreground">{language.label}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <div className="mt-8 flex gap-3">
        <Button variant="outline" className="flex-1" asChild>
          <Link to="/onboarding/class">
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
