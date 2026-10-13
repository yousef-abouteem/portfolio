"use client";

import { useEffect, useRef, useState } from "react";
import SectionLink from "./SectionLink";

type Props = {
  links: { id: string; label: string }[];
};

export default function MobileNav({ links }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={ref} className="relative md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Menu"
        className="inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/50"
      >
        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {open && (
        <ul
          role="menu"
          className="animate-in absolute end-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-border bg-card p-1 shadow-xl"
        >
          {links.map((link) => (
            <li key={link.id} role="none">
              <SectionLink
                role="menuitem"
                section={link.id === "home" ? undefined : link.id}
                onNavigate={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </SectionLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
