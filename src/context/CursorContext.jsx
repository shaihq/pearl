import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

const CursorContext = createContext(null)

export function CursorProvider({ children }) {
  const wrapRef = useRef(null)
  const [visible, setVisible] = useState(false)

  const moveTo = useCallback((x, y) => {
    if (wrapRef.current) {
      wrapRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }
  }, [])

  useEffect(() => {
    function handleMove(e) {
      moveTo(e.clientX, e.clientY)
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [moveTo])

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
