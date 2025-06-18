"use client";

/* eslint-disable tailwindcss/no-custom-classname */
import { cookies } from "next/headers";
import { listAssessments } from "@/lib/registry";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { jsonPatch } from "fast-json-patch";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useState } from "react";

type Row = Awaited<ReturnType<typeof listAssessments>>["data"][number];

/* ---------- Tailwind badge helper ---------- */
const badge = (tier: string) =>
  twMerge(
    "inline-block rounded-full px-2 text-xs font-semibold",
    tier === "High" && "bg-red-100 text-red-700",
    tier === "Medium" && "bg-yellow-100 text-yellow-700",
    tier === "Low" && "bg-green-100 text-green-700",
  );

export default async function RegistryPage() {
  /* ① fetch data on the server (RSC) */
  const session = cookies().get("sb-access-token")?.value ?? null;
  const { data: rows = [] } = await listAssessments(session);

  /* ② column defs */
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

  /* ③ react-table instance (runs client-side) */
  const table = useReactTable({ data: rows, columns, getCoreRowModel });

  /* ④ diff drawer state */
  const [diffSource, setDiffSource] = useState<null | Row>(null);

  /* ⑤ render */
  return (
    <section className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Assessment Registry</h1>

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

      {/* ---------- diff drawer ---------- */}
      {diffSource && (
        <DiffDrawer row={diffSource} onClose={() => setDiffSource(null)} />
      )}
    </section>
  );
}

/* ---------- DiffDrawer component (client) ---------- */
function DiffDrawer({ row, onClose }: { row: Row; onClose: () => void }) {
  const [prev, setPrev] = useState<Row | null>(null);

  // fetch previous run lazily
  useEffect(() => {
    (async () => {
      const { data } = await fetch(`/api/diff?before=${row.id}`).then((r) =>
        r.json(),
      );
      setPrev(data ?? null);
    })();
  }, [row.id]);

  if (!prev) return null;

  const patches = jsonPatch.compare(prev.request, row.request);

  return (
    <aside className="fixed inset-y-0 right-0 w-96 border-l bg-white p-4 shadow-lg">
      <button
        onClick={onClose}
        className="absolute right-4 top-2 text-gray-500 hover:text-black"
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
