import "server-only";
import * as sheets from "./google-sheets";
import { appendLocalSubmission, readLocalSubmissions } from "./local-submissions";
import type { Student, Submission } from "@/types";

function isLocalStorage() {
  const storage = process.env.SUBMISSION_STORAGE || "google-sheets";
  if (storage === "google-sheets") return false;
  if (storage === "sqlite" && !process.env.VERCEL) return true;

  throw new Error("Invalid or unsupported submission storage.");
}

export async function appendSubmission(student: Student): Promise<void> {
  if (isLocalStorage()) {
    appendLocalSubmission(student);
  } else {
    await sheets.appendSubmission(student);
  }
}

export async function readSubmissions(): Promise<Submission[]> {
  return isLocalStorage() ? readLocalSubmissions() : sheets.readSubmissions();
}

export function submissionSheetUrl() {
  return process.env.SUBMISSION_STORAGE === "sqlite" ? null : sheets.googleSheetUrl();
}
