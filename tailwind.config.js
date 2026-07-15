/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        bg: {
          primary: '#ffffff',
          secondary: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
        },
        text: {
          primary: '#0f172a',
          secondary: '#475569',
          muted: '#64748b',
        },
        accent: {
          DEFAULT: '#2563eb',
          hover: '#1d4ed8',
          subtle: 'rgba(37,99,235,0.06)',
          border: 'rgba(37,99,235,0.15)',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
