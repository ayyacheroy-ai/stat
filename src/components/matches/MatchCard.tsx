import Link from "next/link";
import type { Match } from "@/types/match";
import { formatMatchDate } from "@/lib/format";
import { getMatchStatusLabel } from "@/lib/match-status";
import { cn } from "@/lib/cn";

/** Compact match card: teams + score on top, date/status below. Brief §1's exact layout. */
export function MatchCard({ match }: { match: Match }) {
  const [home, away] = match.teams;
  const [homeStats, awayStats] = match.teamStats;

  return (
    <Link href={`/matches/${match.id}`} className="block">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 transition hover:border-accent/40 active:scale-[0.98]">
        <div className="flex items-center gap-3">
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{home.name}</span>
          <span className="shrink-0 font-display text-xl text-foreground">
            {homeStats.score} <span className="text-muted-foreground">—</span> {awayStats.score}
          </span>
          <span className="min-w-0 flex-1 truncate text-right text-sm font-medium text-foreground">
            {away.name}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{formatMatchDate(match.date)}</span>
          <span
            className={cn(
              "font-medium",
              match.status === "COMPLETE" ? "text-accent" : "text-muted-foreground",
            )}
          >
            {getMatchStatusLabel(match.status)}
          </span>
        </div>
      </div>
    </Link>
  );
}
