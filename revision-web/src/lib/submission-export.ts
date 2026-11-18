import "server-only";
import { Workbook } from "exceljs";
import { sheetHeaders, symptoms } from "./constants";
import type { Submission } from "@/types";

function rows(submissions: Submission[]) {
  return [sheetHeaders, ...submissions.map(student => [
    student.id, student.name, student.grade, student.gender, student.date,
    ...symptoms.map((_, i) => student.symptoms.includes(i) ? "CÓ" : "KHÔNG"),
    student.symptoms.length, student.notes, student.submittedAt,
  ])];
}

export function exportCsv(submissions: Submission[]) {
  return "\uFEFF" + rows(submissions).map(row => row.map(cell => {
    const value = String(cell);
    const safe = /^[\s\uFEFF]*[=+\-@]|^[\t\r\n]/u.test(value) ? "'" + value : value;
    return '"' + safe.replaceAll('"', '""') + '"';
  }).join(",")).join("\r\n");
}

export async function exportExcel(submissions: Submission[]) {
  const workbook = new Workbook();
  const sheet = workbook.addWorksheet("Submissions", { views: [{ state: "frozen", ySplit: 1 }] });
  sheet.addRows(rows(submissions));
  sheet.getRow(1).font = { bold: true };
  sheet.autoFilter = "A1:R1";
  sheet.columns.forEach((column, index) => { column.width = index === 0 ? 7 : 26; });
  const buffer = await workbook.xlsx.writeBuffer();
  return new Uint8Array(buffer);
}
