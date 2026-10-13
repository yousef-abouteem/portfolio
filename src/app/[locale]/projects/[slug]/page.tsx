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
                    className="cursor-default rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground transition duration-200 hover:-translate-y-0.5 hover:border-foreground/30 hover:bg-muted hover:text-foreground"
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
                  <a href={project.liveUrl} className="group flex items-center gap-3 rounded-xl border border-border px-4 py-3 transition hover:border-foreground/20 hover:bg-muted">
                    <svg className="size-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                      <path d="M2 12h20" />
                    </svg>
                    <span>{t("live")}</span>
                    <span className="ms-auto inline-block text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:text-foreground rtl:-scale-x-100">↗</span>
                  </a>
                )}
                {project.repoUrl && (
                  <a href={project.repoUrl} className="group flex items-center gap-3 rounded-xl border border-border px-4 py-3 transition hover:border-foreground/20 hover:bg-muted">
                    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.6 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
                    </svg>
                    <span>{t("code")}</span>
                    <span className="ms-auto inline-block text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:text-foreground rtl:-scale-x-100">↗</span>
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
