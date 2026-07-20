import { useTheme } from '../context/ThemeContext'

function SunIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

function MoonIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle color mode"
      aria-pressed={isDark}
      className="relative w-10 h-10 shrink-0 rounded-full border border-neutral-200 dark:border-zinc-800 flex items-center justify-center text-ink dark:text-white hover:bg-neutral-100 dark:hover:bg-zinc-900 transition-colors"
    >
      <SunIcon
        className={`w-[18px] h-[18px] absolute transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isDark ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
        }`}
      />
      <MoonIcon
        className={`w-[18px] h-[18px] absolute transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'
        }`}
      />
    </button>
  )
}
