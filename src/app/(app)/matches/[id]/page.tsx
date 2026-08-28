import { notFound } from "next/navigation";
import { getPlayers } from "@/lib/data-source";
import { getMatches } from "@/data/mock/generate-matches";
import { Container } from "@/components/ui/Container";
import { Tabs } from "@/components/ui/Tabs";
import { MatchHeader } from "@/components/matches/MatchHeader";
import { TeamComparisonCard } from "@/components/matches/TeamComparisonCard";
import { MatchPlayerLeaderboard } from "@/components/matches/MatchPlayerLeaderboard";
import { LineupsSection } from "@/components/matches/LineupsSection";

// Explicit, though dynamic route segments without generateStaticParams
// already render on demand — see lib/upload-store.ts for why this matters.
export const dynamic = "force-dynamic";

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
      <Tabs
        tabs={[
          {
            value: "overview",
            label: "Overview",
            content: <TeamComparisonCard match={match} variant="overview" />,
          },
          {
            value: "lineups",
            label: "Lineups",
            content: <LineupsSection match={match} />,
          },
          {
            value: "stats",
            label: "Stats",
            content: (
              <div className="flex flex-col gap-4">
                <TeamComparisonCard match={match} variant="stats" />
                {match.players.length > 0 && <MatchPlayerLeaderboard players={match.players} />}
              </div>
            ),
          },
        ]}
      />
    </Container>
  );
}
