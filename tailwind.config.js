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
        // Consistent status color system
        "status-success": "#10b981",
        "status-success-light": "#d1fae5",
        "status-success-dark": "#065f46",
        "status-warning": "#f59e0b", 
        "status-warning-light": "#fef3c7",
        "status-warning-dark": "#92400e",
        "status-error": "#ef4444",
        "status-error-light": "#fee2e2", 
        "status-error-dark": "#991b1b",
        "status-info": "#3b82f6",
        "status-info-light": "#dbeafe",
        "status-info-dark": "#1e40af",
      },
      spacing: {
        "rack-unit": "44px",
        "rack-width": "600px",
        "rack-width-standard": "720px",
        "rack-unit-label": "56px",
        "component-padding": "8px",
        "container-padding": "24px",
      },
      height: {
        "rack-unit": "44px",
      },
      zIndex: {
        'component': '10',
        'dragging': '20', 
        'snap-guide': '20',
        'modal': '50',
        'drag-preview': '1000',
      },
      gridTemplateRows: {
        "rack-42": "repeat(42, minmax(0, 1fr))",
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-out',
        'slideIn': 'slideIn 0.3s ease-out',  
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'strong': '0 8px 32px rgba(0, 0, 0, 0.16)',
      },
    },
  },
};
