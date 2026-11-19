import { schoolDate, sheetHeaders, symptoms } from "./constants";
import { emptyEye } from "./screening";
import type { Student, Submission } from "@/types";

export function normalizeStoredStudent(student: Partial<Student>, submittedAt: string): Student {
  return {
    ...student,
    school: student.school ?? "",
    surveyDate: student.surveyDate ?? schoolDate(new Date(submittedAt)),
    leftEye: { ...emptyEye(), ...student.leftEye },
    rightEye: { ...emptyEye(), ...student.rightEye },
  } as Student;
}

export function submissionRow(student: Submission): (string | number)[] {
  const eyeRow = (eye: Student["leftEye"]) => [
    eye.uncorrectedVision ?? "", eye.sph ?? "", eye.cyl ?? "", eye.axis ?? "",
    eye.correctedVision ?? "", eye.lensType,
  ];
  return [
    student.id, student.name, student.grade, student.gender, student.date,
    ...symptoms.map((_, i) => student.symptoms.includes(i) ? "CÓ" : "KHÔNG"),
    student.symptoms.length, student.notes, student.submittedAt,
    student.school, student.surveyDate, ...eyeRow(student.leftEye), ...eyeRow(student.rightEye),
  ];
}

export function groupSubmissionsByDate(submissions: Submission[]) {
  const groups = new Map<string, Submission[]>();
  for (const student of submissions) {
    const date = student.surveyDate;
    const group = groups.get(date) ?? [];
    group.push(student);
    groups.set(date, group);
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
}

export { sheetHeaders };
