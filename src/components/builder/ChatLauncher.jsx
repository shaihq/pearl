import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Send, X } from 'lucide-react'
import { EASE } from '../../motion'
import { cn } from '@/lib/utils'

// A small pool of human, unhyped acknowledgments — rotated rather than
// random-repeated so two messages in a row never coincidentally match.
const CANNED_REPLIES = [
  "Thanks for reaching out — I'll take a look and reply here shortly.",
  'Got it, noted! Give me a moment.',
  "On it — I'll follow up in a bit.",
  'Appreciate the detail — looking into this now.',
]

const GREETING = {
  id: 'greeting',
  from: 'them',
  text: "Hey! 👋 Stuck on something, or just exploring? Happy to help either way.",
}

function ChatBubble({ from, text }) {
  const isThem = from === 'them'
  return (
    <div className={cn('flex', isThem ? 'justify-start' : 'justify-end')}>
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed',
          isThem ? 'rounded-bl-sm bg-white/8 text-white/85' : 'rounded-br-sm bg-[#FF553E] text-white',
        )}
      >
        {text}
      </div>
    </div>
  )
}

// Three dots with staggered bounce delays — Tailwind's built-in
// animate-bounce, no custom keyframes needed. The universal "someone's
// actually typing" cue, kept inside a bubble shell so it reads as part of
// the same conversation rather than a loading spinner bolted on.
function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white/8 px-3.5 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 animate-bounce rounded-full bg-white/50"
            style={{ animationDelay: `${i * 0.12}s`, animationDuration: '0.9s' }}
          />
        ))}
      </div>
    </div>
  )
}

// The floating launcher for the builder's support chat — a person, not a
// sparkle/orb: a real photo avatar rather than AI iconography/copy reads
// immediately as "a human is here." Opens into a small, real (if scripted)
// conversation — a static launcher that does nothing on click would read
// worse than not having one.
export default function ChatLauncher() {
  const [open, setOpen] = useState(false)
  const [seen, setSeen] = useState(false)
  const [messages, setMessages] = useState([GREETING])
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const listRef = useRef(null)
  const replyIndexRef = useRef(0)
  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => () => clearTimeout(typingTimeoutRef.current), [])

  function toggleOpen() {
    setOpen((wasOpen) => !wasOpen)
    setSeen(true)
  }

  function handleSend(e) {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), from: 'me', text }])
    setDraft('')
    setTyping(true)
    clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(
      () => {
        const reply = CANNED_REPLIES[replyIndexRef.current % CANNED_REPLIES.length]
        replyIndexRef.current += 1
        setTyping(false)
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), from: 'them', text: reply }])
      },
      1100 + Math.random() * 500,
    )
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.22, ease: EASE }}
            style={{ transformOrigin: 'bottom right' }}
            role="dialog"
            aria-label="Chat with Pearl support"
            className="fixed bottom-24 right-5 z-40 flex h-[28rem] max-h-[calc(100vh-8rem)] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#18181b] text-white shadow-[0_24px_60px_-12px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#FF6A52] to-[#D6381F] text-sm font-semibold shadow-[inset_0_1px_1px_rgba(255,138,110,0.55),inset_0_-1px_1.5px_rgba(153,32,15,0.55)]">
                <img src="/shailinkd.png" alt="" draggable={false} className="size-full object-cover" />
                <span className="absolute -top-0.5 -left-0.5 size-2.5 rounded-full bg-emerald-400" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">Sam · Pearl Support</p>
                <p className="truncate text-xs text-white/50">Usually replies in a few minutes</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="shrink-0 rounded-md p-1 text-white/40 hover:bg-white/10 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m) => (
                <ChatBubble key={m.id} from={m.from} text={m.text} />
              ))}
              {typing && <TypingIndicator />}
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-white/10 p-3">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type a message…"
                aria-label="Message"
                className="h-9 flex-1 rounded-full border border-white/10 bg-white/5 px-3.5 text-sm text-white outline-none placeholder:text-white/30 focus-visible:border-white/25"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                aria-label="Send message"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#FF553E] text-white transition-colors hover:bg-[#e6472f] disabled:opacity-40"
              >
                <Send className="size-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={toggleOpen}
        initial={{ opacity: 0, scale: 0.6, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE, delay: 0.6 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        aria-label={open ? 'Close chat' : 'Open chat with Pearl support'}
        className="fixed bottom-5 right-5 z-40 flex size-12 items-center justify-center rounded-full shadow-[0_10px_28px_-8px_rgba(0,0,0,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#18181b]"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
              transition={{ duration: 0.18, ease: EASE }}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-br from-[#FF6A52] to-[#D6381F]"
            >
              <X className="size-4 text-white" />
            </motion.span>
          ) : (
            <motion.span
              key="avatar"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.18, ease: EASE }}
              className="absolute inset-0 overflow-hidden rounded-full"
            >
              <img src="/shailinkd.png" alt="" draggable={false} className="size-full object-cover" />
            </motion.span>
          )}
        </AnimatePresence>
        {/* A light rim top-left / dark rim bottom-right rather than a flat
            ring — the same bevel trick as the "Claim now" button, just
            dialed way back (thinner, lower-opacity) since this is a small
            persistent chrome element, not a hero CTA. Tinted from the same
            gradient the close-state icon uses (light stop / dark stop)
            rather than plain white/black, so the rim itself reads as
            brand-colored instead of a generic neutral edge. */}
        <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_1px_1px_rgba(255,138,110,0.55),inset_0_-1px_1px_rgba(153,32,15,0.55)]" />

        {!open && <span className="absolute top-0 left-0 size-2 rounded-full bg-emerald-400" />}

        <AnimatePresence>
          {!seen && (
            <motion.span
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.4, transition: { duration: 0.15, ease: EASE } }}
              transition={{ duration: 0.3, ease: EASE, delay: 1.1 }}
              className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-[#18181b]"
            >
              1
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  )
}
