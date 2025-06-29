
/* eslint-disable tailwindcss/no-custom-classname */
"use client";

import { useState } from "react";
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { twMerge } from "tailwind-merge";
import type { Database } from "@/types/supabase";

type Row = Database["public"]["Tables"]["assessments"]["Row"];

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

  /* ---------- render ---------- */
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {rows.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No assessments found</p>
        </div>
      )}
    </div>
  );
}
