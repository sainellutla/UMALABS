/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Minimal dark palette: near-black base, off-white text (via
        // Tailwind's built-in `white`), and one cool accent used sparingly.
        charcoal: {
          950: "#0a0a0a",
          900: "#131313",
          850: "#171717",
          800: "#1b1b1b",
          700: "#232323",
          600: "#2a2a2a",
          500: "#3a3a3a",
        },
        accent: {
          DEFAULT: "#4C8DFF",
          600: "#2C5FCB",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        serif: ["Newsreader", "Georgia", "serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      maxWidth: {
        content: "1200px",
      },
      letterSpacing: {
        tightest: "-0.04em",
        widest2: "0.2em",
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
