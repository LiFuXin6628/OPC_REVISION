import "server-only";
import { JWT } from "google-auth-library";
import { sheetHeaders, symptoms } from "./constants";
import type { Student, Submission } from "@/types";

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

const range = (cells: string) => `/values/${encodeURIComponent(`'${tab}'!${cells}`)}`;

async function ensureHeader() {
  const { values } = await sheets<{ values?: unknown[][] }>(range("A1:R1"));
  const header = values?.[0] ?? [];
  if (sheetHeaders.every((label, index) => header[index] === label)) return;
  if (header.some((value, index) => value !== "" && value !== sheetHeaders[index])) {
    throw new Error("Submissions sheet has incompatible headers.");
  }

  // Fixed cells make concurrent header writes idempotent.
  await sheets(`${range("A1:R1")}?valueInputOption=RAW`, "PUT", { values: [sheetHeaders] });
}

async function findTabId() {
  const data = await sheets<{ sheets?: { properties: { sheetId: number; title: string } }[] }>(
    "?fields=sheets(properties(sheetId,title))",
  );
  const match = data.sheets?.find(({ properties }) => properties.title === tab);
  if (!match) throw new Error("Submissions tab is missing.");
  return match.properties.sheetId;
}

export async function appendSubmission(student: Student) {
  const [sheetId] = await Promise.all([findTabId(), ensureHeader()]);
  const row = [
    student.name, student.grade, student.gender, student.date,
    ...symptoms.map((_, index) => student.symptoms.includes(index) ? "CÓ" : "KHÔNG"),
    student.symptoms.length, student.notes, new Date().toISOString(),
  ];

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
  const { values } = await sheets<{ values?: unknown[][] }>(`${range("A2:R")}?valueRenderOption=UNFORMATTED_VALUE`);
  return (values ?? []).flatMap((row, index) => {
    if (!row[1]) return [];
    const result: Submission = {
      id: Number(row[0]) || index + 1,
      name: text(row[1]),
      grade: text(row[2]) as Submission["grade"],
      gender: text(row[3]) as Submission["gender"],
      date: text(row[4]),
      symptoms: symptoms.flatMap((_, index) => row[index + 5] === "CÓ" ? [index] : []),
      notes: text(row[16]),
      submittedAt: text(row[17]),
    };
    return [result];
  });
}
