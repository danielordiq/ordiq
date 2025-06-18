/* eslint-disable tailwindcss/no-custom-classname */
import { cookies } from "next/headers";
import { listAssessments } from "@/lib/registry";
import RegistryTable from "./registrytable"; // ⬅️ new import

export const metadata = { title: "Assessment Registry" }; // optional

export default async function RegistryPage() {
  // ── ① fetch data on the server ────────────────────────────
  const session = cookies().get("sb-access-token")?.value ?? null;
  const { data: rows = [] } = await listAssessments(session);

  // ── ② render: pass rows to the client table ───────────────
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Assessment Registry</h1>
      <RegistryTable rows={rows} />
    </main>
  );
}
