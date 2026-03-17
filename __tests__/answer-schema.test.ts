import { answerSchema } from "@/lib/validations/answer-schema";

describe("answerSchema", () => {
  it("should validate a correct answer payload", () => {
    const result = answerSchema.safeParse({
      content: "You can use jose for JWT signing and verification in Next.js route handlers.",
    });

    expect(result.success).toBe(true);
  });

  it("should fail when answer is too short", () => {
    const result = answerSchema.safeParse({
      content: "Hey",
    });

    expect(result.success).toBe(false);
  });
});
