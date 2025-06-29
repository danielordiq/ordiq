
/* eslint-disable tailwindcss/no-custom-classname */
import { cookies }       from "next/headers";
import { listAssessments } from "@/lib/registry";
import RegistryTable     from "./registrytable";
import type { Database } from "@/types/supabase";

type Row = Database["public"]["Tables"]["assessments"]["Row"];

export const metadata = { title: "Assessment Registry" };

export default async function RegistryPage() {
  /* ── fetch on the server ─────────────────────────────── */
  const cookieJar = await cookies();
  const session   = cookieJar.get("sb-access-token")?.value ?? null;

  const { data }  = await listAssessments(session);
  const rows: Row[] = data ?? [];                      // ← strip the "| null"

  /* ── render ──────────────────────────────────────────── */
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assessment Registry</h1>
        <p className="text-gray-600">View and manage your assessment history</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <RegistryTable rows={rows} />
      </div>
    </div>
  );
}
