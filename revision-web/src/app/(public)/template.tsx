import { PublicMotion } from "@/components/public/public-motion";

export default function PublicTemplate({ children }: { children: React.ReactNode }) {
  return <PublicMotion>{children}</PublicMotion>;
}
