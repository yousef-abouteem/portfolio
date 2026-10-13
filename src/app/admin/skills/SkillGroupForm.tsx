"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { SkillGroupInput } from "@/lib/validations/skill-group";
import {
  saveSkillGroup,
  deleteSkillGroup,
  type SkillGroupActionResult,
} from "./actions";

const LOCALES = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
  { code: "tr", label: "Türkçe", dir: "ltr" },
] as const;

const inputClass =
  "w-full rounded-lg border border-border bg-transparent px-3 py-2 outline-none transition focus:border-foreground/40";

export default function SkillGroupForm({
  id,
  initialValues,
}: {
  id: string | null;
  initialValues: SkillGroupInput;
}) {
  const router = useRouter();
  const [names, setNames] = useState(initialValues.names);
  const [skillsText, setSkillsText] = useState(initialValues.skills.join(", "));
  const [sortOrder, setSortOrder] = useState(initialValues.sortOrder);
  const [result, setResult] = useState<SkillGroupActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const errors = result?.fieldErrors ?? {};

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await saveSkillGroup(id, {
        names,
        sortOrder,
        skills: skillsText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      setResult(res);
      if (res.ok) {
        if (!id) {
          setNames({ en: "", ar: "", tr: "" });
          setSkillsText("");
          setSortOrder(0);
        }
        router.refresh();
      }
    });
  }

  function handleDelete() {
    if (!id || !confirm("Delete this skill group?")) return;
    startTransition(async () => {
      await deleteSkillGroup(id);
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={handleSave}
      className="flex flex-col gap-4 rounded-2xl border border-border p-6"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {LOCALES.map((l) => (
          <label key={l.code} className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Name ({l.label})</span>
            <input
              dir={l.dir}
              className={inputClass}
              value={names[l.code]}
              onChange={(e) =>
                setNames((n) => ({ ...n, [l.code]: e.target.value }))
              }
            />
            {errors[`names.${l.code}`] && (
              <span className="text-sm text-red-400">
                {errors[`names.${l.code}`]}
              </span>
            )}
          </label>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Skills (comma separated)</span>
          <input
            className={inputClass}
            value={skillsText}
            placeholder="React, Next.js, TypeScript"
            onChange={(e) => setSkillsText(e.target.value)}
          />
          {errors.skills && (
            <span className="text-sm text-red-400">{errors.skills}</span>
          )}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Order</span>
          <input
            type="number"
            min={0}
            className={inputClass}
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="flex items-center gap-2">
        {result && (
          <p className={`text-sm ${result.ok ? "text-green-500" : "text-red-400"}`}>
            {result.message}
          </p>
        )}
        <div className="ms-auto flex gap-2">
          {id && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="rounded-full px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
            >
              Delete
            </button>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-foreground px-4 py-2 text-sm text-background transition disabled:opacity-60"
          >
            {isPending ? "Saving..." : id ? "Save" : "Add group"}
          </button>
        </div>
      </div>
    </form>
  );
}
