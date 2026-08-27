import { cn } from "@/lib/cn";

const MEDAL_STYLES: Record<number, string> = {
  1: "bg-[#caa54a]/20 text-[#e0be6a]",
  2: "bg-white/15 text-white/80",
  3: "bg-[#a8622f]/20 text-[#c98450]",
};

/** Rank indicator for leaderboard rows. Ranks 1-3 get a subtle medal tint, not an emoji. */
export function RankBadge({ rank }: { rank: number }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
        MEDAL_STYLES[rank] ?? "bg-surface-2 text-muted-foreground",
      )}
    >
      {rank}
    </span>
  );
}
