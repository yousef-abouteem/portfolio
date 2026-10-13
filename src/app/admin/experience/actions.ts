"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { toFieldErrors } from "@/lib/form-errors";
import {
  experienceSchema,
  type ExperienceInput,
} from "@/lib/validations/experience";

const LOCALES = ["en", "ar", "tr"] as const;

export type ExperienceActionResult = {
  error: string;
  fieldErrors?: Record<string, string>;
};

const toDate = (month: string) => new Date(`${month}-01T00:00:00Z`);

function baseData(data: ExperienceInput) {
  return {
    type: data.type,
    startDate: toDate(data.startDate),
    endDate: data.endDate ? toDate(data.endDate) : null,
    url: data.url || null,
  };
}

function translationData(t: ExperienceInput["translations"]["en"]) {
  return {
    title: t.title,
    organization: t.organization,
    location: t.location || null,
    description: t.description || null,
  };
}

function revalidate() {
  revalidatePath("/[locale]", "layout");
  revalidatePath("/admin/experience");
}

export async function createExperience(
  input: ExperienceInput,
): Promise<ExperienceActionResult | void> {
  await requireAdmin();

  const parsed = experienceSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: toFieldErrors(parsed.error) };
  }

  await prisma.experience.create({
    data: {
      ...baseData(parsed.data),
      translations: {
        create: LOCALES.map((locale) => ({
          locale,
          ...translationData(parsed.data.translations[locale]),
        })),
      },
    },
  });

  revalidate();
  redirect("/admin/experience");
}

export async function updateExperience(
  id: string,
  input: ExperienceInput,
): Promise<ExperienceActionResult | void> {
  await requireAdmin();

  const parsed = experienceSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: toFieldErrors(parsed.error) };
  }

  await prisma.experience.update({
    where: { id },
    data: {
      ...baseData(parsed.data),
      translations: {
        upsert: LOCALES.map((locale) => {
          const t = translationData(parsed.data.translations[locale]);
          return {
            where: { experienceId_locale: { experienceId: id, locale } },
            create: { locale, ...t },
            update: t,
          };
        }),
      },
    },
  });

  revalidate();
  redirect("/admin/experience");
}

export async function deleteExperience(id: string) {
  await requireAdmin();
  await prisma.experience.delete({ where: { id } });
  revalidate();
}
