import { Router } from "express";
import { prisma } from "../db/client";

export const playersRouter = Router();

playersRouter.get("/players", async (req, res) => {
  const sport = typeof req.query.sport === "string" ? req.query.sport.toUpperCase() : undefined;
  const players = await prisma.player.findMany({
    where: sport ? { sport: sport as "BASKETBALL" | "FOOTBALL" } : undefined,
    include: { team: true },
    orderBy: { lastName: "asc" },
    take: 100,
  });
  res.json(players);
});

playersRouter.get("/players/:id", async (req, res, next) => {
  try {
    const player = await prisma.player.findUniqueOrThrow({
      where: { id: req.params.id },
      include: {
        team: true,
        gameStats: { include: { game: true }, orderBy: { createdAt: "desc" }, take: 20 },
        awards: { include: { award: true, game: true }, orderBy: { awardedAt: "desc" } },
      },
    });
    res.json(player);
  } catch (err) {
    next(err);
  }
});
