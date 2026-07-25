import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { LEFT_NAV_ITEMS } from './navConfig'
import NavRow from './NavRow'
import PearlLogo from './PearlLogo'

function NavIcon({ icon: Icon, label, active }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-xs"
          className={
            active
              ? 'rounded-lg bg-white/10 text-white hover:bg-white/15 hover:text-white'
              : 'rounded-lg text-white/50 hover:bg-white/10 hover:text-white'
          }
        >
          <Icon />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}

export default function LeftNav({ expanded, onToggle }) {
  return (
    <aside className="flex h-full flex-col items-stretch bg-[#18181b] text-white">
      {/* Fixed to the same height as TopNav so the divider below lines up with its bottom border */}
      <div className={expanded ? 'flex h-14 shrink-0 items-center gap-2 px-4' : 'flex h-14 shrink-0 items-center justify-center'}>
        <PearlLogo className="w-7 h-7 shrink-0" />
      </div>

      <Separator className="bg-white/10" />

      <div
        className={
          expanded
            ? 'flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-3'
            : 'flex flex-1 flex-col items-center gap-2 overflow-y-auto py-3'
        }
      >
        {LEFT_NAV_ITEMS.map((item) =>
          expanded ? <NavRow key={item.label} {...item} compact /> : <NavIcon key={item.label} {...item} />
        )}
      </div>

      <div className={expanded ? 'px-2 pb-3' : 'flex flex-col items-center pb-3'}>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onToggle}
          className="shrink-0 text-white/50 hover:bg-white/10 hover:text-white"
        >
          {expanded ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>
      </div>
    </aside>
  )
}
