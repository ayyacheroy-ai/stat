# Pitchline backend

The real backend the frontend (`/`) was always built to plug into. It owns
one thing today: real, tracker-sourced data — players, matches, per-match
statistics, upload ingestion, and the structural placeholders for async
video processing (jobs, media pointers). It does **not** generate or store
any of the frontend's mock/demo dressing (fabricated match history, bios,
heatmaps, shot maps) — that generation stays exactly where it lives today,
in the frontend's `src/data/mock/` layer, applied on top of whatever this
API returns. See the root repo's engineering handoff for the full picture;
this file covers only what's in `backend/`.

## Why this exists, and why it's scoped the way it is

The frontend has always read `src/data/csv/sample-match.csv` as a
deliberate stand-in for a real API — the whole point of its adapter
boundary (`src/lib/data-source.ts`) was that swapping the CSV for real
HTTP calls should touch one function, not the UI. This service is that
real API, for the one thing the frontend actually fetches today: players
and their tracker metrics.

Two things are explicitly **not** done here, on purpose:

- **The frontend's fake auth isn't touched.** `src/lib/auth/` still sets a
  plain cookie and nothing checks it against this backend. A `User` model
  exists in the schema as a foundation, but wiring real sessions to it is
  a separate, discuss-first change (removing working auth, even fake auth,
  is the kind of thing worth a second pair of eyes before it happens).
- **Match/ProcessingJob/MediaAsset aren't wired into the live frontend.**
  The frontend doesn't fetch match data over HTTP today — it synthesizes
  a "current match" client-side from whatever `getPlayers()` returns, and
  fabricates 4 more for match history. So while this backend implements
  the full conceptual API surface the product's pipeline implies (`GET
  /matches`, `POST /matches`, etc.), only `GET /players` and `POST
  /uploads` are actually called by the frontend right now. The rest exists
  as real, tested groundwork for the day match/video upload becomes a
  frontend feature — not speculative code with nothing depending on it,
  but not force-fit into today's UI either.

## Domain model

See `prisma/schema.prisma` for the authoritative version with full
comments. Summary:

- **Team** — id matches the tracker CSV's `team` column (0/1 today).
- **Player** — identified by `trackerId` (the CV system's id). Bio columns
  exist but are always null today — no data source populates them yet.
- **Match** — a real match. Deliberately has **no** score or possession
  columns: those are fabricated for every match in this product (the
  tracker can't detect goals or the ball), so persisting a fake score
  would make it indistinguishable from a real one. Score/possession stay
  a frontend-only concern, generated the same way they are today.
- **PlayerMatchStatistic** — one row per (player, match, metric). This is
  the real backing for the frontend's `MetricBag`, keyed the way the
  product's own worked example describes it: player + match + metric, not
  a flat per-player bag. The frontend's current single-match world is just
  the trivial case of this table with one match in it.
- **ProcessingJob** — structural-only placeholder for the async video
  pipeline. `POST /matches` creates one at `QUEUED`; nothing in this repo
  ever consumes the queue or does the actual processing. That's a
  separate worker process this repo doesn't implement.
- **MediaAsset** — a pointer (`storageKey`) into object storage, never a
  binary. No object store is implemented here; this only reserves the
  column so a real one can be wired in without a schema change.
- **User** — auth foundation, not wired to anything yet (see above).

## Why SQLite

This runs as its own long-lived Node process — not colocated with the
frontend's Vercel serverless functions — so a file-backed database is
genuinely durable, unlike the frontend's current in-memory upload store
(a `Map` on `globalThis`, which its own code comments already flag as
unsafe across separate serverless instances). SQLite needs zero external
services, which matters for actually being able to run and test this
without provisioning anything. Moving to Postgres later is a one-line
change (`provider` + `DATABASE_URL` in `prisma/schema.prisma`) — nothing
above the Prisma client needs to know.

## API contract

All real data, nothing fabricated. Responses are shaped to be a
near-passthrough into the frontend's existing `Player`/`MetricBag` types;
see `src/data/adapters/api-adapter.ts` in the frontend for the exact
mapping (it only adds the `tracker-` id prefix, a frontend routing
convention the backend doesn't need to know about).

| Method & path                         | Notes |
|----------------------------------------|-------|
| `GET /players`                         | All players, metrics scoped to the latest `COMPLETE` match. |
| `GET /players/:trackerId`               | One player, same scoping. |
| `GET /players/:trackerId/statistics`    | `{ matchId, metrics }`. Optional `?matchId=` to scope to a specific match instead of the latest. |
| `GET /matches`                          | All matches, newest first, with team info. |
| `GET /matches/:id`                      | One match + real per-team aggregates (distance/sprints/topSpeed — summed/maxed from real player rows). No score/possession (see above). |
| `GET /matches/:id/players`              | Players who have statistics for that match, metrics scoped to it. |
| `POST /matches`                         | `{ date, competition, homeTeamId, awayTeamId, sourceVideoKey? }` → creates a `PENDING` match + a `QUEUED` processing job (+ a `MediaAsset` if a video key is given). Does not accept or process a video file. |
| `POST /uploads`                         | Raw CSV text in (`text/csv` or similar), same contract as the frontend's current `POST /api/upload`: `{ matchedCount, unmatchedTrackerIds, totalRows }`. Upserts real `PlayerMatchStatistic` rows against the latest complete match. |

## Running locally

```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev   # creates prisma/dev.db and applies the schema
npm run seed              # loads ../src/data/csv/sample-match.csv
npm run dev                # http://localhost:4000
```

To point the frontend at it instead of the bundled CSV, set
`PITCHLINE_API_URL=http://localhost:4000` in the frontend's `.env` (see
the root `.env.example`) and restart the frontend. Unset (or omit) it and
the frontend behaves exactly as it always has — this integration is
strictly additive.

## Known limitations (intentional, not oversights)

- No auth on these routes yet — CORS is wide open (`Access-Control-Allow-
  Origin: *`). Fine for local development; must be tightened before any
  public deployment, alongside actually wiring the `User` model to real
  sessions.
- `GET /players` and friends scope to "the latest complete match," not a
  season aggregate across matches. That's the correct behavior for today
  (there's exactly one match), and a deliberate placeholder for later —
  season-level aggregation rules (sum? most recent? per-metric?) are a
  product decision, not a technical one, and shouldn't be guessed at here.
- No real object storage integration — `MediaAsset.storageKey` is an
  opaque string with nothing behind it yet.
- No worker process consumes `ProcessingJob` rows — `POST /matches` only
  establishes the queue boundary the handoff's architecture requires.
