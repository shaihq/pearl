import { useEffect, useRef, useState } from 'react'
import ThemeToggle from './ThemeToggle'
import MenuButton from './MenuButton'
import NavDrawer from './NavDrawer'
import { useCursor } from '../context/CursorContext'
import { useCanvas } from '../context/CanvasContext'

export default function Navbar() {
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const lastY = useRef(0)
  const { hide } = useCursor()
  const { containerRef } = useCanvas()

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    lastY.current = el.scrollTop

    function handleScroll() {
      const y = el.scrollTop
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

    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [containerRef])

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-30 px-6 sm:px-8 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          hidden ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="max-w-7xl mx-auto h-24 flex items-center justify-between">
          <div className="text-lg font-semibold tracking-tight text-[var(--primary)]">pearl</div>

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
