"use client";

import { Download, ExternalLink, LogOut } from "lucide-react";
import { useState } from "react";
import { grades, symptoms } from "@/lib/constants";
import type { Submission } from "@/types";

function normalize(value: string) {
  return value.toLocaleLowerCase("vi").normalize("NFD").replace(/\p{M}/gu, "").replaceAll("đ", "d");
}

export function Dashboard({ submissions, sheetUrl, today, loadFailed }: {
  submissions: Submission[]; sheetUrl: string | null; today: string; loadFailed: boolean;
}) {
  const [query, setQuery] = useState("");
  const [grade, setGrade] = useState("");
  const [symptom, setSymptom] = useState("");
  const [surveyDate, setSurveyDate] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const visible = submissions.filter(student => normalize(student.name).includes(normalize(query.trim()))
    && (!grade || student.grade === grade)
    && (!surveyDate || student.surveyDate === surveyDate)
    && (!symptom || student.symptoms.includes(Number(symptom))));
  const stats = [
    { label: "Phiếu sàng lọc", value: submissions.length },
    { label: "Có dấu hiệu cần kiểm tra", value: submissions.filter(student => student.symptoms.length).length },
    { label: "Lượt khám hôm nay", value: submissions.filter(student => student.date === today).length },
  ];

  async function logout() {
    setPending(true);
    setMessage("");
    try {
      const response = await fetch("/api/auth", { method: "DELETE" });
      if (!response.ok) throw new Error("Logout failed");
      window.location.replace("/login");
    } catch {
      setMessage("Chưa đăng xuất được. Vui lòng thử lại.");
      setPending(false);
    }
  }

  return <div className="stack gap-6">
    <div className="cluster justify-between">
      <div className="cluster">
        {!loadFailed && <>
        <a className="button" href="/api/submissions?format=xlsx"><Download aria-hidden="true" /> Tải Excel</a>
        <a className="button alt" href="/api/submissions?format=csv"><Download aria-hidden="true" /> Tải CSV</a>
        {sheetUrl && <a className="button alt" href={sheetUrl} target="_blank" rel="noreferrer">Google Sheets <ExternalLink aria-hidden="true" /></a>}
        </>}
      </div>
      <button className="button alt" disabled={pending} onClick={logout}><LogOut aria-hidden="true" /> Đăng xuất</button>
    </div>
    {!loadFailed && <p className="text-sm">Excel chia trang tính theo ngày điền phiếu và chứa đủ thông số của hai mắt. CSV chứa toàn bộ phiếu trong một bảng.{!sheetUrl && " Để xem nhiều trang tính trên Google Sheets, tải Excel rồi mở tệp bằng Google Sheets trên Google Drive."}</p>}
    {message && <p className="error" role="alert">{message}</p>}
    {loadFailed ? <div className="error stack" role="alert"><p>Không thể đọc dữ liệu sàng lọc. Vui lòng thử lại hoặc kiểm tra cấu hình lưu trữ.</p><div><a href="/dashboard" className="text-link font-bold">Thử tải lại</a></div></div> : <>
    <dl className="stats">
      {stats.map(({ value, label }) => <div className="stat" key={label}>
        <dt><span>{label}</span></dt><dd><strong>{value}</strong></dd>
      </div>)}
    </dl>
    <section className="card stack">
      <h2>Danh sách phiếu</h2>
      <div className="cards-grid">
        <label className="field">Lọc ngày điền phiếu
          <input type="date" value={surveyDate} onChange={e => setSurveyDate(e.target.value)} />
        </label>
        <label className="field">Tìm theo tên
          <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Nhập họ hoặc tên" />
        </label>
        <label className="field">Lọc theo lớp
          <select value={grade} onChange={e => setGrade(e.target.value)}>
            <option value="">Tất cả các lớp</option>
            {grades.map(label => <option key={label}>{label}</option>)}
          </select>
        </label>
        <label className="field">Lọc theo dấu hiệu
          <select value={symptom} onChange={e => setSymptom(e.target.value)}>
            <option value="">Tất cả dấu hiệu</option>
            {symptoms.map((label, index) => <option key={label} value={index}>{label}</option>)}
          </select>
        </label>
      </div>
      <p className="text-sm" role="status">{visible.length} / {submissions.length} phiếu</p>
      {visible.length ? <div className="table-scroll" tabIndex={0} role="region" aria-label="Kết quả sàng lọc">
        <table>
          <thead><tr>{["Họ và tên", "Trường học", "Lớp", "Giới tính", "Ngày khám", "Ngày điền phiếu", "Kết quả mắt", "Dấu hiệu", "Ghi chú"].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead>
          <tbody>{visible.map(student => <tr key={student.id}>
            <td>{student.name}</td><td>{student.school || "—"}</td><td>{student.grade}</td><td>{student.gender || "—"}</td><td>{student.date}</td><td>{student.surveyDate}</td>
            <td><details><summary className="cursor-pointer font-bold">Xem thông số</summary>
              {[{ label: "Mắt trái", eye: student.leftEye }, { label: "Mắt phải", eye: student.rightEye }].map(({ label, eye }) => <div key={label} className="mb-3 min-w-48">
                <strong>{label}</strong>
                <p>Thị lực không kính {eye.uncorrectedVision == null ? "—" : `${eye.uncorrectedVision}/10`}</p>
                <p>SPH {eye.sph ?? "—"} · CYL {eye.cyl ?? "—"} · AXIS {eye.axis ?? "—"}</p>
                <p>Thị lực có kính {eye.correctedVision == null ? "—" : `${eye.correctedVision}/10`}</p>
                <p>Loại kính {eye.lensType || "—"}</p>
              </div>)}
            </details></td>
            <td>{student.symptoms.length ? <details><summary className="cursor-pointer font-bold">{student.symptoms.length} dấu hiệu</summary>
              <ul className="list-disc pl-5">{student.symptoms.map(index => <li key={index}>{symptoms[index]}</li>)}</ul>
            </details> : "Chưa ghi nhận"}</td>
            <td className="whitespace-pre-wrap">{student.notes || "—"}</td>
          </tr>)}</tbody>
        </table>
      </div> : <p>{submissions.length ? "Không có phiếu phù hợp với bộ lọc." : "Chưa có phiếu sàng lọc nào."}</p>}
    </section>
    </>}
  </div>;
}
