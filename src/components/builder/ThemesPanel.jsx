import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Eye, GripVertical, LayoutTemplate, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { THEME_ORDER, useTheme } from '../../context/ThemeContext'

const PANEL_TABS = [
  { value: 'templates', label: 'Templates' },
  { value: 'colors', label: 'Colors' },
  { value: 'sections', label: 'Sections' },
]

// Swatches mirror the literal hex values in index.css for each theme, so the
// picker previews the real palette without needing the global theme applied.
const THEME_SWATCHES = {
  light: { label: 'Light', background: '#ffffff', card: '#e4e5ea', primary: '#0a0a0a', accent: '#6366f1' },
  dark: { label: 'Dark', background: '#09090b', card: '#18181b', primary: '#ffffff', accent: '#6366f1' },
  brown: { label: 'Brown', background: '#1c1917', card: '#292524', primary: '#f5f5f4', accent: '#4ade80' },
  plant: { label: 'Plant', background: '#d9f99d', card: '#ecfccb', primary: '#000000', accent: '#ea580c' },
  blossom: { label: 'Blossom', background: '#fae8ff', card: '#fdf4ff', primary: '#4a044e', accent: '#d946ef' },
}

const MOCK_TEMPLATES = ['Template 1', 'Template 2', 'Template 3', 'Template 4']

const MOCK_SECTIONS = ['Hero', 'Featured Project', 'Projects', 'About Me', 'Work Experience', 'Testimonials']

// Tied to viewport-width breakpoints (not the panel's own rendered width) —
// three deliberate device tiers, not a continuous "does it fit" measurement:
// desktop's side panel is 1 column regardless of how wide it's dragged, the
// bottom sheet is 2 columns on iPad-width viewports (md, >=768) and back
// down to 1 on phone-width viewports (below md), and lg (>=1024) re-flattens
// to 1 column because that's where the side panel takes over from the sheet.
const GRID_COLS_CLASS = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-1'

function ColorSwatch({ id, active, onSelect }) {
  const { label, background, card, primary, accent } = THEME_SWATCHES[id]

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      aria-pressed={active}
      className={`flex flex-col gap-2 rounded-xl border p-2.5 text-left transition-colors ${
        active ? 'border-white/40' : 'border-white/10 hover:border-white/20'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white">{label}</span>
        {active && <Check className="h-3.5 w-3.5 text-white" />}
      </div>
      <div className="flex h-10 overflow-hidden rounded-lg border border-black/10">
        <div className="flex-1" style={{ background }} />
        <div className="flex-1" style={{ background: card }} />
        <div className="flex-1" style={{ background: primary }} />
        <div className="flex-1" style={{ background: accent }} />
      </div>
    </button>
  )
}

export default function ThemesPanel({ onClose, hideHeader = false }) {
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('templates')

  return (
    // min-w matches BuilderShell's THEMES_MIN_PX. The side panel animates its
    // own width open/closed (and react-resizable-panels' Panel wrapper is
    // already overflow-hidden) — without a floor here, this content would
    // reflow/shrink through every intermediate width during that animation,
    // reading as a zoom on the grid. Pinning a minimum width instead makes
    // the panel reveal it via clipping, not squishing; dragging the panel
    // wider than this later still grows the content normally.
    <div className="flex h-full min-w-[260px] flex-col bg-[#18181b] text-white">
      {!hideHeader && (
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4">
          <span className="text-sm font-semibold">Themes</span>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onClose}
            className="text-white/60 hover:bg-white/10 hover:text-white"
          >
            <X />
          </Button>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col overflow-hidden px-4 py-3">
        <TabsList className="bg-white/5">
          {PANEL_TABS.map(({ value, label }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="relative text-white/60 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              {activeTab === value && (
                <motion.div
                  layoutId="themes-tab-indicator"
                  className="absolute inset-0 rounded-md bg-white/10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="templates" className="mt-3 overflow-y-auto">
          <div className={`grid ${GRID_COLS_CLASS} gap-2.5`}>
            {MOCK_TEMPLATES.map((name) => (
              <div
                key={name}
                className="flex aspect-video cursor-not-allowed flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/10 bg-white/5 text-white/30"
              >
                <LayoutTemplate className="h-5 w-5" />
                <span className="text-xs">{name}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-white/40">Coming soon</p>
        </TabsContent>

        <TabsContent value="colors" className="mt-3 overflow-y-auto">
          <div className={`grid ${GRID_COLS_CLASS} gap-2.5`}>
            {THEME_ORDER.map((id) => (
              <ColorSwatch key={id} id={id} active={theme === id} onSelect={setTheme} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sections" className="mt-3 overflow-y-auto">
          <div className="flex flex-col gap-1.5">
            {MOCK_SECTIONS.map((name) => (
              <div
                key={name}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white/80"
              >
                <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-white/30" />
                <span className="flex-1">{name}</span>
                <Eye className="h-4 w-4 shrink-0 text-white/30" />
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-white/40">Coming soon</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
