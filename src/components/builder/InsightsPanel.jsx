import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link2 } from 'lucide-react'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PanelHeader from './PanelHeader'

// Mock traffic — there's no real analytics backend behind this yet, just
// enough of a dataset per range to make the chart and stat tile feel real.
// Values deliberately stay tiny (a brand-new site realistically has ~0-1
// visitors a day), rather than inventing an impressive-looking dashboard.
const RANGES = [
  {
    key: 'week',
    label: 'Week',
    unique: 1,
    points: [
      { label: 'Jul 20', value: 0 },
      { label: 'Jul 21', value: 0 },
      { label: 'Jul 22', value: 1 },
      { label: 'Jul 23', value: 0 },
      { label: 'Jul 24', value: 0 },
      { label: 'Jul 25', value: 0 },
      { label: 'Jul 26', value: 0 },
    ],
  },
  {
    key: 'today',
    label: 'Today',
    unique: 1,
    points: [
      { label: '12am', value: 0 },
      { label: '4am', value: 0 },
      { label: '8am', value: 0 },
      { label: '12pm', value: 1 },
      { label: '4pm', value: 0 },
      { label: '8pm', value: 0 },
      { label: '11pm', value: 0 },
    ],
  },
  {
    key: 'month',
    label: 'This Month',
    unique: 4,
    points: [
      { label: 'Jul 1', value: 0 },
      { label: 'Jul 6', value: 1 },
      { label: 'Jul 11', value: 0 },
      { label: 'Jul 16', value: 2 },
      { label: 'Jul 21', value: 1 },
      { label: 'Jul 26', value: 0 },
    ],
  },
]

const LINE_COLOR = '#3987e5' // dataviz skill's dark-mode sequential blue — reads well on the fixed #18181b chrome

const CHART_WIDTH = 320
const CHART_HEIGHT = 140
const PADDING = { top: 14, right: 8, bottom: 20, left: 18 }
const INNER_WIDTH = CHART_WIDTH - PADDING.left - PADDING.right
const INNER_HEIGHT = CHART_HEIGHT - PADDING.top - PADDING.bottom

function buildChart(points) {
  const maxValue = Math.max(1, ...points.map((p) => p.value))
  const stepX = points.length > 1 ? INNER_WIDTH / (points.length - 1) : 0

  const coords = points.map((p, i) => ({
    ...p,
    x: PADDING.left + i * stepX,
    y: PADDING.top + INNER_HEIGHT - (p.value / maxValue) * INNER_HEIGHT,
  }))

  // Smooth through each point via a bezier whose control points sit at the
  // horizontal midpoint of each segment — simple, no spline library, and it
  // reads as a soft curve rather than the straight-segment "V" shapes a
  // plain polyline gives a mostly-zero dataset like this one.
  const linePath = coords.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x},${pt.y}`
    const prev = coords[i - 1]
    const midX = (prev.x + pt.x) / 2
    return `${acc} C ${midX},${prev.y} ${midX},${pt.y} ${pt.x},${pt.y}`
  }, '')

  const baseline = PADDING.top + INNER_HEIGHT
  const areaPath = `${linePath} L ${coords[coords.length - 1].x},${baseline} L ${coords[0].x},${baseline} Z`

  return { coords, linePath, areaPath, maxValue }
}

function InsightsChart({ points }) {
  const { coords, linePath, areaPath, maxValue } = buildChart(points)
  const [hoverIndex, setHoverIndex] = useState(null)
  const hovered = hoverIndex !== null ? coords[hoverIndex] : null

  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const relX = ((e.clientX - rect.left) / rect.width) * CHART_WIDTH
    let nearest = 0
    let nearestDist = Infinity
    coords.forEach((pt, i) => {
      const d = Math.abs(pt.x - relX)
      if (d < nearestDist) {
        nearestDist = d
        nearest = i
      }
    })
    setHoverIndex(nearest)
  }

  const midIndex = Math.floor((coords.length - 1) / 2)

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="h-auto w-full cursor-crosshair"
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIndex(null)}
      >
        {[0, 1 / 3, 2 / 3, 1].map((t) => {
          const y = PADDING.top + INNER_HEIGHT * t
          return (
            <line
              key={t}
              x1={PADDING.left}
              x2={CHART_WIDTH - PADDING.right}
              y1={y}
              y2={y}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
          )
        })}

        <path d={areaPath} fill={LINE_COLOR} opacity="0.1" stroke="none" />
        <path d={linePath} fill="none" stroke={LINE_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {hovered && (
          <>
            <line
              x1={hovered.x}
              x2={hovered.x}
              y1={PADDING.top}
              y2={PADDING.top + INNER_HEIGHT}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
            />
            <circle cx={hovered.x} cy={hovered.y} r="4" fill={LINE_COLOR} stroke="#18181b" strokeWidth="2" />
          </>
        )}

        <text x={PADDING.left - 4} y={PADDING.top + 3} fontSize="9" textAnchor="end" fill="rgba(255,255,255,0.4)">
          {maxValue}
        </text>
        <text x={PADDING.left - 4} y={PADDING.top + INNER_HEIGHT} fontSize="9" textAnchor="end" fill="rgba(255,255,255,0.4)">
          0
        </text>

        {coords.map((pt, i) => {
          if (i !== 0 && i !== coords.length - 1 && i !== midIndex) return null
          const anchor = i === 0 ? 'start' : i === coords.length - 1 ? 'end' : 'middle'
          return (
            <text key={pt.label} x={pt.x} y={CHART_HEIGHT - 4} fontSize="9" textAnchor={anchor} fill="rgba(255,255,255,0.4)">
              {pt.label}
            </text>
          )
        })}
      </svg>

      {hovered && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-[calc(100%+8px)] rounded-md border border-white/10 bg-[#18181b] px-2 py-1 text-xs whitespace-nowrap shadow-lg"
          style={{ left: `${(hovered.x / CHART_WIDTH) * 100}%`, top: `${(hovered.y / CHART_HEIGHT) * 100}%` }}
        >
          <div className="font-semibold text-white">{hovered.value}</div>
          <div className="text-white/50">{hovered.label}</div>
        </div>
      )}
    </div>
  )
}

export default function InsightsPanel({ onClose, hideHeader = false }) {
  const [rangeKey, setRangeKey] = useState('week')
  const range = RANGES.find((r) => r.key === rangeKey)

  return (
    <div className="flex h-full min-w-[260px] flex-col bg-[#18181b] text-white">
      {!hideHeader && <PanelHeader title="Insights" onClose={onClose} />}

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mb-4 flex items-center gap-1.5 text-xs text-white/50">
          <Link2 className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">yourname.pearl.dev</span>
        </div>

        <Tabs value={rangeKey} onValueChange={setRangeKey} className="mb-4">
          <TabsList className="bg-white/5">
            {RANGES.map(({ key, label }) => (
              <TabsTrigger
                key={key}
                value={key}
                className="relative text-white/60 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none"
              >
                {rangeKey === key && (
                  <motion.div
                    layoutId="insights-range-indicator"
                    className="absolute inset-0 rounded-md bg-white/10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="rounded-xl bg-white/5 p-4">
          <p className="text-3xl font-semibold text-white">{range.unique}</p>
          <p className="mt-1 text-sm text-white/50">Unique visitors</p>
        </div>

        <div className="mt-4">
          <InsightsChart points={range.points} />
        </div>
      </div>
    </div>
  )
}
