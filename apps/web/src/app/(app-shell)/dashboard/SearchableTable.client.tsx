"use client";
import { useState } from "react";
import { useDebounce } from "@/components/useDebounce";

// 👇 TypeScript doesn’t know this is an RSC – tell it to ignore
// @ts-expect-error - ModelsTable is a Server Component
import { ModelsTable } from "./ModelsTable";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function SearchableTable() {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 300);

  return (
    <>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search model…"
        className="w-64 rounded border px-3 py-2 text-sm"
      />

      <ErrorBoundary>
        <ModelsTable search={debounced} />
      </ErrorBoundary>
    </>
  );
}