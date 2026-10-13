import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";

export default async function Header() {
  const t = await getTranslations("Nav");

  const links = [
    { id: "projects", label: t("projects") },
    { id: "about", label: t("about") },
    { id: "contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-6">
        <Link href="/" dir="ltr" className="font-semibold tracking-tight">
          Yousef<span className="text-accent">.</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          {links.map((link) => (
            <Link
              key={link.id}
              href={`/#${link.id}`}
              className="transition hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}