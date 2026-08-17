import { parse } from "csv-parse/sync";
import { prisma } from "../db/client";
import { HttpError } from "../middleware/errorHandler";
import { SPORT_TO_ENUM, trackerRowSchema, type TrackerRow } from "../types/tracker";

export interface IngestSummary {
  gameExternalId: string;
  playersProcessed: number;
  teamsProcessed: number;
}

/**
 * Ingests one tracker CSV (see docs/tracker-schema.md) for a single completed
 * game. Upserts Team/Player/Game/GameStat records so re-uploading the same
 * (or a corrected) file is safe.
 */
export async function ingestGameCsv(csvBuffer: Buffer, sourceFile: string): Promise<IngestSummary> {
  const rawRows: unknown[] = parse(csvBuffer, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  if (rawRows.length === 0) {
    throw new HttpError(400, "CSV file has no data rows");
  }

  const rows: TrackerRow[] = rawRows.map((raw, i) => {
    const result = trackerRowSchema.safeParse(raw);
    if (!result.success) {
      throw new HttpError(400, `Row ${i + 1} failed validation`, result.error.flatten().fieldErrors);
    }
    return result.data;
  });

  const gameExternalIds = new Set(rows.map((r) => r.game_external_id));
  if (gameExternalIds.size !== 1) {
    throw new HttpError(400, "CSV file must contain rows for exactly one game", {
      gameExternalIds: [...gameExternalIds],
    });
  }

  const first = rows[0];
  const sport = SPORT_TO_ENUM[first.sport];

  await validateMetricKeys(rows, sport);

  const teamsProcessed = await upsertTeamsAndPlayers(rows, sport);

  const game = await prisma.game.upsert({
    where: { externalId: first.game_external_id },
    create: {
      externalId: first.game_external_id,
      sport,
      playedAt: new Date(first.played_at),
      homeScore: first.home_score,
      awayScore: first.away_score,
      sourceFile,
      homeTeam: { connect: { externalId: first.home_team_external_id } },
      awayTeam: { connect: { externalId: first.away_team_external_id } },
    },
    update: {
      playedAt: new Date(first.played_at),
      homeScore: first.home_score,
      awayScore: first.away_score,
      sourceFile,
    },
  });

  for (const row of rows) {
    const player = await prisma.player.findUniqueOrThrow({ where: { externalId: row.player_external_id } });
    const team = await prisma.team.findUniqueOrThrow({ where: { externalId: row.team_external_id } });

    await prisma.gameStat.upsert({
      where: { gameId_playerId: { gameId: game.id, playerId: player.id } },
      create: {
        gameId: game.id,
        playerId: player.id,
        teamId: team.id,
        minutesPlayed: row.minutes_played ?? undefined,
        metrics: JSON.parse(row.metrics_json),
      },
      update: {
        teamId: team.id,
        minutesPlayed: row.minutes_played ?? undefined,
        metrics: JSON.parse(row.metrics_json),
      },
    });
  }

  return {
    gameExternalId: first.game_external_id,
    playersProcessed: rows.length,
    teamsProcessed,
  };
}

async function validateMetricKeys(rows: TrackerRow[], sport: "BASKETBALL" | "FOOTBALL") {
  const definitions = await prisma.statMetricDefinition.findMany({ where: { sport } });
  const knownKeys = new Set(definitions.map((d) => d.key));

  for (const [i, row] of rows.entries()) {
    let metrics: Record<string, unknown>;
    try {
      metrics = JSON.parse(row.metrics_json);
    } catch {
      throw new HttpError(400, `Row ${i + 1} has invalid metrics_json`);
    }

    const unknownKeys = Object.keys(metrics).filter((k) => !knownKeys.has(k));
    if (unknownKeys.length > 0) {
      throw new HttpError(
        400,
        `Row ${i + 1} uses metric keys not registered in StatMetricDefinition for ${sport}`,
        { unknownKeys }
      );
    }
  }
}

async function upsertTeamsAndPlayers(rows: TrackerRow[], sport: "BASKETBALL" | "FOOTBALL"): Promise<number> {
  const teamsByExternalId = new Map<string, { externalId: string; name: string }>();
  teamsByExternalId.set(rows[0].home_team_external_id, {
    externalId: rows[0].home_team_external_id,
    name: rows[0].home_team_name,
  });
  teamsByExternalId.set(rows[0].away_team_external_id, {
    externalId: rows[0].away_team_external_id,
    name: rows[0].away_team_name,
  });

  for (const team of teamsByExternalId.values()) {
    await prisma.team.upsert({
      where: { externalId: team.externalId },
      create: { externalId: team.externalId, name: team.name, sport },
      update: { name: team.name },
    });
  }

  const playersByExternalId = new Map<string, TrackerRow>();
  for (const row of rows) {
    playersByExternalId.set(row.player_external_id, row);
  }

  for (const row of playersByExternalId.values()) {
    const team = await prisma.team.findUniqueOrThrow({ where: { externalId: row.team_external_id } });
    await prisma.player.upsert({
      where: { externalId: row.player_external_id },
      create: {
        externalId: row.player_external_id,
        firstName: row.player_first_name,
        lastName: row.player_last_name,
        sport,
        teamId: team.id,
      },
      update: {
        firstName: row.player_first_name,
        lastName: row.player_last_name,
        teamId: team.id,
      },
    });
  }

  return teamsByExternalId.size;
}
