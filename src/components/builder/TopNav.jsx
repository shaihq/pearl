import { BarChart3, ExternalLink, Globe, Link2, Palette, Pencil } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import MobileNav from './MobileNav'
import PearlLogo from './PearlLogo'
import SparkleIcon from './SparkleIcon'

export default function TopNav({ themesOpen, onThemesClick }) {
  return (
    <header className="h-14 shrink-0 flex items-center px-4 border-b border-white/10 bg-[#18181b] text-white">
      {/* Mobile: hamburger (opens consolidated nav) + logo, Publish + avatar stay reachable */}
      <div className="flex md:hidden w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <MobileNav onThemesClick={onThemesClick} />
          <PearlLogo className="w-6 h-6 shrink-0" />
        </div>

        <div className="flex items-center gap-2">
          <Button size="xs" className="bg-[#FF553E] text-white hover:bg-[#e6472f]">
            <Globe />
            Publish
          </Button>
          <Avatar className="size-7">
            <AvatarFallback className="bg-white/10 text-white text-xs">P</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="xs" className="bg-white/10 text-white hover:bg-white/15">
            <SparkleIcon />
            Upgrade
          </Button>

          <div className="relative w-64">
            <Link2 className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-white/50" />
            <Input
              readOnly
              defaultValue="yourname.pearl.dev/"
              className="h-7 rounded-md border-white/10 bg-white/5 pl-8 pr-7 text-xs text-white/70 focus-visible:ring-white/20"
            />
            <Button
              variant="ghost"
              size="icon-xs"
              className="absolute right-0.5 top-1/2 -translate-y-1/2 text-white/50 hover:bg-white/10 hover:text-white"
            >
              <Pencil />
            </Button>
          </div>

          <Button variant="ghost" size="icon-xs" className="text-white/60 hover:bg-white/10 hover:text-white">
            <ExternalLink />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="xs"
            onClick={onThemesClick}
            className={
              'border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white' +
              (themesOpen ? ' bg-white/10' : '')
            }
          >
            <Palette />
            Themes
          </Button>
          <Button
            variant="outline"
            size="xs"
            className="border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <BarChart3 />
            Insights
          </Button>
          <Button size="xs" className="bg-[#FF553E] text-white hover:bg-[#e6472f]">
            <Globe />
            Publish
          </Button>
          <Avatar className="size-7">
            <AvatarFallback className="bg-white/10 text-white text-xs">P</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
