"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { ExperienceInput } from "@/lib/validations/experience";
import type { ExperienceActionResult } from "./actions";

type Locale = "en" | "ar" | "tr";
type Field = "title" | "organization" | "location" | "description";

const LOCALES: { code: Locale; label: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
  { code: "tr", label: "Türkçe", dir: "ltr" },
];

const inputClass =
  "w-full rounded-lg border border-border bg-transparent px-3 py-2 outline-none transition focus:border-foreground/40";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {error && <span className="text-sm text-red-400">{error}</span>}
    </label>
  );
}

export default function ExperienceForm({
  initialValues,
  onSubmit,
  submitLabel,
}: {
  initialValues: ExperienceInput;
  onSubmit: (values: ExperienceInput) => Promise<ExperienceActionResult | void>;
  submitLabel: string;
}) {
  const [values, setValues] = useState(initialValues);
  const [activeLocale, setActiveLocale] = useState<Locale>("en");
  const [result, setResult] = useState<ExperienceActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const errors = result?.fieldErrors ?? {};
  const current = LOCALES.find((l) => l.code === activeLocale)!;
  const t = values.translations[activeLocale];
  const tError = (f: Field) => errors[`translations.${activeLocale}.${f}`];

  function updateTranslation(field: Field, value: string) {
    setValues((v) => ({
      ...v,
      translations: {
        ...v.translations,
        [activeLocale]: { ...v.translations[activeLocale], [field]: value },
      },
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await onSubmit(values);
      if (res) setResult(res);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {result?.error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {result.error}
        </p>
      )}

      <section className="grid gap-4 rounded-2xl border border-border p-6 sm:grid-cols-2">
        <Field label="Type" error={errors.type}>
          <select
            className={inputClass}
            value={values.type}
            onChange={(e) =>
              setValues((v) => ({ ...v, type: e.target.value as ExperienceInput["type"] }))
            }
          >
            <option value="work">Work</option>
            <option value="education">Education</option>
            <option value="certificate">Certificate</option>
          </select>
        </Field>

        <Field label="Link (optional)" error={errors.url}>
          <input
            className={inputClass}
            value={values.url}
            placeholder="https://..."
            onChange={(e) => setValues((v) => ({ ...v, url: e.target.value }))}
          />
        </Field>

        <Field label="Start" error={errors.startDate}>
          <input
            type="month"
            className={inputClass}
            value={values.startDate}
            onChange={(e) => setValues((v) => ({ ...v, startDate: e.target.value }))}
          />
        </Field>

        <Field label="End (leave empty if current)" error={errors.endDate}>
          <input
            type="month"
            className={inputClass}
            value={values.endDate}
            onChange={(e) => setValues((v) => ({ ...v, endDate: e.target.value }))}
          />
        </Field>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-border p-6">
        <div className="flex gap-1 self-start rounded-full border border-border p-1">
          {LOCALES.map((l) => {
            const hasError = Object.keys(errors).some((k) =>
              k.startsWith(`translations.${l.code}.`),
            );
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => setActiveLocale(l.code)}
                className={`relative rounded-full px-4 py-1.5 text-sm transition ${
                  activeLocale === l.code
                    ? "bg-foreground text-background"
                    : "hover:bg-muted"
                }`}
              >
                {l.label}
                {hasError && (
                  <span className="absolute -top-0.5 -end-0.5 size-2 rounded-full bg-red-500" />
                )}
              </button>
            );
          })}
        </div>

        <div dir={current.dir} className="grid gap-4 sm:grid-cols-2">
          <Field label="Title" error={tError("title")}>
            <input
              className={inputClass}
              value={t.title}
              placeholder="Frontend Developer"
              onChange={(e) => updateTranslation("title", e.target.value)}
            />
          </Field>
          <Field label="Organization" error={tError("organization")}>
            <input
              className={inputClass}
              value={t.organization}
              placeholder="Company / University"
              onChange={(e) => updateTranslation("organization", e.target.value)}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Location (optional)" error={tError("location")}>
              <input
                className={inputClass}
                value={t.location}
                placeholder="Istanbul, Türkiye"
                onChange={(e) => updateTranslation("location", e.target.value)}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Description (optional)" error={tError("description")}>
              <textarea
                rows={4}
                className={inputClass}
                value={t.description}
                onChange={(e) => updateTranslation("description", e.target.value)}
              />
            </Field>
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-2">
        <Link
          href="/admin/experience"
          className="rounded-full px-5 py-2.5 text-sm transition hover:bg-muted"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-foreground px-5 py-2.5 text-sm text-background transition disabled:opacity-60"
        >
          {isPending ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
