import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import type { ProjectInput } from "@/lib/validations/project";
import ProjectForm from "../../ProjectForm";
import { updateProject } from "../../actions";

type Locale = "en" | "ar" | "tr";

export default async function EditProjectPage({
  params,
}: PageProps<"/admin/projects/[id]/edit">) {
  await requireAdmin();
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: { translations: true },
  });

  if (!project) notFound();

  const translationFor = (locale: Locale) => {
    const tr = project.translations.find((x) => x.locale === locale);
    return {
      title: tr?.title ?? "",
      summary: tr?.summary ?? "",
      description: tr?.description ?? "",
    };
  };

  const initialValues: ProjectInput = {
    slug: project.slug,
    techStack: project.techStack,
    liveUrl: project.liveUrl ?? "",
    repoUrl: project.repoUrl ?? "",
    featured: project.featured,
    published: project.published,
    sortOrder: project.sortOrder,
    translations: {
      en: translationFor("en"),
      ar: translationFor("ar"),
      tr: translationFor("tr"),
    },
  };

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold">Edit project</h1>
      <ProjectForm
        initialValues={initialValues}
        onSubmit={updateProject.bind(null, project.id)}
        submitLabel="Save changes"
      />
    </main>
  );
}