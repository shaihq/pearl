import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PenTool, Rocket, Sparkles, TrendingUp } from 'lucide-react'
import { EASE } from '../motion'
import { BLOG_POSTS } from '../data/blogPosts'
import LandingShell from './landing/LandingShell'

// Same local variants as LandingPage — short, eased entrances rather than a
// linear snap. Kept local instead of imported since the two pages don't
// otherwise share animation state.
const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}
const heroReveal = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

// Scattered colored badges around the hero heading — same colored-icon-badge
// language as ICON_BURST/PREVIEW_TABS on the landing page, positioned by %
// and a fixed rotation rather than the landing page's full scroll-driven
// burst physics (this hero has no stat block to converge on, so the simpler
// one-time fade/scale entrance is the right amount of motion here).
// posClass is a full, literal Tailwind class string (not built from
// interpolated values at render time) — Tailwind's content scanner reads
// source files as plain text to find arbitrary-value utilities like
// `top-[2%]`, so a runtime-interpolated `top-[${n}%]` would never actually
// get generated; writing the whole class list out per badge is what makes
// it show up in the compiled CSS. The bare (mobile) coordinates pin these
// into the box's corners rather than the sm: coordinates — on a narrow
// viewport the wrapped heading takes up nearly the full width, so the
// closer-to-center spot that works above sm: would sit right on top of
// the text instead of beside it.
const HERO_BADGES = [
  { Icon: Rocket, posClass: 'top-[2%] left-[4%] sm:top-[16%] sm:left-[20%]', bg: 'bg-rose-500', rotate: -8 },
  { Icon: TrendingUp, posClass: 'top-[2%] left-[74%] sm:top-[20%] sm:left-[78%]', bg: 'bg-blue-600', rotate: 6 },
  { Icon: PenTool, posClass: 'top-[90%] left-[6%] sm:top-[74%] sm:left-[24%]', bg: 'bg-green-500', rotate: 10 },
  { Icon: Sparkles, posClass: 'top-[90%] left-[76%] sm:top-[70%] sm:left-[80%]', bg: 'bg-violet-600', rotate: -10 },
]
const badgeVariant = {
  hidden: { opacity: 0, scale: 0.4, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

function PostCard({ post, featured = false }) {
  return (
    <Link to={`/blog/${post.slug}`} className="group block">
      <div
        className={`relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] ${
          featured ? 'aspect-[16/11]' : 'aspect-[16/10]'
        }`}
      >
        <img
          src={post.image}
          alt=""
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--secondary)] text-[var(--primary)] pl-2 pr-3 py-1 text-xs font-medium shadow-sm">
          <post.Icon className="w-3.5 h-3.5" />
          {post.category}
        </span>
      </div>
      <p className="mt-4 text-xs text-[var(--muted)]">{post.date}</p>
      <p
        className={`mt-1 font-[650] text-[var(--primary)] group-hover:text-[var(--muted)] transition-colors ${
          featured ? 'text-xl sm:text-2xl leading-snug' : 'text-base leading-snug'
        }`}
      >
        {post.title}
      </p>
    </Link>
  )
}

export default function BlogPage() {
  const [featuredPost, ...rest] = BLOG_POSTS
  const sidePosts = rest.slice(0, 2)
  const gridPosts = rest.slice(2)

  return (
    <LandingShell>
      <motion.section
        className="relative z-10 flex flex-col items-center text-center"
        variants={heroContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0 }}
      >
        {/* Same dotted backdrop as the landing hero, so the two pages read
            as one design system rather than two different treatments. The
            section above has no padding of its own — this box starts flush
            at the top and owns ALL the spacing itself (including nav
            clearance, via pt), so the dots fill that space instead of
            leaving a plain white gap above them. pb is close to pt (rather
            than just enough to clear the nav) so the heading/subhead sit
            centered in the box instead of pinned toward its bottom. */}
        <div
          className="relative self-stretch -mx-6 sm:-mx-8 px-6 sm:px-8 pt-32 sm:pt-40 pb-24 sm:pb-32 flex flex-col items-center justify-center"
          style={{
            backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        >
          {HERO_BADGES.map((badge, i) => (
            <motion.span
              key={i}
              variants={badgeVariant}
              className={`absolute flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl shadow-sm ${badge.posClass} ${badge.bg}`}
              style={{ rotate: `${badge.rotate}deg` }}
            >
              <badge.Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </motion.span>
          ))}

          <motion.h1
            variants={heroReveal}
            className="text-4xl sm:text-5xl lg:text-6xl font-[650] tracking-tight leading-[1.08] max-w-2xl text-[var(--heading)]"
          >
            Stories &amp; advice for your design career
          </motion.h1>
          <motion.p variants={heroReveal} className="mt-6 text-lg sm:text-xl text-[var(--muted)] max-w-xl">
            Tips on portfolios, case studies, and landing the UX role you actually want.
          </motion.p>
        </div>
      </motion.section>

      <motion.section
        className="relative z-10 pb-24 sm:pb-32"
        variants={heroContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <motion.div variants={heroReveal} className="lg:col-span-2">
            <PostCard post={featuredPost} featured />
          </motion.div>
          <div className="flex flex-col gap-6 sm:gap-8">
            {sidePosts.map((post) => (
              <motion.div key={post.slug} variants={heroReveal}>
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div variants={heroReveal} className="mt-16 sm:mt-20">
          <h2 className="text-2xl sm:text-3xl font-[650] tracking-tight text-[var(--heading)]">
            More from the blog
          </h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {gridPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </motion.div>
      </motion.section>
    </LandingShell>
  )
}
