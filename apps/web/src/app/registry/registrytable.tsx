/* eslint-disable tailwindcss/no-custom-classname */
"use client";

import { compare as jsonCompare } from "fast-json-patch";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type { Database } from "@/types/supabase";

type Row = Database["public"]["Tables"]["assessments"]["Row"];

/* ---------- Tailwind badge helper ---------- */
const badge = (tier: string) =>
  twMerge(
    "inline-block rounded-full px-2 text-xs font-semibold",
    tier === "High" && "bg-red-100 text-red-700",
    tier === "Medium" && "bg-yellow-100 text-yellow-700",
    tier === "Low" && "bg-green-100 text-green-700",
  );

export default function RegistryTable({ rows }: { rows: Row[] }) {
  /* ---------- React-Table ---------- */
  const c = createColumnHelper<Row>();
  const columns = [
    c.accessor("created_at", {
      header: "Date",
      cell: (v) => new Date(v.getValue()).toLocaleString(),
    }),
    c.accessor("purpose", {
      header: "Purpose",
      cell: (v) => v.renderValue() ?? "—",
    }),
    c.accessor("tier", {
      header: "Tier",
      cell: (v) => <span className={badge(v.getValue())}>{v.getValue()}</span>,
    }),
  ];

  /* 👇 call getCoreRowModel() and give Row to useReactTable */
  const table = useReactTable<Row>({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  /* ---------- diff drawer state ---------- */
  const [diffSource, setDiffSource] = useState<Row | null>(null);

  return (
    <>
      <table className="w-full border text-sm">
        <thead className="bg-gray-50 text-left">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th key={h.id} className="px-2 py-1 font-semibold">
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((r) => (
            <tr
              key={r.id}
              className="cursor-pointer odd:bg-gray-50 hover:bg-indigo-50"
              onClick={() => setDiffSource(r.original)}
            >
              {r.getVisibleCells().map((c) => (
                <td key={c.id} className="px-2 py-1">
                  {flexRender(c.column.columnDef.cell, c.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {diffSource && (
        <DiffDrawer row={diffSource} onClose={() => setDiffSource(null)} />
      )}
    </>
  );
}

/* ---------- DiffDrawer ---------- */
function DiffDrawer({ row, onClose }: { row: Row; onClose: () => void }) {
  const [prev, setPrev] = useState<Row | null>(null);

  /* fetch previous assessment lazily */
  useEffect(() => {
    (async () => {
      const { data } = await fetch(`/api/diff?before=${row.id}`).then((r) =>
        r.json(),
      );
      setPrev(data ?? null);
    })();
  }, [row.id]);

  if (!prev) return null;

  const patches = jsonCompare(prev.request, row.request);

  return (
    <aside className="fixed inset-y-0 right-0 w-96 border-l bg-white p-4 shadow-lg">
      <button
        onClick={onClose}
        className="absolute right-4 top-2 text-gray-500 hover:text-black"
        aria-label="Close diff"
      >
        ✕
      </button>
      <h2 className="mb-2 text-lg font-semibold">Changes since last run</h2>
      <pre className="whitespace-pre-wrap break-all text-xs">
        {JSON.stringify(patches, null, 2)}
      </pre>
    </aside>
  );
}
