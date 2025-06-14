import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
// apps/web/src/app/api/run/route.ts
import rules from '@/config/ai_act_v1.json';



// 1️⃣ init SDKs with env vars (never hard-coded)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supa = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

// 2️⃣ runtime config – Edge Function
export const runtime = "edge";

// 3️⃣ POST handler
export async function POST(req: Request) {
  try {
    // ---- read request body ------------
    const body = await req.json();

    /* body example:
       {
         "purpose": "Automated CV screening",
         "data_types": ["CV text", "cover letter"],
         "users": ["EU job applicants"]
       }
    */

    // ---- build prompt -----------------
    const ruleKeys = Object.keys(rules).join(", ");
    const sys = `
      You are a compliance classifier for the EU AI Act.
      Return EXACTLY one key from the list: ${ruleKeys}
    `;

    const user = JSON.stringify(body);

    // ---- call GPT-4o-mini -------------
    const gpt = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user },
      ],
    });

    const chosenKey = gpt.choices[0].message.content.trim();
    const rule = (rules as any)[chosenKey];

    if (!rule) {
      return NextResponse.json(
        { error: "model returned unknown key", chosenKey },
        { status: 422 },
      );
    }

    // ---- save assessment --------------
    await supa
      .from("assessments") // (create table later)
      .insert({
        request: body,
        matched_key: chosenKey,
        tier: rule.tier,
      });

    // ---- reply to client --------------
    return NextResponse.json({
      matched_key: chosenKey,
      tier: rule.tier,
      obligations: rule.obligations,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "internal error" },
      { status: 500 },
    );
  }
}
