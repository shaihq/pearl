import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { x: 40, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.55, ease: EASE } },
}

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const socialLinks = ['X / Twitter', 'Instagram', 'Threads', 'LinkedIn']

export default function NavDrawer({ open, onClose }) {
  useEffect(() => {
    if (!open) return

    document.body.style.overflow = 'hidden'

    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            key="backdrop"
            onClick={onClose}
            aria-label="Close menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="hidden sm:block fixed inset-0 z-[55] bg-black/50"
          />

          <motion.div
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.65, ease: EASE }}
            className="fixed inset-y-0 right-0 z-[60] w-full sm:w-[420px] bg-ink dark:bg-zinc-900 text-white overflow-y-auto shadow-2xl"
          >
            <div className="h-full relative px-6 sm:px-8 pt-28 pb-16">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="absolute top-6 right-6 sm:right-8 w-10 h-10 rounded-full bg-white text-ink flex items-center justify-center hover:bg-neutral-200 transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>

              <motion.div variants={listVariants} initial="hidden" animate="visible">
                <nav className="flex flex-col gap-1">
                  {navLinks.map(({ label, href }) => (
                    <motion.a
                      key={label}
                      href={href}
                      variants={itemVariants}
                      onClick={onClose}
                      className="text-4xl sm:text-5xl font-medium tracking-tight hover:text-neutral-400 transition-colors"
                    >
                      {label}
                    </motion.a>
                  ))}
                </nav>

                <div className="mt-14 flex flex-col gap-1">
                  <motion.p variants={itemVariants} className="text-sm text-neutral-500 mb-1">
                    Contact
                  </motion.p>
                  <motion.a
                    variants={itemVariants}
                    href="mailto:hi@pearlstudio.com"
                    onClick={onClose}
                    className="text-lg hover:text-neutral-400 transition-colors"
                  >
                    hi@pearlstudio.com
                  </motion.a>
                  <motion.a
                    variants={itemVariants}
                    href="tel:+15550123456"
                    onClick={onClose}
                    className="text-lg hover:text-neutral-400 transition-colors"
                  >
                    +1 (555) 012-3456
                  </motion.a>
                </div>

                <div className="mt-10 flex flex-col gap-1">
                  <motion.p variants={itemVariants} className="text-sm text-neutral-500 mb-1">
                    Socials
                  </motion.p>
                  {socialLinks.map((label) => (
                    <motion.a
                      key={label}
                      variants={itemVariants}
                      href="#"
                      onClick={onClose}
                      className="text-lg hover:text-neutral-400 transition-colors"
                    >
                      {label}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
