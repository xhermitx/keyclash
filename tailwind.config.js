/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bgColor: "#231E23",
        itemColor: "#BF1363",
        shadowColor: "#39A6A3",
        textColor: "#DEEEEA",
      },
    },
  },
  plugins: [],
};
