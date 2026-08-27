import { cn } from "@/lib/cn";

interface StatValueProps {
  label: string;
  /** Pre-formatted display value, or null/undefined when the metric isn't available. */
  value: string | null | undefined;
  unit?: string;
  emphasis?: boolean;
}

/**
 * The hero stat number. Renders a placeholder instead of breaking when a
 * metric is missing — required for a flexible metrics model where not
 * every player/sport has every field.
 */
export function StatValue({ label, value, unit, emphasis }: StatValueProps) {
  const isAvailable = value !== null && value !== undefined && value !== "";

  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          "font-display leading-none tracking-tight text-foreground",
          emphasis ? "text-3xl" : "text-xl",
        )}
      >
        {isAvailable ? (
          <>
            {value}
            {unit ? (
              <span className="ml-1 font-sans text-sm font-medium text-muted-foreground">
                {unit}
              </span>
            ) : null}
          </>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </div>
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
