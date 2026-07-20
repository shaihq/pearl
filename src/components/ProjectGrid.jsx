import { motion } from 'framer-motion'
import DazzleCard from './cards/DazzleCard'
import HealthcareCard from './cards/HealthcareCard'
import InfographicCard from './cards/InfographicCard'
import AppPluginCard from './cards/AppPluginCard'
import { useCursor } from '../context/CursorContext'
import { quickContainer, revealBT, viewport } from '../motion'

const projects = [
  { Card: DazzleCard, client: 'Dazzle Inc.', title: 'Dazzle © Branding' },
  { Card: HealthcareCard, client: 'CareSunset', title: 'Healthcare Mobile App' },
  { Card: InfographicCard, client: 'Tech Bank Client', title: 'Technical Infographic' },
  { Card: AppPluginCard, client: 'Notex', title: 'Extend & Support - App Plugin' },
]

export default function ProjectGrid() {
  const { show, hide } = useCursor()

  return (
    <motion.section
      className="pb-16 grid grid-cols-1 sm:grid-cols-2 gap-4"
      variants={quickContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {projects.map(({ Card, client, title }) => (
        <motion.div
          key={title}
          variants={revealBT}
          className="group cursor-none"
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          <Card />
          <div className="mt-4 flex flex-col gap-0.5">
            <p className="text-xs text-[var(--muted)]">{client}</p>
            <p className="text-sm font-medium text-[var(--primary)]">{title}</p>
          </div>
        </motion.div>
      ))}
    </motion.section>
  )
}
