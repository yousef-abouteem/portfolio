import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import type { ExperienceInput } from "@/lib/validations/experience";
import ExperienceForm from "../../ExperienceForm";
import { updateExperience } from "../../actions";

type Locale = "en" | "ar" | "tr";
const toMonth = (date: Date) => date.toISOString().slice(0, 7);

export default async function EditExperiencePage({
  params,
}: PageProps<"/admin/experience/[id]/edit">) {
  await requireAdmin();
  const { id } = await params;

  const exp = await prisma.experience.findUnique({
    where: { id },
    include: { translations: true },
  });
  if (!exp) notFound();

  const translationFor = (locale: Locale) => {
    const tr = exp.translations.find((x) => x.locale === locale);
    return {
      title: tr?.title ?? "",
      organization: tr?.organization ?? "",
      location: tr?.location ?? "",
      description: tr?.description ?? "",
    };
  };

  const initialValues: ExperienceInput = {
    type: exp.type,
    startDate: toMonth(exp.startDate),
    endDate: exp.endDate ? toMonth(exp.endDate) : "",
    url: exp.url ?? "",
    translations: {
      en: translationFor("en"),
      ar: translationFor("ar"),
      tr: translationFor("tr"),
    },
  };

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold">Edit entry</h1>
      <ExperienceForm
        initialValues={initialValues}
        onSubmit={updateExperience.bind(null, exp.id)}
        submitLabel="Save changes"
      />
    </main>
  );
}
