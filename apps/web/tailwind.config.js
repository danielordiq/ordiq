/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tell Tailwind where your React files live ↓
  content: [
    'apps/web/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        riskHigh:   '#F87171',
        riskLimited:'#FBBF24',
        riskMinimal:'#34D399',
      },
    },
  },
  plugins: [],
};
