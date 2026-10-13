"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { ProfileInput } from "@/lib/validations/profile";
import { updateProfile, type ProfileActionResult } from "./actions";

type Locale = "en" | "ar" | "tr";
type TranslationField = "headline" | "bio";

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

export default function ProfileForm({
  initialValues,
}: {
  initialValues: ProfileInput;
}) {
  const [values, setValues] = useState(initialValues);
  const [activeLocale, setActiveLocale] = useState<Locale>("en");
  const [result, setResult] = useState<ProfileActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const errors = result?.fieldErrors ?? {};

  function update(
    key: "email" | "githubUrl" | "linkedinUrl" | "cvUrl",
    value: string,
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
    startTransition(async () => {
      setResult(await updateProfile(values));
    });
  }

  const current = LOCALES.find((l) => l.code === activeLocale)!;
  const t = values.translations[activeLocale];
  const tError = (field: TranslationField) =>
    errors[`translations.${activeLocale}.${field}`];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {result && (
        <p
          className={`rounded-lg px-4 py-3 text-sm ${
            result.ok
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {result.message}
        </p>
      )}

      {/* Translations */}
      <section className="flex flex-col gap-4 rounded-2xl border border-foreground/15 p-6">
        <div className="flex gap-1 self-start rounded-full border border-foreground/15 p-1">
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
          <Field label="Headline" error={tError("headline")}>
            <input
              className={inputClass}
              value={t.headline}
              onChange={(e) =>
                updateTranslation(activeLocale, "headline", e.target.value)
              }
            />
          </Field>

          <Field label="Bio" error={tError("bio")}>
            <textarea
              rows={5}
              className={inputClass}
              value={t.bio}
              onChange={(e) =>
                updateTranslation(activeLocale, "bio", e.target.value)
              }
            />
          </Field>
        </div>
      </section>

      {/* Contact & links */}
      <section className="grid gap-4 rounded-2xl border border-foreground/15 p-6 sm:grid-cols-2">
        <Field label="Contact email" error={errors.email}>
          <input
            type="email"
            className={inputClass}
            value={values.email}
            placeholder="you@example.com"
            onChange={(e) => update("email", e.target.value)}
          />
        </Field>

        <Field label="GitHub URL" error={errors.githubUrl}>
          <input
            className={inputClass}
            value={values.githubUrl}
            placeholder="https://github.com/..."
            onChange={(e) => update("githubUrl", e.target.value)}
          />
        </Field>

        <Field label="LinkedIn URL" error={errors.linkedinUrl}>
          <input
            className={inputClass}
            value={values.linkedinUrl}
            placeholder="https://linkedin.com/in/..."
            onChange={(e) => update("linkedinUrl", e.target.value)}
          />
        </Field>

        <Field label="CV URL" error={errors.cvUrl}>
          <input
            className={inputClass}
            value={values.cvUrl}
            placeholder="https://..."
            onChange={(e) => update("cvUrl", e.target.value)}
          />
        </Field>
      </section>

      <div className="flex justify-end gap-2">
        <Link
          href="/admin"
          className="rounded-full px-5 py-2.5 text-sm transition hover:bg-foreground/10"
        >
          Back
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-foreground px-5 py-2.5 text-sm text-background transition disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save profile"}
        </button>
      </div>
    </form>
  );
}