// apps/web/src/app/api/run/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15", // stable, matches current typings
});

import rulesJSON from "@/config/ai_act_v1.json" assert { type: "json" };

// ✅ env-driven slack webhook
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL!;

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
   3 ▸ Edge runtime (requirered for Stripe - changed)
─────────────────────────────── */
export const runtime = "nodejs"; // ✅ Stripe SDK runs in Node

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
    const payloadStr = JSON.stringify(body); // ✨ rename

    /* ---------- call GPT-4o-mini ------ */
    const gpt = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: sys },
        { role: "user", content: payloadStr }, // ✨ rename
      ],
    });

    const chosenKey = gpt.choices[0]!.message!.content!.trim();
    const rule = rules[chosenKey];

    if (!rule) {
      return NextResponse.json(
        { error: "model returned unknown key", chosenKey },
        { status: 422 },
      );
    }

    /* ---------- store assessment ------ */
    // ① fetch the signed-in user (null on anon requests)
    const {
      data: { user: authUser }, // ✨ rename
    } = await supa.auth.getUser();

    // ② insert the row, including user_id
    const insertQuery = await supa.from("assessments").insert({
      request: body,
      matched_key: chosenKey,
      tier: rule.tier,
      user_id: authUser?.id ?? null, // ✨ uses renamed var
    });
    if (insertQuery.error) {
      console.error("Supabase error in apps/web/src/app/api/run/route.ts:95", insertQuery.error);
      throw insertQuery.error;
    }

    /* ---------- Stripe usage metering ---------- */
    try {
      await stripe.subscriptionItems.createUsageRecord(
        process.env.STRIPE_AI_RUN_PRICE_ID!, // ⬅️ price-ID env-var
        {
          quantity: 1, // one run
          timestamp: Math.floor(Date.now() / 1000), // now (UNIX seconds)
          action: "increment",
        },
      );
    } catch (err) {
      console.error("stripe usage record failed", err);
      // Optional: don’t block the request; we still return success to the user.
    }


    /* ────── 5) dynamic Slack webhook on HIGH ────── */
    if (rule.tier === "High") {
      // ① extract the tenant/company ID from the payload
      //    (make sure your client is sending { company_id: "...", … })
      const companyId = (body as any).company_id as string | undefined

      if (companyId) {
        // ② look up that tenant’s row in Supabase
        const { data: tenant, error: tenantErr } = await supa
          .from("tenants")
          .select("slack_webhook_url")
          .eq("id", companyId)
          .single()

        if (tenantErr || !tenant?.slack_webhook_url) {
          console.error("Could not find Slack webhook for tenant", {
            companyId,
            error: tenantErr,
          })
        } else {
          // ③ fire off the same payload into *their* webhook
          await fetch(tenant.slack_webhook_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: `:warning: *High-risk assessment*  
    • key: *${chosenKey}*  
    • user: \`${authUser?.id ?? "anonymous"}\`  
    • url: ${process.env.ORDIQ_PREVIEW_URL}/run/${chosenKey}`,
            }),
          })
        }
      }
    }


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
