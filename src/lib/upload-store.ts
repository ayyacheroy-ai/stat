import type { MetricBag } from "@/types/metrics";

/**
 * In-memory only, by design: the brief scopes this build stage to "no
 * real backend, database" (see AGENTS.md §3/§9) — this demonstrates the
 * upload -> merge -> re-render mechanism end to end without one. A real
 * backend would persist this to the database instead, and getPlayers()
 * wouldn't need to change at all when that happens.
 *
 * Stored on `globalThis` rather than a plain module-level variable:
 * Next.js can compile route handlers and page/server components into
 * separate module graphs, so a `const` here isn't guaranteed to be the
 * same instance everywhere — a route handler and a page would each get
 * their own empty Map, and an upload would silently vanish for anything
 * but the route that received it. `globalThis` is the actual JS global
 * object for the process, shared regardless of how the module was
 * bundled — the same trick commonly used for a singleton DB client in
 * Next.js apps.
 *
 * Known limitation: this only works within a single long-lived server
 * process (fine for `npm run dev` / `npm run start`, or any traditional
 * Node host). On a serverless platform like Vercel, separate requests can
 * land on separate instances that don't share this memory, so an upload
 * may not reliably show up on every page. Fixing that requires the real
 * backend this stage explicitly doesn't build yet.
 */
declare global {
  var __pitchlineUploadedMetrics: Map<number, MetricBag> | undefined;
}

function getStore(): Map<number, MetricBag> {
  if (!globalThis.__pitchlineUploadedMetrics) {
    globalThis.__pitchlineUploadedMetrics = new Map();
  }
  return globalThis.__pitchlineUploadedMetrics;
}

export function applyUploadedMetrics(trackerId: number, metrics: MetricBag): void {
  const store = getStore();
  const existing = store.get(trackerId) ?? {};
  store.set(trackerId, { ...existing, ...metrics });
}

export function getUploadedMetrics(trackerId: number): MetricBag {
  return getStore().get(trackerId) ?? {};
}
