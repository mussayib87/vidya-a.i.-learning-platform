import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  to = "/",
  showTagline = false,
}: {
  className?: string;
  to?: string;
  showTagline?: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span className="grid size-10 place-items-center rounded-xl bg-gradient-brand text-primary-foreground shadow-float transition-transform group-hover:scale-105">
        <GraduationCap className="size-5" />
      </span>
      <span className="leading-tight">
        <span className="block text-lg font-extrabold tracking-tight">
          Vidya <span className="text-gradient-brand">A.I.</span>
        </span>
        {showTagline && (
          <span className="block text-xs text-muted-foreground">
            Learn in your language. Learn your way.
          </span>
        )}
      </span>
    </Link>
  );
}
