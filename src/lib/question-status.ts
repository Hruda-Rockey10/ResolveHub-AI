export type QuestionStatus = "UNRESOLVED" | "IN_PROGRESS" | "RESOLVED";

export function getQuestionStatus(options: {
  answerCount: number;
  hasAcceptedAnswer: boolean;
}): QuestionStatus {
  const { answerCount, hasAcceptedAnswer } = options;

  if (hasAcceptedAnswer) {
    return "RESOLVED";
  }

  if (answerCount > 0) {
    return "IN_PROGRESS";
  }

  return "UNRESOLVED";
}
