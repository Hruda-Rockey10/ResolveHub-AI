import { z } from "zod";

export const questionSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(150, "Title must be less than 150 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must be less than 5000 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).nullable().optional(),
  tags: z.array(z.string()).max(8, "Maximum 8 tags allowed"),
});
