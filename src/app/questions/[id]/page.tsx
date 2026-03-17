import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUserFromCookie } from "@/lib/auth";
import QuestionBadges from "@/components/questions/question-badges";
import DeleteQuestionButton from "@/components/questions/delete-question-button";
import AnswerForm from "@/components/answers/answer-form";
import AnswerCard from "@/components/answers/answer-card";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function QuestionDetailPage({ params }: PageProps) {
  const { id } = await params;

  const [question, currentUser] = await Promise.all([
    db.question.findUnique({
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
        _count: {
          select: {
            answers: true,
          },
        },
      },
    }),
    getCurrentUserFromCookie(),
  ]);

  if (!question) {
    notFound();
  }

  const isQuestionOwner = currentUser?.userId === question.author.id;

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-xl border p-6">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{question.title}</h1>
              <p className="mt-3 text-sm text-gray-500">
                Asked by {question.author.name}
              </p>
            </div>

            <QuestionBadges
              status={question.status}
              difficulty={question.difficulty}
            />
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {question.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="rounded-lg bg-gray-50 p-5">
            <p className="whitespace-pre-wrap text-gray-800">
              {question.description}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
            <span>{question._count.answers} answers</span>
            <span>Status: {question.status.replace("_", " ")}</span>
          </div>

          {isQuestionOwner && (
            <div className="mt-6 flex gap-3">
              <Link
                href={`/questions/${question.id}/edit`}
                className="rounded-md border px-4 py-2 text-sm"
              >
                Edit
              </Link>

              <DeleteQuestionButton questionId={question.id} />
            </div>
          )}
        </div>

        {currentUser ? (
          <div className="rounded-xl border p-6">
            <h2 className="text-xl font-semibold">Your Answer</h2>
            <p className="mt-2 mb-4 text-sm text-gray-500">
              Help resolve this question by posting a useful answer.
            </p>
            <AnswerForm
              questionId={question.id}
              questionTitle={question.title}
              questionDescription={question.description}
            />
          </div>
        ) : (
          <div className="rounded-xl border p-6 text-sm text-gray-600">
            Please{" "}
            <Link href="/login" className="underline">
              login
            </Link>{" "}
            to post an answer.
          </div>
        )}

        <div className="rounded-xl border p-6">
          <h2 className="text-xl font-semibold">Answers</h2>

          {question.answers.length === 0 ? (
            <p className="mt-4 text-gray-500">No answers yet.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {question.answers.map((answer) => (
                <AnswerCard
                  key={answer.id}
                  answer={answer}
                  currentUserId={currentUser?.userId}
                  questionOwnerId={question.author.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
