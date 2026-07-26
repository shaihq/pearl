import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import EditableItem from './builder/EditableItem'
import { FEATURED_PROJECT } from '../data/projects'
import { useCursor } from '../context/CursorContext'
import { revealContainer, revealRL, viewport } from '../motion'

export default function FeaturedProject() {
  const { show, hide } = useCursor()
  const { slug, client, title, Card } = FEATURED_PROJECT

  return (
    <motion.section
      className="pb-10"
      variants={revealContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      <EditableItem itemLabel={title} sectionKey="projects" sectionLabel="Projects">
        <Link to={`/projects/${slug}`} className="block">
          <motion.div variants={revealRL} onMouseEnter={show} onMouseLeave={hide}>
            <Card />
          </motion.div>
          <motion.div variants={revealRL} className="mt-4 flex flex-col gap-0.5">
            <p className="text-xs text-[var(--muted)]">{client}</p>
            <p className="text-sm font-medium text-[var(--primary)]">{title}</p>
          </motion.div>
        </Link>
      </EditableItem>
    </motion.section>
  )
}
