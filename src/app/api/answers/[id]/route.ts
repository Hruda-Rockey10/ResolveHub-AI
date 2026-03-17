import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { answerSchema } from "@/lib/validations/answer-schema";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(req: Request, { params }: Params) {
  try {
    const user = await getCurrentUserFromCookie();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingAnswer = await db.answer.findUnique({
      where: { id },
    });

    if (!existingAnswer) {
      return NextResponse.json({ message: "Answer not found" }, { status: 404 });
    }

    if (existingAnswer.authorId !== user.userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = answerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const updatedAnswer = await db.answer.update({
      where: { id },
      data: {
        content: parsed.data.content,
      },
    });

    return NextResponse.json(updatedAnswer);
  } catch (error) {
    console.error("UPDATE_ANSWER_ERROR", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const user = await getCurrentUserFromCookie();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingAnswer = await db.answer.findUnique({
      where: { id },
      include: {
        question: true,
      },
    });

    if (!existingAnswer) {
      return NextResponse.json({ message: "Answer not found" }, { status: 404 });
    }

    if (existingAnswer.authorId !== user.userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const questionId = existingAnswer.questionId;
    const wasAccepted = existingAnswer.isAccepted;

    await db.answer.delete({
      where: { id },
    });

    if (wasAccepted) {
      await db.question.update({
        where: { id: questionId },
        data: {
          acceptedAnswerId: null,
          status: "IN_PROGRESS",
        },
      });
    }

    const remainingAnswers = await db.answer.count({
      where: { questionId },
    });

    if (remainingAnswers === 0) {
      await db.question.update({
        where: { id: questionId },
        data: {
          status: "UNRESOLVED",
          acceptedAnswerId: null,
        },
      });
    }

    return NextResponse.json({ message: "Answer deleted" });
  } catch (error) {
    console.error("DELETE_ANSWER_ERROR", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
