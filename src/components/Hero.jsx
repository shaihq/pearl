import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import { revealContainer, revealRL, viewport } from '../motion'
import { useTypewriter } from '../hooks/useTypewriter'

const ROLES = ['Designer', 'Developer', 'Storyteller']

export default function Hero() {
  const role = useTypewriter(ROLES)

  return (
    <motion.section
      className="pt-8 pb-16 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-center lg:gap-16"
      variants={revealContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      <div className="order-2 lg:order-1">
        <motion.p variants={revealRL} className="text-xs text-[var(--muted)] mb-4">
          Branding · Product Design
        </motion.p>

        <motion.h1
          variants={revealRL}
          className="text-4xl sm:text-5xl leading-[1.15] tracking-tight max-w-2xl text-[var(--primary)] font-medium"
        >
          Hi, I'm Matt.
          <br />
          I'm a {role}.
          <span className="inline-block w-[3px] h-[0.9em] bg-[var(--primary)] ml-1 align-middle typewriter-caret" />
        </motion.h1>

        <motion.p
          variants={revealRL}
          className="mt-6 max-w-md text-base sm:text-lg leading-relaxed text-[var(--muted)]"
        >
          I specialize in crafting engaging digital experiences that elevate brands and drive results.
        </motion.p>

        <motion.button
          variants={revealRL}
          className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium pl-5 pr-4 py-2.5 hover:bg-[var(--primary-hover)] transition-colors"
        >
          Contact me
          <Mail className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      <div className="order-1 flex justify-start lg:order-2">
        <motion.img
          variants={revealRL}
          src="/db5f76c2a132da4d5112cf0a25466f36.jpg"
          alt="Matt"
          className="w-44 h-44 sm:w-64 sm:h-64 lg:w-80 lg:h-80 rounded-2xl border border-[var(--border)] object-cover shrink-0 shadow-xl"
        />
      </div>
    </motion.section>
  )
}
