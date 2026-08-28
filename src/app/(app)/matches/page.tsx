import { getPlayers } from "@/lib/data-source";
import { getMatches } from "@/data/mock/generate-matches";
import { Container } from "@/components/ui/Container";
import { MatchCard } from "@/components/matches/MatchCard";

// Prevents build-time static prerendering — an uploaded CSV changes the
// tracked match's real physical stats without a rebuild. See lib/upload-store.ts.
export const dynamic = "force-dynamic";

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
