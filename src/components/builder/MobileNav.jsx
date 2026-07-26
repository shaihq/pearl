import { useState } from 'react'
import { Link2, Menu, Pencil } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { LEFT_NAV_ITEMS, TOP_NAV_ACTIONS } from './navConfig'
import NavRow from './NavRow'
import PearlLogo from './PearlLogo'

function SectionLabel({ children }) {
  return <p className="px-3 pt-3 pb-1 text-[11px] font-medium uppercase tracking-wide text-white/40">{children}</p>
}

export default function MobileNav({ onThemesClick, onInsightsClick }) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-xs" className="text-white/70 hover:bg-white/10 hover:text-white">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-72 border-white/10 bg-[#18181b] p-0 text-white sm:max-w-72">
        <SheetHeader className="flex-row items-center gap-2 border-b border-white/10 p-4">
          <PearlLogo className="w-7 h-7 shrink-0" />
          <SheetTitle className="text-white">pearl</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-2 pb-4">
          <SectionLabel>Navigate</SectionLabel>
          <div className="flex flex-col gap-0.5">
            {LEFT_NAV_ITEMS.map((item) => (
              <NavRow key={item.label} {...item} />
            ))}
          </div>

          <SectionLabel>Site</SectionLabel>
          <div className="relative mx-3 mb-2">
            <Link2 className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-white/50" />
            <Input
              readOnly
              defaultValue="yourname.pearl.dev/"
              className="h-8 rounded-md border-white/10 bg-white/5 pl-8 pr-8 text-xs text-white/70 focus-visible:ring-white/20"
            />
            <Button
              variant="ghost"
              size="icon-xs"
              className="absolute right-0.5 top-1/2 -translate-y-1/2 text-white/50 hover:bg-white/10 hover:text-white"
            >
              <Pencil />
            </Button>
          </div>

          <SectionLabel>Actions</SectionLabel>
          <div className="flex flex-col gap-0.5">
            {TOP_NAV_ACTIONS.map((item) => {
              const panelClick =
                item.label === 'Themes' ? onThemesClick : item.label === 'Insights' ? onInsightsClick : null

              return (
                <NavRow
                  key={item.label}
                  {...item}
                  onClick={
                    panelClick
                      ? () => {
                          setOpen(false)
                          panelClick()
                        }
                      : undefined
                  }
                />
              )
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
