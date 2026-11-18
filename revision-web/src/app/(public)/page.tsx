import Image from "next/image";
import { ArrowDownRight, ArrowUpRight, HeartHandshake, MapPin } from "lucide-react";
import { Action } from "@/components/ui/action";
import { Activities } from "@/components/public/campaign";
import { assets, project } from "@/lib/constants";

export default function Home() {
  return <>
    <section className="section wrap hero">
      <div className="hero-copy motion-intro">
        <p className="eyebrow"><HeartHandshake aria-hidden="true" /> Dự án thiện nguyện của sinh viên Bách khoa</p>
        <h1><span>Kính cũ,</span><span>Tầm nhìn mới</span></h1>
      </div>
      <div className="hero-copy motion-intro">
        <p className="lede">RE:VISION giúp trẻ em tại Gia Lai được kiểm tra thị lực, biết cách chăm sóc mắt và có kính phù hợp khi cần.</p>
        <div className="cluster">
          <Action href="/contribute" variant="rose">Ủng hộ dự án <ArrowUpRight aria-hidden="true" /></Action>
          <Action href="/about" variant="alt">Về dự án <ArrowDownRight aria-hidden="true" /></Action>
        </div>
      </div>
      <figure className="hero-image motion-intro motion-media">
        <Image src={assets.banner} alt="Minh họa trao tặng gọng kính cho RE:VISION" width={1600} height={400} sizes="(max-width: 1248px) 100vw, 1200px" priority />
        <figcaption><MapPin size={16} aria-hidden="true" /> {project.location} · Điểm trường sẽ được công bố khi xác nhận</figcaption>
      </figure>
    </section>
    <section className="section wrap stack">
      <h2 data-motion-reveal="heading">Hoạt động tại điểm trường</h2>
      <Activities />
    </section>
    <section className="wrap mb-12" data-motion-reveal="panel"><div className="feature stack">
      <h2>Cùng giúp các em có kính phù hợp</h2>
      <p className="lede">Bạn có thể tặng gọng kính còn tốt, đóng góp kinh phí, hỗ trợ vật tư hoặc đồng hành bằng chuyên môn.</p>
      <div><Action href="/contribute">Xem cách đóng góp <ArrowUpRight aria-hidden="true" /></Action></div>
    </div></section>
  </>;
}
