/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/**/*.{html,js}",   // looks inside your Flask templates
    "./static/**/*.{html,js,css}",  // includes JS or CSS in static
  ],
  theme: {
    extend: {
      colors: {
        // your OKLCH custom header color
        header: "oklch(98.4% 0.003 247.858)",
        // optional palette for consistency
        widaGreen: "oklch(65% 0.15 150)",
        widaGold: "#f9c74f",
      },
      fontFamily: {
        serif: ["Merriweather", "serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
