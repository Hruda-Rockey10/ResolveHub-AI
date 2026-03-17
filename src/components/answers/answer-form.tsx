"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AnswerFormProps = {
  questionId: string;
  questionTitle?: string;
  questionDescription?: string;
  initialContent?: string;
  answerId?: string;
  mode?: "create" | "edit";
};

export default function AnswerForm({
  questionId,
  questionTitle = "",
  questionDescription = "",
  initialContent = "",
  answerId,
  mode = "create",
}: AnswerFormProps) {
  const router = useRouter();

  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleAiDraft() {
    if (!questionTitle || !questionDescription) {
      setMessage("Question details missing");
      return;
    }

    setAiLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/ai/draft-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: questionTitle,
          description: questionDescription,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to generate AI draft");
        return;
      }

      setContent(data.draft || "");
    } catch {
      setMessage("AI draft failed");
    } finally {
      setAiLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const endpoint =
        mode === "create"
          ? `/api/questions/${questionId}/answers`
          : `/api/answers/${answerId}`;

      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Something went wrong");
        return;
      }

      if (mode === "create") {
        setContent("");
      }

      router.refresh();
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleAiDraft}
          disabled={aiLoading}
          className="rounded-md border px-4 py-2 text-sm"
        >
          {aiLoading ? "Generating..." : "AI Draft Answer"}
        </button>
      </div>

      <textarea
        className="min-h-[140px] w-full rounded-md border p-3"
        placeholder="Write your answer..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-black px-4 py-2 text-white"
      >
        {loading
          ? mode === "create"
            ? "Posting..."
            : "Updating..."
          : mode === "create"
          ? "Post Answer"
          : "Update Answer"}
      </button>

      {message && <p className="text-sm text-red-500">{message}</p>}
    </form>
  );
}
