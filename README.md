# Stat

A FotMob-style stats app for basketball and football (soccer). A separate
tracker system outputs one CSV per completed game; this app ingests those
CSVs, turns them into player/team stat pages, auto-generates fun awards
(30-point games, double-doubles, hat tricks, …), and runs online
competitions between players.

## Stack

| Layer    | Choice |
|----------|--------|
| Frontend | React Native (Expo) |
| Backend  | Node.js + Express + PostgreSQL (via Prisma ORM) |

**Why Express + Postgres over Supabase for this app:** ingestion is a
custom, code-heavy pipeline (parse CSV → validate against a schema we
control → upsert players/teams/games → run an awards rule engine), and the
awards/leaderboard logic needs to run non-trivial aggregation queries and
business logic server-side, not in client-side queries against
auto-generated REST/GraphQL. A plain Express API gives full control over
that pipeline and keeps deploy targets flexible (any host that runs Node +
Postgres). Prisma is used as the ORM/migration tool on top of Postgres —
swap it for raw SQL or another ORM later if needed, the schema is what
matters.

## Repo structure

```
.
├── docs/
│   └── tracker-schema.md   # CSV format contract with the tracker system — source of truth
├── server/                 # Express API + Postgres (Prisma)
│   ├── prisma/
│   │   ├── schema.prisma   # Team, Player, Game, GameStat, Award, Competition, ...
│   │   └── seed.ts         # registers stat metric keys + a few example awards
│   └── src/
│       ├── config/         # env validation
│       ├── db/             # Prisma client singleton
│       ├── middleware/
│       ├── routes/         # /api/games, /api/players, /api/awards, /api/competitions, /api/ingest
│       ├── services/
│       │   ├── csvIngest.ts    # parses + validates + upserts a tracker CSV
│       │   └── awards/engine.ts # evaluates Award.criteria against a game's stat lines
│       └── types/tracker.ts     # zod schema mirroring docs/tracker-schema.md
└── mobile/                 # Expo (React Native) app
    └── src/
        ├── api/            # typed API client
        ├── navigation/
        ├── screens/        # Home (games), GameSummary, PlayerProfile, Awards, Competitions
        └── components/
```

## Getting started

### Prerequisites

- Node.js 20+
- A Postgres database (local install, Docker, or a hosted instance)
- Expo Go app (or an iOS/Android simulator) for running the mobile app

### 1. Backend (`server/`)

```bash
cd server
npm install
cp .env.example .env   # then set DATABASE_URL to point at your Postgres instance
npm run prisma:migrate # creates the schema
npm run prisma:seed    # registers stat metric keys + example awards
npm run dev             # starts the API on http://localhost:4000
```

Check it's up: `curl http://localhost:4000/health`

Ingest a game CSV (see `docs/tracker-schema.md` for the format):

```bash
curl -X POST http://localhost:4000/api/ingest/game -F "file=@/path/to/game.csv"
```

### 2. Mobile app (`mobile/`)

```bash
cd mobile
npm install
npm start
```

By default the app points at `http://localhost:4000` (see `apiBaseUrl` in
`mobile/app.json`). If you're testing on a physical device via Expo Go,
change that to your machine's LAN IP so the device can reach the API.

## Data flow

```
tracker system  --CSV-->  POST /api/ingest/game
                              │
                              ├─ validate rows (server/src/types/tracker.ts)
                              ├─ upsert Team / Player / Game / GameStat
                              └─ run awards engine (server/src/services/awards/engine.ts)
                                     │
                                     ▼
                          mobile app reads via /api/games, /api/players,
                          /api/awards, /api/competitions
```

## Docs

- [`docs/tracker-schema.md`](docs/tracker-schema.md) — the CSV contract
  with the tracker system. **This is the source of truth**: if the
  tracker's output format changes, update this doc first, then
  `server/src/types/tracker.ts` and `server/src/services/csvIngest.ts` to
  match. It's currently a draft based on a reasonable guess at the format —
  replace it with the tracker's actual columns as soon as they're finalized.

## Status

Early scaffold: repo structure, DB schema, a working ingest → awards
pipeline, and basic read endpoints/screens are in place. Not yet built:
auth, real competition scoring logic, push notifications, and polish on
the mobile UI.
