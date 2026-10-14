/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f1ff',
          100: '#b3d7ff',
          500: '#00d4ff',
          600: '#00b8e6',
          700: '#009acc',
          900: '#004d66',
        },
        danger: {
          500: '#ef4444',
          600: '#dc2626',
        },
        success: {
          500: '#10b981',
          600: '#059669',
        },
        warning: {
          500: '#f59e0b',
          600: '#d97706',
        },
        dark: {
          50: '#e2e8f0',
          100: '#cbd5e1',
          200: '#94a3b8',
          300: '#64748b',
          400: '#475569',
          500: '#334155',
          600: '#1e293b',
          700: '#0f172a',
          800: '#0d1117',
          900: '#010409',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
