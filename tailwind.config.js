/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bgColor: "#000000",
        itemColor: "#082032",
        shadowColor: "#334756",
        textColor: "#F0A500",
      },
    },
  },
  plugins: [],
};
