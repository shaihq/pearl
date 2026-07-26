import { useEffect, useRef, useState } from 'react'
import { CanvasProvider } from '../../context/CanvasContext'
import { BuilderPanelProvider } from '../../context/BuilderPanelContext'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import LeftNav from './LeftNav'
import RightPanelSheet from './RightPanelSheet'
import SectionEditorPanel from './SectionEditorPanel'
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

// Same pixel-anchoring for the themes panel — a plain percentage minSize
// shrinks in lockstep with the window, squeezing the swatch grid/tab labels
// down to nothing on a narrow viewport instead of holding a legible width.
const THEMES_MIN_PX = 260
const THEMES_MAX_PX = 420

// Below this width the themes UI becomes a bottom sheet instead of a side
// panel — Tailwind's `lg` breakpoint, the conventional tablet/desktop line.
// iPad-width viewports (>= md, below this) get the sheet at 2 columns; only
// true desktop widths (this and up) get the side panel. Matched against
// ThemesPanel's own `md:grid-cols-2 lg:grid-cols-1` so the two stay in sync.
const COMPACT_BREAKPOINT_PX = 1024

const PANEL_ANIMATION_MS = 300
// Tailwind's build-time scanner needs the literal class text, so this can't
// be assembled from PANEL_ANIMATION_MS via string interpolation.
const PANEL_TRANSITION_CLASS = 'transition-[flex-grow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]'

export default function BuilderShell({ children }) {
  const canvasRef = useRef(null)
  const groupRef = useRef(null)
  const mainGroupRef = useRef(null)
  const leftPanelRef = useRef(null)
  const themesPanelRef = useRef(null)
  const animationTimeoutRef = useRef(null)

  // The group spans the full viewport width, so window.innerWidth is exact
  // on first paint — the ResizeObserver below just keeps it correct as the
  // window itself is resized afterward.
  const [groupWidth, setGroupWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1200))
  // The canvas+themes group only spans the "main" panel (outer group minus
  // the left rail), so its own pixel-to-percent conversion needs the main
  // panel's width, not the full window width.
  const [mainWidth, setMainWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1200))
  const [leftExpanded, setLeftExpanded] = useState(false)
  // Whether the right-hand panel is open, and separately what it's showing —
  // Themes or a given section's editor. Kept apart from panelOpen so
  // switching between the two (panel already open) is an instant content
  // swap instead of a close/reopen animation.
  const [panelOpen, setPanelOpenState] = useState(false)
  const [panelView, setPanelView] = useState({ type: 'themes' })
  const [isPanelAnimating, setIsPanelAnimating] = useState(false)
  const [isCompact, setIsCompact] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < COMPACT_BREAKPOINT_PX : false
  )

  useEffect(() => {
    const el = groupRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setGroupWidth(entry.contentRect.width))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const el = mainGroupRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setMainWidth(entry.contentRect.width))
    observer.observe(el)
    return () => observer.disconnect()
    // mainGroupRef only mounts in the non-compact branch, so this needs to
    // re-attach whenever isCompact flips back to false.
  }, [isCompact])

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${COMPACT_BREAKPOINT_PX - 1}px)`)
    const handleChange = (e) => setIsCompact(e.matches)
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  // Crossing back over the breakpoint while the sheet was open swaps in a
  // fresh (collapsed-by-default) side panel — re-expand it so the panel
  // stays open across the transition instead of silently vanishing.
  useEffect(() => {
    if (isCompact || !panelOpen) return
    themesPanelRef.current?.expand()
  }, [isCompact, panelOpen])

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
    // The canvas div is two different DOM nodes depending on isCompact (full-
    // width vs. split with the themes rail) — reattach when that swaps.
  }, [isCompact])

  function pxToPercent(px) {
    return groupWidth > 0 ? (px / groupWidth) * 100 : 0
  }

  function pxToPercentMain(px) {
    return mainWidth > 0 ? (px / mainWidth) * 100 : 0
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

  function setPanelOpen(open) {
    // Compact mode renders the panel as a Sheet, not a resizable panel —
    // there's no imperative panel handle to drive, just the open state.
    if (isCompact) {
      setPanelOpenState(open)
      return
    }
    const panel = themesPanelRef.current
    if (!panel) return
    animatePanel()
    if (open) panel.expand()
    else panel.collapse()
  }

  function openThemes() {
    setPanelView({ type: 'themes' })
    setPanelOpen(true)
  }

  function openSection(sectionKey, label) {
    setPanelView({ type: 'section', sectionKey, label })
    setPanelOpen(true)
  }

  useEffect(() => {
    if (!panelOpen) return
    function handleKeyDown(e) {
      if (e.key === 'Escape') setPanelOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [panelOpen])

  const isThemesView = panelView.type === 'themes'
  const panelTitle = isThemesView ? 'Themes' : `Edit ${panelView.label}`

  function renderPanelContent(hideHeader) {
    if (isThemesView) return <ThemesPanel hideHeader={hideHeader} onClose={() => setPanelOpen(false)} />
    return (
      <SectionEditorPanel
        hideHeader={hideHeader}
        sectionKey={panelView.sectionKey}
        label={panelView.label}
        onClose={() => setPanelOpen(false)}
      />
    )
  }

  const panelTransitionClass = isPanelAnimating ? PANEL_TRANSITION_CLASS : ''

  return (
    <BuilderPanelProvider openSection={openSection}>
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
            <TopNav
              themesOpen={panelOpen && isThemesView}
              onThemesClick={() => {
                if (panelOpen && isThemesView) setPanelOpen(false)
                else openThemes()
              }}
            />

            {isCompact ? (
              // Below the compact breakpoint there's no room for a side
              // rail, so the canvas takes the full width and the panel moves
              // into the bottom sheet mounted below instead.
              <div className="relative flex-1 overflow-hidden contain-layout bg-[var(--background)]">
                <div ref={canvasRef} className="h-full w-full overflow-y-auto overflow-x-hidden">
                  <CanvasProvider containerRef={canvasRef}>{children}</CanvasProvider>
                </div>
              </div>
            ) : (
              <div ref={mainGroupRef} className="flex-1 overflow-hidden">
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
                    className={`bg-white/10 data-[resize-handle-state=hover]:bg-white/20 data-[resize-handle-state=drag]:bg-white/20 ${panelOpen ? '' : 'hidden'}`}
                  />

                  <ResizablePanel
                    ref={themesPanelRef}
                    id="themes"
                    order={2}
                    collapsible
                    collapsedSize={0}
                    defaultSize={0}
                    minSize={pxToPercentMain(THEMES_MIN_PX)}
                    maxSize={pxToPercentMain(THEMES_MAX_PX)}
                    onCollapse={() => setPanelOpenState(false)}
                    onExpand={() => setPanelOpenState(true)}
                    className={panelTransitionClass}
                  >
                    {renderPanelContent(false)}
                  </ResizablePanel>
                </ResizablePanelGroup>
              </div>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>

        {isCompact && (
          <RightPanelSheet open={panelOpen} onClose={() => setPanelOpen(false)} title={panelTitle}>
            {renderPanelContent(true)}
          </RightPanelSheet>
        )}
      </div>
    </BuilderPanelProvider>
  )
}
