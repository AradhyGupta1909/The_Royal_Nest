export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        gold: { 300: "#f0d080", 400: "#e6bc4a", 500: "#d4a017", 600: "#b8860b" },
        dark: { 900: "#0a0a0f", 800: "#12121a", 700: "#1a1a26", 600: "#242434", 500: "#2e2e44" },
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        body: ["'Jost'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
