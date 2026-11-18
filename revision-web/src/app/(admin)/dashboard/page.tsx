import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Dashboard } from "@/components/dashboard/dashboard";
import { isAdmin, sessionCookie } from "@/lib/auth";
import { submissionSheetUrl, readSubmissions } from "@/lib/submissions";
import { schoolDate } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const metadata = { title: "Quản lý sàng lọc", robots: { index: false, follow: false } };

export default async function DashboardPage() {
  const session = (await cookies()).get(sessionCookie);
  if (!(await isAdmin(session?.value))) redirect("/login");

  const submissions = await readSubmissions().catch(() => {
    console.error("RE:VISION could not load dashboard data.");
    return null;
  });

  return <div className="wrap section stack gap-7">
    <header className="stack">
      <p className="eyebrow">Khu vực quản trị</p>
      <h1 className="page-title">Quản lý sàng lọc</h1>
    </header>
    <Dashboard submissions={submissions ?? []} sheetUrl={submissionSheetUrl()} today={schoolDate()} loadFailed={submissions === null} />
  </div>;
}
