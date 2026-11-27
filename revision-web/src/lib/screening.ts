import { z } from "zod";
import { defaultSchool, genders, grades, symptoms } from "./constants";

const optionalMeasurement = (min: number, max: number) => z.number().finite().min(min).max(max).nullable().default(null);

export const eyeSchema = z.strictObject({
  uncorrectedVision: optionalMeasurement(0, 10),
  sph: z.number().finite().nullable().default(null),
  cyl: z.number().finite().nullable().default(null),
  axis: z.number().int().min(0).max(180).nullable().default(null),
  correctedVision: optionalMeasurement(0, 10),
  lensType: z.string().trim().max(120).default(""),
});

export const emptyEye = () => eyeSchema.parse({});

export const screeningSchema = z.strictObject({
  name: z.string().trim().min(1, "Vui lòng nhập họ và tên học sinh.").max(120),
  school: z.string().trim().min(1, "Vui lòng nhập tên trường.").max(200).default(defaultSchool),
  grade: z.enum(grades, { error: "Vui lòng chọn lớp." }),
  gender: z.enum(genders).or(z.literal("")).default(""),
  date: z.iso.date({ error: "Ngày khám không hợp lệ." }),
  surveyDate: z.iso.date({ error: "Ngày điền phiếu không hợp lệ." }).optional(),
  leftEye: eyeSchema.default(emptyEye),
  rightEye: eyeSchema.default(emptyEye),
  symptoms: z.array(z.number().int().min(0).max(symptoms.length - 1)).max(symptoms.length)
    .transform(indices => [...new Set(indices)].sort((a, b) => a - b)),
  notes: z.string().trim().max(2000, "Ghi chú tối đa 2.000 ký tự.").default(""),
});
