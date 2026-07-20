import { useEffect, useRef, useState } from 'react'
import ThemeToggle from './ThemeToggle'
import MenuButton from './MenuButton'
import NavDrawer from './NavDrawer'
import { useCursor } from '../context/CursorContext'

export default function Navbar() {
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const lastY = useRef(0)
  const { hide } = useCursor()

  useEffect(() => {
    lastY.current = window.scrollY

    function handleScroll() {
      const y = window.scrollY
      const delta = y - lastY.current

      if (y < 80) {
        setHidden(false)
      } else if (delta > 4) {
        setHidden(true)
      } else if (delta < -4) {
        setHidden(false)
      }

      lastY.current = y
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 px-6 sm:px-8 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          hidden ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="max-w-7xl mx-auto h-24 flex items-center justify-between">
          <div className="text-lg font-semibold tracking-tight text-ink dark:text-white">pearl</div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {!menuOpen && (
              <MenuButton
                onClick={() => {
                  hide()
                  setMenuOpen(true)
                }}
              />
            )}
          </div>
        </div>
      </header>

      <NavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
