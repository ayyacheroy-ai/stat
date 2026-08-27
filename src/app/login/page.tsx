import { login } from "@/lib/auth/actions";
import { appConfig } from "@/config/app-config";
import { Button } from "@/components/ui/Button";

/**
 * Fake login — see src/lib/auth. Any input (or none) logs in; there's no
 * real backend behind this. Kept as a plain server-action form so it
 * works with zero client JS.
 */
export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      <div className="flex w-full max-w-sm flex-col gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">
            {appConfig.brand.name}
          </span>
          <h1 className="font-display text-3xl text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground">{appConfig.brand.tagline}</p>
        </div>

        <form action={login} className="flex flex-col gap-3">
          <input
            name="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            className="h-12 rounded-xl border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            className="h-12 rounded-xl border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
          />
          <Button type="submit" className="mt-2 w-full">
            Continue
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Demo build — any email and password will sign you in.
        </p>
      </div>
    </div>
  );
}
