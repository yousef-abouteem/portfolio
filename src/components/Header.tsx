import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileNav from "./MobileNav";

export default async function Header() {
  const t = await getTranslations("Nav");
  const profile = await prisma.profile.findUnique({
    where: { id: "main" },
    select: { email: true },
  });

  const links = [
    { id: "home", label: t("home"), href: "/" },
    { id: "projects", label: t("projects"), href: "/#projects" },
    { id: "about", label: t("about"), href: "/#about" },
    { id: "contact", label: t("contact"), href: "/#contact" },
  ];

  return (
    <header
      dir="ltr"
      className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md"
    >
      <div className="grid h-16 w-full grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 lg:px-10">
        <Link href="/" className="group/logo inline-flex items-center gap-2.5 justify-self-start">
          <span className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-base font-bold transition group-hover/logo:border-accent/50">
            Y<span className="text-accent">.</span>
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Yousef<span className="text-accent">.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-border bg-card/60 p-1 text-[15px] font-medium text-muted-foreground md:flex">
          {links.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className="rounded-full px-6 py-1.5 transition hover:bg-muted hover:text-foreground lg:px-9"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="col-start-3 flex items-center justify-self-end gap-2">
          <MobileNav links={links} />
          <ThemeToggle />
          <LanguageSwitcher />
          {profile?.email && (
            <a
              href={`mailto:${profile.email}`}
              aria-label={t("email")}
              className="inline-flex h-9 items-center gap-2 rounded-full bg-accent px-3 text-sm font-medium text-accent-foreground transition hover:opacity-90 sm:px-4"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span className="hidden sm:inline">{t("email")}</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
