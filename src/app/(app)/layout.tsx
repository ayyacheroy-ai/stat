import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";

/**
 * Every authenticated route lives under this group so it gets the shared
 * header + bottom nav for free. Route protection itself happens in
 * src/proxy.ts, not here — this layout is purely visual.
 */
export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
