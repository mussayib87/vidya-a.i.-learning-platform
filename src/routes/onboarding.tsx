import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingLayout,
});

const steps = [
  { path: "/onboarding/welcome", label: "Welcome" },
  { path: "/onboarding/class", label: "Class" },
  { path: "/onboarding/language", label: "Language" },
  { path: "/onboarding/subjects", label: "Subjects" },
  { path: "/onboarding/preferences", label: "Preferences" },
  { path: "/onboarding/review", label: "Review" },
  { path: "/onboarding/complete", label: "Complete" },
];

function OnboardingLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const currentIndex = steps.findIndex((s) => s.path === pathname);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;
  const progress = Math.round(((activeIndex + 1) / steps.length) * 100);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-soft px-4 py-12">
      <div className="mb-8 inline-flex items-center gap-2">
        <span className="grid size-10 place-items-center rounded-xl bg-gradient-brand text-primary-foreground shadow-float">
          <GraduationCap className="size-5" />
        </span>
        <span className="text-xl font-extrabold tracking-tight">
          Vidya <span className="text-gradient-brand">A.I.</span>
        </span>
      </div>

      <div className="w-full max-w-xl">
        <div className="mb-6">
          <div className="mb-2 flex justify-between text-xs font-medium text-muted-foreground">
            <span>Step {activeIndex + 1} of {steps.length}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-brand transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-float md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
