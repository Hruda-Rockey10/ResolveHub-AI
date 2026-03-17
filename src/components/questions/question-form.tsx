"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type QuestionFormProps = {
  initialData?: {
    id?: string;
    title: string;
    description: string;
    difficulty: "EASY" | "MEDIUM" | "HARD" | null;
    tags: string[];
  };
  mode?: "create" | "edit";
};

export default function QuestionForm({
  initialData,
  mode = "create",
}: QuestionFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [difficulty, setDifficulty] = useState<
    "EASY" | "MEDIUM" | "HARD" | ""
  >(initialData?.difficulty || "");
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags?.join(", ") || ""
  );

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleAiSuggest() {
    if (!title.trim() || !description.trim()) {
      setMessage("Please enter title and description first");
      return;
    }

    setAiLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to get AI suggestions");
        return;
      }

      if (Array.isArray(data.tags)) {
        setTagsInput(data.tags.join(", "));
      }

      if (data.difficulty) {
        setDifficulty(data.difficulty);
      }
    } catch {
      setMessage("AI suggestion failed");
    } finally {
      setAiLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);

    const payload = {
      title,
      description,
      difficulty: difficulty || null,
      tags,
    };

    try {
      const endpoint =
        mode === "create"
          ? "/api/questions"
          : `/api/questions/${initialData?.id}`;

      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Something went wrong");
        return;
      }

      if (mode === "create") {
        router.push("/");
      } else {
        router.push(`/questions/${initialData?.id}`);
      }

      router.refresh();
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium">Title</label>
        <input
          type="text"
          className="w-full rounded-md border p-3"
          placeholder="e.g. How to implement JWT auth in Next.js?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Description</label>
        <textarea
          className="min-h-[180px] w-full rounded-md border p-3"
          placeholder="Describe your question in detail..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleAiSuggest}
          disabled={aiLoading}
          className="rounded-md border px-4 py-2 text-sm"
        >
          {aiLoading ? "Thinking..." : "AI Suggest Tags + Difficulty"}
        </button>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Difficulty (Optional)
        </label>
        <select
          className="w-full rounded-md border p-3"
          value={difficulty}
          onChange={(e) =>
            setDifficulty(e.target.value as "EASY" | "MEDIUM" | "HARD" | "")
          }
        >
          <option value="">Select difficulty</option>
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Tags (comma separated)
        </label>
        <input
          type="text"
          className="w-full rounded-md border p-3"
          placeholder="react, nextjs, jwt"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-black px-5 py-3 text-white"
      >
        {loading
          ? mode === "create"
            ? "Posting..."
            : "Updating..."
          : mode === "create"
          ? "Post Question"
          : "Update Question"}
      </button>

      {message && <p className="text-sm text-red-500">{message}</p>}
    </form>
  );
}
