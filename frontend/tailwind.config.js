/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slate: {
          50: '#f6f7f2', 100: '#edf0e8', 200: '#e0e5db', 300: '#cad2c6',
          400: '#a0ab9f', 500: '#5d6b61', 600: '#4b5a50', 700: '#37483d',
          800: '#25362d', 900: '#18271f', 950: '#101b14'
        },
        cyan: {
          50: '#edf9ed', 100: '#daf2db', 200: '#bce6bf', 300: '#9dd9a5',
          400: '#80d68f', 500: '#6aca7c', 600: '#25743d', 700: '#205d34',
          800: '#1c4b2c', 900: '#173e25', 950: '#102c1b'
        },
        gym: {
          dark: '#101b14',
          surface: '#18271f',
          card: '#25362d',
          border: '#37483d',
          accent: '#6aca7c',
          'accent-hover': '#80d68f',
          neon: '#10b981',
          gold: '#f59e0b',
          rose: '#f43f5e',
          violet: '#8b5cf6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 8px 32px -18px rgba(37, 116, 61, 0.45)',
        'glow-emerald': '0 0 20px -5px rgba(16, 185, 129, 0.4)',
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
