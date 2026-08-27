import { logout } from "@/lib/auth/actions";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function ProfilePage() {
  return (
    <Container className="flex flex-col gap-4">
      <h1 className="font-display text-2xl text-foreground">Profile</h1>
      <Card className="flex flex-col gap-4">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Signed in as
          </div>
          <div className="font-display text-xl text-foreground">Demo User</div>
        </div>
        <p className="text-sm text-muted-foreground">
          This is a fake login for the demo — no account or password is checked.
        </p>
        <form action={logout}>
          <Button type="submit" variant="secondary" className="w-full">
            Log out
          </Button>
        </form>
      </Card>
    </Container>
  );
}
