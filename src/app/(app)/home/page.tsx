import Link from "next/link";
import { getPlayers } from "@/lib/data-source";
import { getMatches } from "@/data/mock/generate-matches";
import { aggregateSquadPhysicalStats } from "@/lib/aggregate-stats";
import { getMetric, rankPlayersByMetric } from "@/lib/metrics";
import { formatMetricValue } from "@/data/registry/metrics";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { StatTile } from "@/components/ui/StatTile";
import { PlayerRankRow } from "@/components/players/PlayerRankRow";
import { LatestMatchHero } from "@/components/matches/LatestMatchHero";
import { MatchCard } from "@/components/matches/MatchCard";
import { appConfig } from "@/config/app-config";
import { showMockBadge } from "@/lib/demo-badge";

// Without this, Next prerenders Home once at build time as static HTML —
// a CSV upload afterward would never show up here in production. See
// lib/upload-store.ts.
export const dynamic = "force-dynamic";

/**
 * The real dashboard (brief §7.3), replacing the Stage A/B/C foundation
 * screen now that the pieces it links to (Matches, full Players list,
 * Leaderboard) actually exist. Squad stat tiles mix real aggregates
 * (distance/sprints/top speed) with one mock one (possession, taken from
 * the latest match) — never claim possession is tracked, since it isn't.
 */
export default async function HomePage() {
  const players = await getPlayers();
  const matches = getMatches(players);
  const [currentMatch, ...pastMatches] = matches;

  const squadStats = aggregateSquadPhysicalStats(players);
  const topPerformers = rankPlayersByMetric(players, "distance").slice(0, 3);
  const maxDistance = Math.max(...players.map((player) => getMetric(player, "distance")?.value ?? 0), 1);

  return (
    <Container className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-3xl text-foreground">Football Analytics</h1>
        <p className="text-sm text-muted-foreground">{appConfig.brand.tagline}</p>
      </header>

      <LatestMatchHero match={currentMatch} />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile
          label="Squad Distance"
          value={formatMetricValue("distance", squadStats.distance)}
          unit="km"
          emphasis
        />
        <StatTile label="Squad Sprints" value={String(squadStats.sprints)} emphasis />
        <StatTile label="Top Speed" value={formatMetricValue("topSpeed", squadStats.topSpeed)} unit="km/h" />
        <StatTile
          label="Possession"
          value={formatMetricValue("possession", currentMatch.teamStats[0].possession)}
          unit="%"
          mock={showMockBadge(true)}
        />
      </div>

      <Card className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Top Performers · Distance
          </span>
          <Link href="/leaderboard" className="text-xs font-medium text-accent">
            See all
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {topPerformers.length > 0 ? (
            topPerformers.map((player, index) => (
              <PlayerRankRow key={player.id} player={player} rank={index + 1} metricKey="distance" maxValue={maxDistance} />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No tracked players yet.</p>
          )}
        </div>
      </Card>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Recent Matches</span>
          <Link href="/matches" className="text-xs font-medium text-accent">
            See all
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {pastMatches.length > 0 ? (
            pastMatches.slice(0, 3).map((match) => <MatchCard key={match.id} match={match} />)
          ) : (
            <Card>
              <p className="text-sm text-muted-foreground">No past matches yet.</p>
            </Card>
          )}
        </div>
      </div>

      <Link href="/upload" className="block">
        <Card className="flex items-center justify-between gap-3 transition hover:border-accent/40 active:scale-[0.98]">
          <div>
            <div className="text-sm font-medium text-foreground">Upload Match Data</div>
            <div className="text-xs text-muted-foreground">
              Add a CSV to bring real stats into a new match.
            </div>
          </div>
          <span className="text-accent">→</span>
        </Card>
      </Link>
    </Container>
  );
}
