export const EASE = [0.16, 1, 0.3, 1]

export const viewport = { once: true, amount: 0.3 }

export const revealContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

export const revealRL = {
  hidden: { x: 48, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.7, ease: EASE } },
}

export const quickContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

export const revealBT = {
  hidden: { y: 28, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.35, ease: EASE } },
}
