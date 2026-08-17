import { Router } from "express";
import { prisma } from "../db/client";

export const gamesRouter = Router();

gamesRouter.get("/games", async (_req, res) => {
  const games = await prisma.game.findMany({
    orderBy: { playedAt: "desc" },
    take: 50,
    include: { homeTeam: true, awayTeam: true },
  });
  res.json(games);
});

gamesRouter.get("/games/:id", async (req, res, next) => {
  try {
    const game = await prisma.game.findUniqueOrThrow({
      where: { id: req.params.id },
      include: {
        homeTeam: true,
        awayTeam: true,
        stats: { include: { player: true, team: true } },
        awards: { include: { award: true, player: true } },
      },
    });
    res.json(game);
  } catch (err) {
    next(err);
  }
});
