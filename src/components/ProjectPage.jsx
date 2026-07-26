import { useParams } from 'react-router-dom'
import Navbar from './Navbar'
import { getProjectBySlug } from '../data/projects'

// Deliberately minimal — a case study page shell, not a written case study.
// Just enough to prove the navigation and layout: client, title, thumbnail.
export default function ProjectPage() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 pt-32 pb-24 sm:px-8">
        {project ? (
          <>
            <p className="mb-2 text-xs text-[var(--muted)]">{project.client}</p>
            <h1 className="mb-8 text-3xl font-medium tracking-tight text-[var(--primary)] sm:text-4xl">
              {project.title}
            </h1>
            <project.Card />
          </>
        ) : (
          <p className="text-[var(--muted)]">Project not found.</p>
        )}
      </div>
    </>
  )
}
