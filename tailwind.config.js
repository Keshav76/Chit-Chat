/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "rgba(39,39,42,1)",
        light: "rgb(244,244,245,1)",
        darkText: "rgb(9,9,11,1)",
        gray: "rgb(161,161,170,1)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};
