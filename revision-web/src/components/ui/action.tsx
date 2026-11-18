import Link from "next/link";
import type { ReactNode } from "react";

export function Action({ href, children, variant = "" }: {
  href: string; children: ReactNode; variant?: "rose" | "alt" | "";
}) {
  return <Link href={href} className={`button ${variant}`}>{children}</Link>;
}
