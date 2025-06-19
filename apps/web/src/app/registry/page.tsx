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
  const rows: Row[] = data ?? [];                      // ← strip the “| null”

  /* ── render ──────────────────────────────────────────── */
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Assessment Registry</h1>
      <RegistryTable rows={rows} />                    {/* ✅ still Row[] */}
    </main>
  );
}
