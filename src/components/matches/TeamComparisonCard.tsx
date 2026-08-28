import type { Match } from "@/types/match";
import { Card } from "@/components/ui/Card";
import { ComparisonRow } from "./ComparisonRow";
import { getTeamColor } from "@/config/app-config";
import { formatMetricValue } from "@/data/registry/metrics";
import { showMockBadge } from "@/lib/demo-badge";

export function TeamComparisonCard({ match }: { match: Match }) {
  const [home, away] = match.teamStats;
  const homeColor = getTeamColor(match.teams[0].id);
  const awayColor = getTeamColor(match.teams[1].id);
  // Possession has no tracker equivalent yet — always mock. The physical
  // rows are only mock when this match itself isn't the one our tracker
  // actually covered (see Match.isTracked).
  const physicalIsMock = showMockBadge(!match.isTracked);

  return (
    <Card className="flex flex-col gap-5">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Match Stats</div>

      <ComparisonRow
        label="Possession"
        homeValue={home.possession}
        awayValue={away.possession}
        homeDisplay={`${home.possession}%`}
        awayDisplay={`${away.possession}%`}
        homeColor={homeColor}
        awayColor={awayColor}
        mock={showMockBadge(true)}
      />

      {match.isTracked && (
        <div className="-mb-2 text-xs font-medium uppercase tracking-wide text-accent">Physical · Tracked Live</div>
      )}

      <ComparisonRow
        label="Distance"
        homeValue={home.distance}
        awayValue={away.distance}
        homeDisplay={`${formatMetricValue("distance", home.distance)} km`}
        awayDisplay={`${formatMetricValue("distance", away.distance)} km`}
        homeColor={homeColor}
        awayColor={awayColor}
        mock={physicalIsMock}
      />
      <ComparisonRow
        label="Sprints"
        homeValue={home.sprints}
        awayValue={away.sprints}
        homeDisplay={String(home.sprints)}
        awayDisplay={String(away.sprints)}
        homeColor={homeColor}
        awayColor={awayColor}
        mock={physicalIsMock}
      />
      <ComparisonRow
        label="Top Speed"
        homeValue={home.topSpeed}
        awayValue={away.topSpeed}
        homeDisplay={`${formatMetricValue("topSpeed", home.topSpeed)} km/h`}
        awayDisplay={`${formatMetricValue("topSpeed", away.topSpeed)} km/h`}
        homeColor={homeColor}
        awayColor={awayColor}
        mock={physicalIsMock}
      />
    </Card>
  );
}
