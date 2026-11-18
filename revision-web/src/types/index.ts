import type { z } from "zod";
import type { screeningSchema } from "@/lib/screening";
import type { symptoms } from "@/lib/constants";

export type Student = z.output<typeof screeningSchema>;
export type Symptom = typeof symptoms[number];
export type UserRole = "admin";
export type Submission = Student & { id: number; submittedAt: string };
