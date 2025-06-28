/* apps/web/src/app/(app-shell)/dashboard/ModelsTable.tsx
   ────────────────────────────────────────────────────────
   Renders an <SSR> table of recent assessment runs
*/

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { RowSkeleton } from "@/components/RowSkeleton";

/** Row type for convenience (generated from supabase/gen types) */
type Row = Database["public"]["Tables"]["assessments"]["Row"];

export default async function ModelsTable({ search }: { search: string }) {
  /* 1️⃣  Server-side query -------------------------------------------------- */
  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!, // safe on the server
  );

  const { data, error } = await supabase
    .from("assessments")
    .select("*") // ← was limited list
    .ilike("matched_key", `%${search}%`)
    .order("created_at_timestamp", { ascending: false });

  if (error) throw error; // handled by <ErrorBoundary />

  /* 2️⃣  Render the table --------------------------------------------------- */
  return (
    <table className="w-full text-sm">
      <thead className="text-left text-xs text-slate-500">
        <tr>
          <th className="py-2">Model key</th>
          <th className="py-2">Purpose</th>
          <th className="py-2">Tier</th>
          <th className="py-2">Created</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-100">
        {data?.length ? (
          data.map((row: Row) => {
            const purpose =
              typeof row.request === "object" && row.request !== null
                ? // request is jsonb → pull out `"purpose"` if present
                  // (satisfies both TS & runtime)
                  ((row.request as Record<string, unknown>).purpose ?? "—")
                : "—";

            return (
              <tr key={row.id} className="group hover:bg-slate-50">
                <td className="py-2 font-medium">{row.matched_key}</td>
                <td>{String(purpose)}</td>
                <td className="font-medium">{row.tier}</td>
                <td>
                  {row.created_at_timestamp
                    ? new Date(row.created_at_timestamp).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            );
          })
        ) : (
          /* empty while Suspense resolves → show a single skeleton row */
          <RowSkeleton />
        )}
      </tbody>
    </table>
  );
}
