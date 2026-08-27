import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { EASE } from '../../motion'
import useForceLightTheme from '../../hooks/useForceLightTheme'

// Shared chrome for every marketing page (landing, blog, ...) — the bordered
// frame, floating nav and closing footer CTA are one continuous visual
// language across pages, so they live here once rather than being
// copy-pasted per page and drifting out of sync. Page-specific content
// (hero, video, post grid, whatever) is passed in as children and rendered
// between the nav and the footer.
//
// Copied verbatim from :root in index.css — pinning the tokens here (rather
// than relying on the app's live theme) covers every var() reference within
// this subtree regardless of whatever theme the builder happens to be in;
// see useForceLightTheme for why that's also enforced at the document level.
const LIGHT_THEME_VARS = {
  '--background': '#ffffff',
  '--card': '#e4e5ea',
  '--secondary': '#f5f5f5',
  '--secondary-hover': '#e5e5e5',
  '--muted': '#737373',
  '--border': '#e5e5e5',
  '--primary': '#0a0a0a',
  '--primary-foreground': '#ffffff',
  '--primary-hover': '#262626',
  '--heading': '#2b2b2b', // softer than --primary — headings shouldn't read as pure black
}

export default function LandingShell({ children }) {
  const [pastHero, setPastHero] = useState(false)

  useForceLightTheme()

  // Nav stays put now (no hide-on-scroll) — this just watches for having
  // scrolled roughly a viewport height, our stand-in for "past the hero"
  // since the shell doesn't have a ref into whatever hero the page renders,
  // to flip on the "Join for free" button below.
  useEffect(() => {
    function handleScroll() {
      setPastHero(window.scrollY > window.innerHeight * 0.8)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      style={{ ...LIGHT_THEME_VARS, fontFamily: "'Manrope', sans-serif" }}
      className="relative min-h-screen bg-[var(--background)] text-[var(--primary)] pt-10 sm:pt-12"
    >
      {/* Left and right borders — a continuous frame open at the top (the
          video now runs flush to the true page top there, so a top border
          would cut across it) and the bottom, running the full page height
          (min-h-screen so it still reaches the bottom on short pages).
          Inset from the true screen edges (max-w-[1400px] + px, same as the
          reference) rather than full-bleed — there's visible page
          background outside the lines on both sides. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative min-h-screen max-w-[1400px] mx-auto px-6 sm:px-8"
      >
        <div className="absolute inset-y-0 left-0 w-px bg-[var(--border)] z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-px bg-[var(--border)] z-20 pointer-events-none" />

        {/* Sticky nav — fixed (not absolute) so it stays pinned through
            scroll instead of scrolling away with the frame. top-10/12
            matches the outer wrapper's pt-10/12, so it lands in the exact
            same spot straddling the top border at rest. -translate-y-1/2 is
            the same vertical-centering trick the old scroll-driven y
            animation used, just static now — the nav no longer hides on
            scroll, it just sits there. */}
        <div className="fixed inset-x-0 top-10 sm:top-12 -translate-y-1/2 z-30 px-6 sm:px-8">
          <motion.nav
            layout
            transition={{ duration: 0.3, ease: EASE }}
            className="flex items-center justify-between max-w-xl mx-auto rounded-full border border-[var(--border)] bg-[var(--secondary)] px-6 py-2 shadow-sm"
          >
            <Link to="/landing" className="flex items-center gap-2">
              <svg width="32" height="32" viewBox="0 0 125 125" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 shrink-0">
                <g filter="url(#pearl-logo-filter)">
                  <rect width="124.5" height="124.5" rx="62.25" fill="url(#pearl-logo-gradient)" />
                  <path
                    d="M67.437 15.5625H57.062V49.7263L32.9046 25.5688L25.5683 32.9051L49.7258 57.0625H15.562V67.4375H49.7258L25.5684 91.5949L32.9046 98.9311L57.062 74.7737V108.937H67.437V74.7737L91.5944 98.9312L98.9307 91.5949L74.7732 67.4375H108.937V57.0625H74.7732L98.9307 32.9051L91.5944 25.5688L67.437 49.7263V15.5625Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <filter id="pearl-logo-filter" x="0" y="0" width="124.5" height="124.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset />
                    <feGaussianBlur stdDeviation="6.72973" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.333333 0 0 0 0 0.243137 0 0 0 1 0" />
                    <feBlend mode="normal" in2="shape" result="leftnav-logo-shadow" />
                  </filter>
                  <linearGradient id="pearl-logo-gradient" x1="62.25" y1="0" x2="62.25" y2="124.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFDCD7" />
                    <stop offset="0.788462" stopColor="#FF553E" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-lg font-bold tracking-tight lowercase">designfolio</span>
            </Link>
            <div className="flex items-center gap-6 text-sm font-medium text-[var(--primary)]">
              {/* layout on each of these makes them FLIP-animate their own
                  position when the row's total width changes — i.e. when
                  Join for free mounts/unmounts below, Examples/Blogs/Log in
                  smoothly slide over to make or close its space instead of
                  snapping. mode="popLayout" on the AnimatePresence is what
                  lets that reflow happen immediately on exit rather than
                  waiting for the exiting element to finish animating out. */}
              <motion.a layout href="#" className="text-[var(--muted)] hover:text-[var(--primary)] transition-colors">
                Examples
              </motion.a>
              <motion.div layout>
                <Link to="/blog" className="text-[var(--muted)] hover:text-[var(--primary)] transition-colors">
                  Blogs
                </Link>
              </motion.div>
              <motion.a layout href="#" className="text-[var(--muted)] hover:text-[var(--primary)] transition-colors">
                Log in
              </motion.a>
              {/* Only shows up once you've scrolled roughly past the hero —
                  a quick pop/slide in, not there from the first paint. */}
              <AnimatePresence mode="popLayout">
                {pastHero && (
                  <motion.a
                    layout
                    href="#"
                    initial={{ opacity: 0, scale: 0.85, x: -8 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.85, x: -8 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 hover:bg-[var(--primary-hover)] transition-colors whitespace-nowrap"
                  >
                    Join for free
                  </motion.a>
                )}
              </AnimatePresence>
            </div>
          </motion.nav>
        </div>

        {children}

        {/* Closes out the frame, which is deliberately open at the bottom
            (see the border comment above) — so this is every page's actual
            terminus, not just another section. Divider matches the hatched
            ones used within page content, closing the section instead of
            just trailing into blank white space. Full-bleed illustrated CTA
            band with a plain legal bar underneath, kept as a separate
            flat-color strip rather than laid over the artwork, so the
            copyright/links stay legible regardless of what's happening in
            the image behind the CTA above it.

            Animated on its own trigger (not a shared stagger container with
            whatever page content precedes it) so this footer behaves
            identically no matter which page is rendering it. */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="-mx-6 sm:-mx-8 h-16 border-y border-[var(--border)]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to right, var(--border) 0, var(--border) 1px, transparent 1px, transparent 12px)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="-mx-6 sm:-mx-8"
        >
          <div
            className="relative flex flex-col items-center text-center px-6 sm:px-8 py-24 sm:py-32"
            style={{
              backgroundImage: 'url(/footerfornewdesignfolio.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-[650] tracking-tight leading-[1.1] max-w-2xl text-[#1a1a1a]">
              Your UX job hunt starts here
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-[#1a1a1a]/70 max-w-md">
              Build a portfolio recruiters actually remember — publish today and start applying with confidence.
            </p>
            <button className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium pl-6 pr-5 py-3 hover:bg-[var(--primary-hover)] transition-colors">
              Claim your domain — FREE
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 px-6 sm:px-8 py-6 border-t border-[var(--border)] bg-[var(--background)] text-xs text-[var(--muted)]">
            <p>© 2026 Designfolio. All rights reserved.</p>
            <nav className="flex items-center gap-6">
              <a href="#" className="hover:text-[var(--primary)] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-[var(--primary)] transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-[var(--primary)] transition-colors">
                Cookie Settings
              </a>
            </nav>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
