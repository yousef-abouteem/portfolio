"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function SignInButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    const { error } = await authClient.signIn.social({
      provider: "github",
      callbackURL: "/admin",
      errorCallbackURL: "/admin/login?error=1",
    });

    if (error) {
      setError(error.message ?? `Error ${error.status}`);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full rounded-full bg-foreground px-6 py-3 text-background transition disabled:opacity-60"
      >
        {loading ? "Redirecting..." : "Sign in with GitHub"}
      </button>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}