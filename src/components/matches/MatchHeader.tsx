import type { Match } from "@/types/match";
import { Card } from "@/components/ui/Card";
import { TeamDot } from "@/components/ui/TeamDot";
import { getTeamColor } from "@/config/app-config";
import { formatMatchDate } from "@/lib/format";
import { getMatchStatusLabel } from "@/lib/match-status";

export function MatchHeader({ match }: { match: Match }) {
  const [home, away] = match.teams;
  const [homeStats, awayStats] = match.teamStats;

  return (
    <Card className="flex flex-col items-center gap-3 text-center">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {match.competition}
      </div>
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex flex-1 flex-col items-center gap-2">
          <TeamDot color={getTeamColor(home.id)} />
          <span className="text-sm font-semibold uppercase tracking-wide text-foreground">
            {home.name}
          </span>
        </div>
        <div className="font-display text-4xl text-foreground">
          {homeStats.score} <span className="text-muted-foreground">—</span> {awayStats.score}
        </div>
        <div className="flex flex-1 flex-col items-center gap-2">
          <TeamDot color={getTeamColor(away.id)} />
          <span className="text-sm font-semibold uppercase tracking-wide text-foreground">
            {away.name}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="text-muted-foreground">{formatMatchDate(match.date)}</span>
        <span className="text-border">·</span>
        <span className="font-medium text-accent">{getMatchStatusLabel(match.status)}</span>
      </div>
    </Card>
  );
}
