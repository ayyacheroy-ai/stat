import { getPlayers } from "@/lib/data-source";
import { getMatches } from "@/data/mock/generate-matches";
import { Container } from "@/components/ui/Container";
import { MatchCard } from "@/components/matches/MatchCard";

export default async function MatchesPage() {
  const players = await getPlayers();
  const matches = getMatches(players);

  return (
    <Container className="flex flex-col gap-4">
      <h1 className="font-display text-2xl text-foreground">Matches</h1>
      <div className="flex flex-col gap-3">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </Container>
  );
}
