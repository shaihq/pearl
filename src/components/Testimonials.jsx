import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE, revealContainer, revealRL, viewport } from '../motion'

const testimonials = [
  {
    quote:
      "Working with Matt completely transformed our brand identity. The attention to detail and creative vision exceeded everything we imagined.",
    name: 'Alex Rivera',
    role: 'Creative Director',
    company: 'Dazzle Inc.',
  },
  {
    quote:
      "Our appointment booking flow finally feels effortless. Patient engagement is up, and our support tickets have dropped significantly.",
    name: 'Priya Nandan',
    role: 'Head of Product',
    company: 'CareSunset',
  },
  {
    quote:
      "The infographic work made a genuinely complex product feel simple to understand. Our sales team uses it in every pitch now.",
    name: 'Jordan Lee',
    role: 'VP of Design',
    company: 'Tech Bank Client',
  },
  {
    quote:
      "Matt didn't just design a plugin, he rethought the entire onboarding experience. Our activation rate nearly doubled.",
    name: 'Sam Okafor',
    role: 'Founder',
    company: 'Notex',
  },
]

const DURATION = 6

function Avatar({ name }) {
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')

  return (
    <span className="w-9 h-9 shrink-0 rounded-full bg-neutral-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-semibold text-ink dark:text-white">
      {initials}
    </span>
  )
}

export default function Testimonials() {
  const [active, setActive] = useState(0)

  const goToNext = () => setActive((i) => (i + 1) % testimonials.length)

  return (
    <motion.section
      className="py-14 border-t border-neutral-200 dark:border-zinc-800"
      variants={revealContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      <div
        className="grid gap-x-16 gap-y-8 [grid-template-areas:'label'_'quote'_'counter'_'list'] sm:[grid-template-areas:'label_counter'_'quote_list'] sm:grid-cols-[1fr_360px]"
      >
        <motion.p
          variants={revealRL}
          className="[grid-area:label] text-xs text-neutral-500 dark:text-zinc-400 pb-3 border-b border-neutral-200 dark:border-zinc-800"
        >
          Testimonials
        </motion.p>

        <motion.div
          variants={revealRL}
          className="[grid-area:counter] flex items-end sm:items-start justify-start sm:justify-end pb-3 border-b border-neutral-200 dark:border-zinc-800"
        >
          <span className="text-xs text-neutral-400 dark:text-zinc-500">
            {active + 1} / {testimonials.length}
          </span>
        </motion.div>

        <motion.div variants={revealRL} className="[grid-area:quote] pt-2">
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="text-2xl sm:text-3xl font-medium leading-snug tracking-tight text-ink dark:text-white"
            >
              "{testimonials[active].quote}"
            </motion.p>
          </AnimatePresence>
        </motion.div>

        <motion.div variants={revealRL} className="[grid-area:list] flex flex-col">
          {testimonials.map((item, index) => {
            const isActive = index === active

            return (
              <div key={item.name} className="relative">
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  className="w-full text-left py-4 flex items-center justify-between gap-3"
                >
                  <div>
                    <p
                      className={`text-sm font-medium transition-colors ${
                        isActive ? 'text-ink dark:text-white' : 'text-neutral-400 dark:text-zinc-600'
                      }`}
                    >
                      {item.name}
                    </p>
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <p className="text-xs text-neutral-500 dark:text-zinc-400 mt-1">{item.role}</p>
                          <p className="text-xs text-neutral-500 dark:text-zinc-400">{item.company}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3, ease: EASE }}
                      >
                        <Avatar name={item.name} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>

                <div className="h-px bg-neutral-200 dark:bg-zinc-800" />

                {isActive && (
                  <motion.div
                    key={active}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: DURATION, ease: 'linear' }}
                    onAnimationComplete={goToNext}
                    className="absolute bottom-0 left-0 h-px bg-ink dark:bg-white"
                  />
                )}
              </div>
            )
          })}
        </motion.div>
      </div>
    </motion.section>
  )
}
