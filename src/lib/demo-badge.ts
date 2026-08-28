import { appConfig } from "@/config/app-config";

/**
 * Central gate for the optional "this is demo data" indicator (brief §2:
 * "This lets the UI optionally show a subtle 'demo data' treatment
 * later"). Off by default via app-config.ts's demo.showMockDataBadge —
 * flip that one flag to turn the indicator on everywhere it's wired in,
 * without touching any component.
 */
export function showMockBadge(isMock: boolean): boolean {
  return appConfig.demo.showMockDataBadge && isMock;
}
