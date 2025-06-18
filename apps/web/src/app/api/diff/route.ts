import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

/* ──────────────────────────────────────────────
   Supabase client (typed)
   ──────────────────────────────────────────── */
const supa = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!, // or SUPABASE_ANON_KEY if you prefer
);

/* GET /api/diff?before=<id> */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const afterId = searchParams.get("before");

  /* ─ 1. validate query param ─ */
  if (!afterId)
    return NextResponse.json({ error: "missing id" }, { status: 400 });

  /* ─ 2. read session token (cookies() is async!) ─ */
  const session = (await cookies()).get("sb-access-token")?.value ?? null;

  /* unauthenticated → nothing to diff */
  if (!session) return NextResponse.json({ data: null });

  /* ─ 3. fetch previous assessment run for this user ─ */
  const { data } = await supa
    .from("assessments")
    .select("*")
    .eq("user_id", session)
    .lt("id", afterId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  /* ─ 4. respond ─ */
  return NextResponse.json({ data });
}
