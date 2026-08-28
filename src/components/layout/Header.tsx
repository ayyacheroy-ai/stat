import { appConfig } from "@/config/app-config";

/** Mobile/tablet only — Sidebar shows the brand on desktop instead (see AppShell). */
export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
      <span className="text-xs font-semibold uppercase tracking-widest text-accent">
        {appConfig.brand.name}
      </span>
    </header>
  );
}
