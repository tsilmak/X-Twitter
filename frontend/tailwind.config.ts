import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        borderColor: "var(--border-color)",
        // BLACK THEME
        colorHover: "var(--color-hover)",
        primaryText: "var(--primary-text)",
        // PRIMARY COLORS
        primaryBlue: "var(--primary-blue)",
        primaryBlueHover: "var(--primary-blue-hover)",
        // TEXT COLORS
        textSecondary: "var(--text-secondary)",
        textMuted: "var(--text-muted)",
        // BUTTON COLORS
        buttonPrimaryBg: "var(--button-primary-bg)",
        buttonPrimaryHover: "var(--button-primary-hover)",
        buttonDisabledBg: "var(--button-disabled-bg)",
        // INTERACTIVE STATES
        hoverOverlay: "var(--hover-overlay)",
        focusBorder: "var(--focus-border)",
      },
      keyframes: {
        "scale-up": {
          "0%": { transform: "scale(1)" },
          "25%": { transform: "scale(1.03)" },
          "50%": { transform: "scale(1.05)" },
          "75%": { transform: "scale(1.03)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "scale-up": "scale-up 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      },
      screens: {
        "3xl": "1920px",
      },
      boxShadow: {
        glow: "0 0 2px 1px var(--glow-inner), 0 0 6px 1px var(--glow-outer)",
      },
    },
  },
  plugins: [],
} satisfies Config;
