import { createContext, useContext } from 'react'

const CanvasContext = createContext(null)

export function CanvasProvider({ containerRef, children }) {
  return <CanvasContext.Provider value={{ containerRef }}>{children}</CanvasContext.Provider>
}

export function useCanvas() {
  const ctx = useContext(CanvasContext)
  if (!ctx) throw new Error('useCanvas must be used within a CanvasProvider')
  return ctx
}
