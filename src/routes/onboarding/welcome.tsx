import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/onboarding/welcome")({
  head: () => ({
    meta: [
      { title: "Welcome — Vidya A.I." },
      { name: "description", content: "Welcome to Vidya A.I. Set up your learning profile in a few steps." },
      { property: "og:title", content: "Welcome — Vidya A.I." },
      { property: "og:description", content: "Set up your learning profile in a few steps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WelcomeStep,
});

function WelcomeStep() {
  return (
    <div className="text-center">
      <div className="mx-auto grid size-16 place-items-center rounded-full bg-accent-soft text-accent">
        <Sparkles className="size-8" />
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
        Welcome to Vidya A.I.
      </h1>
      <p className="mt-3 text-muted-foreground">
        Let&apos;s build your personalized learning profile in the next few steps. You can always change these later in settings.
      </p>
      <Button className="mt-8 group w-full" asChild>
        <Link to="/onboarding/class">
          Get started
          <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </Button>
    </div>
  );
}
