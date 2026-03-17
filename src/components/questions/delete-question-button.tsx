"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type DeleteQuestionButtonProps = {
  questionId: string;
};

export default function DeleteQuestionButton({
  questionId,
}: DeleteQuestionButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this question?"
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/questions/${questionId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Failed to delete question");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded-md border border-red-300 px-4 py-2 text-sm text-red-600"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
