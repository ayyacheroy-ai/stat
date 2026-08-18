import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Registers the metric keys documented in docs/tracker-schema.md, plus a
 * couple of illustrative awards, so a fresh database can accept an ingest
 * immediately. Keep this in sync with that doc.
 */
async function main() {
  const basketballMetrics: [string, string, string | null][] = [
    ["points", "Points", null],
    ["rebounds_offensive", "Offensive Rebounds", null],
    ["rebounds_defensive", "Defensive Rebounds", null],
    ["assists", "Assists", null],
    ["steals", "Steals", null],
    ["blocks", "Blocks", null],
    ["turnovers", "Turnovers", null],
    ["fouls", "Fouls", null],
    ["field_goals_made", "Field Goals Made", null],
    ["field_goals_attempted", "Field Goals Attempted", null],
    ["three_points_made", "Three Points Made", null],
    ["three_points_attempted", "Three Points Attempted", null],
    ["free_throws_made", "Free Throws Made", null],
    ["free_throws_attempted", "Free Throws Attempted", null],
  ];

  const footballMetrics: [string, string, string | null][] = [
    ["goals", "Goals", null],
    ["assists", "Assists", null],
    ["shots", "Shots", null],
    ["shots_on_target", "Shots on Target", null],
    ["passes_completed", "Passes Completed", null],
    ["passes_attempted", "Passes Attempted", null],
    ["tackles", "Tackles", null],
    ["interceptions", "Interceptions", null],
    ["fouls_committed", "Fouls Committed", null],
    ["fouls_suffered", "Fouls Suffered", null],
    ["yellow_cards", "Yellow Cards", null],
    ["red_cards", "Red Cards", null],
  ];

  for (const [key, label, unit] of basketballMetrics) {
    await prisma.statMetricDefinition.upsert({
      where: { sport_key: { sport: "BASKETBALL", key } },
      create: { sport: "BASKETBALL", key, label, unit },
      update: { label, unit },
    });
  }

  for (const [key, label, unit] of footballMetrics) {
    await prisma.statMetricDefinition.upsert({
      where: { sport_key: { sport: "FOOTBALL", key } },
      create: { sport: "FOOTBALL", key, label, unit },
      update: { label, unit },
    });
  }

  await prisma.award.upsert({
    where: { key: "thirty_point_game" },
    create: {
      key: "thirty_point_game",
      name: "30-Point Game",
      description: "Scored 30 or more points in a single game.",
      sport: "BASKETBALL",
      criteria: JSON.stringify({ type: "threshold", metric: "points", operator: ">=", value: 30 }),
    },
    update: {},
  });

  await prisma.award.upsert({
    where: { key: "double_double" },
    create: {
      key: "double_double",
      name: "Double-Double",
      description: "Reached double digits in points and rebounds in a single game.",
      sport: "BASKETBALL",
      criteria: JSON.stringify({
        type: "all",
        criteria: [
          { type: "threshold", metric: "points", operator: ">=", value: 10 },
          { type: "threshold", metric: "rebounds_defensive", operator: ">=", value: 5 },
        ],
      }),
    },
    update: {},
  });

  await prisma.award.upsert({
    where: { key: "hat_trick" },
    create: {
      key: "hat_trick",
      name: "Hat Trick",
      description: "Scored 3 or more goals in a single game.",
      sport: "FOOTBALL",
      criteria: JSON.stringify({ type: "threshold", metric: "goals", operator: ">=", value: 3 }),
    },
    update: {},
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
