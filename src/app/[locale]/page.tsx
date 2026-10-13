import { getTranslations, setRequestLocale } from "next-intl/server";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/generated/prisma/client";
import ThemeToggle from "@/components/ThemeToggle";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Home");
  const lang = locale as Locale;

  const [profile, projects] = await Promise.all([
    prisma.profileTranslation.findUnique({
      where: { profileId_locale: { profileId: "main", locale: lang } },
    }),
    prisma.project.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      include: { translations: { where: { locale: lang } } },
    }),
  ]);

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-12 p-8">
         <div className="flex justify-end gap-2">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>

      <section className="flex flex-col gap-3">
        <h1 className="text-4xl font-bold">{t("greeting")}</h1>
        <p className="text-xl text-foreground/70">{profile?.headline}</p>
        <p className="text-foreground/70">{profile?.bio}</p>
      </section>

      <section id="projects" className="flex flex-col gap-4">
        {projects.map((project) => {
          const tr = project.translations[0];
          return (
            <article
              key={project.id}
              className="rounded-2xl border border-foreground/15 p-6"
            >
              <h2 className="text-2xl font-semibold">{tr?.title}</h2>
              <p className="mt-2 text-foreground/70">{tr?.summary}</p>
              <ul className="mt-4 flex flex-wrap gap-2" dir="ltr">
                {project.techStack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full bg-foreground/10 px-3 py-1 text-sm"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </section>
    </main>
  );
}