import { z } from "zod";
import { genders, grades, symptoms } from "./constants";

export const screeningSchema = z.strictObject({
  name: z.string().trim().min(1, "Vui lòng nhập họ và tên học sinh.").max(120),
  grade: z.enum(grades, { error: "Vui lòng chọn lớp." }),
  gender: z.enum(genders).or(z.literal("")).default(""),
  date: z.iso.date({ error: "Ngày khám không hợp lệ." }),
  symptoms: z.array(z.number().int().min(0).max(symptoms.length - 1)).max(symptoms.length)
    .transform(indices => [...new Set(indices)].sort((a, b) => a - b)),
  notes: z.string().trim().max(2000, "Ghi chú tối đa 2.000 ký tự.").default(""),
});
