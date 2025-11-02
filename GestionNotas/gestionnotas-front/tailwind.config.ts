/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        galaxy: "#0f0f23",
        nebula: "#16213e",
        cosmos: "#1a1a2e",
        orbit: "#0f3460",
      },
    },
  },
  plugins: [],
};
