"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useRef } from "react";

export function MobileNav({ links }: { links: { href: string; label: string }[] }) {
  const menu = useRef<HTMLDetailsElement>(null);

  return <details className="mobile-nav" ref={menu}>
    <summary><Menu size={19} aria-hidden="true" /> Danh mục</summary>
    <nav className="menu" aria-label="Điều hướng chính">
      {links.map(({ href, label }) => <Link key={href} href={href} onClick={() => menu.current?.removeAttribute("open")}>{label}</Link>)}
    </nav>
  </details>;
}
