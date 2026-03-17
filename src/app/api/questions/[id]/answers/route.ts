import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { answerSchema } from "@/lib/validations/answer-schema";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(req: Request, { params }: Params) {
  try {
    const user = await getCurrentUserFromCookie();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: questionId } = await params;

    const question = await db.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json({ message: "Question not found" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = answerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const answer = await db.answer.create({
      data: {
        content: parsed.data.content,
        questionId,
        authorId: user.userId,
      },
    });

    // If question has no accepted answer and currently unresolved, move to IN_PROGRESS
    if (!question.acceptedAnswerId && question.status === "UNRESOLVED") {
      await db.question.update({
        where: { id: questionId },
        data: {
          status: "IN_PROGRESS",
        },
      });
    }

    return NextResponse.json(answer, { status: 201 });
  } catch (error) {
    console.error("CREATE_ANSWER_ERROR", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
