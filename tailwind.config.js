// eslint-disable-next-line no-undef
import animate from "tailwindcss-animate";
import plugin from "tailwindcss/plugin";

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
        DEFAULT: "0.5rem",
      },
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
        "collapsible-down": {
          from: { height: 0 },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
        "collapsible-up": {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: 0 },
        },
        fadeIn: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "collapsible-down": "collapsible-down 0.2s ease-in-out",
        "collapsible-up": "collapsible-up 0.2s ease-in-out",
        "fade-in": "fadeIn 0.5s ease-in-out",
      },
      colors: {
        "bgc-1": "hsl(var(--background-color-1))",
        "mc-1": "hsl(var(--main-color-1))",
        "mc-2": "hsl(var(--main-color-2))",
        "mc-3": "hsl(var(--main-color-3))",
        "tc-1": "hsl(var(--text-color-1))",
        "tc-2": "hsl(var(--text-color-2))",
        "tc-3": "hsl(var(--text-color-3))",
        "tc-4": "hsl(var(--text-color-4))",
        "hc-1": "hsl(var(--hover-color-1))",
        "hc-2": "hsl(var(--hover-color-2))",
        "hc-3": "hsl(var(--hover-color-3))",
        "shc-1": "hsl(var(--shadow-color-1))",
        "shc-2": "hsl(var(--shadow-color-2))",
        "opc-1": "hsl(var(--opacity-color-1))",
        "scroll-bg": "hsl(var(--scroll-background))",
      },
    },
    screens: {
      "2xl": { max: "1555px" },
      // => @media (max-width: 1555px) { ... }
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
  plugins: [
    animate,
    plugin(
      function ({ matchUtilities, theme }) {
        matchUtilities(
          {
            "content-visibility": (value) => {
              return {
                "content-visibility": value,
              };
            },
          },
          {
            values: theme("contentVisibility"),
          },
        );
        matchUtilities(
          {
            "contain-intrinsic-size": (value) => {
              return {
                "contain-intrinsic-size": value,
              };
            },
          },
          {
            values: theme("containIntrinsicSize"),
          },
        );
      },
      {
        theme: {
          contentVisibility: {
            auto: "auto",
            hidden: "hidden",
            visible: "visible",
          },
        },
      },
    ),
  ],
};
