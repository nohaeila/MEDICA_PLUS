/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4f8ef7",
        bgapp: "#f0f4ff",
        card: "#ffffff",
        textmain: "#1e293b",
        textsub: "#6b7280",
        border: "#e2e8f0",
      }
    },
  },
  plugins: [],
}