import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import DeleteExperienceButton from "./DeleteExperienceButton";

const formatDate = new Intl.DateTimeFormat("en", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
}).format;

export default async function ExperiencePage() {
  await requireAdmin();

  const experiences = await prisma.experience.findMany({
    orderBy: { startDate: "desc" },
    include: { translations: { where: { locale: "en" } } },
  });

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Education & Experience</h1>
        <div className="flex gap-2">
          <Link href="/admin" className="rounded-full px-4 py-2 text-sm transition hover:bg-muted">
            Back
          </Link>
          <Link
            href="/admin/experience/new"
            className="rounded-full bg-foreground px-4 py-2 text-sm text-background"
          >
            + New entry
          </Link>
        </div>
      </div>

      <ul className="flex flex-col divide-y divide-border rounded-2xl border border-border">
        {experiences.map((exp) => {
          const tr = exp.translations[0];
          const title = tr?.title ?? "Untitled";
          return (
            <li key={exp.id} className="flex items-center justify-between gap-4 p-4">
              <div className="flex min-w-0 flex-col gap-1">
                <span className="truncate font-medium">{title}</span>
                <span className="text-xs text-muted-foreground">
                  {tr?.organization} · {formatDate(exp.startDate)} —{" "}
                  {exp.endDate ? formatDate(exp.endDate) : "Present"} ·{" "}
                  <span className="capitalize">{exp.type}</span>
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Link
                  href={`/admin/experience/${exp.id}/edit`}
                  className="rounded-full px-3 py-1.5 text-sm transition hover:bg-muted"
                >
                  Edit
                </Link>
                <DeleteExperienceButton id={exp.id} title={title} />
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
