import { redirect } from "next/navigation";

/**
 * The proxy (src/proxy.ts) already sends unauthenticated visitors to
 * /login before this ever renders — this route just picks a landing spot
 * for anyone authenticated who hits the bare root URL. Matches is the
 * product's home screen (brief: Matches → Match → Lineups → Player).
 */
export default function RootPage() {
  redirect("/matches");
}
