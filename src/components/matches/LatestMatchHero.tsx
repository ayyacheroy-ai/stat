import Link from "next/link";
import type { Match } from "@/types/match";
import { Card } from "@/components/ui/Card";
import { TeamDot } from "@/components/ui/TeamDot";
import { getTeamColor } from "@/config/app-config";

export function LatestMatchHero({ match }: { match: Match }) {
  const [home, away] = match.teams;
  const [homeStats, awayStats] = match.teamStats;

  return (
    <Link href={`/matches/${match.id}`} className="block">
      <Card className="flex flex-col gap-3 transition-colors hover:border-accent/40">
        <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <span>Latest Match</span>
          <span className="text-accent">{match.status === "COMPLETE" ? "Full Time" : match.status}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-2">
            <TeamDot color={getTeamColor(home.id)} />
            <span className="truncate text-sm font-medium text-foreground">{home.name}</span>
          </div>
          <span className="shrink-0 font-display text-2xl text-foreground">
            {homeStats.score}-{awayStats.score}
          </span>
          <div className="flex flex-1 items-center justify-end gap-2">
            <span className="truncate text-sm font-medium text-foreground">{away.name}</span>
            <TeamDot color={getTeamColor(away.id)} />
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {match.date} · {match.competition}
        </div>
      </Card>
    </Link>
  );
}
