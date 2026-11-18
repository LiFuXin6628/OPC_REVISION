import { Eye, Glasses, HeartHandshake, ScanEye } from "lucide-react";

const activities = [
  { icon: ScanEye, title: "Sàng lọc thị lực", text: "Ghi nhận dấu hiệu về mắt và phối hợp kiểm tra thị lực tại điểm trường." },
  { icon: Eye, title: "Chăm sóc mắt", text: "Hướng dẫn các em thói quen chăm sóc mắt khi học tập và sinh hoạt." },
  { icon: Glasses, title: "Chọn gọng, làm tròng", text: "Đơn vị chuyên môn kiểm tra gọng và làm tròng mới tùy theo kết quả kiểm tra." },
  { icon: HeartHandshake, title: "Trao kính", text: "Hướng dẫn các em sử dụng và bảo quản kính trong sinh hoạt hằng ngày." },
];

export function Activities() {
  return <div className="cards-grid">
    {activities.map(({ icon: Icon, title, text }, index) => <article key={title} className="card stack" data-motion-reveal="card" data-motion-order={index}>
      <span className="card-icon"><Icon aria-hidden="true" /></span>
      <h3>{title}</h3><p>{text}</p>
    </article>)}
  </div>;
}
