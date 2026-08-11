import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
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

const HEADLINE_LINES = [
  ['Stop', 'losing', 'sleep'],
  ['over', 'your', 'UX', 'portfolio.'],
]

// Placeholder content only — a simple icon + label swap, not a real product
// screenshot. Keeps the tab-switch interaction legible without pretending
// to be a finished mockup.
const PREVIEW_TABS = [
  { id: 'builder', label: 'Portfolio Builder', Icon: LayoutGrid },
  { id: 'jobs', label: 'AI Job Matching', Icon: Sparkles },
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

export default function LandingPage() {
  const [navHidden, setNavHidden] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
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
          to the frame (max-w-[1250px] + px) instead of the viewport, so it lines
          up directly above it rather than spanning edge to edge. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative max-w-[1250px] mx-auto px-6 sm:px-8"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-[var(--border)] z-20 pointer-events-none" />
        <div className="absolute left-0 top-0 h-10 sm:h-12 w-px bg-[var(--border)] z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 h-10 sm:h-12 w-px bg-[var(--border)] z-20 pointer-events-none" />
      </motion.div>

      {/* Left, right AND top borders — a continuous frame open only at the
          bottom, running the full page height (min-h-screen so it still
          reaches the bottom on short content). Inset from the true screen
          edges (max-w-[1250px] + px, same as the reference) rather than
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
        className="relative min-h-screen max-w-[1250px] mx-auto px-6 sm:px-8"
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
            <span className="text-lg font-bold tracking-tight">Pearl</span>
            <div className="flex items-center gap-6 text-sm font-medium text-[var(--primary)]">
              <a href="#" className="text-[var(--muted)] hover:text-[var(--primary)] transition-colors">
                Pricing
              </a>
              <a href="#" className="text-[var(--muted)] hover:text-[var(--primary)] transition-colors">
                Awards
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
          className="relative z-10 flex flex-col items-center text-center pt-72 sm:pt-96 pb-20"
          variants={heroContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0 }}
        >
          <motion.h1
            variants={waveContainer}
            className="text-5xl sm:text-6xl lg:text-7xl font-[550] tracking-tight leading-[1.08] max-w-3xl text-[var(--heading)]"
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

          <motion.div variants={heroReveal} className="mt-8 flex items-center gap-3">
            <button className="rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium px-6 py-3 hover:bg-[var(--primary-hover)] transition-colors">
              Join for free
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--background)] text-[var(--primary)] text-sm font-medium px-6 py-3 hover:bg-[var(--secondary)] transition-colors">
              See our plans
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>

          {/* Tabs swap the placeholder preview below — deliberately plain
              (icon + label, not a fake product screenshot) so the
              interaction reads clearly without overselling the mockup.
              The separator marks where the preview starts; the tab pill
              straddles it 50/50 (same trick as the nav straddling the
              frame's own top border) and sits flush on top of the preview
              with no gap, rather than floating above it.

              -mx-6/-mx-8 cancels the frame's own px-6/px-8 padding — this
              is a normal in-flow element (unlike the video, which is
              absolutely positioned and so already ignores that padding),
              so without this it stops short of the frame's actual border
              lines instead of filling the container edge to edge.
              self-stretch overrides the section's align-items:center,
              which otherwise shrinks a width:auto flex child to fit its
              own content instead of the container's width — without it,
              the negative margins have nothing correctly-sized to expand
              from and the whole block collapses down to the tab pill's
              own width. */}
          <motion.div variants={heroReveal} className="relative self-stretch -mx-6 sm:-mx-8 mt-16">
            <div className="absolute inset-x-0 top-0 h-px bg-[var(--border)]" />

            <div className="absolute inset-x-0 top-0 z-10 flex justify-center -translate-y-1/2">
              <div className="inline-flex items-center gap-1 rounded-full bg-[var(--secondary)] p-1 shadow-sm">
                {PREVIEW_TABS.map((tab, i) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(i)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === i
                        ? 'bg-[var(--background)] text-[var(--primary)] shadow-sm'
                        : 'text-[var(--muted)] hover:text-[var(--primary)]'
                    }`}
                  >
                    <tab.Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative aspect-[16/9] border-x border-b border-[var(--border)] rounded-b-2xl bg-[var(--card)] overflow-hidden">
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
              <p className="text-3xl sm:text-4xl lg:text-5xl font-[550] tracking-tight text-[var(--heading)]">
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

            <h2 className="relative z-10 text-3xl sm:text-4xl lg:text-5xl font-[550] tracking-tight text-[var(--heading)] max-w-2xl mx-auto">
              Everything you need to write your UX case study
            </h2>

            <div className="relative z-10 mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
              {CASE_STUDY_FEATURES.map((feature) => (
                <div key={feature.title}>
                  <div className="aspect-square rounded-2xl border border-[var(--border)] overflow-hidden">
                    <img src={feature.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <p className="mt-4 font-[550] text-[var(--primary)]">{feature.title}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{feature.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.section>
      </motion.div>
    </div>
  )
}
