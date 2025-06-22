// supabase/functions/rule-refresh/index.ts
// Edge Function — runs in Deno on Supabase
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ① Pull env vars injected by Supabase at runtime
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!; // full access
const supa = createClient(supabaseUrl, serviceRole, {
  auth: { persistSession: false },
});

// ② Edge Function entrypoint (runs by schedule)
serve(async (_req) => {
  try {
    // ➊ fetch latest Annex JSON (replace with your real URL or storage object)
    const annexRes = await fetch("https://example.com/annex.json");
    if (!annexRes.ok) throw new Error(`Annex fetch failed: ${annexRes.status}`);
    const rules = await annexRes.json();

    // ➋ re-score each model (toy example)
    const { data: models, error: fetchErr } = await supa
      .from("models")
      .select("*");
    if (fetchErr) throw fetchErr;
    if (!models || models.length === 0) throw new Error("No models found");

    const updates = models.map((m) => ({
      id: m.id,
      score: rules[m.name] ?? m.score, // naïve merge logic
    }));

    // ➌ bulk upsert
    const { error: upsertErr } = await supa.from("models").upsert(updates);
    if (upsertErr) throw upsertErr;

    // ➍ success response
    return new Response(
      JSON.stringify({
        ok: true,
        updated: updates.length,
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("rule-refresh error:", err);
    return new Response(
      JSON.stringify({
        ok: false,
        error: `${err}`,
      }),
      { status: 500 },
    );
  }
});
