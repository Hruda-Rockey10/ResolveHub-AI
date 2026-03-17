import Link from "next/link";

export default function QuestionCard({ question }: any) {
  return (
    <Link href={`/questions/${question.id}`}>
      <div className="rounded-xl border p-5 hover:bg-gray-50 transition cursor-pointer">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              {question.title}
            </h2>

            <p className="mt-2 text-gray-600">
              {question.description}
            </p>

            {question.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {question.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-4 text-sm text-gray-500">
              By {question.author.name}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 text-sm">
            <span className="rounded-full border px-3 py-1">
              {question.status}
            </span>

            {question.difficulty && (
              <span className="rounded-full border px-3 py-1">
                {question.difficulty}
              </span>
            )}

            <span className="text-gray-500">
              {question._count.answers} answers
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
