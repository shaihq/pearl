import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Menu, X } from 'lucide-react'
import { EASE } from '../../motion'
import useForceLightTheme from '../../hooks/useForceLightTheme'

// Join for free needs both Link's client-side routing and motion.a's
// enter/exit slide animation on the same element — motion.create wraps
// Link so it can take initial/animate/exit props directly.
const MotionLink = motion.create(Link)

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

// Icon + name row for the footer's auto-scrolling logo marquee — same
// square badge PNGs LandingPage's ICON_BURST/trusted-by strip use.
const FOOTER_LOGOS = [
  { logo: '/companylogos/amazon.png', name: 'Amazon' },
  { logo: '/companylogos/google.png', name: 'Google' },
  { logo: '/companylogos/apple.png', name: 'Apple' },
  { logo: '/companylogos/cisco.png', name: 'Cisco' },
  { logo: '/companylogos/mastercard.png', name: 'Mastercard' },
  { logo: '/companylogos/ola.png', name: 'Ola' },
  { logo: '/companylogos/razorpay.png', name: 'Razorpay' },
  { logo: '/companylogos/servicenow.png', name: 'ServiceNow' },
]

export default function LandingShell({ children }) {
  const [pastHero, setPastHero] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
          Inset from the true screen edges (max-w-[1300px] + px, same as the
          reference) rather than full-bleed — there's visible page
          background outside the lines on both sides. This is the one shared
          frame every LandingShell page (landing, blog, privacy policy) sits
          inside, so the width lives here once rather than being set
          per-page. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative min-h-screen max-w-[1300px] mx-auto px-6 sm:px-8"
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
          {/* rounded-[28px] (not rounded-full) — at this pill's normal
              closed height that renders identically to fully rounded, but
              unlike rounded-full it doesn't balloon into a stadium shape
              once the mobile drawer below adds height to this same element.
              p-2 uniform padding — left/right now matches top/bottom
              exactly instead of the pill reading noticeably wider than it
              is tall. Frosted-glass pill — translucent light-gray fill over
              a heavy backdrop-blur, so whatever's scrolling underneath
              (hero video, dotted backdrop, page content) shows through
              softened instead of the nav sitting on a flat opaque chip. */}
          <motion.nav
            layout
            transition={{ duration: 0.3, ease: EASE }}
            className={`max-w-xl mx-auto rounded-[28px] border border-[var(--border)] bg-[rgba(255,255,255,0.92)] backdrop-blur-[48px] p-2 shadow-sm overflow-hidden ${
              // Join for free's own button padding normally gives the pill's
              // right edge some visual buffer — without it, plain "Log in"
              // text sits right up against the curve at only p-2. sm: only,
              // since below that the row is just the (fine as-is) hamburger.
              pastHero ? '' : 'sm:pr-5'
            }`}
          >
            <div className="flex items-center justify-between">
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

              {/* Desktop nav items — hidden below sm, replaced by the
                  hamburger + drawer underneath. layout on each of these
                  makes them FLIP-animate their own position when the row's
                  total width changes — i.e. when Join for free mounts/
                  unmounts, Examples/Blogs/Log in smoothly slide over to make
                  or close its space instead of snapping. mode="popLayout" on
                  the AnimatePresence is what lets that reflow happen
                  immediately on exit rather than waiting for the exiting
                  element to finish animating out. */}
              <div className="hidden sm:flex items-center gap-1 text-sm font-medium text-[var(--primary)]">
                <motion.a
                  layout
                  href="#"
                  className="rounded-full px-3 py-1.5 text-[#525252] hover:text-[var(--primary)] hover:bg-[var(--background)] transition-colors duration-200"
                >
                  Examples
                </motion.a>
                <motion.div layout>
                  <Link
                    to="/blog"
                    className="block rounded-full px-3 py-1.5 text-[#525252] hover:text-[var(--primary)] hover:bg-[var(--background)] transition-colors duration-200"
                  >
                    Blogs
                  </Link>
                </motion.div>
                <motion.a
                  layout
                  href="#"
                  className="rounded-full px-3 py-1.5 text-[#525252] hover:text-[var(--primary)] hover:bg-[var(--background)] transition-colors duration-200"
                >
                  Log in
                </motion.a>
                {/* Only shows up once you've scrolled roughly past the
                    hero. A real slide (large x travel, no scale) rather
                    than the old subtle ±8px + scale combo, which read as
                    mostly a fade/pop rather than a directional move: enters
                    sliding right-to-left into place, exits continuing
                    left-to-right past where it started. */}
                <AnimatePresence mode="popLayout">
                  {pastHero && (
                    <MotionLink
                      to="/signup"
                      layout
                      initial={{ opacity: 0, x: 32 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 32 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 hover:bg-[var(--primary-hover)] transition-colors whitespace-nowrap"
                    >
                      Join for free
                    </MotionLink>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile hamburger — everything except the logo collapses
                  into this drawer below sm. */}
              <button
                onClick={() => setMobileMenuOpen((open) => !open)}
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
                className="sm:hidden flex items-center justify-center w-8 h-8 rounded-full text-[var(--primary)] hover:bg-[var(--background)] transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile drawer — height-animated open/close, sm:hidden so it
                never mounts/measures on desktop where the row above already
                shows everything inline. */}
            <AnimatePresence initial={false}>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="sm:hidden overflow-hidden"
                >
                  <div className="flex flex-col gap-4 pt-5 pb-2 text-sm font-medium text-[var(--primary)]">
                    <a
                      href="#"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[#525252] hover:text-[var(--primary)] transition-colors"
                    >
                      Examples
                    </a>
                    <Link
                      to="/blog"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[#525252] hover:text-[var(--primary)] transition-colors"
                    >
                      Blogs
                    </Link>
                    <a
                      href="#"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[#525252] hover:text-[var(--primary)] transition-colors"
                    >
                      Log in
                    </a>
                    {pastHero && (
                      <Link
                        to="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 text-center hover:bg-[var(--primary-hover)] transition-colors"
                      >
                        Join for free
                      </Link>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.nav>
        </div>

        {children}

        {/* Closes out the frame, which is deliberately open at the bottom
            (see the border comment above) — so this is every page's actual
            terminus, not just another section. Styled after a reference: a
            colorful gradient band with a rounded-top light card pulled up
            over it (negative margin), rather than the previous flat dark
            CTA block — content itself (heading, CTA, trusted-by marquee,
            legal links) is unchanged, just rearranged into this shape. No
            entrance animation or parallax on this section — static, same
            as every load. */}
        <div className="relative -mx-6 sm:-mx-8">
          {/* Its own padding (top + sides, none on the bottom) is what
              leaves a visible strip of the photo showing on top of AND
              beside the white card below, rather than the card running
              flush to its edges. Card only rounds its top corners since the
              bottom is flush with this wrapper's own bottom (nothing
              peeking through there) — matches the frame's own "open at the
              bottom" convention elsewhere on the page. */}
          <div className="relative overflow-hidden px-4 sm:px-8 pt-10 sm:pt-16">
            <img src="/section/footer-bg.png" alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="relative rounded-t-[14px] sm:rounded-t-[20px] bg-[var(--background)] px-6 sm:px-8 pt-14 sm:pt-20 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-[650] tracking-tight leading-[1.1] max-w-xl text-[var(--heading)]">
                  Join 34,600+ designers at top companies
                </h2>
                <p className="mt-4 text-base sm:text-lg text-[var(--muted)] max-w-md">
                  Build a portfolio recruiters actually remember — publish today and start applying with confidence.
                </p>
              </div>
              <button className="shrink-0 self-start inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium pl-6 pr-5 py-3 hover:bg-[var(--primary-hover)] transition-colors">
                Claim your domain — FREE
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Auto-scrolling logo marquee — the row is duplicated back to
                back and animated from x:0% to x:-50%, so the loop point is
                invisible (the second copy is pixel-identical to the first).
                Full-bleed (-mx-6/-mx-8 again, cancelling this div's own
                px-6/8) so it isn't boxed into the centered text column
                above it. mask-image fades the row out right at the edges
                instead of overflow-hidden hard-cropping mid-logo — a wider
                fade zone (25%/75%, was 8%/92%) reads as a lighter, more
                gradual fade instead of a near-instant snap to full opacity. */}
            <div
              className="relative mt-16 sm:mt-24 w-full -mx-6 sm:-mx-8 overflow-hidden"
              style={{
                maskImage: 'linear-gradient(to right, transparent, black 25%, black 75%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 25%, black 75%, transparent)',
              }}
            >
              <motion.div
                className="flex items-center gap-16 w-max"
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
              >
                {[...FOOTER_LOGOS, ...FOOTER_LOGOS].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 shrink-0">
                    <img src={item.logo} alt="" className="w-10 h-10 rounded-xl object-cover" />
                    <span className="text-xl font-[650] text-[var(--primary)] whitespace-nowrap">{item.name}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 mt-12 pt-6 border-t border-[var(--border)] text-xs text-[var(--muted)]">
              <p>© 2026 Designfolio. All rights reserved.</p>
              <nav className="flex items-center gap-6">
                <Link to="/privacy-policy" className="hover:text-[var(--primary)] transition-colors">
                  Privacy Policy
                </Link>
                <a href="#" className="hover:text-[var(--primary)] transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-[var(--primary)] transition-colors">
                  Cookie Settings
                </a>
              </nav>
            </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
