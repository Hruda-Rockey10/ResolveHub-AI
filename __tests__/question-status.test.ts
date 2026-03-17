import { getQuestionStatus } from "@/lib/question-status";

describe("getQuestionStatus", () => {
  it("should return UNRESOLVED when there are no answers", () => {
    const status = getQuestionStatus({
      answerCount: 0,
      hasAcceptedAnswer: false,
    });

    expect(status).toBe("UNRESOLVED");
  });

  it("should return IN_PROGRESS when answers exist but none accepted", () => {
    const status = getQuestionStatus({
      answerCount: 2,
      hasAcceptedAnswer: false,
    });

    expect(status).toBe("IN_PROGRESS");
  });

  it("should return RESOLVED when an accepted answer exists", () => {
    const status = getQuestionStatus({
      answerCount: 3,
      hasAcceptedAnswer: true,
    });

    expect(status).toBe("RESOLVED");
  });
});
