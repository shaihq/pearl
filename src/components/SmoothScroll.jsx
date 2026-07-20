import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

export default function SmoothScroll({ children, extraScroll = 0 }) {
  const contentRef = useRef(null)
  const [contentHeight, setContentHeight] = useState(0)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return

    const measure = () => setContentHeight(el.getBoundingClientRect().height)
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const { scrollY } = useScroll()
  const smoothY = useSpring(scrollY, { damping: 28, stiffness: 220, mass: 0.4 })
  const y = useTransform(smoothY, (value) => -value)

  return (
    <>
      <motion.div
        ref={contentRef}
        style={{ y }}
        className="fixed inset-x-0 top-0 z-10 bg-[var(--background)] transition-colors duration-500 will-change-transform"
      >
        {children}
      </motion.div>
      <div style={{ height: contentHeight + extraScroll }} aria-hidden="true" />
    </>
  )
}
