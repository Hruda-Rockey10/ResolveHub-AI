import Link from "next/link";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function DashboardPage() {
  const user = await getCurrentUserFromCookie();

  if (!user) {
    return null;
  }

  const myQuestions = await db.question.findMany({
    where: {
      authorId: user.userId,
    },
    include: {
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

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-xl border p-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome, {user.name?.trim() || "User"}
          </p>
        </div>

        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">My Questions</h2>

            <Link
              href="/questions/ask"
              className="rounded-md bg-black px-4 py-2 text-white"
            >
              Ask New Question
            </Link>
          </div>

          {myQuestions.length === 0 ? (
            <div className="rounded-xl border p-8 text-center">
              <h3 className="text-xl font-semibold">No questions yet</h3>
              <p className="mt-2 text-gray-600">
                Start by posting your first question.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myQuestions.map((question) => (
                <div key={question.id} className="rounded-xl border p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <Link
                        href={`/questions/${question.id}`}
                        className="text-xl font-semibold hover:underline"
                      >
                        {question.title}
                      </Link>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded-full border px-3 py-1 text-xs">
                          {question.status}
                        </span>

                        {question.difficulty && (
                          <span className="rounded-full border px-3 py-1 text-xs">
                            {question.difficulty}
                          </span>
                        )}
                      </div>

                      {question.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {question.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-gray-100 px-3 py-1 text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="text-sm text-gray-500">
                      {question._count.answers} answers
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
