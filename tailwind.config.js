/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0a',
        muted: '#9a9a9a',
        panel: '#e4e5ea',
      },
    },
  },
  plugins: [],
}
