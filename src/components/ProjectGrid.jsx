import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import EditableItem from './builder/EditableItem'
import { GRID_PROJECTS } from '../data/projects'
import { useCursor } from '../context/CursorContext'
import { quickContainer, revealBT, viewport } from '../motion'

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
      {GRID_PROJECTS.map(({ slug, Card, client, title }) => (
        <motion.div key={slug} variants={revealBT}>
          <EditableItem itemLabel={title} sectionKey="projects" sectionLabel="Projects">
            <Link to={`/projects/${slug}`} className="block">
              <div className="group cursor-none" onMouseEnter={show} onMouseLeave={hide}>
                <Card />
              </div>
              <div className="mt-4 flex flex-col gap-0.5">
                <p className="text-xs text-[var(--muted)]">{client}</p>
                <p className="text-sm font-medium text-[var(--primary)]">{title}</p>
              </div>
            </Link>
          </EditableItem>
        </motion.div>
      ))}
    </motion.section>
  )
}
