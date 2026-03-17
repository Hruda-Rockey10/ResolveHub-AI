import Link from "next/link";
import { db } from "@/lib/db";
import QuestionsFeed from "@/components/questions/questions-feed";

export default async function HomePage() {
  const questions = await db.question.findMany({
    include: {
      author: {
        select: {
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

  const serializedQuestions = questions.map((question) => ({
    ...question,
    createdAt: question.createdAt.toISOString(),
  }));

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">ResolveHub AI</h1>
            <p className="mt-2 text-gray-600">
              Ask questions, get answers, and track resolution.
            </p>
          </div>

          <Link
            href="/questions/ask"
            className="rounded-md bg-black px-4 py-2 text-white"
          >
            Ask a Question
          </Link>
        </div>

        <QuestionsFeed questions={serializedQuestions} />
      </div>
    </main>
  );
}
