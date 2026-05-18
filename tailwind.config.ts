import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#A98B76",
          dark: "#8B6F5A",
          light: "#C4A992",
        },
        secondary: {
          DEFAULT: "#BFA98E",
          light: "#D4C4A8",
        },
        cream: {
          DEFAULT: "#EFE5C8",
          light: "#F7F2E5",
          dark: "#DDD0B3",
        },
        sage: {
          DEFAULT: "#8FA870",
          dark: "#6B8054",
          light: "#A8BF8E",
        },
        stone: {
          50: "#FAF8F5",
          100: "#F2EDE4",
          200: "#E5DAC8",
          300: "#D4C4A8",
          400: "#BFA98E",
          500: "#A98B76",
          600: "#8B6F5A",
          700: "#6B5142",
          800: "#4A3630",
          900: "#2D201C",
        },
      },
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body: ["'Lato'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.4s ease-out forwards",
        "slide-in-right": "slideInRight 0.3s ease-out forwards",
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
