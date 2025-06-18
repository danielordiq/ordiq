// apps/web/eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "eslint/useFlatConfig";
// --- NEW: Tailwind plugin import ------------------------------
import tailwindcss from "eslint-plugin-tailwindcss";
// --------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Next-js defaults + TypeScript
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // --- NEW: enable Tailwind’s recommended rule-set -------------
  tailwindcss.configs.recommended,
  // -------------------------------------------------------------
];

export default eslintConfig;
