// eslint-disable-next-line no-undef
const animate = require("tailwindcss-animate");

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx,vue}",
    "./components/**/*.{ts,tsx,vue}",
    "./app/**/*.{ts,tsx,vue}",
    "./src/**/*.{ts,tsx,vue}",
  ],
  theme: {
    container: {
      // center: true,
      padding: {
        DEFAULT: "1.2rem",
      }
    },
    extend: {
      transitionDuration: {
        DEFAULT: "300ms",
      },
      transitionTimingFunction: {
        DEFAULT: "ease-in-out",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      colors: {
        "mc-1": "var(--main-color-1)",
        "mc-2": "var(--main-color-2)",
        "mc-3": "var(--main-color-3)",
        "tc-1": "var(--text-color-1)",
        "tc-2": "var(--text-color-2)",
        "tc-3": "var(--text-color-3)",
        "btc-1": "var(--button-color-1)",
        "btc-2": "var(--button-color-2)",
        "erc-1": "var(--error-color-1)",
        "shc-1": "var(--shadow-color-1)",
        "shc-2": "var(--shadow-color-2)",
        "scroll-bg": "var(--scroll-background)",
      },
    },
    screens: {
      xl: { max: "1279px" },
      // => @media (max-width: 1279px) { ... }

      lg: { max: "1023px" },
      // => @media (max-width: 1023px) { ... }

      md: { max: "800px" },
      // => @media (max-width: 800px) { ... }

      sm: { max: "639px" },
      // => @media (max-width: 639px) { ... }

      xs: { max: "400px" },
      // => @media (max-width: 400px) { ... }
    },
  },
  plugins: [animate],
};
