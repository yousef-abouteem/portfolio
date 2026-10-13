"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];

const languages: { code: Locale; short: string; name: string }[] = [
  { code: "en", short: "EN", name: "English" },
  { code: "tr", short: "TR", name: "Türkçe" },
  { code: "ar", short: "ع", name: "العربية" },
];

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = languages.find((l) => l.code === locale) ?? languages[0];

  useEffect(() => {
    if (!open) return;

    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function switchTo(next: Locale) {
    setOpen(false);
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={isPending}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Change language"
        className="inline-flex h-9 items-center gap-2 rounded-full border border-border px-3 text-sm text-muted-foreground transition outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/50 disabled:opacity-60"
      >
        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
        <span className="font-medium text-foreground">{current.short}</span>
        <svg
          className={`size-3 transition ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          role="menu"
          className="animate-in absolute end-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-border bg-card p-1 shadow-xl"
        >
          {languages.map((lang) => {
            const active = lang.code === locale;
            return (
              <li key={lang.code} role="none">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => switchTo(lang.code)}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-muted ${
                    active ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <span>{lang.name}</span>
                  {active && (
                    <svg className="size-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
