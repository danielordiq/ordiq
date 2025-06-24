const path = require("path");

/** @type {import("next").NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },

  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.join(__dirname, "src"),   // maps @/ to apps/web/src
    };
    return config;
  },
};

module.exports = nextConfig;
