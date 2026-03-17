"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AnswerActionsProps = {
  answerId: string;
  canAccept: boolean;
  isAccepted: boolean;
  isOwner: boolean;
};

export default function AnswerActions({
  answerId,
  canAccept,
  isAccepted,
  isOwner,
}: AnswerActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleAccept() {
    setLoading(true);

    try {
      const res = await fetch(`/api/answers/${answerId}/accept`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to accept answer");
        return;
      }

      router.refresh();
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm("Delete this answer?");
    if (!confirmed) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/answers/${answerId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to delete answer");
        return;
      }

      router.refresh();
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {canAccept && !isAccepted && (
        <button
          onClick={handleAccept}
          disabled={loading}
          className="rounded-md border border-green-300 px-3 py-1 text-sm text-green-700"
        >
          {loading ? "Accepting..." : "Accept Answer"}
        </button>
      )}

      {isAccepted && (
        <span className="rounded-md bg-green-100 px-3 py-1 text-sm text-green-700">
          Accepted
        </span>
      )}

      {isOwner && (
        <button
          onClick={handleDelete}
          disabled={loading}
          className="rounded-md border border-red-300 px-3 py-1 text-sm text-red-600"
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      )}
    </div>
  );
}
