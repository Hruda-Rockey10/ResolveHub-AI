"use client";

import { useMemo, useState } from "react";
import QuestionCard from "@/components/questions/question-card";

type Question = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: "UNRESOLVED" | "IN_PROGRESS" | "RESOLVED";
  difficulty: "EASY" | "MEDIUM" | "HARD" | null;
  createdAt: string;
  author: {
    name: string;
  };
  _count: {
    answers: number;
  };
};

type QuestionsFeedProps = {
  questions: Question[];
};

export default function QuestionsFeed({ questions }: QuestionsFeedProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const matchesQuery =
        !query ||
        question.title.toLowerCase().includes(query.toLowerCase()) ||
        question.description.toLowerCase().includes(query.toLowerCase()) ||
        question.tags.some((tag) =>
          tag.toLowerCase().includes(query.toLowerCase())
        );

      const matchesStatus =
        status === "ALL" ? true : question.status === status;

      return matchesQuery && matchesStatus;
    });
  }, [questions, query, status]);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <input
          type="text"
          placeholder="Search by title, description, or tag..."
          className="sm:col-span-2 rounded-md border p-3"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          className="rounded-md border p-3"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="UNRESOLVED">Unresolved</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {filteredQuestions.length === 0 ? (
        <div className="rounded-xl border p-8 text-center">
          <h2 className="text-xl font-semibold">No matching questions</h2>
          <p className="mt-2 text-gray-600">
            Try another search or filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      )}
    </div>
  );
}
