import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { EASE } from '../motion'
import { BLOG_POSTS } from '../data/blogPosts'
import LandingShell from './landing/LandingShell'

const articleContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}
const reveal = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

export default function BlogPostPage() {
  const { slug } = useParams()
  const post = BLOG_POSTS.find((p) => p.slug === slug)

  if (!post) {
    return (
      <LandingShell>
        <div className="relative z-10 pt-32 sm:pt-40 pb-24 sm:pb-32 flex flex-col items-center text-center">
          <h1 className="text-3xl sm:text-4xl font-[650] tracking-tight text-[var(--heading)]">Post not found</h1>
          <p className="mt-3 text-[var(--muted)]">This one may have moved or never existed.</p>
          <Link
            to="/blog"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to blog
          </Link>
        </div>
      </LandingShell>
    )
  }

  return (
    <LandingShell>
      <motion.article
        className="relative z-10 pt-20 sm:pt-28 pb-24 sm:pb-32"
        variants={articleContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Extra px beyond the frame's own inset — without it this block
            sits flush against the frame's border lines the same way the
            two-column grid below does, which reads fine for a wide article
            body but cramped for the tighter cluster of pills/title/image. */}
        <div className="px-4 sm:px-8">
          <motion.div variants={reveal} className="flex items-center gap-2">
            <span className="rounded-full border border-[var(--border)] bg-[var(--secondary)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
              {post.date}
            </span>
            <span className="rounded-full border border-[var(--border)] bg-[var(--secondary)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
              {post.readTime}
            </span>
          </motion.div>

          <motion.h1
            variants={reveal}
            className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-[650] tracking-tight leading-[1.1] max-w-3xl text-[var(--heading)]"
          >
            {post.title}
          </motion.h1>

          <motion.div variants={reveal} className="mt-6 flex items-center gap-3">
            <img src={post.author.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <p className="text-sm font-[650] text-[var(--primary)]">{post.author.name}</p>
              <p className="text-xs text-[var(--muted)]">{post.author.role}</p>
            </div>
          </motion.div>

          <motion.div
            variants={reveal}
            className="mt-10 aspect-[16/9] rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--card)]"
          >
            <img src={post.image} alt="" className="w-full h-full object-cover" />
          </motion.div>
        </div>

        {/* Same hatched divider used to close out sections on the landing
            page — ties this page back into the same visual language rather
            than inventing a new rule style just for the blog. */}
        <motion.div
          variants={reveal}
          className="mt-16 sm:mt-20 h-16 border-y border-[var(--border)]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to right, var(--border) 0, var(--border) 1px, transparent 1px, transparent 12px)',
          }}
        />

        {/* Sidebar sticks at top-28 — clears the fixed nav pill the same
            way the hero sections' pt-28/36 do elsewhere on these pages.
            Section headings get the matching scroll-mt so a TOC jump
            doesn't land them underneath that same nav.

            Deliberately a plain <aside>, not a motion.aside — a `transform`
            on any ancestor of a position:sticky element (which is exactly
            what framer-motion leaves inline once a y-based reveal
            animation settles, even at y:0) gives the sticky element a new,
            much smaller containing block instead of the actual scroll
            container. That's why it was sticking almost immediately and
            then failing to keep following the scroll. */}
        {/* max-w-5xl caps the grid itself — without it, on the wider
            1400px frame the 1fr content column keeps growing well past
            the max-w-2xl article text sitting inside it, leaving a large,
            empty-looking gap to the right of the actual paragraphs. Same
            px-4/8 as the hero block above so the sidebar/article's left
            edge lines up with the title instead of sitting further left. */}
        <div className="mt-12 sm:mt-16 max-w-5xl px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 lg:gap-16">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <p className="text-sm font-[650] text-[var(--primary)]">Table of contents</p>
              <nav className="mt-4 flex flex-col gap-3">
                {post.sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
                  >
                    {section.heading}
                  </a>
                ))}
              </nav>

              <div className="mt-10 rounded-2xl border border-[var(--border)] overflow-hidden">
                <div
                  className="h-20"
                  style={{ background: 'linear-gradient(135deg, #FFDCD7, #FF553E)' }}
                />
                <div className="p-5 bg-[var(--background)]">
                  <p className="font-[650] text-[var(--primary)]">Ready to start?</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Build a portfolio recruiters actually remember.
                  </p>
                  <Link
                    to="/landing"
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium px-4 py-2 hover:bg-[var(--primary-hover)] transition-colors"
                  >
                    Get started
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          <motion.div variants={reveal} className="max-w-2xl">
            <p className="text-lg text-[var(--muted)] leading-relaxed">{post.intro}</p>

            {post.sections.map((section) => (
              <section key={section.id} id={section.id} className="mt-10 scroll-mt-28">
                <h2 className="text-2xl font-[650] tracking-tight text-[var(--heading)]">{section.heading}</h2>
                {section.paragraphs.map((paragraph, i) => (
                  <p key={i} className="mt-4 text-base text-[var(--muted)] leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </motion.div>
        </div>
      </motion.article>
    </LandingShell>
  )
}
