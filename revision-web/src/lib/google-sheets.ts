import "server-only";
import { JWT } from "google-auth-library";
import { sheetHeaders, symptoms } from "./constants";
import type { Student, Submission } from "@/types";
import { normalizeStoredStudent, submissionRow } from "./submission-data";

const tab = "Submissions";
const text = (value: unknown) => String(value ?? "");
let client: JWT | undefined;

export function googleSheetUrl() {
  const id = process.env.GOOGLE_SHEET_ID;
  return id ? `https://docs.google.com/spreadsheets/d/${encodeURIComponent(id)}/edit` : null;
}

async function sheets<T>(suffix: string, method: "GET" | "PUT" | "POST" = "GET", data?: object) {
  const id = process.env.GOOGLE_SHEET_ID;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replaceAll("\\n", "\n");
  if (!id || !email || !key) throw new Error("Google Sheets configuration is incomplete.");

  client ??= new JWT({ email, key, scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
  const result = await client.request<T>({
    url: `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(id)}${suffix}`,
    method, data, timeout: 10_000, retry: false,
  });
  return result.data;
}

async function listTabs() {
  const data = await sheets<{ sheets?: { properties: { sheetId: number; title: string } }[] }>(
    "?fields=sheets(properties(sheetId,title))",
  );
  return data.sheets?.map(({ properties }) => properties) ?? [];
}

async function findOrCreateDailyTab(date: string) {
  const existing = (await listTabs()).find(sheet => sheet.title === date);
  if (existing) return existing.sheetId;
  const sheetId = Number(date.replaceAll("-", ""));
  try {
    await sheets(":batchUpdate", "POST", {
      requests: [
        { addSheet: { properties: { sheetId, title: date, gridProperties: { columnCount: sheetHeaders.length, frozenRowCount: 1 } } } },
        { updateCells: {
          start: { sheetId, rowIndex: 0, columnIndex: 0 },
          rows: [{ values: sheetHeaders.map(label => ({ userEnteredValue: { stringValue: label } })) }],
          fields: "userEnteredValue",
        } },
      ],
    });
    return sheetId;
  } catch (error) {
    // Another simultaneous request may have created the same date tab.
    const created = (await listTabs()).find(sheet => sheet.title === date);
    if (!created) throw error;
    return created.sheetId;
  }
}

export async function appendSubmission(student: Student) {
  const sheetId = await findOrCreateDailyTab(student.surveyDate);
  const row = submissionRow({ ...student, id: 0, submittedAt: new Date().toISOString() }).slice(1);
  // Treat input as literal text. Only the application-generated STT cell is a formula.
  const values = [
    { userEnteredValue: { formulaValue: "=ROW()-1" } },
    ...row.map(value => ({
      userEnteredValue: typeof value === "number" ? { numberValue: value } : { stringValue: value },
    })),
  ];
  await sheets(":batchUpdate", "POST", {
    requests: [{ appendCells: { sheetId, rows: [{ values }], fields: "userEnteredValue" } }],
  });
}

export async function readSubmissions() {
  const tabs = (await listTabs()).filter(sheet => sheet.title === tab || /^\d{4}-\d{2}-\d{2}$/.test(sheet.title));
  if (!tabs.length) return [];
  const ranges = tabs.map(sheet => `ranges=${encodeURIComponent(`'${sheet.title}'!A2:${sheet.title === tab ? "R" : "AF"}`)}`).join("&");
  const data = await sheets<{ valueRanges?: { values?: unknown[][] }[] }>(`/values:batchGet?${ranges}&valueRenderOption=UNFORMATTED_VALUE`);
  let id = 0;
  return (data.valueRanges ?? []).flatMap(result => (result.values ?? []).flatMap(row => {
    if (!row[1]) return [];
    const measurement = (value: unknown) => value === "" || value == null ? null : Number(value);
    const eye = (offset: number) => ({
      uncorrectedVision: measurement(row[offset]), sph: measurement(row[offset + 1]),
      cyl: measurement(row[offset + 2]), axis: measurement(row[offset + 3]),
      correctedVision: measurement(row[offset + 4]), lensType: text(row[offset + 5]),
    });
    const submittedAt = text(row[17]);
    const result: Submission = {
      ...normalizeStoredStudent({
        school: text(row[18]), surveyDate: text(row[19]) || undefined,
        leftEye: eye(20), rightEye: eye(26),
      }, submittedAt),
      id: ++id,
      name: text(row[1]),
      grade: text(row[2]) as Submission["grade"],
      gender: text(row[3]) as Submission["gender"],
      date: text(row[4]),
      symptoms: symptoms.flatMap((_, index) => row[index + 5] === "CÓ" ? [index] : []),
      notes: text(row[16]),
      submittedAt,
    };
    return [result];
  }));
}
