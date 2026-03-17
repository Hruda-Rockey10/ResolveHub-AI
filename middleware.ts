import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

async function isAuthenticated(token?: string) {
  if (!token) return false;

  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const authenticated = await isAuthenticated(token);

  const pathname = req.nextUrl.pathname;

  const protectedRoutes = [
    "/dashboard",
    "/questions/ask",
  ];

  const isProtected =
    protectedRoutes.includes(pathname) ||
    /^\/questions\/[^/]+\/edit$/.test(pathname);

  if (isProtected && !authenticated) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/questions/:path*"],
};
