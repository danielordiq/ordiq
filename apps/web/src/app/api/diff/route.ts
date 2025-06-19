// apps/web/src/app/api/diff/route.ts
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

/**
 * GET /api/diff?before=<id>
 * Returns the most-recent assessment *before* the given id,
 * for the user identified by the sb-access-token cookie.
 */
export async function GET(req: NextRequest) {
  /* ── 1. validate query param ─────────────────────────────── */
  const beforeId = new URL(req.url).searchParams.get("before");
  if (!beforeId) {
    return NextResponse.json({ error: "missing id" }, { status: 400 });
  }

  /* ── 2. read session token (cookies() is async) ───────────── */
  const sessionToken = (await cookies()).get("sb-access-token")?.value ?? null;
  if (!sessionToken) {
    return NextResponse.json({ data: null }); // unauthenticated ⇒ nothing to diff
  }

  /* ── 3. create Supabase client *inside* the handler ───────── */
  const supa = createClient<Database>(
    process.env.SUPABASE_URL!,        // required – set in Vercel dashboard
    process.env.SUPABASE_ANON_KEY!,   // ← use the same key as elsewhere
    { auth: { persistSession: false } }
  );

  /* ── 4. fetch previous assessment for this user ───────────── */
  const { data, error } = await supa
    .from("assessments")
    .select("*")
    .eq("user_id", sessionToken)
    .lt("id", beforeId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  /* ── 5. respond ───────────────────────────────────────────── */
  return NextResponse.json({ data });
}
