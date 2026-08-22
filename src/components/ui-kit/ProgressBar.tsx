import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
  showLabel = false,
  size = "md",
}: {
  value: number;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md";
}) {
  const safe = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-muted",
          size === "sm" ? "h-1.5" : "h-2.5",
        )}
        role="progressbar"
        aria-valuenow={safe}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-gradient-brand transition-[width] duration-700 ease-out"
          style={{ width: `${safe}%` }}
        />
      </div>
      {showLabel && (
        <p className="mt-1.5 text-xs text-muted-foreground">{safe}% complete</p>
      )}
    </div>
  );
}
