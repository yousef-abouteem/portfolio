import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/generated/prisma/client";
import Hero from "@/components/Hero";
import ProjectsSection from "@/components/ProjectsSection";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as Locale;

  const [profile, projects] = await Promise.all([
    prisma.profile.findUnique({
      where: { id: "main" },
      include: { translations: { where: { locale: lang } } },
    }),
    prisma.project.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      include: { translations: { where: { locale: lang } } },
    }),
  ]);

  const profileText = profile?.translations[0];

  return (
    <main className="mx-auto max-w-5xl px-6">
      <Hero
        headline={profileText?.headline}
        bio={profileText?.bio}
        email={profile?.email}
        githubUrl={profile?.githubUrl}
        linkedinUrl={profile?.linkedinUrl}
        cvUrl={profile?.cvUrl}
      />
      <ProjectsSection projects={projects} />
    </main>
  );
}
