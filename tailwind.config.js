import tailwindcssAnimate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0a',
        panel: '#e4e5ea',
        background: 'var(--background)',
        foreground: 'var(--primary)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--primary)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--primary)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--primary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted)',
        },
        border: 'var(--border)',
        input: 'var(--secondary-border)',
        ring: 'var(--ring)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
