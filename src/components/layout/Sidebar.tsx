"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { appConfig } from "@/config/app-config";
import { NAV_ITEMS } from "./nav-items";

/**
 * Desktop nav — a persistent left rail replacing the bottom tab bar at the
 * `lg` breakpoint, per the brief's "nav can become a sidebar or top bar on
 * desktop." Mobile stays bottom-tab-first; this only ever shows alongside
 * a wider layout, never instead of it.
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 flex-col gap-8 border-r border-border bg-surface px-4 py-6 lg:flex">
      <span className="text-xs font-semibold uppercase tracking-widest text-accent">
        {appConfig.brand.name}
      </span>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-accent/10 text-accent" : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
