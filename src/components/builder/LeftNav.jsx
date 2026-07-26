import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'

import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { LEFT_NAV_ITEMS } from './navConfig'
import PearlLogo from './PearlLogo'

// Collapsed, every row/logo is centered in the 56px rail via `justify-center`
// — a 28px box centered in 56px sits 14px in from the edge. Expanded used a
// completely different scheme (`w-full` + container padding), so the icon
// and the highlight pill both jumped sideways the moment a label appeared.
// Anchoring every row to this same fixed 14px offset in both states — via
// margin, not centering — means the icon truly never moves; only the pill's
// right edge grows to fit the label.
const RAIL_OFFSET = 'ml-3.5'

function NavItem({ icon: Icon, label, active, expanded }) {
  const button = (
    <button
      type="button"
      className={
        // Collapsed: the list container skips flex-stretch (see below), so
        // this box just hugs its own 28px icon — no pr-3, or the hug would
        // include padding meant for a label that isn't even rendered.
        // Expanded: the container's default stretch takes over and sizes
        // every row to the SAME width (container minus the matching ml/mr
        // margins) — a fixed length shared across items, not each row
        // hugging its own label, and not stretched flush to the rail's edge.
        `flex h-7 items-center gap-2 rounded-lg text-xs transition-colors ${RAIL_OFFSET} mr-3.5 ${expanded ? 'pr-3' : ''} ` +
        (active ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/10 hover:text-white')
      }
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center">
        <Icon className="size-3.5" />
      </span>
      {expanded && <span className="truncate">{label}</span>}
    </button>
  )

  if (expanded) return button

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}

export default function LeftNav({ expanded, onToggle }) {
  return (
    <aside className="flex h-full flex-col items-stretch bg-[#18181b] text-white">
      {/* Fixed to the same height as TopNav so the divider below lines up with its bottom border */}
      <div className="flex h-14 shrink-0 items-center">
        <div className={`flex items-center gap-2 ${RAIL_OFFSET}`}>
          <PearlLogo className="w-7 h-7 shrink-0" />
          {expanded && <span className="text-sm font-semibold">pearl</span>}
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Collapsed needs items-start — otherwise flex-col's default stretch
          would force each icon-only button to fill the full 56px rail
          instead of hugging its 28px icon. Expanded drops it so that same
          default stretch DOES apply, giving every row the same fixed width. */}
      <div
        className={`flex flex-1 flex-col gap-0.5 overflow-y-auto py-3 ${expanded ? '' : 'items-start'}`}
      >
        {LEFT_NAV_ITEMS.map((item) => (
          <NavItem key={item.label} {...item} expanded={expanded} />
        ))}
      </div>

      <div className="flex shrink-0 items-center pb-3">
        <button
          type="button"
          onClick={onToggle}
          className={`flex h-7 w-7 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/10 hover:text-white ${RAIL_OFFSET}`}
        >
          {expanded ? <PanelLeftClose className="size-3.5" /> : <PanelLeftOpen className="size-3.5" />}
        </button>
      </div>
    </aside>
  )
}
