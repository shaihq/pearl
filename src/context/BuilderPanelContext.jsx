import { createContext, useContext } from 'react'

const BuilderPanelContext = createContext(null)

// Lets anything deep in the template tree (EditableSection, wherever it's
// used) open the builder's right-hand panel without threading callbacks
// through every intermediate component — BuilderShell is the only provider.
export function BuilderPanelProvider({ openSection, children }) {
  return <BuilderPanelContext.Provider value={{ openSection }}>{children}</BuilderPanelContext.Provider>
}

export function useBuilderPanel() {
  const ctx = useContext(BuilderPanelContext)
  if (!ctx) throw new Error('useBuilderPanel must be used within a BuilderPanelProvider')
  return ctx
}
