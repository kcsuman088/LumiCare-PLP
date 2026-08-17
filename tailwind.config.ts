import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFF9F4",
        blush: "#F7C8D4",
        petal: "#FDE8EE",
        orchid: "#8D5EAF",
        mist: "#DCEBFF",
        ink: "#2C2430"
      },
      boxShadow: {
        soft: "0 24px 80px rgba(89, 55, 86, 0.14)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-playfair)", "Georgia", "serif"]
      }
    }
  },
  plugins: []
};

export default config;
