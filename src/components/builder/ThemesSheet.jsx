import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import ThemesPanel from './ThemesPanel'

export default function ThemesSheet({ open, onClose }) {
  return (
    <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
      <SheetContent
        side="bottom"
        className="h-[80vh] gap-0 rounded-t-2xl border-white/10 bg-[#18181b] p-0 text-white [&>button]:hidden"
      >
        <div className="flex shrink-0 justify-center pt-2.5">
          <div className="h-1 w-9 rounded-full bg-white/20" />
        </div>

        <div className="flex h-12 shrink-0 items-center justify-between px-4">
          <SheetTitle className="text-sm font-semibold text-white">Themes</SheetTitle>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onClose}
            className="text-white/60 hover:bg-white/10 hover:text-white"
          >
            <X />
          </Button>
        </div>

        {/*
          This wrapper must be a flex container itself, not just a flex item —
          a plain block child sizing via `h-full` against a flex-item parent
          doesn't reliably inherit the parent's flex-resolved (definite)
          height for percentage purposes, so it grows to fit its content
          instead of clipping to it, and the `overflow-y-auto` panes inside
          ThemesPanel never get a bounded box to actually scroll within.
        */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <ThemesPanel hideHeader onClose={onClose} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
