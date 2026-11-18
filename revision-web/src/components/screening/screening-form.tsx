"use client";

import { Send } from "lucide-react";
import { genders, grades, symptoms } from "@/lib/constants";
import { useScreeningForm } from "@/hooks/use-screening-form";

export function ScreeningForm({ date }: { date: string }) {
  const { submit, submitting, error } = useScreeningForm();

  return <form method="post" onSubmit={submit} className="card stack gap-7">
    <fieldset disabled={submitting} className="stack">
      <legend>Thông tin học sinh</legend>
      <label className="field">Họ và tên học sinh (bắt buộc)
        <input name="name" required maxLength={120} autoComplete="off" />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="field">Lớp (bắt buộc)
          <select name="grade" required defaultValue="">
            <option value="" disabled>Chọn lớp</option>
            {grades.map(grade => <option key={grade}>{grade}</option>)}
          </select>
        </label>
        <label className="field">Giới tính
          <select name="gender" defaultValue="">
            <option value="">Chưa chọn</option>
            {genders.map(gender => <option key={gender}>{gender}</option>)}
          </select>
        </label>
      </div>
      <label className="field">Ngày khám
        <input type="date" name="date" required defaultValue={date} />
      </label>
    </fieldset>

    <fieldset disabled={submitting}>
      <legend>Dấu hiệu quan sát được</legend>
      <p className="mb-3 text-sm" id="symptom-help">Chọn tất cả dấu hiệu ghi nhận được. Để trống nếu chưa ghi nhận dấu hiệu nào.</p>
      <div className="checklist" aria-describedby="symptom-help">
        {symptoms.map((label, index) => <label key={label} className="check">
          <input type="checkbox" name="symptoms" value={index} /> <span>{label}</span>
        </label>)}
      </div>
    </fieldset>

    <label className="field">Ghi chú thêm (không bắt buộc)
      <textarea name="notes" disabled={submitting} rows={4} maxLength={2000} />
    </label>
    <p className="text-sm">Thông tin được lưu để ban tổ chức quản lý đợt sàng lọc. Chỉ nhập thông tin cần thiết cho việc hỗ trợ học sinh.</p>
    {error && <p className="error" role="alert">{error}</p>}
    <div>
      <button className="button" disabled={submitting}>
        <Send aria-hidden="true" /> {submitting ? "Đang lưu phiếu…" : "Gửi phiếu sàng lọc"}
      </button>
    </div>
  </form>;
}

