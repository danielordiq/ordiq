// apps/web/src/app/api/run/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

import rulesJSON from "@/config/ai_act_v1.json" assert { type: "json" };

/* ──────────────────────────────
   1 ▸ Types & data
─────────────────────────────── */
type ActRule = {
  tier: "High" | "Medium" | "Low";
  obligations: string[];
};

// cast once → strongly typed map
const rules = rulesJSON as unknown as Record<string, ActRule>;

/* ──────────────────────────────
   2 ▸ SDKs (env-driven)
─────────────────────────────── */
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supa = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

/* ──────────────────────────────
   3 ▸ Edge runtime
─────────────────────────────── */
export const runtime = "edge";

/* ──────────────────────────────
   4 ▸ POST /api/run
─────────────────────────────── */
export async function POST(req: Request) {
  try {
    /* ---------- read request ---------- */
    const body = await req.json();

    /* ---------- build prompt ---------- */
    const ruleKeys = Object.keys(rules).join(", ");
    const sys = `
      You are a compliance classifier for the EU AI Act.
      Return EXACTLY one key from the list: ${ruleKeys}
    `.trim();

    /* GPT expects the user message as a single JSON string */
    const user = JSON.stringify(body);

    /* ---------- call GPT-4o-mini ------ */
    const gpt = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user },
      ],
    });

    //                !            !        !
    const chosenKey = gpt.choices[0]!.message!.content!.trim();

    const rule = rules[chosenKey];

    if (!rule) {
      return NextResponse.json(
        { error: "model returned unknown key", chosenKey },
        { status: 422 },
      );
    }

    /* ---------- store assessment ------ */
    await supa.from("assessments").insert({
      request: body,
      matched_key: chosenKey,
      tier: rule.tier,
    });

    /* ---------- reply ----------------- */
    return NextResponse.json({
      matched_key: chosenKey,
      tier: rule.tier,
      obligations: rule.obligations,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "internal error";
    console.error(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
