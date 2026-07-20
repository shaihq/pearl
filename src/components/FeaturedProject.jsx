import { motion } from 'framer-motion'
import DashboardMockup from './DashboardMockup'
import { useCursor } from '../context/CursorContext'
import { revealContainer, revealRL, viewport } from '../motion'

export default function FeaturedProject() {
  const { show, hide } = useCursor()

  return (
    <motion.section
      className="pb-10"
      variants={revealContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      <motion.div
        variants={revealRL}
        className="group cursor-none rounded-2xl bg-panel dark:bg-zinc-900 h-[360px] flex items-center justify-center px-8 overflow-hidden transition-colors duration-500"
        onMouseEnter={show}
        onMouseLeave={hide}
      >
        <div className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
          <DashboardMockup />
        </div>
      </motion.div>
      <motion.div variants={revealRL} className="mt-4 flex flex-col gap-0.5">
        <p className="text-xs text-neutral-500 dark:text-zinc-400">Booking Corp.</p>
        <p className="text-sm font-medium text-ink dark:text-white">Fintech Dello Banking App</p>
      </motion.div>
    </motion.section>
  )
}
