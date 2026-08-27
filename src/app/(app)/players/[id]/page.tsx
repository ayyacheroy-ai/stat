import { notFound } from "next/navigation";
import { getPlayers } from "@/lib/data-source";
import { generatePlayerProfileExtras } from "@/data/mock/generate-player-profile";
import { getMetric } from "@/lib/metrics";
import { Container } from "@/components/ui/Container";
import { ProfileHeader } from "@/components/players/ProfileHeader";
import { BioStatsCard } from "@/components/players/BioStatsCard";
import { PositionCard } from "@/components/players/PositionCard";
import { MarketValueChart } from "@/components/players/MarketValueChart";
import { SeasonSummaryStrip } from "@/components/players/SeasonSummaryStrip";
import { RecentMatchesTable } from "@/components/players/RecentMatchesTable";
import { ComingSoonCard } from "@/components/players/ComingSoonCard";
import { SeasonPerformanceTable } from "@/components/players/SeasonPerformanceTable";
import { AboutCard } from "@/components/players/AboutCard";

/**
 * The deep Player Profile — the showcase screen of the app. Bio, market
 * value, season stats, and match history are mock (generated
 * deterministically per player); the "Physical · Tracked Live" row inside
 * SeasonSummaryStrip and the corresponding Physical group in the season
 * table are the tracker's real numbers, unchanged from the CSV. Heatmap
 * and shot map are stubbed here — the reusable Pitch component they need
 * comes in a later build stage.
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

  return (
    <Container className="flex flex-col gap-4">
      <ProfileHeader player={player} extras={extras} />
      <BioStatsCard bio={player.bio} />
      <PositionCard position={extras.position} />
      <MarketValueChart history={extras.marketValueHistory} />
      <SeasonSummaryStrip player={player} />
      <RecentMatchesTable matches={extras.recentMatches} />
      <ComingSoonCard
        title="Heatmap"
        description="Pitch-based heatmap visualization is coming in a later build stage."
      />
      <ComingSoonCard
        title="Shot Map"
        description="Shot map visualization is coming in a later build stage."
      />
      <SeasonPerformanceTable player={player} allPlayers={players} />
      <AboutCard player={player} extras={extras} />
    </Container>
  );
}
