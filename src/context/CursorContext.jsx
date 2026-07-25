import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useCanvas } from './CanvasContext'

const CursorContext = createContext(null)

export function CursorProvider({ children }) {
  const { containerRef } = useCanvas()
  const wrapRef = useRef(null)
  const [visible, setVisible] = useState(false)

  const moveTo = useCallback((x, y) => {
    if (wrapRef.current) {
      wrapRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    function handleMove(e) {
      const rect = el.getBoundingClientRect()
      moveTo(e.clientX - rect.left, e.clientY - rect.top)
    }
    el.addEventListener('mousemove', handleMove)
    return () => el.removeEventListener('mousemove', handleMove)
  }, [moveTo, containerRef])

  const show = useCallback(
    (e) => {
      if (e) moveTo(e.clientX, e.clientY)
      setVisible(true)
    },
    [moveTo]
  )

  const hide = useCallback(() => setVisible(false), [])

  return (
    <CursorContext.Provider value={{ show, hide, visible }}>
      {children}
      <div ref={wrapRef} className="pointer-events-none fixed top-0 left-0 z-[9999]">
        <div className={`view-cursor${visible ? ' is-visible' : ''}`}>View</div>
      </div>
    </CursorContext.Provider>
  )
}

export function useCursor() {
  const ctx = useContext(CursorContext)
  if (!ctx) throw new Error('useCursor must be used within a CursorProvider')
  return ctx
}
