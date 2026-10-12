"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];

const labels: Record<Locale, string> = {
  en: "EN",
  ar: "ع",
  tr: "TR",
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div
      dir="ltr"
      className="flex gap-1 rounded-full border border-foreground/20 p-1"
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          disabled={isPending || l === locale}
          aria-current={l === locale ? "true" : undefined}
          className={`rounded-full px-3 py-1 text-sm transition ${
            l === locale
              ? "bg-foreground text-background"
              : "hover:bg-foreground/10"
          }`}
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}