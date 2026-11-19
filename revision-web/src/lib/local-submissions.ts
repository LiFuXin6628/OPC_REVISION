import "server-only";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import type { Student, Submission } from "@/types";
import { normalizeStoredStudent } from "./submission-data";

function withDatabase<T>(operation: (db: DatabaseSync) => T): T {
  const directory = join(process.cwd(), ".data");
  mkdirSync(directory, { recursive: true });

  const db = new DatabaseSync(join(directory, "revision.sqlite"));
  try {
    db.exec(`
      PRAGMA busy_timeout = 5000;
      CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_json TEXT NOT NULL,
        submitted_at TEXT NOT NULL
      ) STRICT;
    `);
    return operation(db);
  } finally {
    db.close();
  }
}

export function appendLocalSubmission(student: Student) {
  withDatabase(db => {
    db.prepare("INSERT INTO submissions (student_json, submitted_at) VALUES (?, ?)")
      .run(JSON.stringify(student), new Date().toISOString());
  });
}

export function readLocalSubmissions(): Submission[] {
  return withDatabase(db => db.prepare("SELECT id, student_json, submitted_at FROM submissions ORDER BY id")
    .all()
    .map(row => ({
      ...normalizeStoredStudent(JSON.parse(row.student_json as string), String(row.submitted_at)),
      id: Number(row.id),
      submittedAt: String(row.submitted_at),
    })));
}
