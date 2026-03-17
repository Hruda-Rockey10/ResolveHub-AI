import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUserFromCookie } from "@/lib/auth";
import QuestionForm from "@/components/questions/question-form";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditQuestionPage({ params }: PageProps) {
  const { id } = await params;

  const [question, currentUser] = await Promise.all([
    db.question.findUnique({
      where: { id },
    }),
    getCurrentUserFromCookie(),
  ]);

  if (!question) {
    notFound();
  }

  if (!currentUser) {
    redirect("/login");
  }

  if (question.authorId !== currentUser.userId) {
    redirect("/");
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-3xl rounded-xl border p-6">
        <h1 className="text-2xl font-bold">Edit Question</h1>
        <p className="mt-2 mb-6 text-gray-600">
          Update your question details.
        </p>

        <QuestionForm
          mode="edit"
          initialData={{
            id: question.id,
            title: question.title,
            description: question.description,
            difficulty: question.difficulty,
            tags: question.tags,
          }}
        />
      </div>
    </main>
  );
}
