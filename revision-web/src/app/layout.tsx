import type { Metadata } from "next";
import { Footer, Header } from "@/components/layout/site-chrome";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "RE:VISION – Kính cũ, Tầm nhìn mới", template: "%s | RE:VISION" },
  description: "Dự án thiện nguyện hỗ trợ kiểm tra thị lực, chăm sóc mắt và trao kính phù hợp cho trẻ em tại Gia Lai.",
  icons: { icon: "/assets/Logo.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi">
    <body className="flex min-h-screen flex-col">
      <a className="sr-only focus:not-sr-only" href="#main">Đến nội dung chính</a>
      <Header />
      <main id="main" className="flex-1">{children}</main>
      <Footer />
    </body>
  </html>;
}
