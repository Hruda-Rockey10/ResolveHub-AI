import { NextResponse } from "next/server";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { generateDraftAnswer } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUserFromCookie();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const title = body.title?.trim();
    const description = body.description?.trim();

    if (!title || !description) {
      return NextResponse.json(
        { message: "Title and description are required" },
        { status: 400 }
      );
    }

    const draft = await generateDraftAnswer({ title, description });

    return NextResponse.json({ draft });
  } catch (error) {
    console.error("AI_DRAFT_ANSWER_ERROR", error);
    return NextResponse.json(
      { message: "Failed to generate draft answer" },
      { status: 500 }
    );
  }
}
