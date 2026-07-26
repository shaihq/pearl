import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Shared header row for the right-hand panel — used by both ThemesPanel and
// SectionEditorPanel so the two stay pixel-identical regardless of which is
// showing.
export default function PanelHeader({ title, onClose, className }) {
  return (
    <div className={cn('flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4', className)}>
      <span className="text-sm font-semibold text-white">{title}</span>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={onClose}
        className="text-white/60 hover:bg-white/10 hover:text-white"
      >
        <X />
      </Button>
    </div>
  )
}
