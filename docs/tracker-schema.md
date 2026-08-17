# Tracker CSV Schema (Source of Truth)

This document is the contract between the tracker system (produces one CSV per
completed game) and this app (ingests that CSV). **When the tracker's output
format changes, this file must be updated in the same change** — the app's
CSV parser (`server/src/services/csvIngest.ts`) and validation types
(`server/src/types/tracker.ts`) are derived from what's written here.

Status: **DRAFT** — the shape below is a reasonable starting point based on
what a per-player, per-game basketball/football box score typically needs.
Replace it with the tracker's actual output as soon as it exists, including
a real sample file under `docs/samples/`.

## File conventions

- One CSV file per completed game.
- Encoding: UTF-8, comma-delimited, header row required.
- Suggested filename convention: `<sport>_<game_external_id>_<yyyyMMdd>.csv`
  (e.g. `basketball_g10432_20260817.csv`) — the app does not parse the
  filename for data, but it's stored as `sourceFile` on the `Game` record for
  traceability.
- Row grain: **one row per player, per game** (not per possession/play).
  Team-level totals are derived by the app, not provided directly.
- All rows in a file belong to the same `game_external_id`.

## Columns

| Column               | Type              | Required | Notes |
|----------------------|-------------------|----------|-------|
| `game_external_id`   | string            | yes      | Tracker's unique ID for the game. Used to dedupe re-ingests (upsert, not duplicate). |
| `sport`              | enum: `basketball`, `football` | yes | Determines which metric set applies (see below). |
| `played_at`          | ISO 8601 datetime | yes      | e.g. `2026-08-17T18:30:00Z`. |
| `home_team_external_id` | string         | yes      | Tracker's team ID. |
| `home_team_name`     | string            | yes      | Used to create the `Team` if it doesn't exist yet. |
| `away_team_external_id` | string         | yes      | |
| `away_team_name`     | string            | yes      | |
| `home_score`         | integer           | yes      | Final score, repeated on every row of the file. |
| `away_score`          | integer          | yes      | |
| `team_external_id`   | string            | yes      | Which team *this row's* player played for. |
| `player_external_id` | string            | yes      | Tracker's unique player ID. Stable across games — this is the join key used to match a tracked player to an app `User` account later. |
| `player_first_name`  | string            | yes      | |
| `player_last_name`   | string            | yes      | |
| `minutes_played`     | decimal           | no       | Minutes as a decimal (e.g. `32.5`). Omit if not tracked. |
| `metrics_json`       | JSON object (string) | yes  | Sport-specific stat line. See below. Kept as a single flexible column so new stats don't require a CSV format change — just a documented key addition here. |

### `metrics_json` — basketball keys

```json
{
  "points": 24,
  "rebounds_offensive": 2,
  "rebounds_defensive": 7,
  "assists": 6,
  "steals": 2,
  "blocks": 1,
  "turnovers": 3,
  "fouls": 4,
  "field_goals_made": 9,
  "field_goals_attempted": 17,
  "three_points_made": 3,
  "three_points_attempted": 8,
  "free_throws_made": 3,
  "free_throws_attempted": 4
}
```

### `metrics_json` — football (soccer) keys

```json
{
  "goals": 1,
  "assists": 1,
  "shots": 4,
  "shots_on_target": 2,
  "passes_completed": 41,
  "passes_attempted": 48,
  "tackles": 3,
  "interceptions": 2,
  "fouls_committed": 1,
  "fouls_suffered": 2,
  "yellow_cards": 0,
  "red_cards": 0
}
```

> Every key used above must have a matching row in the `StatMetricDefinition`
> table (see `server/prisma/schema.prisma`) so the app knows its display
> label, unit, and whether higher is better (needed for awards + leaderboard
> sorting). Adding a new stat = add the key here, add a
> `StatMetricDefinition` row, done — no schema migration required for the
> stat itself.

## Example CSV (basketball, 2 players shown)

```csv
game_external_id,sport,played_at,home_team_external_id,home_team_name,away_team_external_id,away_team_name,home_score,away_score,team_external_id,player_external_id,player_first_name,player_last_name,minutes_played,metrics_json
g10432,basketball,2026-08-17T18:30:00Z,t1,Riverside Hawks,t2,Lakeside Wolves,88,81,t1,p552,Jordan,Ellis,32.5,"{""points"":24,""rebounds_offensive"":2,""rebounds_defensive"":7,""assists"":6,""steals"":2,""blocks"":1,""turnovers"":3,""fouls"":4,""field_goals_made"":9,""field_goals_attempted"":17,""three_points_made"":3,""three_points_attempted"":8,""free_throws_made"":3,""free_throws_attempted"":4}"
g10432,basketball,2026-08-17T18:30:00Z,t1,Riverside Hawks,t2,Lakeside Wolves,88,81,t2,p118,Marcus,Reyes,29.0,"{""points"":19,""rebounds_offensive"":1,""rebounds_defensive"":4,""assists"":3,""steals"":0,""blocks"":0,""turnovers"":2,""fouls"":3,""field_goals_made"":7,""field_goals_attempted"":15,""three_points_made"":1,""three_points_attempted"":5,""free_throws_made"":4,""free_throws_attempted"":5}"
```

## Ingestion behavior (for reference)

- `game_external_id` is unique — re-uploading the same file (or a corrected
  version) upserts the `Game` and its `GameStat` rows rather than creating
  duplicates.
- `player_external_id` and `team_external_id` are the join keys used to
  create-or-match `Player` and `Team` records across games.
- Unrecognized `metrics_json` keys are currently rejected (fail the row) so
  schema drift is caught at ingestion time instead of silently dropped. If
  the tracker adds a stat, update this doc + `StatMetricDefinition` first.

## Open questions for the tracker team

- [ ] Confirm final column names/casing (snake_case assumed above).
- [ ] Confirm `metrics_json` vs. flat columns per stat — flat columns are
      easier to eyeball in a spreadsheet but require a CSV format change
      (and a migration) for every new stat.
- [ ] Do we get a roster/DNP row for players who didn't play, or only rows
      for players with recorded minutes?
- [ ] Any overtime/period-level breakdown needed, or are these game totals
      only?
- [ ] Timezone handling for `played_at` — always UTC, or local with offset?
