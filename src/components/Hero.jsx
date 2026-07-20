import { motion } from 'framer-motion'
import ArrowIcon from './ArrowIcon'
import { revealContainer, revealRL, viewport } from '../motion'
import { useTypewriter } from '../hooks/useTypewriter'

const ROLES = ['Designer', 'Developer', 'Storyteller']

export default function Hero() {
  const role = useTypewriter(ROLES)

  return (
    <motion.section
      className="pt-8 pb-16"
      variants={revealContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      <motion.p variants={revealRL} className="text-xs text-neutral-500 dark:text-zinc-400 mb-4">
        Branding · Product Design
      </motion.p>

      <motion.h1
        variants={revealRL}
        className="text-4xl sm:text-5xl leading-[1.15] tracking-tight max-w-2xl text-ink dark:text-white font-medium"
      >
        Hi, I'm Matt.
        <br />
        I'm a {role}.
        <span className="inline-block w-[3px] h-[0.9em] bg-ink dark:bg-white ml-1 align-middle typewriter-caret" />
      </motion.h1>

      <motion.p
        variants={revealRL}
        className="mt-6 max-w-md text-base sm:text-lg leading-relaxed text-neutral-500 dark:text-zinc-400"
      >
        I specialize in crafting engaging digital experiences that elevate brands and drive results.
      </motion.p>

      <motion.button
        variants={revealRL}
        className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-ink text-white text-sm font-medium pl-5 pr-4 py-2.5 hover:bg-neutral-800 dark:bg-white dark:text-ink dark:hover:bg-neutral-200 transition-colors"
      >
        Get for free
        <ArrowIcon />
      </motion.button>
    </motion.section>
  )
}
