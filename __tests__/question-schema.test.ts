import { questionSchema } from "@/lib/validations/question-schema";

describe("questionSchema", () => {
  it("should validate a correct question payload", () => {
    const result = questionSchema.safeParse({
      title: "How to implement JWT auth in Next.js?",
      description: "I want to implement secure JWT auth using HTTP-only cookies.",
      difficulty: "MEDIUM",
      tags: ["nextjs", "jwt", "auth"],
    });

    expect(result.success).toBe(true);
  });

  it("should fail when title is too short", () => {
    const result = questionSchema.safeParse({
      title: "Hi",
      description: "This is a valid description for testing purpose.",
      difficulty: "EASY",
      tags: ["test"],
    });

    expect(result.success).toBe(false);
  });

  it("should fail when more than 8 tags are provided", () => {
    const result = questionSchema.safeParse({
      title: "Valid question title here",
      description: "This is a valid description for testing purpose.",
      difficulty: "HARD",
      tags: ["a", "b", "c", "d", "e", "f", "g", "h", "i"],
    });

    expect(result.success).toBe(false);
  });
});
