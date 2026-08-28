import { notFound } from "next/navigation";
import { getPlayers } from "@/lib/data-source";
import { generatePlayerProfileExtras } from "@/data/mock/generate-player-profile";
import { generateHeatmapPoints } from "@/data/mock/generate-heatmap";
import { generateShotEvents } from "@/data/mock/generate-shot-map";
import { getMetric } from "@/lib/metrics";
import { Container } from "@/components/ui/Container";
import { ProfileHeader } from "@/components/players/ProfileHeader";
import { BioStatsCard } from "@/components/players/BioStatsCard";
import { PositionCard } from "@/components/players/PositionCard";
import { MarketValueChart } from "@/components/players/MarketValueChart";
import { SeasonSummaryStrip } from "@/components/players/SeasonSummaryStrip";
import { RecentMatchesTable } from "@/components/players/RecentMatchesTable";
import { Heatmap } from "@/components/pitch/Heatmap";
import { ShotMap } from "@/components/pitch/ShotMap";
import { SeasonPerformanceTable } from "@/components/players/SeasonPerformanceTable";
import { AboutCard } from "@/components/players/AboutCard";

// Explicit, though dynamic route segments without generateStaticParams
// already render on demand — see lib/upload-store.ts for why this matters.
export const dynamic = "force-dynamic";

/**
 * The deep Player Profile — the showcase screen of the app. Bio, market
 * value, season stats, match history, heatmap, and shot map are all mock
 * (generated deterministically per player); the "Physical · Tracked Live"
 * row inside SeasonSummaryStrip and the Physical group in the season
 * table are the tracker's real numbers, unchanged from the CSV.
 */
export default async function PlayerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const players = await getPlayers();
  const player = players.find((candidate) => candidate.id === id);

  if (!player) {
    notFound();
  }

  const marketValue = player.bio.marketValueEur ?? 500_000;
  const ratingHint = getMetric(player, "rating")?.value ?? 6.5;
  const extras = generatePlayerProfileExtras(player.trackerId, marketValue, ratingHint);

  const heatmapPoints = generateHeatmapPoints(player.trackerId, extras.position.primary);
  const touches = getMetric(player, "touches")?.value;

  const shotEvents = generateShotEvents(
    player.trackerId,
    getMetric(player, "shots")?.value ?? 0,
    getMetric(player, "shotsOnTarget")?.value ?? 0,
    getMetric(player, "goals")?.value ?? 0,
  );

  return (
    <Container className="flex flex-col gap-4">
      <ProfileHeader player={player} extras={extras} />
      <BioStatsCard bio={player.bio} />
      <PositionCard position={extras.position} />
      <MarketValueChart history={extras.marketValueHistory} />
      <SeasonSummaryStrip player={player} />
      <RecentMatchesTable matches={extras.recentMatches} />
      <Heatmap points={heatmapPoints} touches={touches} />
      <ShotMap shots={shotEvents} />
      <SeasonPerformanceTable player={player} allPlayers={players} />
      <AboutCard player={player} extras={extras} />
    </Container>
  );
}
