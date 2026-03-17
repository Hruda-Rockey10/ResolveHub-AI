import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signToken, setAuthCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validations/auth-schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }
    const { email, password } = parsed.data;

    const user = await db.user.findUnique({
      where: { email },
    });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }
    const idValid = await bcrypt.compare(password, user.password);
    if (!idValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = await signToken({
      userId: user.id,
      email: user.email,
      names: user.name,
    });

    await setAuthCookie(token);

    return NextResponse.json({ message: "Logged in" });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
