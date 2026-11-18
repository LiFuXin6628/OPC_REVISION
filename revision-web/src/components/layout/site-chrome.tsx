import Link from "next/link";
import Image from "next/image";
import { assets, project } from "@/lib/constants";
import { MobileNav } from "./mobile-nav";

const links = [
  { href: "/", label: "Trang chủ" },
  { href: "/about", label: "Về dự án" },
  { href: "/screening", label: "Sàng lọc" },
  { href: "/contribute", label: "Ủng hộ" },
];

function Brand() {
  return <Link className="brand" href="/">
    <Image src={assets.logo} width={46} height={46} alt="" /> RE:VISION
  </Link>;
}

export function Header() {
  return <header className="header"><div className="wrap header-row">
    <Brand />
    <nav className="nav" aria-label="Điều hướng chính">
      {links.map(({ href, label }) => <Link key={href} href={href} className={href === "/contribute" ? "button rose" : undefined}>{label}</Link>)}
    </nav>
    <MobileNav links={links} />
  </div></header>;
}

export function Footer() {
  return <footer className="footer"><div className="wrap footer-row">
    <Brand />
    <a href={`mailto:${project.email}`}>{project.email}</a>
    <Link href="/login">Quản trị viên</Link>
  </div></footer>;
}
