import { useEffect, useRef } from 'react'
import ArrowIcon from './ArrowIcon'

export default function Footer({ onHeightChange }) {
  const footerRef = useRef(null)

  useEffect(() => {
    const el = footerRef.current
    if (!el || !onHeightChange) return

    const observer = new ResizeObserver(() => {
      onHeightChange(el.getBoundingClientRect().height)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [onHeightChange])

  return (
    <footer
      ref={footerRef}
      className="fixed inset-x-0 bottom-0 z-0 bg-ink dark:bg-zinc-900 text-white px-6 sm:px-8 pt-16 pb-6 transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between gap-10">
          <h2 className="text-4xl sm:text-5xl font-medium tracking-tight leading-[1.1]">
            Let's build something cool together
          </h2>

          <div className="flex gap-16 text-sm text-neutral-400 sm:pt-2">
            <nav className="flex flex-col gap-2">
              <a href="#work" className="hover:text-white transition-colors">
                Work
              </a>
              <a href="#about" className="hover:text-white transition-colors">
                About
              </a>
              <a href="#contact" className="hover:text-white transition-colors">
                Contact
              </a>
            </nav>
            <nav className="flex flex-col gap-2">
              <a href="#dribbble" className="flex items-center gap-1 hover:text-white transition-colors">
                Dribbble <ArrowIcon className="w-3 h-3" />
              </a>
              <a href="#instagram" className="flex items-center gap-1 hover:text-white transition-colors">
                Instagram <ArrowIcon className="w-3 h-3" />
              </a>
            </nav>
          </div>
        </div>

        <button className="mt-10 inline-flex items-center gap-1.5 rounded-full bg-white text-ink text-sm font-medium pl-5 pr-4 py-2.5 hover:bg-neutral-200 transition-colors">
          Let's talk
          <ArrowIcon />
        </button>

        <div className="mt-24 flex items-center justify-between text-xs text-neutral-500">
          <p>2026 Pearl Framer template crafted with love by David Pietrasiak</p>
          <span className="flex items-center gap-1.5 bg-neutral-800 dark:bg-zinc-800 text-neutral-300 rounded-full px-3 py-1.5">
            ● Made in Framer
          </span>
        </div>
      </div>
    </footer>
  )
}
