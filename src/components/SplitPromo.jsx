import { motion } from 'framer-motion'
import ArrowIcon from './ArrowIcon'
import { revealContainer, revealRL, viewport } from '../motion'

export default function SplitPromo({ label, lead, rest, cta }) {
  return (
    <motion.section
      className="py-14 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10 border-t border-[var(--border)]"
      variants={revealContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      <motion.p variants={revealRL} className="text-xs text-[var(--muted)] sm:w-40 shrink-0">
        {label}
      </motion.p>

      <motion.p variants={revealRL} className="text-xl sm:text-2xl leading-snug tracking-tight flex-1">
        <span className="text-[var(--primary)] font-medium">{lead}</span>{' '}
        <span className="text-[var(--muted)] font-medium">{rest}</span>
      </motion.p>

      <motion.button
        variants={revealRL}
        className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-[var(--secondary)] text-[var(--primary)] text-sm font-medium pl-4 pr-3.5 py-2 hover:bg-[var(--secondary-hover)] transition-colors"
      >
        {cta}
        <ArrowIcon className="w-3 h-3" />
      </motion.button>
    </motion.section>
  )
}
