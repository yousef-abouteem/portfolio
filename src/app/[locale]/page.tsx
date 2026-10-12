import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Home");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold">{t("greeting")}</h1>
      <a
        href="#projects"
        className="rounded-full bg-foreground px-6 py-3 text-background"
      >
        {t("viewProjects")}
      </a>
    </main>
  );
}