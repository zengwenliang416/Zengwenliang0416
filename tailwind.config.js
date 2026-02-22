/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#F2F2F7",
        "dark-surface": "#FFFFFF",
        "dark-card": "#FFFFFF",
        "dark-border": "rgba(0,0,0,0.08)",
        coral: "#FF3C5F",
        "coral-dim": "rgba(255,60,95,0.10)",
        lime: "#34C759",
        "lime-dim": "rgba(52,199,89,0.10)",
        indigo: "#5856D6",
        "indigo-dim": "rgba(88,86,214,0.10)",
        "text-primary": "#1C1C1E",
        "text-secondary": "#3A3A3C",
        "text-muted": "#8E8E93",
        "glass-fill": "rgba(255,255,255,0.45)",
        "glass-border": "rgba(0,0,0,0.08)",
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans SC", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        display: ["Space Grotesk", "sans-serif"],
      },
    },
  },
  plugins: [],
};
