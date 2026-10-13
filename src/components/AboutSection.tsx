import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/generated/prisma/client";

export default async function AboutSection({ locale }: { locale: Locale }) {
  const t = await getTranslations("About");

  const [skillGroups, experiences] = await Promise.all([
    prisma.skillGroup.findMany({
      orderBy: { sortOrder: "asc" },
      include: { translations: { where: { locale } } },
    }),
    prisma.experience.findMany({
      orderBy: { startDate: "desc" },
      include: { translations: { where: { locale } } },
    }),
  ]);

  const formatDate = new Intl.DateTimeFormat(
    locale === "ar" ? "ar-u-nu-latn" : locale,
    { month: "short", year: "numeric" },
  ).format;

  const languages = [
    { name: t("arabic"), level: t("native") },
    { name: t("english"), level: t("working") },
    { name: t("turkish"), level: t("basic") },
  ];

  const headingClass =
    "text-sm font-medium uppercase tracking-wider text-muted-foreground rtl:tracking-normal";

  return (
    <section id="about" className="scroll-mt-20 border-t border-border py-20">
      <div className="mb-12 flex flex-col gap-2">
        <h2 className="text-3xl font-semibold tracking-tight rtl:tracking-normal">
          {t("title")}
        </h2>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="grid gap-16 md:grid-cols-2">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-6">
            <h3 className={headingClass}>{t("skills")}</h3>
            {skillGroups.map((group) => (
              <div key={group.id} className="flex flex-col gap-3">
                <p className="font-medium">{group.translations[0]?.name}</p>
                <ul className="flex flex-wrap gap-1.5">
                  {group.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <h3 className={headingClass}>{t("languages")}</h3>
            <dl className="flex flex-col">
              {languages.map((lang) => (
                <div
                  key={lang.name}
                  className="flex items-center justify-between border-b border-border py-3 last:border-b-0"
                >
                  <dt className="font-medium">{lang.name}</dt>
                  <dd className="text-sm text-muted-foreground">{lang.level}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className={headingClass}>{t("journey")}</h3>
          <ol className="flex flex-col gap-10 border-s border-border">
            {experiences.map((exp) => {
              const tr = exp.translations[0];
              if (!tr) return null;

              return (
                <li key={exp.id} className="relative ps-6">
                  <span className="absolute -start-[5px] top-1.5 size-2.5 rounded-full bg-accent ring-4 ring-background" />
                  <p className="text-xs text-muted-foreground">
                    {formatDate(exp.startDate)} —{" "}
                    {exp.endDate ? formatDate(exp.endDate) : t("present")}
                  </p>
                  <p className="mt-1 font-medium">{tr.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {tr.organization}
                    {tr.location && ` · ${tr.location}`}
                  </p>
                  {tr.description && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {tr.description}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
