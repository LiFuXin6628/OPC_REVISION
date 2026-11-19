import type { z } from "zod";
import type { screeningSchema } from "@/lib/screening";
import type { symptoms } from "@/lib/constants";

export type Student = Omit<z.output<typeof screeningSchema>, "surveyDate"> & { surveyDate: string };
export type Symptom = typeof symptoms[number];
export type UserRole = "admin";
export type Submission = Student & { id: number; submittedAt: string };
