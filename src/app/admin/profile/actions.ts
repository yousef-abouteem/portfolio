"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { profileSchema, type ProfileInput } from "@/lib/validations/profile";

const LOCALES = ["en", "ar", "tr"] as const;

export type ProfileActionResult = {
  ok: boolean;
  message: string;
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

export async function updateProfile(
  input: ProfileInput,
): Promise<ProfileActionResult> {
  await requireAdmin();

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  const { translations, email, githubUrl, linkedinUrl, cvUrl } = parsed.data;

  const fields = {
    email: email || null,
    githubUrl: githubUrl || null,
    linkedinUrl: linkedinUrl || null,
    cvUrl: cvUrl || null,
  };

  await prisma.profile.upsert({
    where: { id: "main" },
    create: {
      id: "main",
      ...fields,
      translations: {
        create: LOCALES.map((locale) => ({ locale, ...translations[locale] })),
      },
    },
    update: {
      ...fields,
      translations: {
        upsert: LOCALES.map((locale) => ({
          where: { profileId_locale: { profileId: "main", locale } },
          create: { locale, ...translations[locale] },
          update: translations[locale],
        })),
      },
    },
  });

  revalidatePublicSite();
  return { ok: true, message: "Profile saved." };
}

function revalidatePublicSite() {
  revalidatePath("/[locale]", "layout");
}