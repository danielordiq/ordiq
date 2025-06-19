/* apps/web/src/types/supabase.d.ts
   ─────────────────────────────────
   Minimal temporary stub – only the
   assessments table we need today. */

export type Database = {
  public: {
    Tables: {
      assessments: {
        /* ---- columns you really store ---- */
        Row: {
          id: string;
          user_id: string | null;
          created_at: string;                // ISO string
          purpose: string | null;
          tier: "High" | "Medium" | "Low";
          request: unknown;                  // adjust later
        };
      };
    };
  };
};
