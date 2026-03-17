import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserFromCookie } from "@/lib/auth";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(_: Request, { params }: Params) {
  try {
    const user = await getCurrentUserFromCookie();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const answer = await db.answer.findUnique({
      where: { id },
      include: {
        question: true,
      },
    });

    if (!answer) {
      return NextResponse.json({ message: "Answer not found" }, { status: 404 });
    }

    // Only question owner can accept
    if (answer.question.authorId !== user.userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // If another answer was already accepted, unaccept it first
    if (answer.question.acceptedAnswerId) {
      await db.answer.update({
        where: { id: answer.question.acceptedAnswerId },
        data: {
          isAccepted: false,
        },
      });
    }

    await db.answer.update({
      where: { id: answer.id },
      data: {
        isAccepted: true,
      },
    });

    await db.question.update({
      where: { id: answer.questionId },
      data: {
        acceptedAnswerId: answer.id,
        status: "RESOLVED",
      },
    });

    return NextResponse.json({ message: "Answer accepted" });
  } catch (error) {
    console.error("ACCEPT_ANSWER_ERROR", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
