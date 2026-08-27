# Pitchline — Football Analytics (Frontend Prototype)

A frontend prototype for a football analytics platform: match video → computer
vision → player/team statistics → mobile app. This repository currently
contains **only the frontend foundation** — design system, normalized data
model, CSV adapter, and one test screen — built so it can later be pointed at
a real backend API without being rewritten.

## Running locally

```bash
npm install
npm run dev
```

Then open **http://localhost:3000**.

You should see a dark-themed "Football Analytics" screen confirming the CSV
loaded, with one card per player showing distance, top speed, average speed,
and sprints.

Other useful commands:

```bash
npm run build   # production build (also type-checks)
npm run lint    # eslint
```

## Where things live

```
src/
├── app/
│   ├── page.tsx             # the test screen described above
│   ├── layout.tsx           # root layout: fonts + accent color wiring
│   ├── globals.css          # design tokens (colors, fonts) for Tailwind v4
│   └── api/players/route.ts # preview of the future `GET /players` API shape
│
├── components/
│   ├── ui/                  # reusable primitives: Card, StatValue, Badge, Container
│   └── players/             # PlayerCard (composes the ui/ primitives)
│
├── data/
│   ├── csv/
│   │   ├── sample-match.csv   # ← replace this with a real tracker export
│   │   └── parser.ts          # generic CSV string -> rows parser
│   └── adapters/
│       └── tracker-adapter.ts # the ONLY file that knows the CSV's column names
│
├── types/                   # normalized data model (Player, Team, Match, PlayerMetrics)
├── config/
│   └── app-config.ts        # ← brand name, accent color, team names, player names
└── lib/
    ├── data-source.ts       # reads + normalizes the CSV (swap for a fetch() later)
    ├── format.ts            # display formatting for metric values
    └── cn.ts                # small classnames helper
```

### Changing the demo data

- **Replace the CSV**: drop a new export at `src/data/csv/sample-match.csv`,
  keeping the same headers (`tracker_id,team,seconds_tracked,distance_m,
  avg_speed_ms,top_speed_ms,top_speed_kmh,sprints`). If your tracker uses
  different column names, update `src/data/adapters/tracker-adapter.ts` —
  that's the only file that needs to change.
- **Rename players/teams, change branding**: edit
  `src/config/app-config.ts`. Tracker IDs and team IDs map to display names
  there; nothing else in the app hardcodes a name.

## Architecture notes for whoever builds the next stage

- **The UI never touches CSV column names.** `tracker-adapter.ts` converts
  raw rows into the normalized `Player` type (`types/player.ts`,
  `types/metrics.ts`). Every component downstream reads `player.metrics.X`,
  not `row.x_column`. When a real API replaces the CSV, only
  `lib/data-source.ts` and the adapter need to change.
- **Metrics are optional, not fixed.** `PlayerMetrics` models today's fields
  (distance, speed, sprints) as optional and leaves room for future ones
  (goals, passes, possession, ...). `StatValue` renders a placeholder ("—")
  instead of breaking when a metric is absent — required for players/sports
  that don't produce every metric.
- **`app/api/players/route.ts`** returns the same normalized shape over
  HTTP today. It's not wired into the test screen (which reads
  `getPlayers()` directly as a Server Component, the normal Next.js
  pattern) — it exists so the eventual API contract is visible and testable
  now, before a real backend exists.
- **Mobile-first, dark by default.** `components/ui/Container.tsx` is
  narrow by default and widens on larger breakpoints, not the reverse.
  Design tokens (colors, fonts) live in `app/globals.css` as Tailwind v4
  `@theme` variables; the accent color is wired from `app-config.ts` in
  `app/layout.tsx` so brand color changes stay a one-line edit.

## What's intentionally not built yet

Per the project brief, this stage stops at the foundation: no auth, no
database, no job queue, no full dashboard, no heatmaps, no additional
screens (Matches, Player Profile, Leaderboards, etc). Those come after this
foundation and visual direction are validated.
