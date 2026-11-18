import { Banknote, Glasses, HandHeart } from "lucide-react";
import { Action } from "@/components/ui/action";
import { project } from "@/lib/constants";

export const metadata = { title: "Đóng góp và tài trợ" };

const waysToHelp = [
  {
    icon: Glasses,
    title: "Tặng gọng kính",
    description: "Gọng đã qua sử dụng cần còn tốt và có thể tái sử dụng sau kiểm tra. Gọng mới được tiếp nhận theo nhu cầu thực tế. Hãy hỏi ban tổ chức về điểm và giờ nhận gọng.",
  },
  {
    icon: Banknote,
    title: "Đóng góp kinh phí",
    description: "Bạn có thể đóng góp một lần, theo đợt hoặc cho một hạng mục cụ thể. Liên hệ ban tổ chức để xác nhận cách tiếp nhận tiền mặt hoặc chuyển khoản.",
  },
  {
    icon: HandHeart,
    title: "Hỗ trợ vật tư và chuyên môn",
    description: "Các hình thức hỗ trợ gồm tròng kính mới, vật tư làm hoặc sửa kính, dịch vụ kiểm tra thị lực, tư vấn chuyên môn và hỗ trợ làm kính.",
  },
];

export default function Contribute() {
  return <div className="wrap section stack gap-10">
    <header className="stack">
      <p className="eyebrow">Đóng góp và tài trợ</p>
      <h1 className="page-title">Đồng hành cùng RE:VISION</h1>
      <p className="lede">Sự hỗ trợ của bạn giúp trẻ em tại Gia Lai được kiểm tra thị lực và có kính phù hợp khi cần.</p>
    </header>
    <section className="stack">
      <h2>Cách đóng góp</h2>
      <div className="cards-grid">
        {waysToHelp.map(({ icon: Icon, title, description }) => <article className="card stack" key={title}>
          <span className="card-icon"><Icon aria-hidden="true" /></span>
          <h3>{title}</h3>
          <p>{description}</p>
        </article>)}
      </div>
    </section>
    <section className="feature stack">
      <h2>Trao đổi về tài trợ</h2>
      <p className="lede">Doanh nghiệp, tổ chức, cá nhân và đơn vị chuyên môn có thể liên hệ ban tổ chức để thống nhất hình thức đồng hành, hạng mục hỗ trợ và thông tin tiếp nhận.</p>
      <div><Action href={`mailto:${project.email}?subject=${encodeURIComponent("Đồng hành cùng RE:VISION")}`}>Liên hệ ban tổ chức</Action></div>
    </section>
  </div>;
}
