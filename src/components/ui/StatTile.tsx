import { cn } from "@/lib/cn";

interface StatTileProps {
  label: string;
  /** Pre-formatted display value, or null/undefined when the metric isn't available. */
  value: string | null | undefined;
  unit?: string;
  emphasis?: boolean;
  /**
   * Shows a subtle "demo data" dot next to the label. Callers should pass
   * the result of lib/demo-badge.ts's showMockBadge(), not a raw boolean —
   * that's what keeps this off by default and consistent everywhere.
   */
  mock?: boolean;
}

/**
 * The hero stat number — repeats across every screen in the app (big bold
 * value, small muted caption underneath). Build it once, use it
 * everywhere, per the design brief. Renders a placeholder instead of
 * breaking when a metric is missing, which matters once metrics are a
 * flexible bag rather than a fixed set of fields.
 */
export function StatTile({ label, value, unit, emphasis, mock }: StatTileProps) {
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
      <div className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
        {mock && <span className="h-1 w-1 rounded-full bg-amber" title="Demo data" />}
      </div>
    </div>
  );
}
