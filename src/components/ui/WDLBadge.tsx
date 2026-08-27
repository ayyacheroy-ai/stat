export type MatchResult = "W" | "D" | "L";

const RESULT_STYLES: Record<MatchResult, string> = {
  W: "bg-accent/15 text-accent",
  D: "bg-surface-2 text-muted-foreground",
  L: "bg-danger/15 text-danger",
};

export function WDLBadge({ result }: { result: MatchResult }) {
  return (
    <span
      className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-semibold ${RESULT_STYLES[result]}`}
    >
      {result}
    </span>
  );
}
