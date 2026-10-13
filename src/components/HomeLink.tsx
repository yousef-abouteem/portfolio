"use client";

import { Link, usePathname } from "@/i18n/navigation";

type Props = {
  children: React.ReactNode;
  className?: string;
  onNavigate?: () => void;
};

export default function HomeLink({ children, className, onNavigate }: Props) {
  const pathname = usePathname();

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    onNavigate?.();
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      history.replaceState(null, "", window.location.pathname);
    }
  }

  return (
    <Link href="/" onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
