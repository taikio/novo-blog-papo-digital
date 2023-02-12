/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.vue",
    "./layouts/**/*.vue",
    "./components/**/*.{js,vue,ts}",
    "./plugins/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "rgba(57, 188, 209, 0.2)",
          200: "rgba(57, 188, 209, 0.4)",
          300: "rgba(57, 188, 209, 0.6)",
          400: "rgba(57, 188, 209, 0.8)",
          500: "rgba(57, 188, 209, 1)",
        },
        secondary: {
          100: "rgba(100, 175, 204, 0.2)",
          200: "rgba(100, 175, 204, 0.4)",
          300: "rgba(100, 175, 204, 0.6)",
          400: "rgba(100, 175, 204, 0.8)",
          500: "rgba(100, 175, 204, 1)",
        },
        "dark-purple": {
          100: "rgba(54, 57, 115, 0.2)",
          200: "rgba(54, 57, 115, 0.4)",
          300: "rgba(54, 57, 115, 0.6)",
          400: "rgba(54, 57, 115, 0.8)",
          500: "rgba(54, 57, 115, 1)",
        },
        midnight: {
          100: "rgba(57, 52, 89, 0.2)",
          200: "rgba(57, 52, 89, 0.4)",
          300: "rgba(57, 52, 89, 0.6)",
          400: "rgba(57, 52, 89, 0.8)",
          500: "rgba(57, 52, 89, 1)",
        },
        gray: {
          100: "rgba(196, 202, 207, 0.2)",
          200: "rgba(196, 202, 207, 0.4)",
          300: "rgba(196, 202, 207, 0.6)",
          400: "rgba(196, 202, 207, 0.8)",
          500: "rgba(196, 202, 207, 1)",
        },
        ice: "rgba(250, 250, 250, 0.2)",
        black: {
          400: "rgba(0, 0, 0, 0.75)",
          500: "rgba(0, 0, 0, 0.8)",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: "rgba(0, 0, 0, 0.75)",
            "code::before": {
              content: "",
            },
            "code::after": {
              content: "",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
