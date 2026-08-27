import { appConfig } from "@/config/app-config";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
      <span className="text-xs font-semibold uppercase tracking-widest text-accent">
        {appConfig.brand.name}
      </span>
    </header>
  );
}
