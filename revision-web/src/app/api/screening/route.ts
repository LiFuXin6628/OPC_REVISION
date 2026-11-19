import { NextRequest, NextResponse } from "next/server";
import { appendSubmission } from "@/lib/submissions";
import { errorResponse, readJson } from "@/lib/http";
import { screeningSchema } from "@/lib/screening";
import { schoolDate } from "@/lib/constants";

export async function POST(request: NextRequest) {
  const body = await readJson(request, 16_384);
  if (!body.ok) return body.response;
  const student = screeningSchema.safeParse(body.data);
  if (!student.success) return errorResponse("Vui lòng kiểm tra thông tin học sinh, ngày điền phiếu, thị lực (0–10) và AXIS (0–180).", 422);

  try {
    await appendSubmission({ ...student.data, surveyDate: student.data.surveyDate ?? schoolDate() });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    console.error("RE:VISION could not store submission.");
    return errorResponse("Chưa xác nhận được kết quả lưu. Vui lòng kiểm tra với ban tổ chức trước khi gửi lại.", 503);
  }
}
