import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSession, sessionCookie, sessionLifetime, signingKey } from "@/lib/auth";
import { errorResponse, isSameOrigin, noStore, readJson } from "@/lib/http";

const credentials = z.strictObject({
  username: z.string().min(1).max(256),
  password: z.string().min(1).max(1024),
});

const cookieOptions = {
  httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/",
} as const;

function equal(a: string, b: string) {
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(a), digest(b));
}

export async function POST(request: NextRequest) {
  const body = await readJson(request, 8192);
  if (!body.ok) return body.response;
  const login = credentials.safeParse(body.data);
  if (!login.success) return errorResponse("Vui lòng kiểm tra tên đăng nhập và mật khẩu.", 400);

  const key = signingKey();
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!key || !username || !password) {
    // Log variable names only so deployment logs can diagnose setup without exposing credentials.
    const invalid = [!username && "ADMIN_USERNAME", !password && "ADMIN_PASSWORD", !key && "JWT_SECRET (minimum 32 bytes)"].filter(Boolean);
    console.error("RE:VISION invalid admin configuration:", invalid.join(", "));
    return errorResponse("Quản trị viên chưa được cấu hình. Vui lòng kiểm tra ADMIN_USERNAME, ADMIN_PASSWORD và JWT_SECRET trên môi trường triển khai, sau đó deploy lại.", 503);
  }

  const correctUser = equal(login.data.username, username);
  const correctPassword = equal(login.data.password, password);
  if (!correctUser || !correctPassword) return errorResponse("Tên đăng nhập hoặc mật khẩu chưa đúng.", 401);

  const response = NextResponse.json({ ok: true }, { headers: noStore });
  response.cookies.set(sessionCookie, await createSession(username, key), { ...cookieOptions, maxAge: sessionLifetime });
  return response;
}

export async function DELETE(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return errorResponse("Yêu cầu không hợp lệ.", 403);
  }

  const response = NextResponse.json({ ok: true }, { headers: noStore });
  response.cookies.set(sessionCookie, "", { ...cookieOptions, maxAge: 0 });
  return response;
}

