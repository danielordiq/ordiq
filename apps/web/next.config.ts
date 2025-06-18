import type { NextConfig } from "next";

/** @type {import("next").NextConfig} */
const nextConfig: NextConfig = {
  /**
   * ❗ Skip the lint-step in production builds (Vercel).
   * We’ll still be able to run `pnpm lint` locally.
   */
  eslint: {
    ignoreDuringBuilds: true,
  },

  /* ───────────────
     other options …
     Add anything else you had or will need here.
  ─────────────── */
};

export default nextConfig;
