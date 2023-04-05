const headlessui = require("@headlessui/tailwindcss");
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
        900: "rgba(126, 136, 195, 1)",
      },
      accent: {
        100: "rgb(236, 87, 87)",
        200: "rgb(255, 151, 151)",
        300: "rgba(133, 139, 178, 1)",
        400: "rgba(55, 59, 83, 1)",
        500: "rgba(255, 143, 0, 1)",
        600: "rgba(255, 143, 0, 0.1)",
        700: "rgba(51, 214, 159, 1)",
        800: "rgba(51, 214, 159, 0.1)",
      },
      white: "#fff",
      black: "#000",
      transparent: "transparent",
    },
    extend: {
      boxShadow: {
        light: "0px 10px 10px -10px rgba(72, 84, 159, 0.100397)",
        upper: "0px 3px 24px 10px rgba(91, 99, 108, 0.32);",
      },
      transitionProperty: {
        width: "width",
      },
    },
  },
  plugins: [headlessui({ prefix: "ui" })],
};

module.exports = config;
