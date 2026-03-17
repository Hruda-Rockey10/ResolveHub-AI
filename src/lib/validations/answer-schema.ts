import { z } from "zod";

export const answerSchema = z.object({
  content: z
    .string()
    .min(5, "Answer must be at least 5 characters")
    .max(5000, "Answer must be less than 5000 characters"),
});
