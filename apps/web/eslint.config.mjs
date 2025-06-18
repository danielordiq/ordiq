/* apps/web/eslint.config.mjs
   Flat-config, Tailwind CSS plugin, Next defaults + TypeScript */
import { dirname } from "path";
import { fileURLToPath } from "url";

/* ❶ Flat-config helper – ESLint v8.57+ moved it to
      “use-at-your-own-risk”.  Works both locally and on Vercel. */
import { FlatCompat } from "eslint/use-at-your-own-risk/useFlatConfig";

/* ❷ Tailwind CSS plugin */
import tailwindcss from "eslint-plugin-tailwindcss";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  /* Next.js defaults + TypeScript rules */
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  /* ❸ Enable Tailwind’s recommended rule-set */
  tailwindcss.configs.recommended,
];

export default eslintConfig;
