"use client";

import { Link, usePathname } from "@/i18n/navigation";

type Props = {
  section?: string;
  children: React.ReactNode;
  className?: string;
  role?: string;
  onNavigate?: () => void;
};

export default function SectionLink({
  section,
  children,
  className,
  role,
  onNavigate,
}: Props) {
  const pathname = usePathname();
  const href = section ? `/#${section}` : "/";

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    onNavigate?.();
    if (pathname !== "/") return;

    e.preventDefault();
    if (section) {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    history.replaceState(null, "", window.location.pathname);
  }

  return (
    <Link href={href} onClick={handleClick} className={className} role={role}>
      {children}
    </Link>
  );
}
