import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { revealContainer, revealRL, viewport } from '../motion'

export default function AboutMe() {
  const photoRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: photoRef,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])

  return (
    <>
      <motion.section
        className="py-14 flex flex-col sm:flex-row gap-8 sm:gap-16 border-t border-[var(--border)]"
        variants={revealContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <motion.h2
          variants={revealRL}
          className="text-2xl sm:text-3xl font-medium tracking-tight text-[var(--primary)] sm:w-56 shrink-0"
        >
          About me
        </motion.h2>

        <div className="flex-1 flex flex-col gap-5 max-w-2xl">
          <motion.p
            variants={revealRL}
            className="text-lg sm:text-xl leading-relaxed text-[var(--primary)]"
          >
            I'm a dedicated product designer with a passion for creating fun and intuitive
            experiences. Over the last 7 years I've worked across many industries — from mobile
            applications to web products — translating ideas into effective, highly-crafted
            solutions.
          </motion.p>

          <motion.p
            variants={revealRL}
            className="text-base leading-relaxed text-[var(--muted)]"
          >
            My approach is grounded in research and collaboration. I believe the best results come
            from understanding the end-user and working closely with the team, with clear
            communication and an open mind.
          </motion.p>

          <motion.p
            variants={revealRL}
            className="text-base leading-relaxed text-[var(--muted)]"
          >
            Outside of work, I enjoy staying up to date with the latest design trends and tools —
            I'm always learning, which helps me bring fresh ideas to every project.
          </motion.p>
        </div>
      </motion.section>

      <div
        ref={photoRef}
        className="relative left-1/2 w-screen -translate-x-1/2 h-[32vh] sm:h-[42vh] overflow-hidden mb-14"
      >
        <motion.div style={{ y }} className="absolute inset-x-0 -top-[20%] h-[140%]">
          <img
            src="/workme.webp"
            alt="Matt at his desk"
            className="w-full h-full object-cover"
            style={{ objectPosition: '50% 35%' }}
          />
        </motion.div>
      </div>
    </>
  )
}
