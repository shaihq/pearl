import { useRef, useState } from 'react'
import { cubicBezier, motion, useScroll, useTransform } from 'framer-motion'
import { EASE } from '../motion'
import LandingShell from './landing/LandingShell'

// EASE is a raw cubic-bezier control-point array — fine for
// transition:{ease}, but useTransform's own `ease` option wants an actual
// easing *function* (t) => t, a different API. cubicBezier(...) converts it.
const SCROLL_EASE = cubicBezier(...EASE)

const HEADLINE_LINES = [
  ['Stop', 'losing', 'sleep'],
  ['over', 'your', 'UX', 'portfolio.'],
]

// Real company logos (pre-styled PNGs with their own background baked in,
// so no bg-color class needed here) scattered around the stat block,
// positioned by % so the "burst from center" offset below can be computed
// relative to each one's own spot. top/left are percentages of the
// container.
const ICON_BURST = [
  { logo: '/companylogos/amazon.png', name: 'Amazon', top: 8, left: 14 },
  { logo: '/companylogos/google.png', name: 'Google', top: 6, left: 46 },
  { logo: '/companylogos/apple.png', name: 'Apple', top: 5, left: 80 },
  { logo: '/companylogos/cisco.png', name: 'Cisco', top: 40, left: 10 },
  { logo: '/companylogos/servicenow.png', name: 'ServiceNow', top: 38, left: 88 },
  { logo: '/companylogos/mastercard.png', name: 'Mastercard', top: 78, left: 16 },
  { logo: '/companylogos/razorpay.png', name: 'Razorpay', top: 90, left: 48 },
  { logo: '/companylogos/ola.png', name: 'Ola', top: 82, left: 82 },
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

// The dark palette from index.css's [data-theme='dark'] block, copied the
// same way LandingShell's LIGHT_THEME_VARS copies :root — this is the one
// section of an otherwise-forced-light page that's meant to break from it,
// so it needs its own local override rather than touching the page-level
// theme.
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
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [subdomain, setSubdomain] = useState('')
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

  return (
    <LandingShell>
        {/* Video sits behind the nav/hero, clipped to its own wrapper so it
            doesn't bleed past the column's edges. Starts invisible and only
            fades in once a frame is actually decoded (onLoadedData) — a
            fixed-timing entrance would risk showing a blank/black box for
            however long the browser takes to buffer the file. */}
        <div className="absolute inset-x-0 -top-10 sm:-top-12 h-[24.5rem] sm:h-[31rem] overflow-hidden pointer-events-none z-0">
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
          className="relative z-10 flex flex-col items-center text-center pt-[22rem] sm:pt-[28rem]"
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
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] pl-5 sm:pl-6 pr-1 py-1 shadow-sm transition-shadow duration-200 ease-out focus-within:shadow-[0_0_0_4px_rgba(10,10,10,0.06)]">
                  <input
                    type="text"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="john"
                    className="w-16 sm:w-32 bg-transparent py-2 sm:py-2.5 text-sm sm:text-base text-[var(--primary)] placeholder:text-[var(--muted)] outline-none selection:bg-[var(--primary)] selection:text-[var(--primary-foreground)]"
                  />
                  <span className="hidden sm:block h-5 w-px bg-[var(--border)]" />
                  <span className="hidden sm:inline pr-3 text-base text-[var(--muted)]">.designfolio.me</span>
                  <button className="rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-sm sm:text-base font-medium px-5 sm:px-6 py-2.5 sm:py-3 transition-all duration-150 ease-out hover:bg-[var(--primary-hover)] active:scale-[0.97] active:bg-[var(--primary-hover)] focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_rgba(10,10,10,0.35)] whitespace-nowrap">
                    Get started
                  </button>
                </div>
                <p className="text-xs text-[var(--muted)]">Claim your domain before it's taken</p>
              </motion.div>
            </div>

            {/* -mx-6/-mx-8 cancels the padding this wrapper just re-added
                (see comment above) — a normal in-flow element (unlike the
                video, which is absolutely positioned and so already
                ignores that padding), so without this it stops short of
                the frame's actual border lines instead of filling the
                container edge to edge. self-stretch overrides the
                section's align-items:center, which otherwise shrinks a
                width:auto flex child to fit its own content instead of
                the container's width. */}
            <motion.div variants={heroReveal} className="relative self-stretch -mx-6 sm:-mx-8">
              <div className="relative aspect-[133/108] border border-[var(--border)] rounded-2xl bg-[var(--card)] overflow-hidden">
                <video
                  src="/companylogos/1st.mp4"
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
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
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden"
                  >
                    <img src={item.logo} alt={item.name} className="w-full h-full object-cover" />
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
              tokens for this subtree only, the same way LandingShell's
              LIGHT_THEME_VARS does for the whole page. self-stretch -mx-6/-mx-8
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
        </motion.section>
    </LandingShell>
  )
}
