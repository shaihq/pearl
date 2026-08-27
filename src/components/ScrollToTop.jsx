import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// React Router doesn't reset scroll on navigation the way a real page load
// does — without this, going from partway down the landing page to
// /privacy-policy or /blog renders that new page still scrolled to wherever
// you left off. Runs on every pathname change (not full location, so a
// same-page query/hash change doesn't also yank scroll back to 0).
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
