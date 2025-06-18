import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase"; // <- generated types

const supa = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

/** Returns the last N assessments for the signed-in user */
export async function listAssessments(session: string | null, limit = 100) {
  if (!session) throw new Error("No auth session");
  return supa
    .from("assessments")
    .select("*")
    .eq("user_id", session)
    .order("created_at", { ascending: false })
    .limit(limit);
}
