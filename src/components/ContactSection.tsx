import { getTranslations } from "next-intl/server";

export default async function ContactSection({
  email,
}: {
  email?: string | null;
}) {
  const t = await getTranslations("Contact");

  return (
    <section id="contact" className="scroll-mt-20 border-t border-border py-24">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <h2 className="text-4xl font-semibold tracking-tight rtl:tracking-normal sm:text-5xl">
          {t("title")}
        </h2>
        <p className="leading-relaxed text-muted-foreground">{t("text")}</p>
        {email && (
          <>
            <a
              href={`mailto:${email}`}
              className="mt-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:opacity-90"
            >
              {t("button")}
            </a>
            <p dir="ltr" className="text-sm text-muted-foreground">
              {email}
            </p>
          </>
        )}
      </div>
    </section>
  );
}
