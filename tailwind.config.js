// eslint-disable-next-line no-undef
const animate = require("tailwindcss-animate")

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx,vue}',
    './components/**/*.{ts,tsx,vue}',
    './app/**/*.{ts,tsx,vue}',
    './src/**/*.{ts,tsx,vue}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      colors: {
        'mc-1': '#a5a5a5',
        'mc-2': '#f78ac9',
        'tc-1': '#111111',
        'erc-1': '#d02d1e',
        'shc-1': '#00000050',
        'shc-2': '#00000070',
      },
    },
    screens: {
      xl: {max: "1279px"},
      // => @media (max-width: 1279px) { ... }

      lg: {max: "1023px"},
      // => @media (max-width: 1023px) { ... }

      md: {max: "800px"},
      // => @media (max-width: 800px) { ... }

      sm: {max: "639px"},
      // => @media (max-width: 639px) { ... }

      xs: {max: "400px"},
      // => @media (max-width: 400px) { ... }
    },
  container: {
    padding: {
      DEFAULT: '1.3vw'
    },
    },
  },
  plugins: [animate],
}
