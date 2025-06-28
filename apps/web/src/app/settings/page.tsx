"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supa = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SettingsPage() {
  const [url, setUrl] = useState("");
  // TODO: replace with your real session lookup (e.g. supabase auth user ID)
  const tenantId = "";


  useEffect(() => {
    supa
      .from("tenants")
      .select("slack_webhook_url")
      .eq("id", tenantId)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error("Supabase error in apps/web/src/app/settings/page.tsx:20", error);
          throw error;
        }
        setUrl(data?.slack_webhook_url || "");
      });
  }, [tenantId]);

  const save = async () => {
    const updateQuery = await supa
      .from("tenants")
      .update({ slack_webhook_url: url })
      .eq("id", tenantId);
    if (updateQuery.error) {
      console.error("Supabase error in apps/web/src/app/settings/page.tsx:28", updateQuery.error);
      throw updateQuery.error;
    }
    alert("Saved!");
  };

  return (
    <div>
      <h1>Slack Webhook URL</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://hooks.slack.com/…"
        className="border p-2 w-full"
      />
      <button onClick={save} className="mt-2 px-4 py-2 bg-blue-600 text-white">
        Save
      </button>
    </div>
  );
}
