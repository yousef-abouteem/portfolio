import SignInButton from "./SignInButton";

export default async function LoginPage({
  searchParams,
}: PageProps<"/admin/login">) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-sm rounded-2xl border border-foreground/15 p-8 text-center">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <p className="mt-2 text-sm text-foreground/60">
          Sign in to manage your portfolio.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
            This account is not allowed to sign in.
          </p>
        )}

        <div className="mt-6">
          <SignInButton />
        </div>
      </div>
    </main>
  );
}