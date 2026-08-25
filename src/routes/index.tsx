import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bot,
  BookOpen,
  Languages,
  LineChart,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Headphones,
  Zap,
  Shield,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vidya A.I. — Learn in your language" },
      {
        name: "description",
        content:
          "AI-powered multilingual learning for students. Study in 13 Indian languages, get instant help from an AI tutor, track progress and reach your goals.",
      },
      { property: "og:title", content: "Vidya A.I. — Learn in your language" },
      {
        property: "og:description",
        content:
          "AI-powered multilingual learning for students. Study in 13 Indian languages, get instant help from an AI tutor, track progress and reach your goals.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

const features = [
  {
    icon: Languages,
    title: "Learn in your language",
    description:
      "Switch seamlessly between English, Hindi, Tamil, Telugu, Marathi, Bengali, Kannada, Malayalam, Gujarati, Punjabi, Odia, Assamese and Urdu.",
  },
  {
    icon: Bot,
    title: "AI tutor, always ready",
    description:
      "Ask doubts, get explanations, and explore concepts deeper with a tutor that adapts to your level and pace.",
  },
  {
    icon: Sparkles,
    title: "Personalized lessons",
    description:
      "Vidya A.I. tailizes content based on your class, goals, difficulty preference and learning style.",
  },
  {
    icon: LineChart,
    title: "Progress you can see",
    description:
      "Track weekly study time, completed lessons, quiz scores and streaks in a clear, visual dashboard.",
  },
  {
    icon: Headphones,
    title: "Voice-friendly learning",
    description:
      "Practice questions, listen to explanations and study hands-free with a voice-ready interface.",
  },
  {
    icon: Shield,
    title: "Safe student environment",
    description:
      "Built for students with a focused, distraction-free experience and no unnecessary data collection.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create your profile",
    description:
      "Sign up in seconds, pick your class, preferred language and the subjects you want to master.",
  },
  {
    number: "02",
    title: "Start learning",
    description:
      "Choose a lesson, read clear explanations, view examples and complete bite-sized quizzes.",
  },
  {
    number: "03",
    title: "Ask the AI tutor",
    description:
      "Stuck on a concept? Get instant answers, simpler explanations or translations in your language.",
  },
  {
    number: "04",
    title: "Track and grow",
    description:
      "Watch your streak, weekly study time and subject progress grow as you keep learning.",
  },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6 lg:px-8">
          <Logo showTagline />
          <div className="flex items-center gap-2 md:gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-16 pb-20 md:px-6 md:pt-24 md:pb-28 lg:px-8 lg:pt-32 lg:pb-36">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-soft opacity-40 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-card">
            <Sparkles className="size-4 text-accent" />
            <span>AI-powered learning for every student</span>
          </div>

          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Learn in your language. <br />
            <span className="text-gradient-brand">Learn your way.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Vidya A.I. is a multilingual learning platform that explains concepts, answers questions and tracks your progress in the language you think in.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild className="group min-w-[180px]">
              <Link to="/signup">
                Start learning
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="min-w-[180px]">
              <Link to="/login">Login</Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-success" />
              13 Indian languages
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-success" />
              AI tutor
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-success" />
              Progress tracking
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-success" />
              Personalized lessons
            </span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-secondary/30 px-4 py-20 md:px-6 md:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Everything you need to learn better
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A complete learning toolkit built around how students actually study.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-card transition-transform hover:-translate-y-0.5"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary">
                  <feature.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20 md:px-6 md:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              How Vidya A.I. works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Go from signup to confident learning in four simple steps.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative rounded-2xl border border-border bg-card p-6 shadow-card"
              >
                <span className="text-4xl font-extrabold text-primary/20">
                  {step.number}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="px-4 pb-20 md:px-6 md:pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-brand px-6 py-12 text-center text-primary-foreground md:px-12 md:py-16">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Ready to start learning smarter?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg opacity-90">
                Join Vidya A.I. today and study any subject in the language you feel most comfortable with.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                  className="group min-w-[180px]"
                >
                  <Link to="/signup">
                    Create free account
                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 min-w-[180px]"
                >
                  <Link to="/login">Login</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 py-12 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Logo />
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                AI-powered multilingual learning for students across India. Learn in the language you think in.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground">Product</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/" className="hover:text-foreground">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/app/dashboard" className="hover:text-foreground">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/app/tutor" className="hover:text-foreground">
                    AI Tutor
                  </Link>
                </li>
                <li>
                  <Link to="/app/subjects" className="hover:text-foreground">
                    Subjects
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground">Account</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/login" className="hover:text-foreground">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-foreground">
                    Sign up
                  </Link>
                </li>
                <li>
                  <Link to="/forgot-password" className="hover:text-foreground">
                    Forgot password
                  </Link>
                </li>
                <li>
                  <Link to="/app/profile" className="hover:text-foreground">
                    Settings
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground">Contact</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="inline-flex items-center gap-2">
                  <MessageCircle className="size-4" />
                  <span>help@vidyaai.example</span>
                </li>
                <li className="inline-flex items-center gap-2">
                  <Zap className="size-4" />
                  <span>Built for students, by students</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row">
            <p>© {new Date().getFullYear()} Vidya A.I. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link to="/" className="hover:text-foreground">
                Privacy Policy
              </Link>
              <Link to="/" className="hover:text-foreground">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
