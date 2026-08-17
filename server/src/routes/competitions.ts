import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db/client";
import { HttpError } from "../middleware/errorHandler";

export const competitionsRouter = Router();

competitionsRouter.get("/competitions", async (_req, res) => {
  const competitions = await prisma.competition.findMany({
    orderBy: { startDate: "desc" },
    include: { participants: { include: { player: true } } },
  });
  res.json(competitions);
});

const createCompetitionSchema = z.object({
  sport: z.enum(["BASKETBALL", "FOOTBALL"]),
  name: z.string().min(1),
  description: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

competitionsRouter.post("/competitions", async (req, res, next) => {
  try {
    const body = createCompetitionSchema.safeParse(req.body);
    if (!body.success) {
      throw new HttpError(400, "Invalid competition payload", body.error.flatten().fieldErrors);
    }

    const competition = await prisma.competition.create({
      data: {
        sport: body.data.sport,
        name: body.data.name,
        description: body.data.description,
        startDate: new Date(body.data.startDate),
        endDate: new Date(body.data.endDate),
      },
    });
    res.status(201).json(competition);
  } catch (err) {
    next(err);
  }
});

const joinCompetitionSchema = z.object({ playerId: z.string().min(1) });

competitionsRouter.post("/competitions/:id/join", async (req, res, next) => {
  try {
    const body = joinCompetitionSchema.safeParse(req.body);
    if (!body.success) {
      throw new HttpError(400, "Invalid join payload", body.error.flatten().fieldErrors);
    }

    const participant = await prisma.competitionParticipant.upsert({
      where: { competitionId_playerId: { competitionId: req.params.id, playerId: body.data.playerId } },
      create: { competitionId: req.params.id, playerId: body.data.playerId },
      update: {},
    });
    res.status(201).json(participant);
  } catch (err) {
    next(err);
  }
});
