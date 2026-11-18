"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { screeningSchema } from "@/lib/screening";

export function useScreeningForm() {
  const router = useRouter();
  const busy = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    setError("");

    const fields = new FormData(event.currentTarget);
    const result = screeningSchema.safeParse({
      name: fields.get("name"), grade: fields.get("grade"), gender: fields.get("gender"),
      date: fields.get("date"), symptoms: fields.getAll("symptoms").map(Number), notes: fields.get("notes"),
    });
    if (!result.success) {
      setError("Vui lòng kiểm tra họ tên, lớp, ngày khám và ghi chú.");
      return;
    }

    busy.current = true;
    setSubmitting(true);
    try {
      const response = await fetch("/api/screening", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(result.data),
      });
      if (response.ok) {
        router.replace("/screening/success");
        return;
      }
      const data = await response.json();
      setError(data.message ?? "Gửi phiếu chưa thành công.");
    } catch {
      setError("Mất kết nối khi gửi phiếu. Vui lòng kiểm tra kết nối và xác nhận với ban tổ chức trước khi gửi lại.");
    }

    busy.current = false;
    setSubmitting(false);
  }

  return { submit, submitting, error };
}
