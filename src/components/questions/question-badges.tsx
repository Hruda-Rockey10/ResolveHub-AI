type QuestionBadgesProps = {
  status: "UNRESOLVED" | "IN_PROGRESS" | "RESOLVED";
  difficulty: "EASY" | "MEDIUM" | "HARD" | null;
};

export default function QuestionBadges({
  status,
  difficulty,
}: QuestionBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="rounded-full border px-3 py-1 text-xs font-medium">
        {status.replace("_", " ")}
      </span>

      {difficulty && (
        <span className="rounded-full border px-3 py-1 text-xs font-medium">
          {difficulty}
        </span>
      )}
    </div>
  );
}
