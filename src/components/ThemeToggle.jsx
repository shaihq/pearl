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

function CoffeeIcon({ className }) {
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
      <path d="M17 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M3 8h14v7a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="2" x2="6" y2="4" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="14" y1="2" x2="14" y2="4" />
    </svg>
  )
}

function LeafIcon({ className }) {
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
      <path d="M11 20A7 7 0 0 1 4 13c0-4 3-8 8-9 5 1 8 5 8 9a7 7 0 0 1-7 7z" />
      <path d="M11 20v-9" />
      <path d="M11 11l4-4" />
    </svg>
  )
}

function FlowerIcon({ className }) {
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
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 9.5A2.5 2.5 0 1 1 14.5 7 2.5 2.5 0 0 1 12 9.5z" />
      <path d="M12 14.5A2.5 2.5 0 1 1 9.5 17 2.5 2.5 0 0 1 12 14.5z" />
      <path d="M14.5 12A2.5 2.5 0 1 1 17 14.5 2.5 2.5 0 0 1 14.5 12z" />
      <path d="M9.5 12A2.5 2.5 0 1 1 7 9.5 2.5 2.5 0 0 1 9.5 12z" />
    </svg>
  )
}

function iconClass(active) {
  return `w-[18px] h-[18px] absolute transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
    active ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'
  }`
}

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle color mode"
      className="relative w-10 h-10 shrink-0 rounded-full border border-[var(--secondary-border)] flex items-center justify-center text-[var(--primary)] hover:bg-[var(--secondary)] transition-colors"
    >
      <SunIcon className={iconClass(theme === 'light')} />
      <MoonIcon className={iconClass(theme === 'dark')} />
      <CoffeeIcon className={iconClass(theme === 'brown')} />
      <LeafIcon className={iconClass(theme === 'plant')} />
      <FlowerIcon className={iconClass(theme === 'blossom')} />
    </button>
  )
}
