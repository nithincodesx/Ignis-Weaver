import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Light theme surfaces
        "g-bg-light": "#EDEDED",
        "g-surface-light": "#E3E4E6",
        "g-card-light": "#FFFFFF",
        "g-border-light": "#000000",
        "g-border-dim-light": "#D1D5DB",
        "g-text-light": "#111827",
        "g-text-dim-light": "#6B7280",
        // Dark theme surfaces
        "g-bg-dark": "#06080F",
        "g-surface-dark": "#0C1019",
        "g-card-dark": "#111520",
        "g-border-dark": "#1A1F2E",
        "g-border-2-dark": "#252B3B",
        "g-text-dark": "#E2E8F0",
        "g-text-dim-dark": "#64748B",
        // Shared accent colours
        "g-teal": "#00E88F",
        "g-blue": "#00C9FF",
        "g-danger": "#FF4D6A",
        "g-warn": "#FFB547",
        "g-info": "#5B8DEF",
        "g-logo": "#10D9B1",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "Fira Code", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 8s linear infinite",
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.35s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
