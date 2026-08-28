import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { aiTutors } from "@/data/ai-tutors";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/layout/AppShell";
import { ArrowRight, Sparkle } from "lucide-react";

export const Route = createFileRoute("/app/tutor")({
  head: () => ({
    meta: [
      { title: "Choose Your AI Tutor — Vidya A.I." },
      {
        name: "description",
        content: "Choose your personal learning companion from 5 expert AI tutors specialized in different subjects.",
      },
      { property: "og:title", content: "Choose Your AI Tutor — Vidya A.I." },
      {
        property: "og:description",
        content: "Get personalized tutoring from expert AI tutors in multiple languages.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TutorSelectionPage,
});

function TutorSelectionPage() {
  const navigate = useNavigate();

  const handleStartLearning = (tutorId: string) => {
    void navigate({
      to: "/app/tutor/session",
      search: { tutorId },
    });
  };

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Sparkle className="size-6 text-primary" />
            <span className="text-sm font-semibold text-primary">AI Tutors</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Choose Your Personal Learning Companion
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Pick from 5 expert AI tutors, each specialized in different subjects with unique teaching styles.
          </p>
        </div>

        {/* Tutor Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {aiTutors.map((tutor) => (
            <TutorCard
              key={tutor.id}
              tutor={tutor}
              onStartLearning={() => handleStartLearning(tutor.id)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 p-8 text-center">
          <h2 className="text-xl font-semibold">Start Learning Today</h2>
          <p className="mt-2 text-muted-foreground">
            Choose a tutor above and begin your personalized learning journey.
          </p>
        </div>
      </main>
    </AppShell>
  );
}

function TutorCard({
  tutor,
  onStartLearning,
}: {
  tutor: typeof aiTutors[0];
  onStartLearning: () => void;
}) {
  return (
    <div className="group relative rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-lg hover:border-primary/50">
      {/* Background gradient */}
      <div
        className={`absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-5 bg-gradient-to-br ${tutor.avatarBg}`}
        aria-hidden="true"
      />

      <div className="relative">
        {/* Avatar */}
        <div className={`mb-4 inline-flex items-center justify-center rounded-full w-16 h-16 bg-gradient-to-br ${tutor.avatarBg} text-white text-2xl font-bold`}>
          {tutor.name[0]}
        </div>

        {/* Tutor Info */}
        <h3 className="text-xl font-bold">{tutor.name}</h3>
        <p className="text-sm text-primary font-medium">{tutor.role}</p>

        {/* Specialization */}
        <div className="mt-3 space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Specialization
          </p>
          <p className="text-sm text-foreground">{tutor.specialization}</p>
        </div>

        {/* Personality & Teaching Style */}
        <div className="mt-4 space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Teaching Approach
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {tutor.personality}
          </p>
        </div>

        {/* Subjects */}
        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Subjects
          </p>
          <div className="flex flex-wrap gap-2">
            {tutor.subjects.slice(0, 3).map((subject) => (
              <span
                key={subject}
                className="rounded-full bg-muted px-3 py-1 text-xs text-foreground capitalize"
              >
                {subject.replace("-", " ")}
              </span>
            ))}
            {tutor.subjects.length > 3 && (
              <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                +{tutor.subjects.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Languages */}
        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Languages
          </p>
          <div className="flex flex-wrap gap-2">
            {tutor.supportedLanguages.slice(0, 3).map((lang) => (
              <span
                key={lang}
                className="text-xs text-muted-foreground capitalize"
              >
                {lang.toUpperCase()}
              </span>
            ))}
            {tutor.supportedLanguages.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{tutor.supportedLanguages.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="mt-4 flex items-center gap-2">
          <span className="inline-block size-2 rounded-full bg-green-500" />
          <span className="text-sm font-medium text-green-600">Ready to teach</span>
        </div>

        {/* CTA Button */}
        <Button
          onClick={onStartLearning}
          className="mt-6 w-full rounded-lg group/btn"
        >
          Start Learning{" "}
          <ArrowRight className="ml-2 size-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}
