/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'med-bg': '#070b14',
        'med-card': '#0d1321',
        'med-blue': '#3b9eff',
        'med-gold': '#c9a84c',
        'med-text': '#d0e4f7',
        'med-border': '#1e3a5f',
        'med-btn': '#0a4d8c',
      }
    },
  },
  plugins: [],
}