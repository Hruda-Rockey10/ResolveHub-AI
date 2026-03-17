import Link from "next/link";
import { getCurrentUserFromCookie } from "@/lib/auth";
import LogoutButton from "@/components/shared/logout-button";

export default async function Navbar() {
  const user = await getCurrentUserFromCookie();

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold">
          ResolveHub AI
        </Link>

        <nav className="flex items-center gap-3">
          <Link href="/" className="text-sm">
            Home
          </Link>

          {user ? (
            <>
              <Link href="/questions/ask" className="text-sm">
                Ask
              </Link>
              <Link href="/dashboard" className="text-sm">
                Dashboard
              </Link>
              <span className="text-sm text-gray-500">
                Hi, {user.name?.trim() || "User"}
              </span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm">
                Login
              </Link>
              <Link href="/register" className="text-sm">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
