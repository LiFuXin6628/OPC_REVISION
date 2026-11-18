import { NextRequest, NextResponse } from "next/server";
import { appendSubmission } from "@/lib/submissions";
import { errorResponse, readJson } from "@/lib/http";
import { screeningSchema } from "@/lib/screening";

export async function POST(request: NextRequest) {
  const body = await readJson(request, 16_384);
  if (!body.ok) return body.response;
  const student = screeningSchema.safeParse(body.data);
  if (!student.success) return errorResponse("Vui lòng kiểm tra họ tên, lớp, ngày khám và các thông tin đã chọn.", 422);

  try {
    await appendSubmission(student.data);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    console.error("RE:VISION could not store submission.");
    return errorResponse("Chưa xác nhận được kết quả lưu. Vui lòng kiểm tra với ban tổ chức trước khi gửi lại.", 503);
  }
}
