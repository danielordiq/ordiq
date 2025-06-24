import path from "path";
import type { NextConfig } from "next";

/** @type {import("next").NextConfig} */
const nextConfig: NextConfig = {
  /**
   * ❗ Skip the lint-step in production builds (Vercel).
   * We’ll still be able to run `pnpm lint` locally.
   */
  eslint: { ignoreDuringBuilds: true },

  /* ─── Webpack alias for "@/…" (needed on Next 15.3.x) ─── */
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.join(__dirname, "src"), //  <-- maps @/ to apps/web/src
    };
    return config;
  },
};

export default nextConfig;
