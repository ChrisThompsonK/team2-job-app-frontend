/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", ".dark-mode"],
  content: [
    "./src/**/*.{html,js,ts,njk}",
    "./src/views/**/*.njk",
    "./public/js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0f172a',
        'dark-surface': '#1e293b',
        'dark-border': '#334155',
        'dark-text': '#f1f5f9',
      },
    },
  },
  plugins: [],
}