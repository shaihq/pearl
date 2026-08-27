import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE } from '../motion'

// Standalone auth screen — deliberately NOT wrapped in LandingShell. It's
// its own full-viewport split layout (dark form left, screenshot wall
// right), not a page with the marketing nav/footer around it, same as the
// reference.
//
// Dark palette copied verbatim from LandingShell's own DARK_THEME_VARS
// rather than imported — matches how this codebase already treats these
// theme snapshots as standalone copies per component (see LandingShell's
// own comment on LIGHT_THEME_VARS) rather than a shared import.
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
  '--heading': '#f2f2f2',
}

// Icon + name pairs — same square badge PNGs and layout the footer's
// scrolling logo marquee uses, rather than the flat wordmark SVGs. Only 4
// show at once (see TrustedByLogos below); the rest of the pool rotates
// through those same 4 slots over time.
const TRUSTED_LOGOS = [
  { logo: '/companylogos/amazon.png', name: 'Amazon' },
  { logo: '/companylogos/google.png', name: 'Google' },
  { logo: '/companylogos/apple.png', name: 'Apple' },
  { logo: '/companylogos/cisco.png', name: 'Cisco' },
  { logo: '/companylogos/mastercard.png', name: 'Mastercard' },
  { logo: '/companylogos/ola.png', name: 'Ola' },
  { logo: '/companylogos/razorpay.png', name: 'Razorpay' },
  { logo: '/companylogos/servicenow.png', name: 'ServiceNow' },
]

// Real screenshots from the product itself (the same case-study feature
// shots and mock photos used elsewhere on the landing page) rather than
// stock imagery — cycled to fill the grid since there are only a handful
// of unique ones.
const SCREENSHOTS = [
  '/section/templates.png',
  '/section/write%20using%20ai.png',
  '/section/embeds%20figma.png',
  '/section/notion%20ediotr.png',
  '/section/custom%20domains.png',
  '/section/protectpassword.png',
  '/db5f76c2a132da4d5112cf0a25466f36.jpg',
  '/4bd851154ac889867f6c8d15dcf3b35c.jpg',
  '/protectpassword.png',
]
const GRID_TILES = Array.from({ length: 15 }, (_, i) => SCREENSHOTS[i % SCREENSHOTS.length])

// Staggered entrance for the left column — each direct child reveals a
// beat after the last rather than all popping in at once.
const formContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}
const formItem = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

// Plain blur+fade per logo slot — no transform (no flip, no y drift), just
// filter and opacity, and slower than the earlier attempts. Each slot is
// its own AnimatePresence (they're separate trees, not siblings under one
// shared parent), so the wave sweeping across the row is a manual per-slot
// transition delay.
function LogoSlot({ item, index }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={item.name}
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, filter: 'blur(10px)' }}
        transition={{ duration: 0.9, ease: EASE, delay: index * 0.15 }}
        className="flex items-center gap-2"
      >
        <img src={item.logo} alt="" className="w-8 h-8 rounded-lg object-cover" />
        <span className="text-base font-[650] text-[var(--primary)] whitespace-nowrap">{item.name}</span>
      </motion.div>
    </AnimatePresence>
  )
}

// Only 3 of the pool show at once, and every few seconds the row shifts one
// slot over — the same "each slot takes the next slot's logo, a new one
// enters at the end" trick as the footer marquee's data, just animated
// instead of physically scrolling. Slower interval to match the slower fade.
function TrustedByLogos() {
  const [start, setStart] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setStart((i) => (i + 1) % TRUSTED_LOGOS.length), 4000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex items-center justify-center gap-8">
      {Array.from({ length: 3 }, (_, slot) => (
        <LogoSlot key={slot} index={slot} item={TRUSTED_LOGOS[(start + slot) % TRUSTED_LOGOS.length]} />
      ))}
    </div>
  )
}

export default function SignupPage() {
  return (
    <div style={{ ...DARK_THEME_VARS, fontFamily: "'Manrope', sans-serif" }} className="flex min-h-screen bg-[var(--background)] text-[var(--primary)]">
      {/* Form column — full width on mobile (the screenshot wall is a
          desktop-only flourish, hidden below lg), exactly half the
          viewport on desktop so the wall takes the other half. */}
      <div className="flex w-full lg:w-1/2 shrink-0 flex-col items-center justify-center px-8 sm:px-16 py-16">
        <motion.div variants={formContainer} initial="hidden" animate="visible" className="w-full max-w-sm">
          <motion.div variants={formItem}>
            <Link to="/landing" className="flex justify-center">
              <svg width="48" height="48" viewBox="0 0 125 125" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
                <g filter="url(#signup-logo-filter)">
                  <rect width="124.5" height="124.5" rx="62.25" fill="url(#signup-logo-gradient)" />
                  <path
                    d="M67.437 15.5625H57.062V49.7263L32.9046 25.5688L25.5683 32.9051L49.7258 57.0625H15.562V67.4375H49.7258L25.5684 91.5949L32.9046 98.9311L57.062 74.7737V108.937H67.437V74.7737L91.5944 98.9312L98.9307 91.5949L74.7732 67.4375H108.937V57.0625H74.7732L98.9307 32.9051L91.5944 25.5688L67.437 49.7263V15.5625Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <filter id="signup-logo-filter" x="0" y="0" width="124.5" height="124.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset />
                    <feGaussianBlur stdDeviation="6.72973" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.333333 0 0 0 0 0.243137 0 0 0 1 0" />
                    <feBlend mode="normal" in2="shape" result="signup-logo-shadow" />
                  </filter>
                  <linearGradient id="signup-logo-gradient" x1="62.25" y1="0" x2="62.25" y2="124.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFDCD7" />
                    <stop offset="0.788462" stopColor="#FF553E" />
                  </linearGradient>
                </defs>
              </svg>
            </Link>
          </motion.div>

          <motion.h1 variants={formItem} className="mt-8 text-center text-3xl font-[650] tracking-tight text-[var(--heading)]">
            Create your free account
          </motion.h1>
          <motion.p variants={formItem} className="mt-3 text-center text-sm text-[var(--muted)]">
            Create your free account to build and publish your UX portfolio. No credit card required.
          </motion.p>

          <motion.button
            variants={formItem}
            className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-full border border-[var(--border)] bg-[var(--secondary)] py-3 text-sm font-medium hover:bg-[var(--secondary-hover)] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.616Z"
                fill="#4285F4"
              />
              <path
                d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.26c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.583-5.036-3.71H.957v2.332A8.997 8.997 0 0 0 9 18Z"
                fill="#34A853"
              />
              <path
                d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </motion.button>

          <motion.div variants={formItem} className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <span className="text-xs text-[var(--muted)]">or</span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </motion.div>

          <motion.input
            variants={formItem}
            type="email"
            placeholder="Enter email address"
            className="mt-6 w-full rounded-full border border-[var(--border)] bg-[var(--secondary)] px-5 py-3 text-sm text-[var(--primary)] placeholder:text-[var(--muted)] outline-none focus:border-[var(--primary)] transition-colors"
          />
          <motion.button
            variants={formItem}
            className="mt-3 w-full rounded-full bg-[var(--primary)] py-3 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition-colors"
          >
            Continue
          </motion.button>

          <motion.p variants={formItem} className="mt-5 text-center text-xs text-[var(--muted)]">
            By continuing, you agree to Designfolio's{' '}
            <a href="#" className="underline hover:text-[var(--primary)] transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <Link to="/privacy-policy" className="underline hover:text-[var(--primary)] transition-colors">
              Privacy Policy
            </Link>
            .
          </motion.p>

          <motion.p variants={formItem} className="mt-8 text-center text-sm text-[var(--muted)]">
            Already have an account?{' '}
            <a href="#" className="font-medium text-[var(--primary)] hover:underline">
              Log in
            </a>
          </motion.p>

          <motion.div variants={formItem} className="mt-16 flex flex-col items-center gap-5">
            <p className="text-xs text-[var(--muted)]">Trusted by designers working at</p>
            <TrustedByLogos />
          </motion.div>
        </motion.div>
      </div>

      {/* Screenshot wall — hidden below lg, where the form column alone
          fills the screen. overflow-hidden on the outer panel clips the
          rotated/scaled grid back down to the panel's own bounds; scale-125
          on the grid makes sure the rotation doesn't leave gaps of bare
          background visible at the panel's corners. */}
      <div className="relative hidden lg:block lg:w-1/2 overflow-hidden bg-[var(--card)]">
        <div className="absolute inset-0 grid grid-cols-3 gap-4 p-4 rotate-[-8deg] scale-125">
          {GRID_TILES.map((src, i) => (
            <div key={i} className="aspect-[9/17] rounded-2xl overflow-hidden border border-[var(--border)] shadow-xl">
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
