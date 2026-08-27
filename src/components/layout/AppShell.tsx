import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  MessageSquareText,
  Radio,
  UserRound,
  X,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useApp } from "@/hooks/useApp";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/subjects", label: "Subjects", icon: BookOpen },
  { to: "/app/tutor", label: "AI Tutor", icon: MessageSquareText },
  { to: "/app/live/join", label: "Live Class", icon: Radio },
  { to: "/app/progress", label: "Progress", icon: LineChart },
  { to: "/app/profile", label: "Profile", icon: UserRound },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { user, profile, signOut } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const initials =
    (profile.name || user?.name || "Student")
      .split(" ")
      .map((p) => p.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase() || "S";

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  const navList = (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => {
        const active = pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary-soft text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="size-4.5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Logo to="/app/dashboard" />
          <Button
            variant="ghost"
            size="icon"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
        {open && (
          <div className="border-t border-border px-4 py-3">
            {navList}
            <Button
              variant="outline"
              className="mt-3 w-full rounded-xl"
              onClick={handleSignOut}
            >
              <LogOut className="size-4" /> Sign out
            </Button>
          </div>
        )}
      </header>

      <div className="mx-auto flex w-full max-w-7xl">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border px-4 py-6 lg:flex">
          <Logo to="/app/dashboard" />
          <div className="mt-8 flex-1">{navList}</div>
          <div className="rounded-2xl border border-border bg-card p-3 shadow-card">
            <div className="flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-brand text-sm font-bold text-primary-foreground">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {profile.name || user?.name || "Student"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {profile.email || user?.email || "Guest session"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="mt-2 w-full justify-start rounded-xl text-muted-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="size-4" /> Sign out
            </Button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
