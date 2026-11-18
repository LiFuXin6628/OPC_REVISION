import { NextRequest, NextResponse } from "next/server";
import { isAdmin, sessionCookie } from "@/lib/auth";
import { submissionSheetUrl, readSubmissions } from "@/lib/submissions";
import { errorResponse, noStore } from "@/lib/http";
import { schoolDate } from "@/lib/constants";
import { exportCsv, exportExcel } from "@/lib/submission-export";

export async function GET(request: NextRequest) {
  if (!(await isAdmin(request.cookies.get(sessionCookie)?.value))) {
    return errorResponse("Vui lòng đăng nhập với tài khoản quản trị.", 401);
  }
  const format = request.nextUrl.searchParams.get("format");
  if (format && format !== "csv" && format !== "xlsx") return errorResponse("Định dạng xuất không hợp lệ.", 400);

  try {
    const submissions = await readSubmissions();
    if (!format) return NextResponse.json({ submissions, sheetUrl: submissionSheetUrl() }, { headers: noStore });

    return new NextResponse(format === "csv" ? exportCsv(submissions) : await exportExcel(submissions), {
      headers: {
        ...noStore,
        "Content-Type": format === "csv" ? "text/csv; charset=utf-8" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="revision-sang-loc-${schoolDate()}.${format}"`,
      },
    });
  } catch {
    console.error("RE:VISION could not load or export submissions.");
    return errorResponse("Không thể đọc dữ liệu. Vui lòng thử lại hoặc kiểm tra cấu hình lưu trữ.", 503);
  }
}
