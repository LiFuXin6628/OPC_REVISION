import { CircleCheck, Plus } from "lucide-react";
import { Action } from "@/components/ui/action";

export const metadata = { title: "Đã lưu phiếu sàng lọc" };

export default function Success() {
  return <div className="narrow section"><div className="feature stack">
    <span className="card-icon"><CircleCheck aria-hidden="true" /></span>
    <h1 className="page-title">Đã lưu phiếu sàng lọc</h1>
    <p className="lede">Bạn có thể tiếp tục nhập phiếu cho học sinh kế tiếp.</p>
    <div className="cluster">
      <Action href="/screening"><Plus aria-hidden="true" /> Nhập tiếp học sinh khác</Action>
      <Action href="/" variant="alt">Về trang chủ</Action>
    </div>
  </div></div>;
}
