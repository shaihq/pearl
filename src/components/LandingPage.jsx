import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { EASE } from '../motion'
import { cn } from '@/lib/utils'
import LandingShell from './landing/LandingShell'

const HEADLINE_LINES = [
  ['Stop', 'losing', 'sleep'],
  ['over', 'your', 'UX', 'portfolio.'],
]

// Cycled by the subdomain input's animated placeholder below — a real
// placeholder attribute can't cross-fade between two strings, so this
// drives a custom overlay instead (hidden once the field has a value).
const SUBDOMAIN_PLACEHOLDERS = ['yourname', 'type here']

// Per-character stagger for the placeholder's flip — staggerChildren on the
// word wrapper fires each letter's flip a beat after the last, so the whole
// word rolls through like a wave instead of flipping as one rigid block.
// staggerDirection: -1 on exit makes the outgoing word wave off in reverse
// (last letter first), which reads more like a continuous ripple than the
// entrance wave simply running backwards.
const placeholderWaveContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.025 } },
  exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
}
const placeholderWaveChar = {
  hidden: { rotateX: 100, y: 5, opacity: 0 },
  visible: { rotateX: 0, y: 0, opacity: 0.7, transition: { duration: 0.4, ease: [0.65, 0, 0.35, 1] } },
  exit: { rotateX: -100, y: -5, opacity: 0, transition: { duration: 0.35, ease: [0.65, 0, 0.35, 1] } },
}

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
    title: 'Templates made for great portfolios',
    description: 'Choose a proven structure and customize every section to make it your own.',
    image: '/section/templates.png',
  },
  {
    title: 'Password protection',
    description: 'Keep your work private and share case studies only with the people you choose.',
    image: '/section/protectpassword.png',
  },
  {
    title: 'Figma embeds',
    description: 'Embed your Figma files directly into your case studies. Keep your work interactive and easy to explore.',
    image: '/section/embeds%20figma.png',
  },
  {
    title: 'Custom domain & hosting',
    description: 'Connect your own domain and publish your portfolio without worrying about hosting.',
    image: '/section/custom%20domains.png',
  },
  {
    title: 'AI writing assistant',
    description: 'Write and analyze with AI. Get help explaining your process, decisions, and impact clearly.',
    image: '/section/write%20using%20ai.png',
  },
  {
    title: 'Notion-like editor',
    description: 'Write and structure your case studies with an editor that feels familiar from the start.',
    image: '/section/notion%20ediotr.png',
  },
].map((feature, i) => ({ ...feature, image: feature.image ?? MOCK_IMAGES[i % MOCK_IMAGES.length] }))

// Masonry "wall of quotes" testimonials — avatarBg stands in for a real
// profile photo (none on hand), rendered as an initials circle instead.
const TESTIMONIALS = [
  {
    quote: 'What used to take me weeks to put together, I built in a single weekend.',
    name: 'Marcus Reyes',
    role: 'Reyes Studio',
    avatarBg: '#e8c9a0',
  },
  {
    quote:
      'Design portfolios used to take me forever — Pearl cut that time in half. The templates alone are worth it.',
    name: 'Dana Cole',
    role: 'Fielo',
    avatarBg: '#a9d6b8',
  },
  {
    quote: 'I had three interview requests within a week of publishing my portfolio.',
    name: 'Priya Asha',
    role: 'Northwind',
    avatarBg: '#e3d485',
  },
  {
    quote:
      "They didn't just help me build a portfolio, they helped me tell my story. Every case study finally reads the way the work actually happened.",
    name: 'Tom Harris',
    role: 'Stacklane',
    avatarBg: '#cbb8e8',
  },
  {
    quote: "Best decision I've made for my career in the last three years.",
    name: 'Lena Vogel',
    role: 'Kindred',
    avatarBg: '#d9744e',
  },
  {
    quote: 'Honest, fast, and the results speak for themselves.',
    name: 'Chris Owens',
    role: 'Dusklab',
    avatarBg: '#c3d9ef',
  },
  {
    quote:
      "Pearl is one of those tabs I never close. It's the fastest way I've found to turn messy Figma files into something a recruiter actually wants to read.",
    name: 'Noah Kim',
    role: 'Fielo',
    avatarBg: '#f3b6a4',
  },
  {
    quote: 'The password protection alone saved me from sharing unfinished work with the wrong people twice.',
    name: 'Aria Bloom',
    role: 'Northwind',
    avatarBg: '#9fd0d6',
  },
  {
    quote: "Went from a Notion doc nobody read to a portfolio that's gotten me every interview since.",
    name: 'Diego Marín',
    role: 'Dusklab',
    avatarBg: '#e0c68a',
  },
]

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

// A spring-driven caret for the subdomain field. The native caret is
// hidden (caretColor: transparent) and a motion.div bar glides to the
// caret's pixel position instead of jumping + blinking. An invisible
// <span> mirrors the input's *computed* font so the text before the caret
// can be measured in px; the input, that span, and the caret bar all stack
// in one CSS-grid cell so the bar lands exactly on the text. Native scroll
// is tracked too, since a subdomain routinely overflows this narrow field.
// Under prefers-reduced-motion the spring is stiff enough to be instant.
const SMOOTH_CARET_SPRING = { stiffness: 500, damping: 30, mass: 0.5 }
const SMOOTH_CARET_SPRING_REDUCED = { stiffness: 10000, damping: 100, mass: 0.1 }

// A synthesized keystroke — no audio asset, just Web Audio. Built to read
// as a mechanical keyboard: three noise bursts through fast attack/decay
// envelopes — a low-mid "clack" resonance (plate + keycap, ~340 Hz), a
// crisp high-passed "click" transient for the snap, and a smaller, brighter
// release tick a beat later (that press/release double-tick is the tell of
// a real board) — plus a quiet low sine for weight. Only a gentle ~8 kHz
// lowpass on the master, so the click keeps its edge. Everything jittered
// per press so a fast run never loops; Backspace is lower, duller, no
// release tick. The AudioContext is created lazily on the first keystroke
// — itself a user gesture — so autoplay policy never blocks it.
let sharedAudioCtx = null
let sharedNoiseBuffer = null

function getKeystrokeCtx() {
  if (typeof window === 'undefined') return null
  const Ctx = window.AudioContext || window.webkitAudioContext
  if (!Ctx) return null
  if (!sharedAudioCtx) sharedAudioCtx = new Ctx()
  if (sharedAudioCtx.state === 'suspended') void sharedAudioCtx.resume()
  return sharedAudioCtx
}

function getNoiseBuffer(ctx) {
  if (sharedNoiseBuffer && sharedNoiseBuffer.sampleRate === ctx.sampleRate) return sharedNoiseBuffer
  const length = Math.floor(ctx.sampleRate * 0.2)
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1
  sharedNoiseBuffer = buffer
  return buffer
}

// A shared noise burst: buffer source -> biquad filter -> fast
// attack/decay gain envelope -> destination. Both playKeystroke and
// playClaimClick below are built out of a few of these, tuned differently.
function noiseBurst(ctx, noiseBuf, destination, t, type, freq, q, peak, attack, decay, startAt = 0) {
  const src = ctx.createBufferSource()
  src.buffer = noiseBuf
  const filter = ctx.createBiquadFilter()
  filter.type = type
  filter.frequency.value = freq
  filter.Q.value = q
  const gain = ctx.createGain()
  const s = t + startAt
  gain.gain.setValueAtTime(0.0001, s)
  gain.gain.exponentialRampToValueAtTime(peak, s + attack)
  gain.gain.exponentialRampToValueAtTime(0.0001, s + attack + decay)
  src.connect(filter).connect(gain).connect(destination)
  src.start(s)
  src.stop(s + attack + decay + 0.02)
}

function prefersReducedMotionNow() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function playKeystroke({ backspace = false } = {}) {
  const ctx = getKeystrokeCtx()
  if (!ctx) return
  const t = ctx.currentTime
  const rand = (a, b) => a + Math.random() * (b - a)
  const noiseBuf = getNoiseBuffer(ctx)

  // Master: kept low, with a top lowpass pulled down just enough to take
  // the edge off the click and leave it a touch smudged — not so far that
  // the mechanical snap disappears.
  const master = ctx.createGain()
  master.gain.value = backspace ? 0.5 : 0.58
  const tame = ctx.createBiquadFilter()
  tame.type = 'lowpass'
  tame.frequency.value = rand(5200, 6400)
  tame.Q.value = 0.3
  master.connect(tame).connect(ctx.destination)

  // 1) Bottom-out "clack" — low-mid noise resonance (plate + keycap).
  noiseBurst(ctx, noiseBuf, master, t, 'bandpass', backspace ? rand(200, 250) : rand(300, 380), rand(2, 2.8), rand(1.6, 2.4), 0.002, rand(0.035, 0.06))
  // 2) "Click" transient — the mechanical snap, softened a hair so it reads
  //    smudged rather than sharp.
  noiseBurst(ctx, noiseBuf, master, t, 'highpass', rand(2100, 2800), 0.7, rand(0.085, 0.14), 0.0022, rand(0.009, 0.017))
  // 3) Release tick — smaller, brighter, a beat later. The press/release
  //    double-tick is what actually reads as a mechanical board.
  if (!backspace) {
    noiseBurst(ctx, noiseBuf, master, t, 'highpass', rand(2900, 3700), 0.7, rand(0.03, 0.06), 0.002, rand(0.011, 0.021), rand(0.045, 0.075))
  }

  // 4) A little low-end weight — quiet, short.
  const thump = ctx.createOscillator()
  thump.type = 'sine'
  thump.frequency.setValueAtTime(rand(115, 145), t)
  thump.frequency.exponentialRampToValueAtTime(rand(75, 95), t + 0.04)
  const thumpGain = ctx.createGain()
  thumpGain.gain.setValueAtTime(0, t)
  thumpGain.gain.linearRampToValueAtTime(rand(0.06, 0.1), t + 0.004)
  thumpGain.gain.exponentialRampToValueAtTime(0.0005, t + rand(0.035, 0.055))
  thump.connect(thumpGain).connect(master)
  thump.start(t)
  thump.stop(t + 0.09)
}

// The "Claim now" confirm click — one deliberate press on a big glossy
// pill, not a fast run of small key taps, so it's tuned rounder and a
// touch more present than a single keystroke: a higher, wider body
// resonance, a crisper confirm edge, and a small rising pitch "lift" right
// after the hit (the bit of "confirmed" character a plain tap doesn't
// have). Skipped under prefers-reduced-motion, same sensory-reduction call
// as the keystroke sound.
function playClaimClick() {
  if (prefersReducedMotionNow()) return
  const ctx = getKeystrokeCtx()
  if (!ctx) return
  const t = ctx.currentTime
  const rand = (a, b) => a + Math.random() * (b - a)
  const noiseBuf = getNoiseBuffer(ctx)

  const master = ctx.createGain()
  master.gain.value = 0.6
  const tame = ctx.createBiquadFilter()
  tame.type = 'lowpass'
  tame.frequency.value = rand(6500, 7500)
  tame.Q.value = 0.3
  master.connect(tame).connect(ctx.destination)

  // Body — rounder and a hair higher than the keystroke's, plus a crisp
  // confirm edge.
  noiseBurst(ctx, noiseBuf, master, t, 'bandpass', rand(480, 560), rand(2, 2.6), rand(1.8, 2.4), 0.002, rand(0.055, 0.075))
  noiseBurst(ctx, noiseBuf, master, t, 'highpass', rand(3200, 4000), 0.7, rand(0.1, 0.16), 0.0018, rand(0.009, 0.016))

  // Weight.
  const thump = ctx.createOscillator()
  thump.type = 'sine'
  thump.frequency.setValueAtTime(rand(140, 165), t)
  thump.frequency.exponentialRampToValueAtTime(rand(90, 105), t + 0.045)
  const thumpGain = ctx.createGain()
  thumpGain.gain.setValueAtTime(0, t)
  thumpGain.gain.linearRampToValueAtTime(rand(0.07, 0.11), t + 0.005)
  thumpGain.gain.exponentialRampToValueAtTime(0.0005, t + rand(0.045, 0.065))
  thump.connect(thumpGain).connect(master)
  thump.start(t)
  thump.stop(t + 0.1)

  // A small rising blip just after the hit — the "confirmed" lift.
  const lift = ctx.createOscillator()
  lift.type = 'sine'
  const liftStart = t + 0.012
  lift.frequency.setValueAtTime(rand(520, 580), liftStart)
  lift.frequency.exponentialRampToValueAtTime(rand(740, 820), liftStart + 0.05)
  const liftGain = ctx.createGain()
  liftGain.gain.setValueAtTime(0.0001, liftStart)
  liftGain.gain.exponentialRampToValueAtTime(rand(0.035, 0.055), liftStart + 0.008)
  liftGain.gain.exponentialRampToValueAtTime(0.0001, liftStart + 0.07)
  lift.connect(liftGain).connect(master)
  lift.start(liftStart)
  lift.stop(liftStart + 0.09)
}

function SmoothCaretInput({ value, onChange, onFocus, className, 'aria-label': ariaLabel }) {
  const caretX = useMotionValue(0)
  const caretOpacity = useMotionValue(0)
  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const measureRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()
  const springCaretX = useSpring(
    caretX,
    prefersReducedMotion ? SMOOTH_CARET_SPRING_REDUCED : SMOOTH_CARET_SPRING,
  )

  const updateCaret = (target) => {
    const measureSpan = measureRef.current
    if (!target || !measureSpan) return

    const styles = window.getComputedStyle(target)
    measureSpan.style.font = `${styles.fontStyle} ${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`
    measureSpan.style.letterSpacing = styles.letterSpacing

    const selectionStart = target.selectionStart ?? 0
    const selectionEnd = target.selectionEnd ?? 0
    const hasSelection = selectionStart !== selectionEnd
    const caretIndex =
      selectionStart === selectionEnd
        ? selectionStart
        : target.selectionDirection === 'backward'
          ? selectionStart
          : selectionEnd

    measureSpan.textContent = target.value.slice(0, caretIndex)
    const paddingLeft = parseFloat(styles.paddingLeft) || 0
    const paddingRight = parseFloat(styles.paddingRight) || 0
    const absoluteWidth =
      caretIndex > 0 ? measureSpan.offsetWidth + paddingLeft : paddingLeft - 1

    // Keep the field's own scroll position chasing the caret so it stays
    // in view once the value is wider than the field.
    const maxScroll = Math.max(0, target.scrollWidth - target.clientWidth)
    const visibleRight = target.scrollLeft + target.clientWidth - paddingRight
    const visibleLeft = target.scrollLeft + paddingLeft
    if (absoluteWidth > visibleRight) {
      target.scrollLeft = Math.min(absoluteWidth - target.clientWidth + paddingRight, maxScroll)
    } else if (absoluteWidth < visibleLeft) {
      target.scrollLeft = Math.max(0, absoluteWidth - paddingLeft)
    }

    const caretPosition = absoluteWidth - target.scrollLeft
    const minX = paddingLeft - 1
    const maxX = target.clientWidth - paddingRight
    caretX.set(Math.min(caretPosition, maxX))
    caretOpacity.set(hasSelection || caretPosition < minX || caretPosition > maxX + 1 ? 0 : 1)
  }

  const updateCaretRef = useRef(updateCaret)
  updateCaretRef.current = updateCaret

  const syncIfFocused = () => {
    const input = inputRef.current
    if (input && document.activeElement === input) updateCaretRef.current(input)
  }

  // A soft key-tap sound per printable keystroke (and a duller one for
  // Backspace). Skipped under prefers-reduced-motion, on auto-repeat, and
  // for modifier combos / shortcuts; a short min-gap keeps a fast run from
  // stacking into noise.
  const lastSoundRef = useRef(0)
  const onKeyDown = (e) => {
    if (prefersReducedMotion || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return
    const isPrintable = typeof e.key === 'string' && e.key.length === 1
    const isBackspace = e.key === 'Backspace'
    if (!isPrintable && !isBackspace) return
    const nowMs = performance.now()
    if (nowMs - lastSoundRef.current < 22) return
    lastSoundRef.current = nowMs
    playKeystroke({ backspace: isBackspace })
  }

  useEffect(() => {
    syncIfFocused()
  }, [value])

  useEffect(() => {
    const input = inputRef.current
    const container = containerRef.current
    if (!input || !container) return

    const onSelectionChange = () => {
      if (document.activeElement === input) requestAnimationFrame(syncIfFocused)
    }
    document.addEventListener('selectionchange', onSelectionChange)
    input.addEventListener('scroll', syncIfFocused)
    document.fonts?.addEventListener?.('loadingdone', syncIfFocused)
    void document.fonts?.ready?.then?.(syncIfFocused)
    const resizeObserver = new ResizeObserver(syncIfFocused)
    resizeObserver.observe(container)

    return () => {
      document.removeEventListener('selectionchange', onSelectionChange)
      input.removeEventListener('scroll', syncIfFocused)
      document.fonts?.removeEventListener?.('loadingdone', syncIfFocused)
      resizeObserver.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative grid grid-cols-1 text-base sm:text-lg"
      style={{ caretColor: 'transparent' }}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e)
          requestAnimationFrame(syncIfFocused)
        }}
        onFocus={(e) => {
          onFocus?.(e)
          requestAnimationFrame(syncIfFocused)
        }}
        onKeyDown={onKeyDown}
        onBlur={() => caretOpacity.set(0)}
        aria-label={ariaLabel}
        className={cn('col-start-1 row-start-1 w-full bg-transparent outline-none', className)}
      />
      <span
        ref={measureRef}
        aria-hidden
        className="pointer-events-none invisible absolute left-0 top-0 whitespace-pre"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none col-start-1 row-start-1 h-[1.1em] w-0.5 self-center bg-[var(--primary)]"
        style={{ x: springCaretX, opacity: caretOpacity }}
      />
    </div>
  )
}

// Handles that resolve as "taken" in the hero's fake availability check —
// enough real-looking names (plus "shai") that trying a few lands on both
// outcomes. Everything else comes back available.
const RESERVED_SUBDOMAINS = new Set([
  'shai',
  'admin',
  'www',
  'app',
  'api',
  'hello',
  'me',
  'design',
  'test',
  'blog',
  'portfolio',
])

// macOS-style dotted spinner — eight dots on a small ring at stepped
// opacities, the ring rotating in eight discrete steps so the bright dot
// chases around. Reuses Tailwind's `spin` keyframes (already in the build
// via animate-spin elsewhere) with a stepped timing function.
function DottedSpinner({ className }) {
  return (
    <span className={cn('relative inline-block size-3', className)} aria-hidden>
      <span className="absolute inset-0 [animation:spin_0.75s_steps(8,end)_infinite]">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 size-[2px] rounded-full bg-current"
            style={{
              opacity: (i + 1) / 8,
              transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-4px)`,
            }}
          />
        ))}
      </span>
    </span>
  )
}

// The line under the subdomain field. Cross-fades (with a small vertical
// slide) between idle copy, a "checking" state with the spinner, and a
// green/red resolved state. Keyed on the status name only, so it animates
// on each state change but not on every keystroke while still "checking".
const DOMAIN_STATUS_MOTION = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: EASE },
}
function DomainStatus({ status, subdomain }) {
  let content
  if (status === 'checking') {
    content = (
      <>
        <DottedSpinner className="text-[var(--muted)]" />
        <span className="text-[var(--muted)]">Checking availability…</span>
      </>
    )
  } else if (status === 'available') {
    content = (
      <span className="text-emerald-600">
        <span className="font-medium">{subdomain}</span> is available
      </span>
    )
  } else if (status === 'taken') {
    content = (
      <span className="text-rose-600">
        <span className="font-medium">{subdomain}</span> is taken
      </span>
    )
  } else if (status === 'empty-error') {
    content = <span className="text-rose-600">Pick a name first</span>
  } else {
    content = <span className="text-[var(--muted)]">Claim your domain before it&apos;s taken</span>
  }

  return (
    <div className="flex h-5 items-center justify-center text-sm" role="status" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={status} {...DOMAIN_STATUS_MOTION} className="flex items-center gap-1.5">
          {content}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function LandingPage() {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [subdomain, setSubdomain] = useState('')

  // Fake availability check: debounce the typed handle, flip to "checking"
  // for ~700ms, then resolve against RESERVED_SUBDOMAINS.
  const trimmedSubdomain = subdomain.trim()
  const [availability, setAvailability] = useState('idle')
  useEffect(() => {
    if (!trimmedSubdomain) {
      setAvailability('idle')
      return
    }
    setAvailability('checking')
    const id = setTimeout(() => {
      setAvailability(RESERVED_SUBDOMAINS.has(trimmedSubdomain) ? 'taken' : 'available')
    }, 700)
    return () => clearTimeout(id)
  }, [trimmedSubdomain])

  // Clicking "Claim now" with nothing typed nudges the field instead of
  // silently doing nothing: the pill shakes, its border goes red, and the
  // status line swaps to a one-off "empty-error" copy — which takes over
  // from DomainStatus's own idle/checking/available/taken state below.
  // Clears the moment there's real input, or on its own after a few
  // seconds either way.
  const [showEmptyError, setShowEmptyError] = useState(false)
  const pillShakeControls = useAnimationControls()
  useEffect(() => {
    if (trimmedSubdomain) setShowEmptyError(false)
  }, [trimmedSubdomain])
  useEffect(() => {
    if (!showEmptyError) return
    const id = setTimeout(() => setShowEmptyError(false), 2400)
    return () => clearTimeout(id)
  }, [showEmptyError])

  const handleClaimClick = () => {
    playClaimClick()
    if (trimmedSubdomain) return
    setShowEmptyError(true)
    pillShakeControls.start({ x: [0, -6, 6, -4, 4, 0], transition: { duration: 0.4, ease: EASE } })
  }

  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % SUBDOMAIN_PLACEHOLDERS.length)
    }, 2400)
    return () => clearInterval(id)
  }, [])

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
                    keeps "Claim now" from getting cramped rather than
                    needing to shrink the button down to an icon. */}
                {/* The pill sits on the dotted radial-gradient field, and
                    both it and the dots are drawn in --border on white — so
                    shadow-sm left it dissolving into the background. A small
                    contact shadow plus a short, tight ambient one (keyed to
                    the same rgba(10,10,10) ink the focus ring uses) lifts it
                    just clear of the dots without reading as a floating
                    card; hover nudges it a hair deeper.
                    Tailwind emits `hover:` after `focus-within:`, so a
                    plain hover shadow (no ring layer) would clobber the
                    focus ring whenever you moused over a focused field —
                    the ring blinking out under the cursor. The stacked
                    `focus-within:hover:` rule re-asserts the ring on top of
                    the deeper hover lift so it survives both states.

                    Clicking "Claim now" empty reuses that same ring rather
                    than adding a separate red border — it recolors the
                    4px focus-within ring to rose and forces it on
                    regardless of focus (clicking the button keeps
                    focus-within true anyway, since the button lives inside
                    this pill, but this covers the case once focus moves
                    away) — and fires an imperative shake via
                    pillShakeControls (rather than an `animate` prop driven
                    off state, so the shake replays on every click even if
                    showEmptyError was already true from the last one). */}
                <motion.div
                  animate={pillShakeControls}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] pl-6 sm:pl-7 pr-1.5 py-1.5 transition-shadow duration-200 ease-out',
                    showEmptyError
                      ? 'shadow-[0_0_0_4px_rgba(244,63,94,0.35),0_4px_10px_-4px_rgba(10,10,10,0.08)]'
                      : 'shadow-[0_1px_2px_rgba(10,10,10,0.04),0_4px_10px_-4px_rgba(10,10,10,0.08)] hover:shadow-[0_1px_2px_rgba(10,10,10,0.05),0_6px_16px_-6px_rgba(10,10,10,0.12)] focus-within:shadow-[0_0_0_4px_rgba(10,10,10,0.06),0_4px_10px_-4px_rgba(10,10,10,0.08)] focus-within:hover:shadow-[0_0_0_4px_rgba(10,10,10,0.06),0_6px_16px_-6px_rgba(10,10,10,0.12)]',
                  )}
                  style={{ perspective: 500 }}
                >
                  <div className="relative w-20 sm:w-36" style={{ perspective: 400 }}>
                    <SmoothCaretInput
                      value={subdomain}
                      onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9- ]/g, ''))}
                      aria-label="Choose your subdomain"
                      className="py-2.5 sm:py-3 text-base sm:text-lg text-[var(--primary)] selection:bg-[var(--primary)] selection:text-[var(--primary-foreground)]"
                    />
                    {/* Real <input placeholder> can't cross-fade between two
                        strings — this overlay swaps in for it instead,
                        hidden the instant there's a real value. Split into
                        one motion.span per character (not one span for the
                        whole word) so staggerChildren can fire each letter's
                        flip a beat after the last — the word rolls through
                        like a wave instead of flipping as one rigid block.
                        opacity-70 (not the full-strength --primary look
                        opacity:1 gave it) is what actually reads as a muted
                        placeholder instead of just faded body text.
                        pointer-events-none so clicks/focus still land on the
                        input underneath. */}
                    {!subdomain && (
                      <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none">
                        <AnimatePresence mode="popLayout">
                          <motion.span
                            key={SUBDOMAIN_PLACEHOLDERS[placeholderIndex]}
                            variants={placeholderWaveContainer}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="inline-flex text-base sm:text-lg text-[var(--muted)]"
                          >
                            {SUBDOMAIN_PLACEHOLDERS[placeholderIndex].split('').map((ch, i) => (
                              <motion.span
                                key={i}
                                variants={placeholderWaveChar}
                                style={{ display: 'inline-block', transformOrigin: 'center bottom', whiteSpace: 'pre' }}
                              >
                                {ch}
                              </motion.span>
                            ))}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                  <span className="hidden sm:block h-6 w-px bg-[var(--border)]" />
                  <span className="hidden sm:inline pr-3 text-lg text-[var(--muted)]">.designfolio.me</span>
                  {/* Very subtle 3D tilt, not a big showy one — a couple
                      degrees of rotateX/rotateY on hover (needs the parent
                      pill's perspective above to read as depth rather than
                      a skew) and back to flat with a slight press on tap.
                      Color/bg still animate via the plain Tailwind
                      transition below; framer only owns the transform now,
                      replacing the old active:scale for that.

                      The glossy-pill treatment on top of that: a soft
                      ambient shadow lifts the whole button off the field,
                      kept light so it reads as a lift and not a drop shadow
                      (folded into the focus-visible ring too, same fix as
                      the outer pill's shadow — otherwise focus would wipe
                      the lift instead of adding to it); an inset radial
                      highlight, biased hard toward the top, reads as a
                      light source catching a rounded glass/plastic surface;
                      a light-rim-top / dark-rim-bottom pair of inset
                      shadows is the bevel that makes it look embossed
                      rather than flat; and a full all-around inset stroke
                      (the ring visible tracing the whole capsule in the
                      reference, not just a top highlight) is what actually
                      separates the pill's edge from the dark field behind
                      it. All three overlays are separate
                      absolutely-positioned layers rather than squeezed into
                      one background- shorthand, so they don't fight the
                      plain bg-[var(--primary)] / hover:bg-* color change on
                      the button itself. */}
                  <motion.button
                    whileHover={{ rotateX: -5, rotateY: 3, y: -1 }}
                    whileTap={{ scale: 0.96, rotateX: 0, rotateY: 0, y: 0 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    style={{ transformStyle: 'preserve-3d' }}
                    onClick={handleClaimClick}
                    className="relative overflow-hidden rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-base sm:text-lg font-medium px-6 sm:px-7 py-3 sm:py-3.5 shadow-[0_1px_2px_rgba(10,10,10,0.2),0_6px_14px_-8px_rgba(10,10,10,0.35)] transition-colors duration-150 ease-out hover:bg-[var(--primary-hover)] focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_rgba(10,10,10,0.35),0_6px_14px_-8px_rgba(10,10,10,0.35)] whitespace-nowrap"
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(120%_100%_at_50%_-35%,rgba(255,255,255,0.32),rgba(255,255,255,0)_60%)]"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),inset_0_-1.5px_1.5px_rgba(0,0,0,0.45),inset_0_0_0_1px_rgba(255,255,255,0.22)]"
                    />
                    <span className="relative">Claim now</span>
                  </motion.button>
                </motion.div>
                <DomainStatus
                  status={showEmptyError ? 'empty-error' : availability}
                  subdomain={trimmedSubdomain}
                />
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

            {/* max-w-6xl (not the old max-w-5xl) — at 5xl the grid sat
                noticeably narrower than the dark section's own full-bleed
                background, reading as extra side padding around the cards
                rather than the section actually using its available
                width. */}
            <div className="relative z-10 mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto text-left">
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

          {/* Static masonry "wall of quotes" — CSS columns (break-inside-avoid
              per card) rather than the old scroll-pinned stack, matching the
              reference: a plain grid of bordered cards at uneven heights, no
              scroll-jacking or motion tied to it at all. Same self-stretch
              -mx-6/-mx-8 + px-6/8 py-* breakout pattern as the sections
              above, just without the dark theme override — this one stays
              on the page's normal light background. */}
          <motion.div
            variants={heroReveal}
            className="relative self-stretch -mx-6 sm:-mx-8 px-6 sm:px-8 py-20 sm:py-28"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-[650] tracking-tight text-[var(--heading)]">
              What our users are saying.
            </h2>

            <div className="mt-12 sm:mt-16 columns-1 sm:columns-2 lg:columns-4 gap-6 max-w-6xl mx-auto text-left">
              {TESTIMONIALS.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="mb-6 break-inside-avoid rounded-2xl border border-[var(--border)] p-6"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-[650] text-[#1a1a1a]/70 shrink-0"
                      style={{ background: testimonial.avatarBg }}
                    >
                      {initials(testimonial.name)}
                    </div>
                    <div>
                      <p className="font-[650] text-sm text-[var(--primary)]">{testimonial.name}</p>
                      <p className="text-xs text-[var(--muted)]">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[#3d3d3d]">{testimonial.quote}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.section>
    </LandingShell>
  )
}
