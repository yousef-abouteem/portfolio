"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteExperience } from "./actions";

export default function DeleteExperienceButton({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteExperience(id);
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="rounded-full px-3 py-1.5 text-sm text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
