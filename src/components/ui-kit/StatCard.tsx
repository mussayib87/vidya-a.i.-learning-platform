import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent = "primary",
  className,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  accent?: "primary" | "accent" | "success" | "warning";
  className?: string;
}) {
  const accents: Record<string, string> = {
    primary: "bg-primary-soft text-primary",
    accent: "bg-accent-soft text-accent",
    success: "bg-success/15 text-success",
    warning: "bg-warning/20 text-warning-foreground",
  };
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-card transition-transform hover:-translate-y-0.5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
        </div>
        <span className={cn("grid size-10 place-items-center rounded-xl", accents[accent])}>
          <Icon className="size-5" />
        </span>
      </div>
      {hint && <p className="mt-3 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
