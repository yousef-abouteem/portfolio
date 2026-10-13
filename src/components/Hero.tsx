import Image from "next/image";
import { getTranslations } from "next-intl/server";
import HeroBackground from "./HeroBackground";
import SectionLink from "./SectionLink";

type Props = {
  headline?: string;
  bio?: string;
  email?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  cvUrl?: string | null;
  avatarUrl?: string | null;
};

const delay = (ms: number) =>
  ({ "--delay": `${ms}ms` }) as React.CSSProperties;

export default async function Hero({
  headline,
  bio,
  email,
  githubUrl,
  linkedinUrl,
  cvUrl,
  avatarUrl,
}: Props) {
  const t = await getTranslations("Home");

  return (
    <section className="relative isolate flex items-center justify-between gap-10 py-20 sm:py-28">
      <HeroBackground />
      <div className="flex min-w-0 flex-1 flex-col gap-8">
        <div style={delay(0)} className="animate-in flex items-center gap-3">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            {t("available")}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 flex-col gap-3">
              <p style={delay(100)} className="animate-in text-lg text-muted-foreground">
                {t("greeting")}
              </p>
              <h1
                style={delay(200)}
                className="animate-in text-5xl font-semibold tracking-tight rtl:tracking-normal sm:text-6xl"
              >
                {t("name")}
              </h1>
            </div>
            {avatarUrl && (
              <div style={delay(300)} className="animate-in relative shrink-0 md:hidden">
                <div className="absolute -inset-2 rounded-full bg-accent/20 blur-xl" />
                <Image
                  src={avatarUrl}
                  alt={t("name")}
                  width={96}
                  height={96}
                  priority
                  className="relative size-24 rounded-full border border-border object-cover"
                />
              </div>
            )}
          </div>
          {headline && (
            <p
              style={delay(300)}
              className="animate-in text-xl text-muted-foreground sm:text-2xl"
            >
              {headline}
            </p>
          )}
        </div>

        {bio && (
          <p
            style={delay(400)}
            className="animate-in max-w-2xl leading-relaxed text-muted-foreground"
          >
            {bio}
          </p>
        )}

        <div style={delay(500)} className="animate-in flex flex-wrap items-center gap-3">
          <SectionLink section="projects" className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90">
            {t("viewProjects")}
          </SectionLink>

          {cvUrl && (
            <a
              href={cvUrl}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
            >
              {t("downloadCv")}
            </a>
          )}

          {email && (
            <a
              href={`mailto:${email}`}
              className="group/contact inline-flex items-center gap-1.5 px-2 py-2.5 text-sm font-medium text-accent"
            >
              <svg className="size-4 transition-transform duration-300 group-hover/contact:-rotate-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span className="relative">
                {t("contact")}
                <span className="absolute -bottom-0.5 start-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 group-hover/contact:scale-x-100 rtl:origin-right" />
              </span>
              <span className="inline-block transition-transform duration-300 group-hover/contact:translate-x-1 rtl:-scale-x-100 rtl:group-hover/contact:-translate-x-1">→</span>
            </a>
          )}
        </div>

        <div
          style={delay(600)}
          className="animate-in flex items-center gap-4 text-muted-foreground"
        >
          {githubUrl && (
            <a
              href={githubUrl}
              aria-label="GitHub"
              className="transition duration-200 hover:scale-110 hover:text-[#181717] dark:hover:text-white"
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.6 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
              </svg>
            </a>
          )}

          {linkedinUrl && (
            <a
              href={linkedinUrl}
              aria-label="LinkedIn"
              className="transition duration-200 hover:scale-110 hover:text-[#0A66C2]"
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {avatarUrl && (
        <div style={delay(300)} className="animate-in group relative hidden shrink-0 md:block">
          <div className="absolute -inset-3 rounded-full bg-accent/20 blur-2xl transition-all duration-500 group-hover:-inset-4 group-hover:bg-accent/25" />
          <Image
            src={avatarUrl}
            alt={t("name")}
            width={224}
            height={224}
            priority
            className="relative size-56 rounded-full border border-border object-cover transition duration-500 group-hover:scale-[1.02] group-hover:border-accent/30"
          />
        </div>
      )}
    </section>
  );
}
