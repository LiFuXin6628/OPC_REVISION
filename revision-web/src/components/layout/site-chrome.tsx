import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin } from "lucide-react";
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
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(project.address)}`;

  return <footer className="footer">
    <div className="wrap footer-row">
      <Brand />
      <address className="footer-contact">
        <a href={`mailto:${project.email}`}><Mail aria-hidden="true" /> {project.email}</a>
        <a href={mapUrl} target="_blank" rel="noreferrer"><MapPin aria-hidden="true" /> {project.address}</a>
      </address>
      <div className="footer-school">
        <Image src="/assets/bk_name_vi.png" alt="Trường Đại học Bách khoa – ĐHQG TP.HCM" width={3701} height={534} sizes="225px" />
        <Link href="/login">Quản trị viên</Link>
      </div>
    </div>
  </footer>;
}
