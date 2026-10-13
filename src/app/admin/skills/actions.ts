"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { toFieldErrors } from "@/lib/form-errors";
import {
  skillGroupSchema,
  type SkillGroupInput,
} from "@/lib/validations/skill-group";

const LOCALES = ["en", "ar", "tr"] as const;

export type SkillGroupActionResult = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
};

function revalidate() {
  revalidatePath("/[locale]", "layout");
  revalidatePath("/admin/skills");
}

export async function saveSkillGroup(
  id: string | null,
  input: SkillGroupInput,
): Promise<SkillGroupActionResult> {
  await requireAdmin();

  const parsed = skillGroupSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  const { skills, sortOrder, names } = parsed.data;

  if (id) {
    await prisma.skillGroup.update({
      where: { id },
      data: {
        skills,
        sortOrder,
        translations: {
          upsert: LOCALES.map((locale) => ({
            where: { skillGroupId_locale: { skillGroupId: id, locale } },
            create: { locale, name: names[locale] },
            update: { name: names[locale] },
          })),
        },
      },
    });
  } else {
    await prisma.skillGroup.create({
      data: {
        skills,
        sortOrder,
        translations: {
          create: LOCALES.map((locale) => ({ locale, name: names[locale] })),
        },
      },
    });
  }

  revalidate();
  return { ok: true, message: "Saved." };
}

export async function deleteSkillGroup(id: string) {
  await requireAdmin();
  await prisma.skillGroup.delete({ where: { id } });
  revalidate();
}
