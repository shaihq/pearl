import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

const THEME_ORDER = ['light', 'dark', 'brown', 'plant', 'blossom']

// Each theme maps to a structural data-theme (light/dark) plus an optional
// data-template that layers a palette on top. brown/plant/blossom aren't
// independent light/dark axes of their own — they're fixed palettes that
// ride on top of whichever structural mode they visually match.
const THEME_CONFIG = {
  light: { domTheme: 'light', template: null },
  dark: { domTheme: 'dark', template: null },
  brown: { domTheme: 'dark', template: 'brown' },
  plant: { domTheme: 'light', template: 'plant' },
  blossom: { domTheme: 'light', template: 'blossom' },
}

function getInitialTheme() {
  const stored = window.localStorage.getItem('theme')
  if (THEME_ORDER.includes(stored)) return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme) {
  const config = THEME_CONFIG[theme] ?? THEME_CONFIG.light

  document.documentElement.setAttribute('data-theme', config.domTheme)
  if (config.template) {
    document.documentElement.setAttribute('data-template', config.template)
  } else {
    document.documentElement.removeAttribute('data-template')
  }
  document.documentElement.style.colorScheme = config.domTheme
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    applyTheme(theme)
    window.localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((t) => THEME_ORDER[(THEME_ORDER.indexOf(t) + 1) % THEME_ORDER.length])
  }, [])

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
