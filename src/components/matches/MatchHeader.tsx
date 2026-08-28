import type { Match } from "@/types/match";
import { Card } from "@/components/ui/Card";
import { TeamDot } from "@/components/ui/TeamDot";
import { getTeamColor } from "@/config/app-config";

export function MatchHeader({ match }: { match: Match }) {
  const [home, away] = match.teams;
  const [homeStats, awayStats] = match.teamStats;

  return (
    <Card className="flex flex-col items-center gap-3 text-center">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {match.date} · {match.competition}
      </div>
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex flex-1 flex-col items-center gap-2">
          <TeamDot color={getTeamColor(home.id)} />
          <span className="text-sm font-medium text-foreground">{home.name}</span>
        </div>
        <div className="font-display text-4xl text-foreground">
          {homeStats.score}-{awayStats.score}
        </div>
        <div className="flex flex-1 flex-col items-center gap-2">
          <TeamDot color={getTeamColor(away.id)} />
          <span className="text-sm font-medium text-foreground">{away.name}</span>
        </div>
      </div>
      <span className="text-xs font-medium text-accent">
        {match.status === "COMPLETE" ? "Full Time" : match.status}
      </span>
    </Card>
  );
}
