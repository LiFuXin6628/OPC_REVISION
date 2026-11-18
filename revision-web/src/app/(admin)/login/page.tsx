import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/dashboard/login-form";
import { isAdmin, sessionCookie } from "@/lib/auth";

export const metadata = { title: "Đăng nhập quản trị", robots: { index: false, follow: false } };

export default async function Login() {
  const session = (await cookies()).get(sessionCookie);
  if (await isAdmin(session?.value)) redirect("/dashboard");

  return <div className="narrow section">
    <div className="card stack mx-auto max-w-lg">
      <p className="eyebrow">Khu vực quản trị</p>
      <h1 className="page-title">Đăng nhập</h1>
      <LoginForm />
    </div>
  </div>;
}
