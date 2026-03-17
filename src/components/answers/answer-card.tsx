import AnswerActions from "@/components/answers/answer-actions";

type AnswerCardProps = {
  answer: {
    id: string;
    content: string;
    isAccepted: boolean;
    author: {
      id: string;
      name: string;
    };
  };
  currentUserId?: string;
  questionOwnerId: string;
};

export default function AnswerCard({
  answer,
  currentUserId,
  questionOwnerId,
}: AnswerCardProps) {
  const isAnswerOwner = currentUserId === answer.author.id;
  const canAccept = currentUserId === questionOwnerId;

  return (
    <div
      className={`rounded-xl border p-5 ${
        answer.isAccepted ? "border-green-400 bg-green-50" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-gray-500">By {answer.author.name}</p>

        {answer.isAccepted && (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            Accepted
          </span>
        )}
      </div>

      <p className="mt-4 whitespace-pre-wrap text-gray-800">{answer.content}</p>

      <AnswerActions
        answerId={answer.id}
        canAccept={canAccept}
        isAccepted={answer.isAccepted}
        isOwner={isAnswerOwner}
      />
    </div>
  );
}
