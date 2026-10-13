import { getTranslations } from "next-intl/server";
import type { Project, ProjectTranslation } from "@/generated/prisma/client";
import ProjectCard from "./ProjectCard";
import Reveal from "./Reveal";

type ProjectWithTranslation = Project & { translations: ProjectTranslation[] };

export default async function ProjectsSection({
  projects,
}: {
  projects: ProjectWithTranslation[];
}) {
  const t = await getTranslations("Projects");

  return (
    <section id="projects" className="scroll-mt-20 py-20">
      <Reveal className="mb-10 flex flex-col gap-2">
        <h2 className="text-3xl font-semibold tracking-tight rtl:tracking-normal">
          {t("title")}
        </h2>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </Reveal>

      {projects.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
          {t("empty")}
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => {
            const tr = project.translations[0];
            if (!tr) return null;

            return (
              <Reveal key={project.id} delay={(index % 2) * 120} className="h-full">
                <ProjectCard
                  slug={project.slug}
                  title={tr.title}
                  summary={tr.summary}
                  coverImage={project.coverImage}
                  techStack={project.techStack}
                  liveUrl={project.liveUrl}
                  repoUrl={project.repoUrl}
                  labels={{
                    live: t("live"),
                    code: t("code"),
                    details: t("details"),
                  }}
                />
              </Reveal>
            );
          })}
        </div>
      )}
    </section>
  );
}
