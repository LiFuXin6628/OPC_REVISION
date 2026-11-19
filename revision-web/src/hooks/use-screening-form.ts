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
    function eyeValues(side: string) {
      const measurement = (key: string) => {
        const value = String(fields.get(`${side}.${key}`) ?? "").trim();
        return value === "" ? null : Number(value);
      };
      return {
        uncorrectedVision: measurement("uncorrectedVision"),
        sph: measurement("sph"), cyl: measurement("cyl"), axis: measurement("axis"),
        correctedVision: measurement("correctedVision"),
        lensType: String(fields.get(`${side}.lensType`) ?? ""),
      };
    }
    const result = screeningSchema.safeParse({
      name: fields.get("name"), grade: fields.get("grade"), gender: fields.get("gender"),
      school: fields.get("school"), surveyDate: fields.get("surveyDate"),
      leftEye: eyeValues("leftEye"), rightEye: eyeValues("rightEye"),
      date: fields.get("date"), symptoms: fields.getAll("symptoms").map(Number), notes: fields.get("notes"),
    });
    if (!result.success) {
      setError("Vui lòng kiểm tra thông tin học sinh, ngày điền phiếu và các thông số mắt.");
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
