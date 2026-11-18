import { NextRequest, NextResponse } from "next/server";

export const noStore = { "Cache-Control": "private, no-store" };

export function errorResponse(message: string, status: number) {
  return NextResponse.json({ message }, { status, headers: noStore });
}

export function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.slice(0, -1);
  return Boolean(host && origin === protocol + "://" + host);
}

export async function readJson(request: NextRequest, limit: number) {
  if (!isSameOrigin(request)) {
    return { ok: false, response: errorResponse("Yêu cầu không hợp lệ.", 403) } as const;
  }
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") {
    return { ok: false, response: errorResponse("Định dạng yêu cầu không hợp lệ.", 415) } as const;
  }

  const reader = request.body?.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let input = "";
  try {
    if (!reader) throw new Error("Missing body");
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel();
        return { ok: false, response: errorResponse("Dữ liệu vượt giới hạn cho phép.", 413) } as const;
      }
      input += decoder.decode(value, { stream: true });
    }
    return { ok: true, data: JSON.parse(input + decoder.decode()) as unknown } as const;
  } catch {
    return { ok: false, response: errorResponse("Dữ liệu không hợp lệ.", 400) } as const;
  }
}

