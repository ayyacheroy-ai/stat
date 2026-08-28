import type { Match } from "@/types/match";
import { Card } from "@/components/ui/Card";
import { ComparisonRow } from "./ComparisonRow";
import { getTeamColor } from "@/config/app-config";
import { formatMetricValue } from "@/data/registry/metrics";
import { showMockBadge } from "@/lib/demo-badge";
import { aggregateTeamMetric } from "@/lib/aggregate-stats";

/**
 * `overview` shows the few useful stats the brief asks for on the match
 * Overview tab; `stats` adds Passes for the dedicated Stats tab. Shots/
 * Shots on Target/Passes have no team-level field in the data model — they
 * only exist by summing real per-player mock metrics, which only exist for
 * `match.isTracked` matches (the mock match history has no player list at
 * all). Those rows are simply omitted rather than showing a fabricated 0.
 */
export function TeamComparisonCard({
  match,
  variant = "overview",
}: {
  match: Match;
  variant?: "overview" | "stats";
}) {
  const [home, away] = match.teamStats;
  const homeTeamId = match.teams[0].id;
  const awayTeamId = match.teams[1].id;
  const homeColor = getTeamColor(homeTeamId);
  const awayColor = getTeamColor(awayTeamId);
  // Possession has no tracker equivalent yet — always mock. The physical
  // rows are only mock when this match itself isn't the one our tracker
  // actually covered (see Match.isTracked).
  const physicalIsMock = showMockBadge(!match.isTracked);
  const hasPlayerStats = match.players.length > 0;

  return (
    <Card className="flex flex-col gap-5">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {variant === "stats" ? "Match Stats" : "Overview"}
      </div>

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

      {hasPlayerStats && (
        <>
          <ComparisonRow
            label="Shots"
            homeValue={aggregateTeamMetric(match.players, homeTeamId, "shots")}
            awayValue={aggregateTeamMetric(match.players, awayTeamId, "shots")}
            homeDisplay={String(aggregateTeamMetric(match.players, homeTeamId, "shots"))}
            awayDisplay={String(aggregateTeamMetric(match.players, awayTeamId, "shots"))}
            homeColor={homeColor}
            awayColor={awayColor}
            mock={showMockBadge(true)}
          />
          <ComparisonRow
            label="Shots on Target"
            homeValue={aggregateTeamMetric(match.players, homeTeamId, "shotsOnTarget")}
            awayValue={aggregateTeamMetric(match.players, awayTeamId, "shotsOnTarget")}
            homeDisplay={String(aggregateTeamMetric(match.players, homeTeamId, "shotsOnTarget"))}
            awayDisplay={String(aggregateTeamMetric(match.players, awayTeamId, "shotsOnTarget"))}
            homeColor={homeColor}
            awayColor={awayColor}
            mock={showMockBadge(true)}
          />
          {variant === "stats" && (
            <ComparisonRow
              label="Passes"
              homeValue={aggregateTeamMetric(match.players, homeTeamId, "passes")}
              awayValue={aggregateTeamMetric(match.players, awayTeamId, "passes")}
              homeDisplay={String(aggregateTeamMetric(match.players, homeTeamId, "passes"))}
              awayDisplay={String(aggregateTeamMetric(match.players, awayTeamId, "passes"))}
              homeColor={homeColor}
              awayColor={awayColor}
              mock={showMockBadge(true)}
            />
          )}
        </>
      )}
    </Card>
  );
}
