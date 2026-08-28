import Link from "next/link";
import type { Match } from "@/types/match";
import { WDLBadge } from "@/components/ui/WDLBadge";
import { getMatchResult } from "@/lib/match-result";

/** A match list row. The leading circle is a placeholder for a competition logo — no real logo assets exist yet. */
export function MatchCard({ match }: { match: Match }) {
  const [home, away] = match.teams;
  const [homeStats, awayStats] = match.teamStats;

  return (
    <Link href={`/matches/${match.id}`} className="block">
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-accent/40">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-[10px] font-semibold uppercase text-muted-foreground">
          {match.competition.slice(0, 1)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-foreground">
            {home.name} <span className="text-muted-foreground">vs</span> {away.name}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {match.date} · {match.competition} · {match.playerCount} players
          </div>
        </div>
        <div className="font-display text-base text-foreground">
          {homeStats.score}-{awayStats.score}
        </div>
        <WDLBadge result={getMatchResult(match)} />
      </div>
    </Link>
  );
}
