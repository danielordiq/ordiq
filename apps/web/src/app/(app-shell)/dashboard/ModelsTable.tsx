// apps/web/src/app/(app-shell)/dashboard/ModelsTable.tsx
import type { Database } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";
import { RowSkeleton } from "@/components/RowSkeleton";

type Row = Database["public"]["Tables"]["models"]["Row"];

export default async function ModelsTable({ search }: { search: string }) {
  /* 1️⃣  Server-side Supabase query */
  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!, // safe on the server
  );

  const { data, error } = await supabase
    .from("models")
    .select("*")
    .ilike("name", `%${search}%`)
    .order("last_run", { ascending: false });

  if (error) throw error; // will be caught by ErrorBoundary

  /* 2️⃣  Render HTML table */
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
        {data?.length ? (
          data.map((row) => (
            <tr key={row.id} className="group hover:bg-slate-50">
              <td className="py-2">{row.name}</td>
              <td>{row.version}</td>
              <td className={`font-medium text-${row.risk_tier}`}>
                {row.risk}
              </td>
              <td>{new Date(row.last_run!).toLocaleDateString()}</td>
            </tr>
          ))
        ) : (
          <RowSkeleton />
        )}
      </tbody>
    </table>
  );
}
