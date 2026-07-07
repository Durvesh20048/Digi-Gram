/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { sm: "640px", md: "768px", lg: "1024px", xl: "1200px" },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2A4D69", // corporate blue
          600: "#244158",
          700: "#1d3447",
        },
        accent: {
          DEFAULT: "#2E7D32", // govt green
          600: "#256528",
          700: "#1f5421",
        },
        ink: "#0f172a",       // slate-900-ish for headings
        sub: "#475569",       // slate-600 for body text
        bg: "#F7F9FC",        // app background
        card: "#ffffff",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(2, 6, 23, 0.08)",
        float: "0 12px 40px rgba(2, 6, 23, 0.12)",
        inset: "inset 0 1px 0 rgba(255,255,255,.4)",
      },
      fontFamily: {
        inter: ["Inter", "system-ui", "Segoe UI", "Roboto", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        floatIn: {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeUp: {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-100% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        floatIn: "floatIn .6s cubic-bezier(.22,.61,.36,1) both",
        fadeUp: "fadeUp .5s ease-out both",
      },
    },
  },
  plugins: [],
};
