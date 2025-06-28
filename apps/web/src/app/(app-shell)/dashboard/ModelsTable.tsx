/* apps/web/src/app/(app-shell)/dashboard/ModelsTable.tsx
   ─────────────────────────────────────────────────────── */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { RowSkeleton } from "@/components/RowSkeleton";

/* ▶ extra column that isn’t in the generated type ------------------------ */
type ExtraFields = { matched_key: string | null };

/* ▶ the actual row shape we’ll get back ---------------------------------- */
type Row = Database["public"]["Tables"]["assessments"]["Row"] & ExtraFields;

/* ──────────────────────────────────────────────────────────────────────── */

export default async function ModelsTable({ search }: { search: string }) {
  /* 1️⃣  server-side query */
  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );

  const { data, error } = await supabase
    .from("assessments")
    .select("id, tier, created_at, matched_key, request")
    .ilike("matched_key", `%${search}%`)
    .order("created_at", { ascending: false });

  if (error) throw error; // handled by <ErrorBoundary />

  /* 2️⃣  render HTML table */
  return (
    <table className="w-full text-sm">
      <thead className="text-left text-xs text-slate-500">
        <tr>
          <th className="py-2">Key</th>
          <th className="py-2">Purpose</th>
          <th className="py-2">Risk</th>
          <th className="py-2">Created</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-100">
        {data && data.length ? (
          data.map((row) => {
            /* request is a jsonb column → pull `"purpose"` if present */
            const purpose =
              typeof row.request === "object" && row.request !== null
                ? ((row.request as Record<string, unknown>).purpose ?? "—")
                : "—";

            return (
              <tr key={row.id} className="group hover:bg-slate-50">
                <td className="py-2 font-medium">{row.matched_key}</td>
                <td>{String(purpose)}</td>
                <td className="font-medium">{row.tier}</td>
                <td>
                  {row.created_at
                    ? new Date(row.created_at).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            );
          })
        ) : (
          <RowSkeleton />
        )}
      </tbody>
    </table>
  );
}
