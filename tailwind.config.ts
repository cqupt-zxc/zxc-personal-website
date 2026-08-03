import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0C0C0C",
        frost: "#D7E2EA",
      },
      fontFamily: {
        display: ["var(--font-kanit)", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
