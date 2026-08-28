import express from "express";
import { playersRouter } from "./routes/players";
import { matchesRouter } from "./routes/matches";
import { uploadsRouter } from "./routes/uploads";

const app = express();

// Permissive CORS: this API has no auth of its own yet (see
// prisma/schema.prisma's User model comment — foundation only, not
// wired up) and is meant to be called from the Next.js frontend running
// on a different origin/port during local development. Tighten this to
// an allowlist before this is ever deployed publicly.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json());
// The upload route wants the raw CSV body as text, matching the
// frontend's current `request.text()` contract — scoped to that one path
// so JSON routes elsewhere aren't affected.
app.use("/uploads", express.text({ type: "*/*", limit: "5mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use(playersRouter);
app.use(matchesRouter);
app.use(uploadsRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(
  (err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  },
);

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`Pitchline backend listening on http://localhost:${port}`);
});
