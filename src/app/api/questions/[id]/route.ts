import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { questionSchema } from "@/lib/validations/question-schema";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = await params;

    const question = await db.question.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        answers: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!question) {
      return NextResponse.json(
        { message: "Question not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error("GET_QUESTION_ERROR", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const user = await getCurrentUserFromCookie();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingQuestion = await db.question.findUnique({
      where: { id },
    });

    if (!existingQuestion) {
      return NextResponse.json(
        { message: "Question not found" },
        { status: 404 },
      );
    }

    if (existingQuestion.authorId !== user.userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = questionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }

    const { title, description, difficulty, tags } = parsed.data;

    const updatedQuestion = await db.question.update({
      where: { id },
      data: {
        title,
        description,
        difficulty: difficulty ?? null,
        tags,
      },
    });

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error("UPDATE_QUESTION_ERROR", error);
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

    const existingQuestion = await db.question.findUnique({
      where: { id },
    });

    if (!existingQuestion) {
      return NextResponse.json(
        { message: "Question not found" },
        { status: 404 },
      );
    }

    if (existingQuestion.authorId !== user.userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await db.question.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Question deleted" });
  } catch (error) {
    console.error("DELETE_QUESTION_ERROR", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
