import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { questionSchema } from "@/lib/validations/question-schema";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUserFromCookie();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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

    const question = await db.question.create({
      data: {
        title,
        description,
        difficulty: difficulty ?? null,
        tags,
        authorId: user.userId,
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error("CREATE_QUESTION_ERROR", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const questions = await db.question.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            answers: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error("GET_QUESTIONS_ERROR", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
