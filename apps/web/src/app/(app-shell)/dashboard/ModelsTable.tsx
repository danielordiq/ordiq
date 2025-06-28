/* apps/web/src/app/(app-shell)/dashboard/ModelsTable.tsx
   ────────────────────────────────────────────────────── */

import type { Database } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";
import { RowSkeleton } from "@/components/RowSkeleton";

/**
 * Table row type → assessments table, which *does* exist in your DB
 */
type Row = Database["public"]["Tables"]["assessments"]["Row"];

export default async function ModelsTable({ search }: { search: string }) {
  /* 1️⃣  Server-side Supabase query */
  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!, // safe on the server
  );

  const { data, error } = await supabase
    .from("assessments") // ← was "models"
    .select("*")
    .ilike("name", `%${search}%`) // assumes “name” column exists
    .order("last_run", { ascending: false });

  if (error) throw error; // caught by <ErrorBoundary />

  /* 2️⃣  Render table (or skeleton while Suspense resolves) */
  return (
    <table className="w-full text-sm">
      <thead className="text-left text-xs text-slate-500">
        <tr>
          <th className="py-2">Model</th>
          <th className="py-2">Version</th>
          <th className="py-2">Risk</th>
          <th className="py-2">Last run</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-100">
        {data && data.length ? (
          data.map((row) => (
            <tr key={row.id} className="group hover:bg-slate-50">
              <td className="py-2">{row.name}</td>
              <td>{row.version}</td>
              <td className="font-medium">{row.tier}</td>
              <td>
                {row.last_run
                  ? new Date(row.last_run).toLocaleDateString()
                  : "—"}
              </td>
            </tr>
          ))
        ) : (
          /* table is empty → show loading skeleton row(s) */
          <RowSkeleton />
        )}
      </tbody>
    </table>
  );
}
