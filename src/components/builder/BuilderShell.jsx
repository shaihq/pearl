import { useEffect, useRef, useState } from 'react'
import { CanvasProvider } from '../../context/CanvasContext'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import LeftNav from './LeftNav'
import ThemesPanel from './ThemesPanel'
import TopNav from './TopNav'

// react-resizable-panels only understands percentages, but the left rail
// needs to stay a fixed 56px when collapsed regardless of viewport width —
// so these are pixel targets, converted to percentages of the measured
// group width below (and re-converted on resize).
const LEFT_COLLAPSED_PX = 56
const LEFT_EXPANDED_PX = 220
const LEFT_MIN_PX = 180
const LEFT_MAX_PX = 320

const PANEL_ANIMATION_MS = 300
// Tailwind's build-time scanner needs the literal class text, so this can't
// be assembled from PANEL_ANIMATION_MS via string interpolation.
const PANEL_TRANSITION_CLASS = 'transition-[flex-grow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]'

export default function BuilderShell({ children }) {
  const canvasRef = useRef(null)
  const groupRef = useRef(null)
  const leftPanelRef = useRef(null)
  const themesPanelRef = useRef(null)
  const animationTimeoutRef = useRef(null)

  // The group spans the full viewport width, so window.innerWidth is exact
  // on first paint — the ResizeObserver below just keeps it correct as the
  // window itself is resized afterward.
  const [groupWidth, setGroupWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1200))
  const [leftExpanded, setLeftExpanded] = useState(false)
  const [themesOpen, setThemesOpen] = useState(false)
  const [isPanelAnimating, setIsPanelAnimating] = useState(false)

  useEffect(() => {
    const el = groupRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setGroupWidth(entry.contentRect.width))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return

    // Chromium doesn't route a wheel event to a scrollable ancestor when the
    // hit-tested target sits inside a `position: fixed` element whose
    // containing block is that same ancestor (rather than the true
    // viewport) — the event still bubbles here in JS, native scroll just
    // never happens. Since almost everything in the canvas (Navbar, Footer,
    // SmoothScroll's content, NavDrawer) is fixed for masking purposes,
    // forward the delta to scrollTop ourselves.
    function handleWheel(e) {
      el.scrollTop += e.deltaY
      e.preventDefault()
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [])

  function pxToPercent(px) {
    return groupWidth > 0 ? (px / groupWidth) * 100 : 0
  }

  function animatePanel(setAnimating = true) {
    if (!setAnimating) return
    setIsPanelAnimating(true)
    clearTimeout(animationTimeoutRef.current)
    animationTimeoutRef.current = setTimeout(() => setIsPanelAnimating(false), PANEL_ANIMATION_MS + 50)
  }

  function setLeftNavOpen(open) {
    const panel = leftPanelRef.current
    if (!panel) return
    animatePanel()
    if (open) panel.expand(pxToPercent(LEFT_EXPANDED_PX))
    else panel.collapse()
  }

  function setThemesPanelOpen(open) {
    const panel = themesPanelRef.current
    if (!panel) return
    animatePanel()
    if (open) panel.expand()
    else panel.collapse()
  }

  useEffect(() => {
    if (!themesOpen) return
    function handleKeyDown(e) {
      if (e.key === 'Escape') setThemesPanelOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [themesOpen])

  const panelTransitionClass = isPanelAnimating ? PANEL_TRANSITION_CLASS : ''

  return (
    <div ref={groupRef} className="h-screen w-screen bg-[#18181b]">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          ref={leftPanelRef}
          id="leftnav"
          order={1}
          collapsible
          collapsedSize={pxToPercent(LEFT_COLLAPSED_PX)}
          defaultSize={pxToPercent(LEFT_COLLAPSED_PX)}
          minSize={pxToPercent(LEFT_MIN_PX)}
          maxSize={pxToPercent(LEFT_MAX_PX)}
          onCollapse={() => setLeftExpanded(false)}
          onExpand={() => setLeftExpanded(true)}
          className={`hidden md:block ${panelTransitionClass}`}
        >
          <LeftNav expanded={leftExpanded} onToggle={() => setLeftNavOpen(!leftExpanded)} />
        </ResizablePanel>

        <ResizableHandle className="hidden md:flex bg-white/10 data-[resize-handle-state=hover]:bg-white/20 data-[resize-handle-state=drag]:bg-white/20" />

        <ResizablePanel id="main" order={2} className="flex flex-col">
          <TopNav themesOpen={themesOpen} onThemesClick={() => setThemesPanelOpen(!themesOpen)} />

          <div className="flex-1 overflow-hidden">
            <ResizablePanelGroup direction="horizontal">
              {/*
                Two nested divs inside this panel on purpose: the outer one is
                the non-scrolling containing block for `fixed` descendants
                (masks them to the canvas instead of the real viewport). The
                inner one is what actually scrolls. Fixed elements must NOT
                move when the thing that establishes their containing block
                also scrolls — mixing both roles into one div drags fixed
                content along with native scroll on top of any JS
                scroll-linked transform, double-moving it.
              */}
              <ResizablePanel
                id="canvas"
                order={1}
                defaultSize={100}
                minSize={30}
                className={`relative overflow-hidden contain-layout bg-[var(--background)] ${panelTransitionClass}`}
              >
                <div ref={canvasRef} className="h-full w-full overflow-y-auto overflow-x-hidden">
                  <CanvasProvider containerRef={canvasRef}>{children}</CanvasProvider>
                </div>
              </ResizablePanel>

              <ResizableHandle
                className={`bg-white/10 data-[resize-handle-state=hover]:bg-white/20 data-[resize-handle-state=drag]:bg-white/20 ${themesOpen ? '' : 'hidden'}`}
              />

              <ResizablePanel
                ref={themesPanelRef}
                id="themes"
                order={2}
                collapsible
                collapsedSize={0}
                defaultSize={0}
                minSize={18}
                maxSize={36}
                onCollapse={() => setThemesOpen(false)}
                onExpand={() => setThemesOpen(true)}
                className={panelTransitionClass}
              >
                <ThemesPanel onClose={() => setThemesPanelOpen(false)} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
