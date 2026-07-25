import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function ThemesPanel({ onClose }) {
  return (
    <div className="flex h-full flex-col bg-[#18181b] text-white">
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

      <div className="flex flex-1 items-center justify-center px-4">
        <p className="text-sm text-white/40">Coming soon</p>
      </div>
    </div>
  )
}
