/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bgColor: "#ffffff",
        itemColor: "#3c6e71",
        shadowColor: "#d9d9d9",
        textColor: "#284b63",
        accentColor: "353535",
      },
    },
  },
  plugins: [],
};
