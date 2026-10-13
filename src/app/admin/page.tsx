import { requireAdmin } from "@/lib/require-admin";
import SignOutButton from "./SignOutButton";

export default async function AdminPage() {
  const session = await requireAdmin();

  return (
    <main className="mx-auto max-w-4xl p-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-foreground/60">
            Signed in as {session.user.email}
          </p>
        </div>
        <SignOutButton />
      </header>
    </main>
  );
}