/* apps/web/src/lib/registry.ts
   ------------------------------------------------------------------ */
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

/** ------------------------------------------------------------------
 *  A single typed, server-side Supabase client                         */
const supa = createClient<Database>(
  process.env.SUPABASE_URL!, // must exist in Vercel or .env.local
  process.env.SUPABASE_ANON_KEY!, // safe for dev & browser
);

/** ------------------------------------------------------------------
 *  Return all assessments that belong to the current user.
 *  - `session` is the “sb-access-token” we already extracted in
 *    `registry/page.tsx`.                                              */
export async function listAssessments(session: string | null) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    return { data: null, error: new Error('Missing Supabase configuration') };
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseKey)

  if (!session)
    return { data: [] as Database["public"]["Tables"]["assessments"]["Row"][] };

  const { data, error } = await supabase
    .from("assessments")
    .select("*")
    .eq("user_id", session)
    .order("created_at", { ascending: false });

  if (error) return {data: null, error};
  return { data };
}