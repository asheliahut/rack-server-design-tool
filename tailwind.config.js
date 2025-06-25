/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        rack: {
          frame: "#2a2a2a",
          unit: "#3a3a3a",
          highlight: "#4a90e2",
          snap: "#ffd700",
        },
        component: {
          server: "#1e40af",
          storage: "#059669",
          network: "#dc2626",
          power: "#7c3aed",
        },
      },
      spacing: {
        "rack-unit": "44px", // Standard 1U height
      },
      gridTemplateRows: {
        "rack-42": "repeat(42, minmax(0, 1fr))", // 42U rack
      },
    },
  },
  plugins: [],
};
