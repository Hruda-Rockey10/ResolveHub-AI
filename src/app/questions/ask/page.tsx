import QuestionForm from "@/components/questions/question-form";

export default function AskQuestionPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-3xl rounded-xl border p-8">
        <h1 className="text-3xl font-bold">Ask a Question</h1>
        <p className="mt-2 text-gray-600">
          Describe your problem clearly so others can help effectively.
        </p>

        <div className="mt-8">
          <QuestionForm />
        </div>
      </div>
    </main>
  );
}
