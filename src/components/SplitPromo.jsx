import { motion } from 'framer-motion'
import ArrowIcon from './ArrowIcon'
import { revealContainer, revealRL, viewport } from '../motion'

export default function SplitPromo({ label, lead, rest, cta }) {
  return (
    <motion.section
      className="py-14 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10 border-t border-neutral-200 dark:border-zinc-800"
      variants={revealContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      <motion.p variants={revealRL} className="text-xs text-neutral-500 dark:text-zinc-400 sm:w-40 shrink-0">
        {label}
      </motion.p>

      <motion.p variants={revealRL} className="text-xl sm:text-2xl leading-snug tracking-tight flex-1">
        <span className="text-ink dark:text-white font-medium">{lead}</span>{' '}
        <span className="text-neutral-400 dark:text-zinc-500 font-medium">{rest}</span>
      </motion.p>

      <motion.button
        variants={revealRL}
        className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-neutral-100 text-ink text-sm font-medium pl-4 pr-3.5 py-2 hover:bg-neutral-200 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 transition-colors"
      >
        {cta}
        <ArrowIcon className="w-3 h-3" />
      </motion.button>
    </motion.section>
  )
}
