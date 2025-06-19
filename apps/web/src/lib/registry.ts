/* apps/web/src/lib/registry.ts
   ------------------------------------------------------------------ */
import { createClient } from "@supabase/supabase-js";
import type { Database }   from "@/types/supabase";

/** ------------------------------------------------------------------
 *  A single typed, server-side Supabase client                         */
const supa = createClient<Database>(
  process.env.SUPABASE_URL!,          // must exist in Vercel
  process.env.SUPABASE_SERVICE_KEY!,  // or SUPABASE_ANON_KEY!, either is fine
);

/** ------------------------------------------------------------------
 *  Return all assessments that belong to the current user.
 *  - `session` is the “sb-access-token” we already extracted in
 *    `registry/page.tsx`.                                              */
export async function listAssessments(session: string | null) {
  if (!session) return { data: [] as Database["public"]["Tables"]["assessments"]["Row"][] };

  const { data, error } = await supa
    .from("assessments")
    .select("*")
    .eq("user_id", session)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return { data };
}
