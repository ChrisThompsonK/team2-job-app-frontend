/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", ".dark-mode"],
  content: [
    "./src/**/*.{html,js,ts,njk}",
    "./src/views/**/*.njk"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}