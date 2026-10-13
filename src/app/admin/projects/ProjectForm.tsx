"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { ProjectInput } from "@/lib/validations/project";
import type { ActionResult } from "./actions";
import ImageUpload from "@/components/admin/ImageUpload";

type Locale = "en" | "ar" | "tr";
type TranslationField = "title" | "summary" | "description";

const LOCALES: { code: Locale; label: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
  { code: "tr", label: "Türkçe", dir: "ltr" },
];


const inputClass =
  "w-full rounded-lg border border-foreground/15 bg-transparent px-3 py-2 outline-none transition focus:border-foreground/40";

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

type Props = {
  initialValues: ProjectInput;
  onSubmit: (values: ProjectInput) => Promise<ActionResult | void>;
  submitLabel: string;
};

export default function ProjectForm({
  initialValues,
  onSubmit,
  submitLabel,
}: Props) {
  const [values, setValues] = useState(initialValues);
  const [techInput, setTechInput] = useState(
    initialValues.techStack.join(", "),
  );
  const [activeLocale, setActiveLocale] = useState<Locale>("en");
  const [result, setResult] = useState<ActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const errors = result?.fieldErrors ?? {};

  function update<K extends keyof ProjectInput>(
    key: K,
    value: ProjectInput[K],
  ) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function updateTranslation(
    locale: Locale,
    field: TranslationField,
    value: string,
  ) {
    setValues((v) => ({
      ...v,
      translations: {
        ...v.translations,
        [locale]: { ...v.translations[locale], [field]: value },
      },
    }));
  }

  function localeHasError(locale: Locale) {
    return Object.keys(errors).some((key) =>
      key.startsWith(`translations.${locale}.`),
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload: ProjectInput = {
      ...values,
      techStack: techInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    startTransition(async () => {
      const res = await onSubmit(payload);
      if (res) setResult(res);
    });
  }

  const current = LOCALES.find((l) => l.code === activeLocale)!;
  const t = values.translations[activeLocale];
  const tError = (field: TranslationField) =>
    errors[`translations.${activeLocale}.${field}`];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {result?.error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {result.error}
        </p>
      )}

      {/* Translations */}
      <section className="flex flex-col gap-4 rounded-2xl border border-foreground/15 p-6">
        <div className="flex gap-1 rounded-full border border-foreground/15 p-1 self-start">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setActiveLocale(l.code)}
              className={`relative rounded-full px-4 py-1.5 text-sm transition ${
                activeLocale === l.code
                  ? "bg-foreground text-background"
                  : "hover:bg-foreground/10"
              }`}
            >
              {l.label}
              {localeHasError(l.code) && (
                <span className="absolute -top-0.5 -end-0.5 size-2 rounded-full bg-red-500" />
              )}
            </button>
          ))}
        </div>

        <div dir={current.dir} className="flex flex-col gap-4">
          <Field label="Title" error={tError("title")}>
            <input
              className={inputClass}
              value={t.title}
              onChange={(e) =>
                updateTranslation(activeLocale, "title", e.target.value)
              }
            />
          </Field>

          <Field label="Summary" error={tError("summary")}>
            <input
              className={inputClass}
              value={t.summary}
              onChange={(e) =>
                updateTranslation(activeLocale, "summary", e.target.value)
              }
            />
          </Field>

          <Field label="Description" error={tError("description")}>
            <textarea
              rows={6}
              className={inputClass}
              value={t.description}
              onChange={(e) =>
                updateTranslation(activeLocale, "description", e.target.value)
              }
            />
          </Field>
        </div>
      </section>

      {/* General */}
      <section className="grid gap-4 rounded-2xl border border-foreground/15 p-6 sm:grid-cols-2">
      
              <div className="sm:col-span-2">
          <ImageUpload
            label="Cover image"
            folder="projects"
            value={values.coverImage}
            onChange={(url) => update("coverImage", url)}
            error={errors.coverImage}
          />
        </div>

        <Field label="Slug" error={errors.slug}>
          <input
            className={inputClass}
            value={values.slug}
            placeholder="gym-booking"
            onChange={(e) => update("slug", e.target.value)}
          />
        </Field>

        <Field label="Sort order" error={errors.sortOrder}>
          <input
            type="number"
            min={0}
            className={inputClass}
            value={values.sortOrder}
            onChange={(e) => update("sortOrder", Number(e.target.value))}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Tech stack (comma separated)" error={errors.techStack}>
            <input
              className={inputClass}
              value={techInput}
              placeholder="React, TypeScript, PostgreSQL"
              onChange={(e) => setTechInput(e.target.value)}
            />
          </Field>
        </div>

        <Field label="Live URL" error={errors.liveUrl}>
          <input
            className={inputClass}
            value={values.liveUrl}
            placeholder="https://..."
            onChange={(e) => update("liveUrl", e.target.value)}
          />
        </Field>

        <Field label="Repository URL" error={errors.repoUrl}>
          <input
            className={inputClass}
            value={values.repoUrl}
            placeholder="https://github.com/..."
            onChange={(e) => update("repoUrl", e.target.value)}
          />
        </Field>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={values.published}
            onChange={(e) => update("published", e.target.checked)}
          />
          Published
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={values.featured}
            onChange={(e) => update("featured", e.target.checked)}
          />
          Featured
        </label>
      </section>

      <div className="flex justify-end gap-2">
        <Link
          href="/admin"
          className="rounded-full px-5 py-2.5 text-sm transition hover:bg-foreground/10"
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