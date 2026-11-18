import Image from "next/image";
import { Activities } from "@/components/public/campaign";
import { Action } from "@/components/ui/action";
import { project } from "@/lib/constants";

export const metadata = { title: "Về dự án" };

export default function About() {
  return <div className="wrap section stack gap-10">
    <section className="split">
      <div className="stack">
        <p className="eyebrow">Về dự án</p>
        <h1 className="page-title">Kính cũ, Tầm nhìn mới</h1>
        <p className="lede">RE:VISION là dự án thiện nguyện của sáu sinh viên năm nhất Trường Đại học Bách khoa – ĐHQG TP.HCM. Dự án giúp trẻ em tại Gia Lai tiếp cận dịch vụ kiểm tra thị lực, đồng thời hỗ trợ kính cho các em có tật khúc xạ và hoàn cảnh khó khăn.</p>
        <p>Nhóm phối hợp với đơn vị chuyên môn để kiểm tra tình trạng và độ phù hợp của gọng đã qua sử dụng. Tái sử dụng gọng còn tốt giúp giảm chi phí, còn tròng kính được làm mới theo kết quả kiểm tra thị lực và nhu cầu của từng em.</p>
      </div>
      <Image
        src="/assets/team_members.jpg"
        alt="Các thành viên dự án RE:VISION"
        width={2560}
        height={1920}
        sizes="(max-width: 480px) calc(100vw - 32px), (max-width: 760px) calc(100vw - 48px), (max-width: 1248px) 37vw, 445px"
        className="h-auto w-full self-center rounded-[var(--radius)]"
      />
    </section>
    <section className="stack"><h2>Hoạt động tại điểm trường</h2><Activities /></section>
    <section className="feature stack">
      <h2>Liên hệ ban tổ chức</h2>
      {project.organizers.map(person => <p key={person.name}>{person.role} · {person.name} · <a className="text-link" href={`tel:+84${person.phone.replaceAll(" ", "").slice(1)}`}>{person.phone}</a></p>)}
      <p>Các thành viên khác được nêu trong hồ sơ gồm Vũ Công Chính, Lê Phúc Tân và Lê Mai Ngọc Linh.</p>
      <p>Fanpage <strong>Re:Vision Project</strong></p>
      <div><Action href={`mailto:${project.email}`} variant="alt">Gửi email cho ban tổ chức</Action></div>
    </section>
  </div>;
}
