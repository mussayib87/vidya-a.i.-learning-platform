import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, PartyPopper } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useApp } from "@/hooks/useApp";

export const Route = createFileRoute("/onboarding/complete")({
  head: () => ({
    meta: [
      { title: "Setup complete — Vidya A.I." },
      { name: "description", content: "Your Vidya A.I. learning profile is ready." },
      { property: "og:title", content: "Setup complete — Vidya A.I." },
      { property: "og:description", content: "Your Vidya A.I. learning profile is ready." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CompleteStep,
});

function CompleteStep() {
  const { updateProfile } = useApp();

  function finish() {
    updateProfile({ onboardingComplete: true });
  }

  return (
    <div className="text-center">
      <div className="mx-auto grid size-16 place-items-center rounded-full bg-success/15 text-success">
        <PartyPopper className="size-8" />
      </div>
      <h2 className="mt-6 text-2xl font-bold text-foreground md:text-3xl">You&apos;re all set!</h2>
      <p className="mt-3 text-muted-foreground">
        Your profile has been created. Let&apos;s start learning in your language, your way.
      </p>
      <Button className="mt-8 group w-full" asChild>
        <Link to="/app/dashboard" onClick={finish}>
          Go to dashboard
          <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </Button>
    </div>
  );
}
