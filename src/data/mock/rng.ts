/**
 * Deterministic pseudo-random generation. Mock data must look identical on
 * every reload — never Math.random(), always seeded off something stable
 * like a player's tracker_id.
 */

/** Hashes any string/number into a 32-bit seed (FNV-1a). */
export function hashSeed(input: number | string): number {
  const str = String(input);
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** mulberry32 — small, fast, good-enough-for-demo-data PRNG. */
export function createRng(seed: number): () => number {
  let state = seed >>> 0 || 1;
  return function next() {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randRange(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min);
}

export function randInt(rng: () => number, min: number, max: number): number {
  return Math.round(randRange(rng, min, max));
}

export function pick<T>(rng: () => number, options: readonly T[]): T {
  return options[Math.floor(rng() * options.length) % options.length];
}
