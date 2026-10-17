export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#16211c",
          soft: "#4a5751",
          muted: "#66726c",
        },
        forest: {
          50: "#eef4f1",
          100: "#d7e5de",
          200: "#b0cbbd",
          500: "#3b6b58",
          600: "#2c5545",
          700: "#1f4234",
          800: "#183428",
          900: "#11261d",
        },
        gold: {
          50: "#faf4ea",
          100: "#f2e4c8",
          400: "#d0a764",
          500: "#b88a45",
          600: "#8f6a2f",
        },
        sand: {
          50: "#fbfaf7",
          100: "#f5f1e9",
          200: "#ebe5d8",
          300: "#d9d0bd",
        },
        danger: {
          50: "#fdf1f0",
          600: "#b42318",
          700: "#912018",
        },
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(22,33,28,0.04), 0 8px 24px -14px rgba(22,33,28,0.14)",
        lift: "0 2px 6px rgba(22,33,28,0.06), 0 24px 48px -20px rgba(22,33,28,0.28)",
      },
    },
  },
};
