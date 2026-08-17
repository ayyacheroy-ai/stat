import { z } from "zod";

/**
 * Mirrors docs/tracker-schema.md. If the tracker's CSV format changes,
 * update that doc first, then this schema to match.
 */
export const trackerRowSchema = z.object({
  game_external_id: z.string().min(1),
  sport: z.enum(["basketball", "football"]),
  played_at: z.string().datetime({ offset: true }).or(z.string().min(1)),
  home_team_external_id: z.string().min(1),
  home_team_name: z.string().min(1),
  away_team_external_id: z.string().min(1),
  away_team_name: z.string().min(1),
  home_score: z.coerce.number().int(),
  away_score: z.coerce.number().int(),
  team_external_id: z.string().min(1),
  player_external_id: z.string().min(1),
  player_first_name: z.string().min(1),
  player_last_name: z.string().min(1),
  minutes_played: z.coerce.number().optional().nullable(),
  metrics_json: z.string().min(1),
});

export type TrackerRow = z.infer<typeof trackerRowSchema>;

export const SPORT_TO_ENUM = {
  basketball: "BASKETBALL",
  football: "FOOTBALL",
} as const;

export type TrackerSport = keyof typeof SPORT_TO_ENUM;
