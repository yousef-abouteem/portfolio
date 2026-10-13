import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/generated/prisma/client";

function getProject(slug: string, locale: Locale) {
  return prisma.project.findFirst({
    where: { slug, published: true },
    include: { translations: { where: { locale } } },
  });
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProject(slug, locale as Locale);
  const tr = project?.translations[0];
  if (!project || !tr) return {};

  return {
    title: `${tr.title} | Yousef Abouteem`,
    description: tr.summary,
    openGraph: project.coverImage ? { images: [project.coverImage] } : undefined,
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = await getProject(slug, locale as Locale);
  const tr = project?.translations[0];
  if (!project || !tr) notFound();

  const t = await getTranslations("Projects");
  const headingClass =
    "text-sm font-medium uppercase tracking-wider text-muted-foreground rtl:tracking-normal";

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/#projects"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <span className="inline-block rtl:-scale-x-100">←</span>
        {t("back")}
      </Link>

      <header className="mt-8 flex flex-col gap-3">
        <h1 className="text-4xl font-semibold tracking-tight rtl:tracking-normal sm:text-5xl">
          {tr.title}
        </h1>
        <p className="text-lg text-muted-foreground">{tr.summary}</p>
      </header>

      {project.coverImage && (
        <div className="relative mt-10 aspect-video overflow-hidden rounded-2xl border border-border bg-muted">
          <Image
            src={project.coverImage}
            alt={tr.title}
            fill
            priority
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover object-top"
          />
        </div>
      )}

      <div className="mt-12 grid gap-10 md:grid-cols-[1fr_220px]">
        <section className="flex flex-col gap-3">
          <h2 className={headingClass}>{t("overview")}</h2>
          <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
            {tr.description}
          </p>
        </section>

        <aside className="flex flex-col gap-8">
          {project.techStack.length > 0 && (
            <div className="flex flex-col gap-3">
              <h2 className={headingClass}>{t("stack")}</h2>
              <ul className="flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(project.liveUrl || project.repoUrl) && (
            <div className="flex flex-col gap-3">
              <h2 className={headingClass}>{t("links")}</h2>
              <div className="flex flex-col gap-2 text-sm font-medium">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent transition hover:opacity-80"
                  >
                    {t("live")} ↗
                  </a>
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-foreground"
                  >
                    {t("code")} ↗
                  </a>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
