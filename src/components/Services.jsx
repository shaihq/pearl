import { motion } from 'framer-motion'
import { revealContainer, revealRL, viewport } from '../motion'

const services = ['Branding', 'UX/UI Designs', 'Motion & Animation', 'Mobile']

export default function Services() {
  return (
    <motion.section
      className="pb-14"
      variants={revealContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      <motion.p variants={revealRL} className="text-xs text-neutral-500 dark:text-zinc-400 mb-2">
        Services
      </motion.p>
      <div className="border-t border-neutral-200 dark:border-zinc-800">
        {services.map((service) => (
          <motion.div
            key={service}
            variants={revealRL}
            className="flex items-center justify-between py-5 border-b border-neutral-200 dark:border-zinc-800"
          >
            <span className="text-2xl sm:text-3xl font-medium tracking-tight text-ink dark:text-white">
              {service}
            </span>
            <span className="text-neutral-400 dark:text-zinc-600 text-lg">↓</span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
