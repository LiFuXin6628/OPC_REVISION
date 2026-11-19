import "server-only";
import { Workbook } from "exceljs";
import { sheetHeaders, submissionRow, groupSubmissionsByDate } from "./submission-data";
import type { Submission } from "@/types";

function rows(submissions: Submission[]) {
  return [sheetHeaders, ...submissions.map(submissionRow)];
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
  const groups = groupSubmissionsByDate(submissions);
  if (!groups.length) groups.push(["Chua co du lieu", []]);
  for (const [date, students] of groups) {
    const sheet = workbook.addWorksheet(date, { views: [{ state: "frozen", ySplit: 1 }] });
    sheet.addRows(rows(students));
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).alignment = { wrapText: true, vertical: "middle" };
    sheet.getRow(1).height = 48;
    sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: sheetHeaders.length } };
    sheet.columns.forEach((column, index) => { column.width = index === 0 ? 7 : 26; });
  }
  const buffer = await workbook.xlsx.writeBuffer();
  return new Uint8Array(buffer);
}
