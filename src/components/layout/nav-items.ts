import { HomeIcon, MatchesIcon, PlayersIcon, ProfileIcon } from "./nav-icons";

/** Shared between BottomNav (mobile/tablet) and Sidebar (desktop) so the two never drift apart. */
export const NAV_ITEMS = [
  { href: "/home", label: "Home", Icon: HomeIcon },
  { href: "/matches", label: "Matches", Icon: MatchesIcon },
  { href: "/players", label: "Players", Icon: PlayersIcon },
  { href: "/profile", label: "Profile", Icon: ProfileIcon },
] as const;
