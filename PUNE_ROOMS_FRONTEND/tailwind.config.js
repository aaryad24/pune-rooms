import { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "2rem",
      },
      borderRadius: {
        xl: "12px",
        lg: "10px",
        md: "8px",
        sm: "6px",
      },
      colors: {
        background: "#ffffff", // White background
        foreground: "#333333", // Dark text for contrast
        primary: {
          DEFAULT: "#007bff", // Professional blue (Booking.com style)
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#ff6f00", // Orange accent (Airbnb-style)
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#f8f9fa", // Light gray for subtle highlights
          foreground: "#333333",
        },
        muted: {
          DEFAULT: "#6c757d",
          foreground: "#ffffff",
        },
        border: "#e0e0e0",
        input: "#f1f1f1",
        ring: "#007bff",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(0, 0, 0, 0.1)",
        md: "0 4px 6px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-in-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"), // Improved form styles
  ],
} satisfies Config;
