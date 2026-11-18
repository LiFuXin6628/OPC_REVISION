"use client";

import { useState, type FormEvent } from "react";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: fields.get("username"), password: fields.get("password") }),
      });
      if (response.ok) {
        window.location.replace("/dashboard");
        return;
      }

      const data = await response.json();
      setError(data.message ?? "Không thể đăng nhập.");
    } catch {
      setError("Không thể kết nối. Vui lòng thử lại.");
    }

    setLoading(false);
  }

  return { login, loading, error };
}
