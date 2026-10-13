import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { emptySkillGroup } from "@/lib/validations/skill-group";
import SkillGroupForm from "./SkillGroupForm";

export default async function SkillsPage() {
  await requireAdmin();

  const groups = await prisma.skillGroup.findMany({
    orderBy: { sortOrder: "asc" },
    include: { translations: true },
  });

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Skills</h1>
        <Link
          href="/admin"
          className="rounded-full px-4 py-2 text-sm transition hover:bg-muted"
        >
          Back
        </Link>
      </div>

      {groups.map((group) => {
        const nameFor = (locale: "en" | "ar" | "tr") =>
          group.translations.find((t) => t.locale === locale)?.name ?? "";

        return (
          <SkillGroupForm
            key={`${group.id}-${group.updatedAt.toISOString()}`}
            id={group.id}
            initialValues={{
              skills: group.skills,
              sortOrder: group.sortOrder,
              names: { en: nameFor("en"), ar: nameFor("ar"), tr: nameFor("tr") },
            }}
          />
        );
      })}

      <h2 className="mt-6 text-lg font-semibold">Add a new group</h2>
      <SkillGroupForm id={null} initialValues={emptySkillGroup} />
    </main>
  );
}
