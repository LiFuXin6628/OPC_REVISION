import Image from "next/image";
import { assets, schoolDate } from "@/lib/constants";
import { ScreeningForm } from "@/components/screening/screening-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Phiếu sàng lọc thị lực" };

export default function Screening() {
  return <div className="narrow section stack">
    <Image className="screen-banner" src={assets.banner} alt="" width={1600} height={400} sizes="(max-width: 868px) 100vw, 820px" />
    <p className="eyebrow">Dành cho quản trị viên</p>
    <h1 className="page-title">Phiếu sàng lọc thị lực</h1>
    <p className="lede">Ghi nhận các dấu hiệu quan sát được ở học sinh để hỗ trợ buổi kiểm tra thị lực.</p>
    <ScreeningForm date={schoolDate()} />
  </div>;
}
