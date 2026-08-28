import { promises as fs } from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { parseCsv } from "../src/lib/csv";
import { extractTrackerMetrics, toNumberOrDefault } from "../src/lib/metric-columns";

const db = new PrismaClient();

/**
 * Seeds this database from the exact same bundled CSV the frontend reads
 * today (src/data/csv/sample-match.csv), so the API-backed path produces
 * byte-identical tracker metrics to the CSV-backed path during migration
 * — a stakeholder comparing before/after should see no numeric
 * difference. Team/player names are mirrored from the frontend's
 * config/app-config.ts (see comment below); everything else in this file
 * only ever writes real, tracker-derived rows.
 */
async function main() {
  // Mirrors src/config/app-config.ts. Once this backend is the source of
  // truth, config/app-config.ts's teams/players maps become read-only
  // display fallbacks (unknown-id labels) rather than the primary source
  // — but that migration is a separate, deliberate step, not bundled here.
  const teams = [
    { id: 0, name: "Team A", color: "#2BD97C" },
    { id: 1, name: "Team B", color: "#F5A524" },
  ];
  const playerNames: Record<number, string> = {
    18: "M. Rossi",
    13: "D. Silva",
    9: "J. Owusu",
    8: "K. Novak",
  };

  for (const team of teams) {
    await db.team.upsert({
      where: { id: team.id },
      update: { name: team.name, color: team.color },
      create: team,
    });
  }

  const csvPath = path.join(
    __dirname,
    "../../src/data/csv/sample-match.csv",
  );
  const csvText = await fs.readFile(csvPath, "utf-8");
  const { rows } = parseCsv(csvText);

  const match = await db.match.upsert({
    where: { id: "match-current" },
    update: {},
    create: {
      id: "match-current",
      status: "COMPLETE",
      date: new Date("2026-08-21"),
      competition: "League",
      homeTeamId: 0,
      awayTeamId: 1,
    },
  });

  for (const row of rows) {
    const trackerId = toNumberOrDefault(row.tracker_id, 0);
    const teamId = toNumberOrDefault(row.team, 0);

    const player = await db.player.upsert({
      where: { trackerId },
      update: { teamId, name: playerNames[trackerId] ?? `Player #${trackerId}` },
      create: {
        trackerId,
        teamId,
        name: playerNames[trackerId] ?? `Player #${trackerId}`,
      },
    });

    for (const { metricKey, value } of extractTrackerMetrics(row)) {
      await db.playerMatchStatistic.upsert({
        where: {
          playerId_matchId_metricKey: {
            playerId: player.id,
            matchId: match.id,
            metricKey,
          },
        },
        update: { value, source: "TRACKER" },
        create: {
          playerId: player.id,
          matchId: match.id,
          metricKey,
          value,
          source: "TRACKER",
        },
      });
    }
  }

  console.log(`Seeded ${teams.length} teams, ${rows.length} players, 1 match.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
