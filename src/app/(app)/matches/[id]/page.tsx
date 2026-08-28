import { notFound } from "next/navigation";
import { getPlayers } from "@/lib/data-source";
import { getMatches } from "@/data/mock/generate-matches";
import { Container } from "@/components/ui/Container";
import { MatchHeader } from "@/components/matches/MatchHeader";
import { TeamComparisonCard } from "@/components/matches/TeamComparisonCard";
import { MatchPlayerLeaderboard } from "@/components/matches/MatchPlayerLeaderboard";

export default async function MatchOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const players = await getPlayers();
  const matches = getMatches(players);
  const match = matches.find((candidate) => candidate.id === id);

  if (!match) {
    notFound();
  }

  return (
    <Container className="flex flex-col gap-4">
      <MatchHeader match={match} />
      <TeamComparisonCard match={match} />
      {match.players.length > 0 && <MatchPlayerLeaderboard players={match.players} />}
    </Container>
  );
}
