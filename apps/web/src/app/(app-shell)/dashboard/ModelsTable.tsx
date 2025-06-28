/* apps/web/src/app/(app-shell)/dashboard/ModelsTable.tsx
   ─────────────────────────────────────────────────────── */

import { createClient } from "@supabase/supabase-js";
import { RowSkeleton }   from "@/components/RowSkeleton";
import type { Database } from "@/types/supabase";

/* 🔖  Extra columns that are NOT in the generated type */
type ExtraFields = {
  matched_key: string | null;
};

/* 🚀  The row type we’ll actually receive from the query */
type Row = Database["public"]["Tables"]["assessments"]["Row"] & ExtraFields;

export default async function ModelsTable({ search }: { search: string }) {
  /* 1️⃣  Query Supabase on the **server** */
  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );

  const { data, error } = await supabase
    .from("assessments")
    /*    ↓ include ONLY the columns we really need  */
    .select("id, tier, created_at, matched_key, request")
    .ilike("matched_key", `%${search}%`)
    .order("created_at", { ascending: false });

  if (error) throw error;

  /* 2️⃣  Render table */
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
        {data?.length ? (
          data.map((row) => {
            /* request is JSON → try to read the `"purpose"` field */
            const purpose =
              typeof row.request === "object" &&
