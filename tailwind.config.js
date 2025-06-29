/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "rack-frame": "#2a2a2a",
        "rack-unit": "#3a3a3a",
        "rack-highlight": "#4a90e2",
        "rack-snap": "#ffd700",
        "component-server": "#1e40af",
        "component-storage": "#059669",
        "component-network": "#dc2626",
        "component-power": "#7c3aed",
      },
      spacing: {
        "rack-unit": "44px",
      },
      gridTemplateRows: {
        "rack-42": "repeat(42, minmax(0, 1fr))",
      },
    },
  },
};
