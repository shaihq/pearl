import { useEffect } from 'react'

// The marketing/content pages (landing, blog, ...) are fixed light-palette
// surfaces, not themeable canvas pages — they should always read as light
// regardless of whatever theme the builder happens to be in.
//
// ThemeProvider is an ancestor of every page, and React fires effects
// child-first — so ThemeProvider's own effect runs AFTER this one on mount
// and unconditionally reasserts its stored theme, silently flipping
// data-theme back to dark right after this sets it to light. A
// MutationObserver re-corrects it for as long as the calling page stays
// mounted, regardless of effect ordering. Guarded with equality checks so
// re-asserting the same value doesn't retrigger itself.
export default function useForceLightTheme() {
  useEffect(() => {
    const html = document.documentElement
    const prevTheme = html.getAttribute('data-theme')
    const prevTemplate = html.getAttribute('data-template')
    const prevColorScheme = html.style.colorScheme

    function forceLight() {
      if (html.getAttribute('data-theme') !== 'light') html.setAttribute('data-theme', 'light')
      if (html.hasAttribute('data-template')) html.removeAttribute('data-template')
      if (html.style.colorScheme !== 'light') html.style.colorScheme = 'light'
    }

    forceLight()
    const observer = new MutationObserver(forceLight)
    observer.observe(html, { attributes: true, attributeFilter: ['data-theme', 'data-template', 'style'] })

    return () => {
      observer.disconnect()
      if (prevTheme) html.setAttribute('data-theme', prevTheme)
      else html.removeAttribute('data-theme')
      if (prevTemplate) html.setAttribute('data-template', prevTemplate)
      else html.removeAttribute('data-template')
      html.style.colorScheme = prevColorScheme
    }
  }, [])
}
