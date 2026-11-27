import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isAdmin, sessionCookie } from "@/lib/auth";

export const metadata = { robots: { index: false, follow: false } };

export default async function ScreeningLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin((await cookies()).get(sessionCookie)?.value))) redirect("/login");
  return children;
}
