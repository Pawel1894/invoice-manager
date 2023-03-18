/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{jsx,tsx}"],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: ["var(--font-spartan)", "sans-serif"],
    },
    colors: {
      primary: {
        100: "rgb(124, 94, 250)",
        200: "rgb(146, 119, 255)",
      },
      neutral: {
        100: "rgb(30, 33, 57)",
        200: "rgb(37, 41, 69)",
        300: "rgb(233, 277, 250)",
        400: "rgb(136, 142, 176)",
        500: "rgb(12, 14, 22)",
        600: "rgb(248, 248, 251)",
        700: "rgb(20, 22, 37)",
        800: "rgb(235, 231, 231)",
      },
      accent: {
        100: "rgb(236, 87, 87)",
        200: "rgb(255, 151, 151)",
      },
      white: "#fff",
      black: "#000",
      transparent: "transparent",
    },
    extend: {},
  },
  plugins: [],
};

module.exports = config;
