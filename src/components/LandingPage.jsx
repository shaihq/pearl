import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, cubicBezier, motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight,
  Box,
  Heart,
  Home,
  LayoutGrid,
  Mail,
  MessageCircle,
  Palette,
  Sparkles,
  Tv,
  Wallet,
} from 'lucide-react'
import { EASE } from '../motion'

// EASE is a raw cubic-bezier control-point array — fine for
// transition:{ease}, but useTransform's own `ease` option wants an actual
// easing *function* (t) => t, a different API. cubicBezier(...) converts it.
const SCROLL_EASE = cubicBezier(...EASE)

const HEADLINE_LINES = [
  ['Stop', 'losing', 'sleep'],
  ['over', 'your', 'UX', 'portfolio.'],
]

// Placeholder content only — a simple icon + label swap, not a real product
// screenshot. Keeps the tab-switch interaction legible without pretending
// to be a finished mockup. badgeBg/badgeFg echo the colored icon-badge
// treatment from ICON_BURST below, so this section doesn't introduce a
// one-off color language of its own.
const PREVIEW_TABS = [
  { id: 'builder', label: 'Portfolio Builder', Icon: LayoutGrid, badgeBg: 'bg-blue-600', badgeFg: 'text-white' },
  { id: 'jobs', label: 'AI Job Matching', Icon: Sparkles, badgeBg: 'bg-violet-600', badgeFg: 'text-white' },
]

// Generic colored app-icon badges (not real brand logos) scattered around
// the stat block, positioned by % so the "burst from center" offset below
// can be computed relative to each one's own spot. top/left are percentages
// of the container. Trimmed to 8 — the original 12 read as cluttered,
// especially once these also show on mobile.
const ICON_BURST = [
  { Icon: Mail, top: 8, left: 14, bg: 'bg-yellow-400', fg: 'text-white' },
  { Icon: Home, top: 6, left: 46, bg: 'bg-blue-600', fg: 'text-white' },
  { Icon: Tv, top: 5, left: 80, bg: 'bg-zinc-900', fg: 'text-white' },
  { Icon: Palette, top: 40, left: 10, bg: 'bg-slate-200', fg: 'text-slate-600' },
  { Icon: MessageCircle, top: 38, left: 88, bg: 'bg-violet-600', fg: 'text-white' },
  { Icon: Wallet, top: 78, left: 16, bg: 'bg-indigo-900', fg: 'text-white' },
  { Icon: Heart, top: 90, left: 48, bg: 'bg-rose-500', fg: 'text-white' },
  { Icon: Box, top: 82, left: 82, bg: 'bg-green-500', fg: 'text-white' },
]

// Icons burst outward from the center on scroll-in — each one's hidden
// state is offset back toward the container's center point (50/50),
// scaled by its own distance from center, so they all visibly converge
// there before animating out to their resting spot. vw/vh (not px) so the
// offset scales with viewport instead of being a fixed distance.
const burstContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.035, delayChildren: 0.05 } },
}
function burstIconVariants(top, left) {
  return {
    hidden: { opacity: 0, scale: 0.2, x: `${(50 - left) * 0.45}vw`, y: `${(50 - top) * 0.45}vh` },
    visible: { opacity: 1, scale: 1, x: 0, y: 0, transition: { duration: 0.6, ease: EASE } },
  }
}
const burstStat = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } },
}

// Continuous idle drift for each icon — every one gets its own direction
// (spread via the golden angle, so 8 icons come out well distributed
// around a full circle instead of clustering) and its own amplitude/speed,
// so none of them are moving in sync or along the same axis. Diagonal
// drift (x AND y) reads as more organic than a uniform vertical bob.
const GOLDEN_ANGLE = 137.5
function floatAnimation(i) {
  const angle = (i * GOLDEN_ANGLE * Math.PI) / 180
  const amplitude = 10 + (i % 3) * 4
  const dx = Math.cos(angle) * amplitude
  const dy = Math.sin(angle) * amplitude
  return {
    animate: { x: [0, dx, 0, -dx * 0.6, 0], y: [0, dy, 0, -dy * 0.6, 0] },
    transition: {
      duration: 3.2 + (i % 4) * 0.6,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: i * 0.22,
    },
  }
}

// Local, deliberate-but-brisk variants for this page specifically — not the
// shared quickContainer/revealBT from ../motion (those stay as they are,
// used across the builder's own canvas pages). Short durations with a nice
// eased curve and small travel distances reads calmer/more "Apple" than a
// linear snap, without lingering.
const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}
const heroReveal = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

// A gentle word-by-word wave — each word barely lifts in (10px) with a
// quick stagger between them, rather than one big slide for the whole line.
const waveContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.02 } },
}
const waveWord = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

// Several eased stops instead of one hard linear cut — dissolves gradually
// rather than ending on a visible seam where the fade "starts." Kept subtle:
// stays fully opaque for most of the box and only eases out near the very
// bottom, instead of fading a large chunk of the footage away.
const VIDEO_FADE_MASK =
  'linear-gradient(to bottom, black 0%, black 70%, rgba(0,0,0,0.9) 80%, rgba(0,0,0,0.7) 88%, rgba(0,0,0,0.4) 96%, transparent 100%)'

// The landing page is a fixed marketing surface, not a themeable canvas
// page — it should always read as the light palette regardless of whatever
// theme the builder happens to be in. Pinning the tokens here (copied
// verbatim from :root in index.css) covers every var() reference *within*
// this component's own subtree. It does NOT cover <body> itself — index.css
// ties `body { background: var(--background) }` to whatever data-theme
// ThemeProvider has set on <html> globally, so on a system/session with the
// dark theme active, body's real background stays near-black underneath
// this component regardless of these local overrides. The effect below
// forces the actual document-level theme to light while this page is
// mounted (restoring whatever it was on unmount) so body itself is white,
// not just the content painted on top of it.
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

// The dark palette from index.css's [data-theme='dark'] block, copied the
// same way LIGHT_THEME_VARS copies :root — this is the one section of an
// otherwise-forced-light page that's meant to break from it, so it needs
// its own local override rather than touching the page-level theme.
const DARK_THEME_VARS = {
  '--background': '#09090b',
  '--card': '#18181b',
  '--secondary': '#27272a',
  '--secondary-hover': '#3f3f46',
  '--muted': '#a1a1aa',
  '--border': '#27272a',
  '--primary': '#ffffff',
  '--primary-foreground': '#0a0a0a',
  '--primary-hover': '#e5e5e5',
  '--heading': '#f2f2f2', // softer than pure white, same reasoning as --heading in the light palette
}

// Placeholder photos standing in for real product screenshots — cycled
// across all 9 cards. protectpassword.png happens to also fit the "Private
// sharing" card thematically, but the mapping otherwise is just filling
// slots, not curated per-card.
const MOCK_IMAGES = [
  '/db5f76c2a132da4d5112cf0a25466f36.jpg',
  '/4bd851154ac889867f6c8d15dcf3b35c.jpg',
  '/protectpassword.png',
]

const CASE_STUDY_FEATURES = [
  {
    title: 'AI writing assistant',
    description: 'Get guided prompts that help you explain your process clearly.',
  },
  {
    title: 'Case study templates',
    description: 'Start from templates built from portfolios that got people hired.',
  },
  {
    title: 'Private sharing',
    description: 'Password-protect a case study before it goes public.',
  },
  {
    title: 'Visual process timeline',
    description: 'Show your design process step by step, exactly how it happened.',
  },
  {
    title: 'Custom sections',
    description: 'Add exactly the sections your story needs, drag and drop.',
  },
  {
    title: 'Metrics & outcomes',
    description: 'Highlight the impact of your work with built-in stat blocks.',
  },
  {
    title: 'Real-time feedback',
    description: 'Collect comments from mentors and peers before you publish.',
  },
  {
    title: 'One-click export',
    description: 'Turn any case study into a polished PDF in seconds.',
  },
  {
    title: 'Built-in SEO',
    description: 'Get discovered by recruiters searching for your skills.',
  },
].map((feature, i) => ({ ...feature, image: MOCK_IMAGES[i % MOCK_IMAGES.length] }))

const TESTIMONIALS = [
  {
    quote: 'What used to take me weeks to put together, I built in a single weekend.',
    name: 'Marcus Reyes',
    role: 'Founder, Reyes Studio',
    bg: '#e8c9a0',
  },
  {
    quote: 'Design portfolios used to take me forever — Pearl cut that time in half.',
    name: 'Dana Cole',
    role: 'Design Director @ Fielo',
    bg: '#a9d6b8',
  },
  {
    quote: 'I had three interview requests within a week of publishing my portfolio.',
    name: 'Priya Asha',
    role: 'Product Designer @ Northwind',
    bg: '#e3d485',
  },
  {
    quote: "They didn't just help me build a portfolio, they helped me tell my story.",
    name: 'Tom Harris',
    role: 'Product Designer @ Stacklane',
    bg: '#f4f1ea',
  },
  {
    quote: "Best decision I've made for my career in the last three years.",
    name: 'Lena Vogel',
    role: 'UX Lead @ Kindred',
    bg: '#d9744e',
  },
  {
    quote: 'Honest, fast, and the results speak for themselves.',
    name: 'Chris Owens',
    role: 'Founder @ Dusklab',
    bg: '#c3d9ef',
  },
]

// Fixed per-card resting offset/rotation — deterministic (not randomized on
// every render) but varied enough per card to read as an organic pile
// rather than a perfectly centered, mechanical stack.
const CARD_LAYOUT = [
  { x: -36, y: -8, rotate: -7 },
  { x: 30, y: 10, rotate: 5 },
  { x: -18, y: 16, rotate: -4 },
  { x: 22, y: -14, rotate: 6 },
  { x: -26, y: 2, rotate: -5 },
  { x: 14, y: -4, rotate: 3 },
]

function lerp(a, b, t) {
  return a + (b - a) * t
}
function clamp01(t) {
  return Math.min(1, Math.max(0, t))
}

// Per-card [start, end] window in scrollYProgress. Each card gets an equal
// 1/total slot and only starts once the previous card's slot has fully
// scrolled past — index 0 still arrives early on its own, via the 'start
// center' offset on scrollYProgress above, the same way.
function cardWindow(index, total) {
  return [index / total, (index + 0.65) / total]
}

// Scroll pin height per card, in vh — also drives the snap-marker math
// below, so it's one shared constant rather than a magic 40 in two places.
const CARD_SLOT_VH = 40

// Vertical offset (vh, relative to the tall wrapper below) at which card
// `index`'s arrival finishes. Solves the same 'start center' -> 'end end'
// scroll mapping useScroll uses for scrollYProgress above, but for the
// wrapper's own position instead of progress, so a snap-aligned marker
// placed here lands the page exactly where that card has finished
// settling — not an approximation of it.
function cardSnapTopVh(index, total) {
  const [, end] = cardWindow(index, total)
  return end * (CARD_SLOT_VH * total - 50) - 50
}

// Purely scroll-progress-driven (no whileInView, no scroll-jacking) — the
// card's position is a direct function of scrollYProgress, so scrolling up
// naturally unwinds it instead of needing separate "reverse" logic, and
// nothing ever fights the user's own scroll (no preventDefault/scrollTo,
// just a sticky parent + derived transforms).
//
// Uses the FUNCTION overload of useTransform (raw scroll value in, plain JS
// math out) rather than the [inputRange],[outputRange] overload. The
// latter — verified empirically, on this framer-motion version — has a
// real bug for plain (non-function-eased) ranges: on this page, an
// unclamped output would climb toward its target then silently collapse
// back toward 0 once scroll continued past the card's own window, instead
// of holding. Doing the interpolation by hand here sidesteps that path
// entirely rather than relying on framer-motion's internal clamping.
function TestimonialCard({ index, total, scrollYProgress, testimonial, layout }) {
  const [start, end] = cardWindow(index, total)

  // Arrives from below its own resting spot (140px lower) and settles
  // there — the resting offset is baked into both ends of the range so it
  // lands at its scattered position, not at a literal y:0.
  const y = useTransform(scrollYProgress, (raw) => {
    const t = SCROLL_EASE(clamp01((raw - start) / (end - start)))
    return lerp(140 + layout.y, layout.y, t)
  })
  // Finishes fading in over just the first 40% of the arrival window, well
  // ahead of the slide/scale/rotate settling over the full window — matching
  // its pace to the rest of the motion (or worse, a separate longer span)
  // read as a slow fade dragging behind everything else.
  const opacity = useTransform(scrollYProgress, (raw) => clamp01((raw - start) / ((end - start) * 0.4)))
  const scale = useTransform(scrollYProgress, (raw) => {
    const t = SCROLL_EASE(clamp01((raw - start) / (end - start)))
    return lerp(0.92, 1, t)
  })
  const rotate = useTransform(scrollYProgress, (raw) => {
    const t = SCROLL_EASE(clamp01((raw - start) / (end - start)))
    return lerp(layout.rotate * 2.4, layout.rotate, t)
  })

  return (
    <motion.div
      style={{
        y,
        opacity,
        scale,
        rotate,
        x: layout.x,
        background: testimonial.bg,
        zIndex: index,
      }}
      className="absolute inset-0 flex flex-col justify-between rounded-3xl p-6 sm:p-8 shadow-2xl ring-1 ring-black/5"
    >
      <p className="text-lg sm:text-xl font-[550] leading-snug text-[#1a1a1a]">“{testimonial.quote}”</p>
      <div>
        <p className="font-[550] text-sm text-[#1a1a1a]">{testimonial.name}</p>
        <p className="text-xs text-[#1a1a1a]/60">{testimonial.role}</p>
      </div>
    </motion.div>
  )
}

export default function LandingPage() {
  const [navHidden, setNavHidden] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [subdomain, setSubdomain] = useState('')
  const lastScrollY = useRef(0)
  const iconLayerRef = useRef(null)

  // Scroll-linked drift on the icon layer — tracks this section's own
  // progress through the viewport (not the whole page), so the icons shift
  // as you scroll past rather than the header/nav's own scroll-hide logic
  // above. Range widened to ±70px (was ±24) to actually read as parallax
  // rather than a barely-there wobble.
  const { scrollYProgress: iconScrollProgress } = useScroll({
    target: iconLayerRef,
    offset: ['start end', 'end start'],
  })
  const iconParallaxY = useTransform(iconScrollProgress, [0, 1], [70, -70])

  const testimonialStackRef = useRef(null)
  // 'start center' -> 'end end': progress starts once the wrapper is half
  // scrolled into view (not tied to the whole page's scroll position),
  // so the first card is already arriving by the time the sticky child
  // below locks to the top instead of only starting then.
  const { scrollYProgress: testimonialProgress } = useScroll({
    target: testimonialStackRef,
    offset: ['start center', 'end end'],
  })

  // Same hide-on-scroll-down / reveal-on-scroll-up pattern as Navbar.jsx,
  // just against window scroll instead of a custom canvas container — this
  // page renders outside BuilderShell, so there's no scroll container to
  // hook into.
  useEffect(() => {
    lastScrollY.current = window.scrollY

    function handleScroll() {
      const y = window.scrollY
      const delta = y - lastScrollY.current

      if (y < 80) setNavHidden(false)
      else if (delta > 4) setNavHidden(true)
      else if (delta < -4) setNavHidden(false)

      lastScrollY.current = y
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const html = document.documentElement
    const prevTheme = html.getAttribute('data-theme')
    const prevTemplate = html.getAttribute('data-template')
    const prevColorScheme = html.style.colorScheme

    // ThemeProvider is an ancestor of this component, and React fires
    // effects child-first — so ThemeProvider's own effect runs AFTER this
    // one on mount and unconditionally reasserts its stored theme,
    // silently flipping data-theme back to dark right after this sets it
    // to light. A MutationObserver re-corrects it for as long as this page
    // stays mounted, regardless of effect ordering. Guarded with equality
    // checks so re-asserting the same value doesn't retrigger itself.
    function forceLight() {
      if (html.getAttribute('data-theme') !== 'light') html.setAttribute('data-theme', 'light')
      if (html.hasAttribute('data-template')) html.removeAttribute('data-template')
      if (html.style.colorScheme !== 'light') html.style.colorScheme = 'light'
    }

    forceLight()
    const observer = new MutationObserver(forceLight)
    observer.observe(html, { attributes: true, attributeFilter: ['data-theme', 'data-template', 'style'] })

    return () => {
      observer.disconnect()
      if (prevTheme) html.setAttribute('data-theme', prevTheme)
      else html.removeAttribute('data-theme')
      if (prevTemplate) html.setAttribute('data-template', prevTemplate)
      else html.removeAttribute('data-template')
      html.style.colorScheme = prevColorScheme
    }
  }, [])

  return (
    <div
      style={{ ...LIGHT_THEME_VARS, fontFamily: "'Manrope', sans-serif" }}
      className="relative min-h-screen bg-[var(--background)] text-[var(--primary)] pt-10 sm:pt-12"
    >
      {/* A second top rule at the true top of the page (not the inset frame
          below, which only starts after the pt- gap), with short corner
          ticks bridging down to where that inset frame's own top border
          starts — closes off the gap the floating nav sits in. Width-matched
          to the frame (max-w-[1400px] + px) instead of the viewport, so it lines
          up directly above it rather than spanning edge to edge. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative max-w-[1400px] mx-auto px-6 sm:px-8"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-[var(--border)] z-20 pointer-events-none" />
        <div className="absolute left-0 top-0 h-10 sm:h-12 w-px bg-[var(--border)] z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 h-10 sm:h-12 w-px bg-[var(--border)] z-20 pointer-events-none" />
      </motion.div>

      {/* Left, right AND top borders — a continuous frame open only at the
          bottom, running the full page height (min-h-screen so it still
          reaches the bottom on short content). Inset from the true screen
          edges (max-w-[1400px] + px, same as the reference) rather than
          full-bleed — there's visible page background outside the lines on
          both sides. All three lines share this same element's edges
          (left-0/right-0/top-0), so the two top corners meet exactly
          instead of leaving a gap.

          The lines are dedicated elements (not a native `border` on this
          div) sitting above the video in z-index — a plain CSS border here
          would paint before the video (an absolutely positioned child) and
          get covered by it wherever the two overlap, i.e. the whole top
          banner. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative min-h-screen max-w-[1400px] mx-auto px-6 sm:px-8"
      >
        <div className="absolute inset-y-0 left-0 w-px bg-[var(--border)] z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-px bg-[var(--border)] z-20 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-[var(--border)] z-20 pointer-events-none" />

        {/* Sticky nav — fixed (not absolute) so it stays pinned through
            scroll instead of scrolling away with the frame. top-10/12
            matches the outer wrapper's pt-10/12, so it lands in the exact
            same spot straddling the top border at rest (y=0 scroll). No
            entrance animation — initial={false} makes framer motion treat
            the very first render as already at rest, so it's only ever the
            scroll-driven hide/reveal that animates, never the page load. */}
        <motion.div
          className="fixed inset-x-0 top-10 sm:top-12 z-30 px-6 sm:px-8"
          initial={false}
          animate={{ y: navHidden ? 'calc(-50% - 120px)' : '-50%' }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <nav className="flex items-center justify-between max-w-xl mx-auto rounded-full border border-[var(--border)] bg-[var(--secondary)] pl-6 pr-2 py-2 shadow-sm">
            <span className="flex items-center gap-2">
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
            </span>
            <div className="flex items-center gap-6 text-sm font-medium text-[var(--primary)]">
              <a href="#" className="text-[var(--muted)] hover:text-[var(--primary)] transition-colors">
                Examples
              </a>
              <a href="#" className="text-[var(--muted)] hover:text-[var(--primary)] transition-colors">
                Blogs
              </a>
              <a
                href="#"
                className="rounded-full bg-[var(--background)] px-4 py-2 shadow-sm hover:bg-white transition-colors"
              >
                Log in
              </a>
            </div>
          </nav>
        </motion.div>

        {/* Video sits behind the nav/hero, clipped to its own wrapper so it
            doesn't bleed past the column's edges. Starts invisible and only
            fades in once a frame is actually decoded (onLoadedData) — a
            fixed-timing entrance would risk showing a blank/black box for
            however long the browser takes to buffer the file. */}
        <div className="absolute inset-x-0 top-0 h-72 sm:h-96 overflow-hidden pointer-events-none z-0">
          <video
            className="w-full h-full object-cover transition-opacity duration-700 ease-out"
            style={{
              WebkitMaskImage: VIDEO_FADE_MASK,
              maskImage: VIDEO_FADE_MASK,
              opacity: videoLoaded ? 1 : 0,
            }}
            src="/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
          />
        </div>

        <motion.section
          className="relative z-10 flex flex-col items-center text-center pt-72 sm:pt-96"
          variants={heroContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0 }}
        >
          {/* One continuous dotted backdrop behind the headline, subhead,
              CTA and tab bar — previously the dots only lived in a small
              strip right above the tabs, which read as a disconnected
              patch. self-stretch -mx-6/-mx-8 + matching px-6/px-8 breaks
              this wrapper out to the frame's full bleed width (same trick
              as the tabs/preview block below, which nests its own
              -mx-6/-mx-8 inside this one — that cancels the padding this
              wrapper just re-added, landing back at the same full-bleed
              edge, so the nesting is transparent to it) so the dots span
              edge to edge, not just the inset content column. The preview
              panel further down keeps its own opaque --card background,
              which naturally paints over the dots behind it — no
              exclusion needed. */}
          <div
            className="relative self-stretch -mx-6 sm:-mx-8 px-6 sm:px-8 flex flex-col items-center text-center"
            style={{
              backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)',
              backgroundSize: '18px 18px',
            }}
          >
            {/* Even, modest gap above the headline and below the CTA —
                matches the tabs block's own mt-0 below (its old mt-16 is
                gone; this wrapper's pb now owns that gap instead) so the
                two sides read as equal rather than the previous
                vh-based min-height, which grew unevenly once the tabs
                block's own top margin stacked on top of its bottom half. */}
            <div className="flex flex-col items-center pt-10 sm:pt-14 pb-10 sm:pb-14">
              <motion.h1
                variants={waveContainer}
                className="text-5xl sm:text-6xl lg:text-7xl font-[650] tracking-tight leading-[1.08] max-w-3xl text-[var(--heading)]"
              >
                {HEADLINE_LINES.map((line, li) => (
                  <span key={li} className="block">
                    {line.flatMap((word, wi) => [
                      <motion.span key={`w-${li}-${wi}`} variants={waveWord} className="inline-block">
                        {word}
                      </motion.span>,
                      wi < line.length - 1 ? ' ' : null,
                    ])}
                  </span>
                ))}
              </motion.h1>

              <motion.p variants={heroReveal} className="mt-6 text-lg sm:text-xl text-[var(--muted)]">
                Build beautiful case studies. Publish your portfolio. Start getting hired.
              </motion.p>

              <motion.div variants={heroReveal} className="mt-8 flex flex-col items-center gap-3">
                {/* One merged pill (input + suffix + button) rather than two
                    separate ones — same nested-pill trick as the nav's own
                    "Log in" button (generous left padding, tight right
                    padding, so the inner button sits flush against the
                    outer pill's edge). Sized up from the rest of the page's
                    buttons since this is the hero's primary CTA. The
                    ".designfolio.me" suffix hides below sm: — at that width
                    it's the least essential part of the row, and dropping it
                    keeps "Get started" from getting cramped rather than
                    needing to shrink the button down to an icon. */}
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] pl-6 sm:pl-7 pr-1.5 py-1.5 shadow-sm">
                  <input
                    type="text"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="john"
                    className="w-20 sm:w-36 bg-transparent py-3 sm:py-3.5 text-base sm:text-lg text-[var(--primary)] placeholder:text-[var(--muted)] outline-none"
                  />
                  <span className="hidden sm:block h-6 w-px bg-[var(--border)]" />
                  <span className="hidden sm:inline pr-4 text-lg text-[var(--muted)]">.designfolio.me</span>
                  <button className="rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-base sm:text-lg font-medium px-7 sm:px-8 py-3.5 sm:py-4 hover:bg-[var(--primary-hover)] transition-colors whitespace-nowrap">
                    Get started
                  </button>
                </div>
                <p className="text-xs text-[var(--muted)]">Claim your domain before it's taken</p>
              </motion.div>
            </div>

            {/* Tabs swap the placeholder preview below — deliberately plain
                (icon + label, not a fake product screenshot) so the
                interaction reads clearly without overselling the mockup.
                Both tabs share one row, same height/padding/rounding
                (rounded-t-2xl, -mb-px), sitting flush together directly on
                the panel's top edge — a single attached header bar for the
                section, not one tab floating separate from the other. The
                active tab matches the panel's own background so it reads
                as continuous with it, the inactive tab a step darker
                (--secondary) so it still reads as clearly part of the
                same bar, just not the open one.

                -mx-6/-mx-8 cancels the padding this wrapper just re-added
                (see comment above) — a normal in-flow element (unlike the
                video, which is absolutely positioned and so already
                ignores that padding), so without this it stops short of
                the frame's actual border lines instead of filling the
                container edge to edge. self-stretch overrides the
                section's align-items:center, which otherwise shrinks a
                width:auto flex child to fit its own content instead of
                the container's width. */}
            <motion.div variants={heroReveal} className="relative self-stretch -mx-6 sm:-mx-8">
              <div className="flex items-end justify-center gap-2 px-4">
                {PREVIEW_TABS.map((tab, i) => {
                  const active = activeTab === i
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(i)}
                      className={`inline-flex items-center gap-2.5 px-4 sm:px-5 py-3 -mb-px rounded-t-2xl text-sm font-semibold transition-colors ${
                        active
                          ? 'bg-[var(--card)] text-[var(--primary)]'
                          : 'bg-[var(--secondary)] text-[var(--muted)] hover:text-[var(--primary)]'
                      }`}
                    >
                      <span
                        className={`flex items-center justify-center w-6 h-6 rounded-md shrink-0 ${tab.badgeBg} ${tab.badgeFg}`}
                      >
                        <tab.Icon className="w-3.5 h-3.5" />
                      </span>
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  )
                })}
              </div>

              <div className="relative aspect-[16/9] border border-[var(--border)] rounded-2xl bg-[var(--card)] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[var(--muted)]"
                >
                  {(() => {
                    const Icon = PREVIEW_TABS[activeTab].Icon
                    return <Icon className="w-10 h-10" strokeWidth={1.5} />
                  })()}
                  <span className="text-sm font-medium">{PREVIEW_TABS[activeTab].label}</span>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
          </div>

          {/* Independent scroll trigger (its own initial/whileInView, not
              inherited from the section above) — this needs to burst in
              when THIS block scrolls into view, not whenever the hero
              above it first did. self-stretch -mx-6/-mx-8 is the same
              breakout trick as the tabs/preview section, so the icons have
              the full frame width to scatter across. Now shown at every
              breakpoint (used to be sm+ only) with smaller badges on
              mobile so they don't crowd the stat text. */}
          <motion.div
            ref={iconLayerRef}
            className="relative self-stretch -mx-6 sm:-mx-8 mt-24 min-h-[320px] sm:min-h-[480px]"
            variants={burstContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            style={{ y: iconParallaxY }}
          >
            {ICON_BURST.map((item, i) => (
              <div
                key={i}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ top: `${item.top}%`, left: `${item.left}%` }}
              >
                {/* Burst-in (variants, scroll-triggered once) on the outer
                    motion element; the idle float (continuous, independent
                    of scroll, own diagonal direction per icon) on a nested
                    one — two separate transforms so they don't fight over
                    the same x/y. */}
                <motion.div variants={burstIconVariants(item.top, item.left)}>
                  <motion.div
                    {...floatAnimation(i)}
                    className={`flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${item.bg}`}
                  >
                    <item.Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${item.fg}`} strokeWidth={2} />
                  </motion.div>
                </motion.div>
              </div>
            ))}

            <motion.div
              variants={burstStat}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
            >
              <p className="text-3xl sm:text-4xl lg:text-5xl font-[650] tracking-tight text-[var(--heading)]">
                Trusted by 34,600+ designers
              </p>
              <p className="mt-2 text-lg sm:text-xl text-[var(--muted)]">around the world</p>
            </motion.div>
          </motion.div>

          {/* Hatched divider band — a repeating thin-line pattern between
              border-top/border-bottom, not just a single hairline. Full
              frame width via the same self-stretch -mx-6/-mx-8 breakout as
              the tabs/preview and icon-burst sections above. */}
          <motion.div
            variants={heroReveal}
            className="self-stretch -mx-6 sm:-mx-8 mt-20 h-16 border-y border-[var(--border)]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to right, var(--border) 0, var(--border) 1px, transparent 1px, transparent 12px)',
            }}
          />

          {/* The one section of this otherwise-forced-light page that's
              meant to break from it — DARK_THEME_VARS locally overrides the
              tokens for this subtree only, the same way LIGHT_THEME_VARS
              does for the whole page higher up. self-stretch -mx-6/-mx-8
              breaks it out to the frame's full width; px-6/px-8 + py bring
              back inset spacing for the content since the negative margin
              cancelled the frame's own padding. */}
          <motion.div
            variants={heroReveal}
            style={DARK_THEME_VARS}
            className="relative self-stretch -mx-6 sm:-mx-8 overflow-hidden bg-[var(--background)] text-[var(--primary)] px-6 sm:px-8 py-16 sm:py-20"
          >
            {/* Quick, subtle orange bleed at the very top — short falloff
                (h-40) rather than a wash over the whole section. z-index
                auto on an absolute element paints ABOVE in-flow content by
                default, so the heading/cards below need their own
                relative z-10 to stay on top of it, not the other way
                around. */}
            <div
              className="absolute inset-x-0 top-0 h-40 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, rgba(255,85,62,0.16), transparent)' }}
            />

            <h2 className="relative z-10 text-3xl sm:text-4xl lg:text-5xl font-[650] tracking-tight text-[var(--heading)] max-w-2xl mx-auto">
              Everything you need to write your UX case study
            </h2>

            <div className="relative z-10 mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
              {CASE_STUDY_FEATURES.map((feature) => (
                <div key={feature.title}>
                  <div className="aspect-square rounded-2xl border border-[var(--border)] overflow-hidden">
                    <img src={feature.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <p className="mt-4 font-[650] text-[var(--primary)]">{feature.title}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{feature.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Same self-stretch -mx-6/-mx-8 breakout as the dark section and
              tabs/preview above — stays inside the bordered frame (not a
              page-level sibling anymore) so the frame's left/right/top
              lines keep running alongside it instead of stopping short.
              The tall wrapper just gives scrollYProgress 0-1 to work with
              while position:sticky pins the viewport; scrolling itself is
              completely native the whole time — no scroll-jacking, no
              preventDefault, nothing fighting the user's own scroll.
              70vh/card felt sluggish to get to the first card — 40vh/card
              gets the stack moving right away instead of a long dead
              scroll after the previous section. */}
          <div
            ref={testimonialStackRef}
            className="relative self-stretch -mx-6 sm:-mx-8"
            style={{ height: `${TESTIMONIALS.length * CARD_SLOT_VH}vh` }}
          >
            {/* One snap-align target per card, positioned (via
                cardSnapTopVh) at the exact scroll offset where that card
                finishes arriving — combined with `scroll-snap-type: y
                proximity` on html (index.css), scrolling still behaves
                natively, it just settles cleanly on a fully-arrived card
                instead of stopping mid-transition. Zero-height and
                pointer-events-none so they're otherwise invisible. */}
            {TESTIMONIALS.map((testimonial, i) => (
              <div
                key={`snap-${testimonial.name}`}
                aria-hidden="true"
                className="absolute inset-x-0 snap-start pointer-events-none"
                style={{ top: `${cardSnapTopVh(i, TESTIMONIALS.length)}vh` }}
              />
            ))}

            <div
              className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-[var(--background)]"
              style={{
                backgroundImage:
                  'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            >
              <div className="relative w-[280px] h-[320px] sm:w-[380px] sm:h-[420px]">
                {TESTIMONIALS.map((testimonial, i) => (
                  <TestimonialCard
                    key={testimonial.name}
                    index={i}
                    total={TESTIMONIALS.length}
                    scrollYProgress={testimonialProgress}
                    testimonial={testimonial}
                    layout={CARD_LAYOUT[i]}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* End of the page — divider matches the hatched one earlier,
              closing the section instead of just trailing into blank
              white space after the sticky pin lets go. */}
          <motion.div
            variants={heroReveal}
            className="self-stretch -mx-6 sm:-mx-8 h-16 border-y border-[var(--border)]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to right, var(--border) 0, var(--border) 1px, transparent 1px, transparent 12px)',
            }}
          />

          {/* Closes out the frame, which is deliberately open at the bottom
              (see the border comment up top) — so this is the page's actual
              terminus, not just another section. Full-bleed illustrated CTA
              band (same self-stretch -mx-6/-mx-8 breakout as the sections
              above) with a plain legal bar underneath, kept as a separate
              flat-color strip rather than laid over the artwork, so the
              copyright/links stay legible regardless of what's happening in
              the image behind the CTA above it. */}
          <motion.div variants={heroReveal} className="self-stretch -mx-6 sm:-mx-8">
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
        </motion.section>
      </motion.div>
    </div>
  )
}
