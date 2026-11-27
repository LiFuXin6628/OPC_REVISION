import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, ShieldCheck } from "lucide-react";
import { assets, project } from "@/lib/constants";
import { MobileNav } from "./mobile-nav";
import { cookies } from "next/headers";
import { isAdmin, sessionCookie } from "@/lib/auth";

const publicLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/about", label: "Về dự án" },
  { href: "/contribute", label: "Ủng hộ" },
];

function Brand() {
  return <Link className="brand" href="/">
    <Image src={assets.logo} width={46} height={46} alt="" /> RE:VISION
  </Link>;
}

export async function Header() {
  const admin = await isAdmin((await cookies()).get(sessionCookie)?.value);
  const links = admin ? [
    ...publicLinks.slice(0, 2),
    { href: "/screening", label: "Sàng lọc" },
    { href: "/dashboard", label: "Quản lý" },
    ...publicLinks.slice(2),
  ] : publicLinks;
  return <header className="header"><div className="wrap header-row">
    <Brand />
    <nav className="nav" aria-label="Điều hướng chính">
      {links.map(({ href, label }) => <Link key={href} href={href} className={href === "/contribute" ? "button rose" : undefined}>{label}</Link>)}
    </nav>
    <MobileNav links={links} />
  </div></header>;
}

export function Footer() {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(project.address)}`;

  return <footer className="footer">
    <div className="wrap footer-row">
      <div className="footer-brands">
        <Brand />
        <Image className="footer-university" src="/assets/bk_name_vi.png" alt="Trường Đại học Bách khoa – ĐHQG TP.HCM" width={3701} height={534} sizes="225px" />
      </div>
      <address className="footer-contact">
        <a href={`mailto:${project.email}`}><Mail aria-hidden="true" /> {project.email}</a>
        <a href={mapUrl} target="_blank" rel="noreferrer"><MapPin aria-hidden="true" /> {project.address}</a>
      </address>
      <Link className="button footer-admin" href="/login">
        <ShieldCheck aria-hidden="true" /> Quản trị viên
      </Link>
    </div>
  </footer>;
}
