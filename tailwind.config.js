/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0B0F19',
        darkCard: '#111827',
        darkSidebar: '#1E293B',
        accentTeal: '#06B6D4',
        accentCyan: '#14B8A6',
      },
    },
  },
  plugins: [],
}
