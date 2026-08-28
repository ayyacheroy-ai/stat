import type { ReactNode } from "react";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";

/**
 * The persistent app frame. Mobile/tablet: header + content + bottom tab
 * bar. Desktop (`lg`+): a left sidebar rail instead, with the header and
 * bottom nav hidden — Header and BottomNav each guard their own
 * visibility per breakpoint, so this component just lays out both and
 * lets CSS decide which is actually shown.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <Sidebar />
      <div className="flex min-h-dvh flex-1 flex-col">
        <Header />
        <main className="flex-1 pb-6 pt-4">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
