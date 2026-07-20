import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE, revealContainer, revealRL, viewport } from '../motion'

const experiences = [
  {
    company: 'Google',
    role: 'Senior Product Designer',
    period: '2022 — Present',
    description:
      "Leading design for core search experiences, partnering closely with engineering and research to ship features used by billions of people daily.",
    tags: ['Design Systems', 'Research', 'Search'],
  },
  {
    company: 'Meta',
    role: 'Product Designer',
    period: '2019 — 2022',
    description:
      'Designed cross-platform social features for Instagram, focusing on creator tools and community engagement.',
    tags: ['Mobile', 'Social', 'Prototyping'],
  },
  {
    company: 'Airbnb',
    role: 'UX Designer',
    period: '2017 — 2019',
    description:
      'Shaped end-to-end booking flows and trust & safety experiences, running dozens of user research studies along the way.',
    tags: ['UX Research', 'Booking Flows', 'Trust & Safety'],
  },
  {
    company: 'Apple',
    role: 'Design Intern',
    period: '2016 — 2017',
    description:
      'Contributed to visual design explorations for iOS system apps as part of the Human Interface team.',
    tags: ['iOS', 'Visual Design', 'HIG'],
  },
]

function CompanyBadge({ name }) {
  return (
    <span className="w-9 h-9 shrink-0 rounded-full bg-neutral-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-semibold text-ink dark:text-white">
      {name.slice(0, 2)}
    </span>
  )
}

function ExperienceRow({ item, isLast }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      variants={revealRL}
      className={isLast ? '' : 'border-b border-neutral-200 dark:border-zinc-800'}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full text-left py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6"
      >
        <div className="flex items-center gap-3 sm:w-56 shrink-0">
          <CompanyBadge name={item.company} />
          <span className="text-sm font-medium text-ink dark:text-white">{item.company}</span>
        </div>

        <div className="flex-1 flex items-center justify-between gap-4">
          <div>
            <p className="text-xl sm:text-2xl font-medium tracking-tight text-ink dark:text-white">
              {item.role}
            </p>
            <p className="sm:hidden text-sm text-neutral-500 dark:text-zinc-400 mt-1">{item.period}</p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <span className="hidden sm:inline text-sm text-neutral-500 dark:text-zinc-400">
              {item.period}
            </span>
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="text-neutral-400 dark:text-zinc-600 text-lg"
            >
              ↓
            </motion.span>
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="tray"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pb-6 sm:pl-56 max-w-2xl">
              <p className="text-sm sm:text-base leading-relaxed text-neutral-500 dark:text-zinc-400">
                {item.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function WorkExperience() {
  return (
    <motion.section
      className="pb-14"
      variants={revealContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      <motion.p variants={revealRL} className="text-xs text-neutral-500 dark:text-zinc-400 mb-2">
        Experience
      </motion.p>
      <div className="border-t border-neutral-200 dark:border-zinc-800">
        {experiences.map((item, index) => (
          <ExperienceRow
            key={item.company}
            item={item}
            isLast={index === experiences.length - 1}
          />
        ))}
      </div>
    </motion.section>
  )
}
