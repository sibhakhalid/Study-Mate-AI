/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Semantic names, not raw hex — every component references these,
        // so a future rebrand/theming pass touches this file only.
        background: "#FFFDF8",   // warm ivory
        surface: "#FFFFFF",      // cards
        primary: {
          DEFAULT: "#D8C4F0",    // dusty lavender
          hover: "#CBB2EA",
          soft: "#F1E9FA",
        },
        secondary: {
          DEFAULT: "#BFD8C1",    // sage green
          hover: "#AECDB0",
          soft: "#EBF3EC",
        },
        accent: {
          DEFAULT: "#F8E7A2",    // butter yellow
          hover: "#F4DC7F",
          soft: "#FCF6E1",
        },
        ink: {
          DEFAULT: "#3D3D3D",    // primary text
          muted: "#6B6B6B",      // secondary text
          faint: "#9C9C9C",      // placeholder/disabled
        },
        border: "#EDE8DE",
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 2px 12px -2px rgba(61, 61, 61, 0.06)",
        lift: "0 8px 24px -4px rgba(61, 61, 61, 0.10)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.4s ease-out",
        floatSlow: "floatSlow 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
