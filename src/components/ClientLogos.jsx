import { motion } from 'framer-motion'
import { revealContainer, revealRL, viewport } from '../motion'

function BowtieIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M2 4l9 8-9 8V4z" />
      <path d="M22 4l-9 8 9 8V4z" />
    </svg>
  )
}

function ButterflyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 5 C 8 2, 2 4, 3 10 C 3.5 14, 8 14, 12 11" />
      <path d="M12 5 C 16 2, 22 4, 21 10 C 20.5 14, 16 14, 12 11" />
      <path d="M12 11 L12 20" />
    </svg>
  )
}

function RingIcon() {
  return <span className="w-5 h-5 rounded-full border-2 border-current inline-block" />
}

const rowOne = [
  { type: 'text', label: 'Ziggo' },
  { type: 'text', label: '✳' },
  { type: 'icon', Icon: BowtieIcon },
  { type: 'text', label: 'dazzle' },
  { type: 'icon', Icon: ButterflyIcon },
]

const rowTwo = [
  { type: 'icon', Icon: RingIcon },
  { type: 'text', label: 'copay' },
  { type: 'text', label: 'e.xodus' },
  { type: 'icon', Icon: RingIcon },
  { type: 'text', label: 'ket:ko' },
]

function LogoRow({ items }) {
  return (
    <motion.div
      className="flex items-center justify-between"
      variants={revealContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {items.map((item, i) =>
        item.type === 'text' ? (
          <motion.span
            key={i}
            variants={revealRL}
            className="text-neutral-400 dark:text-zinc-600 font-medium tracking-tight text-base"
          >
            {item.label}
          </motion.span>
        ) : (
          <motion.span key={i} variants={revealRL} className="text-neutral-400 dark:text-zinc-600">
            <item.Icon />
          </motion.span>
        )
      )}
    </motion.div>
  )
}

export default function ClientLogos() {
  return (
    <section className="py-16 flex flex-col gap-10">
      <LogoRow items={rowOne} />
      <LogoRow items={rowTwo} />
    </section>
  )
}
