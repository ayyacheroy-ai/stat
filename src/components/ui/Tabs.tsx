"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface TabDef {
  value: string;
  label: string;
  content: ReactNode;
}

/**
 * Segmented-control tab bar. Content for every tab is passed in already
 * rendered (server components can hand a client component finished JSX as
 * children/props) — this component only ever toggles which one shows.
 */
export function Tabs({ tabs, defaultValue }: { tabs: TabDef[]; defaultValue?: string }) {
  const [active, setActive] = useState(defaultValue ?? tabs[0]?.value);
  const activeTab = tabs.find((tab) => tab.value === active) ?? tabs[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1 rounded-xl bg-surface-2 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActive(tab.value)}
            className={cn(
              "flex-1 rounded-lg py-2 text-sm font-medium transition-colors active:scale-[0.98]",
              tab.value === activeTab?.value
                ? "bg-surface text-foreground shadow-sm shadow-black/20"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab?.content}
    </div>
  );
}
