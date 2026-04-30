/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#0a0a0f',
        'obsidian-2': '#12121a',
        'obsidian-3': '#1a1a2e',
        violet: {
          900: '#2e1065',
          800: '#3b0764',
          700: '#4c1d95',
          600: '#5b21b6',
          500: '#7c3aed',
          400: '#8b5cf6',
          300: '#a78bfa',
        },
      },
    },
  },
  plugins: [],
}


