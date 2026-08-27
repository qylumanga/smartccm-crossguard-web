import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B1220",
        surface: "#121B2E",
        "surface-raised": "#182541",
        hairline: "#26324A",
        primary: "#E8ECF4",
        muted: "#8492AC",
        accent: "#4FA8FF",
        signal: {
          green: "#2FBF71",
          amber: "#E8A33D",
          red: "#E5484D",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      boxShadow: {
        panel: "0 20px 60px -20px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};
export default config;
