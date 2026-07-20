import { useEffect, useState } from 'react'

export function useTypewriter(words, { typingSpeed = 90, deletingSpeed = 50, pause = 1600 } = {}) {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[index % words.length]

    if (!deleting && subIndex === current.length) {
      const timeout = setTimeout(() => setDeleting(true), pause)
      return () => clearTimeout(timeout)
    }

    if (deleting && subIndex === 0) {
      setDeleting(false)
      setIndex((i) => (i + 1) % words.length)
      return
    }

    const timeout = setTimeout(
      () => setSubIndex((s) => s + (deleting ? -1 : 1)),
      deleting ? deletingSpeed : typingSpeed
    )
    return () => clearTimeout(timeout)
  }, [subIndex, deleting, index, words, typingSpeed, deletingSpeed, pause])

  return words[index % words.length].substring(0, subIndex)
}
