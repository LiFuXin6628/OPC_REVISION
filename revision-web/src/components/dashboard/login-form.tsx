"use client";

import { LogIn } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function LoginForm() {
  const { login, loading, error } = useAuth();
  return <form method="post" className="stack" onSubmit={login}>
    <label className="field">Tên đăng nhập
      <input name="username" autoComplete="username" required maxLength={256} />
    </label>
    <label className="field">Mật khẩu
      <input type="password" name="password" autoComplete="current-password" required maxLength={1024} />
    </label>
    {error && <p className="error" role="alert">{error}</p>}
    <button className="button" disabled={loading}><LogIn aria-hidden="true" /> {loading ? "Đang đăng nhập…" : "Đăng nhập"}</button>
  </form>;
}

