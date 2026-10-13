import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import SignOutButton from "./SignOutButton";
import DeleteProjectButton from "./projects/DeleteProjectButton";

export default async function AdminPage() {
  const session = await requireAdmin();

  const projects = await prisma.project.findMany({
    orderBy: { sortOrder: "asc" },
    include: { translations: { where: { locale: "en" } } },
  });

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 p-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-foreground/60">
            Signed in as {session.user.email}
          </p>
        </div>
        <SignOutButton />
      </header>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Projects ({projects.length})
          </h2>
          <Link
            href="/admin/projects/new"
            className="rounded-full bg-foreground px-4 py-2 text-sm text-background"
          >
            + New project
          </Link>
        </div>

        {projects.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-foreground/20 p-8 text-center text-foreground/60">
            No projects yet.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-foreground/10 rounded-2xl border border-foreground/15">
            {projects.map((project) => {
              const title = project.translations[0]?.title ?? project.slug;
              return (
                <li
                  key={project.id}
                  className="flex items-center justify-between gap-4 p-4"
                >
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="truncate font-medium">{title}</span>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-foreground/60">
                      <span>/{project.slug}</span>
                      <span>· #{project.sortOrder}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 ${
                          project.published
                            ? "bg-green-500/15 text-green-400"
                            : "bg-foreground/10"
                        }`}
                      >
                        {project.published ? "Published" : "Draft"}
                      </span>
                      {project.featured && (
                        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-amber-400">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="rounded-full px-3 py-1.5 text-sm transition hover:bg-foreground/10"
                    >
                      Edit
                    </Link>
                    <DeleteProjectButton id={project.id} title={title} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}