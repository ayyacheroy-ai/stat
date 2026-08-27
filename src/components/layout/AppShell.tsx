import type { ReactNode } from "react";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";

/**
 * The persistent app frame: header + content + bottom nav. This is what
 * makes the product feel like an app rather than a stack of web pages —
 * every authenticated route renders inside this shell via
 * app/(app)/layout.tsx.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1 pb-6 pt-4">{children}</main>
      <BottomNav />
    </div>
  );
}
