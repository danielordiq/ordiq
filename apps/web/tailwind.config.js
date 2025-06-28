
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        riskHigh: '#f87171',     // red-500
        riskLimited: '#fbbf24',  // amber-400
        riskMinimal: '#34d399',  // emerald-400
      },
    },
  },
  plugins: [],
}
