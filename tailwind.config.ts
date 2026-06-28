import type { Config } from "tailwindcss";
export default {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: { ink: "#0b1526", cobalt: "#135ef2", coral: "#f04452", mint: "#19a987" },
      boxShadow: { panel: "0 1px 2px rgb(15 23 42 / .04), 0 8px 24px rgb(15 23 42 / .04)" },
      animation: { "fade-up": "fadeUp .35s ease-out both", "scan": "scan 1.4s ease-in-out infinite" },
      keyframes: {
        fadeUp: { from: { opacity: "0", transform: "translateY(6px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        scan: { "0%,100%": { transform: "translateX(-30%)" }, "50%": { transform: "translateX(130%)" } }
      }
    }
  },
  plugins: []
} satisfies Config;
