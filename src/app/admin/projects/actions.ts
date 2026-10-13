"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { projectSchema, type ProjectInput } from "@/lib/validations/project";

const LOCALES = ["en", "ar", "tr"] as const;

export type ActionResult = {
  error: string;
  fieldErrors?: Record<string, string>;
};

function toFieldErrors(error: z.ZodError) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

function isSlugTaken(e: unknown) {
  return (
    e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002"
  );
}

function revalidatePublicSite() {
  revalidatePath("/[locale]", "layout");
}

export async function createProject(
  input: ProjectInput,
): Promise<ActionResult | void> {
  await requireAdmin();

  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: "Please fix the errors below.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  const { translations, liveUrl, repoUrl, ...rest } = parsed.data;

  try {
    await prisma.project.create({
      data: {
        ...rest,
        liveUrl: liveUrl || null,
        repoUrl: repoUrl || null,
        translations: {
          create: LOCALES.map((locale) => ({
            locale,
            ...translations[locale],
          })),
        },
      },
    });
  } catch (e) {
    if (isSlugTaken(e)) {
      return {
        error: "Please fix the errors below.",
        fieldErrors: { slug: "This slug is already used." },
      };
    }
    throw e;
  }

  revalidatePublicSite();
  redirect("/admin");
}

export async function updateProject(
  id: string,
  input: ProjectInput,
): Promise<ActionResult | void> {
  await requireAdmin();

  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: "Please fix the errors below.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  const { translations, liveUrl, repoUrl, ...rest } = parsed.data;

  try {
    await prisma.project.update({
      where: { id },
      data: {
        ...rest,
        liveUrl: liveUrl || null,
        repoUrl: repoUrl || null,
        translations: {
          upsert: LOCALES.map((locale) => ({
            where: { projectId_locale: { projectId: id, locale } },
            create: { locale, ...translations[locale] },
            update: translations[locale],
          })),
        },
      },
    });
  } catch (e) {
    if (isSlugTaken(e)) {
      return {
        error: "Please fix the errors below.",
        fieldErrors: { slug: "This slug is already used." },
      };
    }
    throw e;
  }

  revalidatePublicSite();
  redirect("/admin");
}

export async function deleteProject(id: string) {
  await requireAdmin();
  await prisma.project.delete({ where: { id } });
  revalidatePublicSite();
}