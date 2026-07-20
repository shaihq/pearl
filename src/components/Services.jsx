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
      <motion.p variants={revealRL} className="text-xs text-[var(--muted)] mb-2">
        Services
      </motion.p>
      <div className="border-t border-[var(--border)]">
        {services.map((service) => (
          <motion.div
            key={service}
            variants={revealRL}
            className="flex items-center justify-between py-5 border-b border-[var(--border)]"
          >
            <span className="text-2xl sm:text-3xl font-medium tracking-tight text-[var(--primary)]">
              {service}
            </span>
            <span className="text-[var(--muted)] text-lg">↓</span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
