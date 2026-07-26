import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  BarChart3,
  Eye,
  EyeOff,
  ExternalLink,
  Globe,
  Link2,
  Loader2,
  LogOut,
  Lock,
  Palette,
  Pencil,
  Settings,
  Sparkles,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import AccountSettingsModal from './AccountSettingsModal'
import MobileNav from './MobileNav'
import PearlLogo from './PearlLogo'
import SparkleIcon from './SparkleIcon'

// Every control on this bar stays fixed-dark regardless of the template's
// active theme (same reasoning as the rest of the builder chrome), so the
// checked state uses a literal accent color rather than var(--primary) —
// that token flips with the template theme and isn't guaranteed to read as
// "on" against this bar's own always-dark surface.
const SWITCH_CLASS = 'data-[state=checked]:bg-[#FF553E] data-[state=unchecked]:bg-white/15'
const SWITCH_THUMB_CLASS = 'bg-white'

const OUTLINE_BUTTON_CLASS = 'border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white'

// Quick + subtle: a small fade/slide, not a production number — this is a
// toolbar swapping contents, not a page transition.
const SWAP_TRANSITION = { duration: 0.15, ease: 'easeOut' }
const swapVariants = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
}

function HideToggle() {
  const [hidden, setHidden] = useState(false)

  return (
    <label className="flex h-7 items-center gap-1.5 rounded-md border border-white/15 px-2.5 text-xs text-white select-none">
      {hidden ? <EyeOff className="size-3.5 text-white/60" /> : <Eye className="size-3.5 text-white/60" />}
      Hide
      <Switch
        checked={hidden}
        onCheckedChange={setHidden}
        className={`ml-0.5 ${SWITCH_CLASS}`}
        thumbClassName={SWITCH_THUMB_CLASS}
      />
    </label>
  )
}

function PasswordProtectControl() {
  const [enabled, setEnabled] = useState(false)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="xs"
          className={OUTLINE_BUTTON_CLASS + (enabled ? ' bg-white/10' : '')}
        >
          <Lock />
          Password protect
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 border-white/10 bg-[#18181b] text-white">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
            <Lock className="size-4 text-white/70" />
          </span>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-white">Password protect</p>
              <Switch checked={enabled} onCheckedChange={setEnabled} className={SWITCH_CLASS} thumbClassName={SWITCH_THUMB_CLASS} />
            </div>
            <p className="mt-1 text-xs text-white/50">Require a password to view this case study.</p>
          </div>
        </div>

        {enabled && (
          <Input
            type="password"
            placeholder="Set a password"
            className="mt-3 border-white/10 bg-white/5 text-xs text-white placeholder:text-white/30 focus-visible:ring-white/20"
          />
        )}
      </PopoverContent>
    </Popover>
  )
}

function ProfileMenu() {
  const [open, setOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20">
            <Avatar className="size-7">
              <AvatarFallback className="bg-white/10 text-white text-xs">P</AvatarFallback>
            </Avatar>
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-64 border-white/10 bg-[#18181b] p-1 text-white">
          <button
            onClick={() => {
              setOpen(false)
              setSettingsOpen(true)
            }}
            className="flex w-full items-start gap-3 rounded-md px-2 py-2 text-left hover:bg-white/10"
          >
            <Settings className="mt-0.5 size-4 shrink-0 text-white/70" />
            <span>
              <span className="block text-sm font-medium text-white">Settings</span>
              <span className="block text-xs text-white/50">Custom Domains, Username and more</span>
            </span>
          </button>
          <div className="my-1 h-px bg-white/10" />
          <button className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-white/10">
            <LogOut className="size-4 shrink-0 text-white/70" />
            <span className="text-sm font-medium text-white">Logout</span>
          </button>
        </PopoverContent>
      </Popover>
      <AccountSettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  )
}

function AnalyzeButton() {
  const [analyzing, setAnalyzing] = useState(false)

  function handleClick() {
    setAnalyzing(true)
    setTimeout(() => setAnalyzing(false), 1600)
  }

  return (
    <Button
      variant="outline"
      size="xs"
      onClick={handleClick}
      disabled={analyzing}
      className={OUTLINE_BUTTON_CLASS + ' disabled:opacity-100'}
    >
      {analyzing ? <Loader2 className="animate-spin" /> : <Sparkles />}
      {analyzing ? 'Analyzing…' : 'Analyze using AI'}
    </Button>
  )
}

export default function TopNav({
  themesOpen,
  onThemesClick,
  insightsOpen,
  onInsightsClick,
  caseStudySlug,
}) {
  const navigate = useNavigate()
  const isCaseStudy = Boolean(caseStudySlug)

  return (
    <>
      <header className="h-14 shrink-0 flex items-center px-4 border-b border-white/10 bg-[#18181b] text-white">
        {/* Mobile: hamburger (opens consolidated nav) + logo, Publish + avatar stay
            reachable — this row is deliberately the same whether or not we're on a
            case study, so the primary nav never shifts around; the case-study
            controls get their own row below instead (see the secondary bar). */}
        <div className="flex md:hidden w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <MobileNav onThemesClick={onThemesClick} onInsightsClick={onInsightsClick} />
            <PearlLogo className="w-6 h-6 shrink-0" />
          </div>

          <div className="flex items-center gap-2">
            <Button size="xs" className="bg-[#FF553E] text-white hover:bg-[#e6472f]">
              <Globe />
              Publish
            </Button>
            <ProfileMenu />
          </div>
        </div>

        {/* Desktop */}
      <div className="hidden md:flex w-full items-center justify-between">
        <AnimatePresence mode="wait" initial={false}>
          {isCaseStudy ? (
            <motion.div
              key="case-study-left"
              variants={swapVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={SWAP_TRANSITION}
              className="flex items-center"
            >
              <Button variant="outline" size="xs" onClick={() => navigate('/')} className={OUTLINE_BUTTON_CLASS}>
                <ArrowLeft />
                Back
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="home-left"
              variants={swapVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={SWAP_TRANSITION}
              className="flex items-center gap-3"
            >
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
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait" initial={false}>
            {isCaseStudy ? (
              <motion.div
                key="case-study-right"
                variants={swapVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={SWAP_TRANSITION}
                className="flex items-center gap-2"
              >
                <HideToggle />
                <PasswordProtectControl />
                <AnalyzeButton />
              </motion.div>
            ) : (
              <motion.div
                key="home-right"
                variants={swapVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={SWAP_TRANSITION}
                className="flex items-center gap-2"
              >
                <Button
                  variant="outline"
                  size="xs"
                  onClick={onThemesClick}
                  className={OUTLINE_BUTTON_CLASS + (themesOpen ? ' bg-white/10' : '')}
                >
                  <Palette />
                  Themes
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={onInsightsClick}
                  className={OUTLINE_BUTTON_CLASS + (insightsOpen ? ' bg-white/10' : '')}
                >
                  <BarChart3 />
                  Insights
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <Button size="xs" className="bg-[#FF553E] text-white hover:bg-[#e6472f]">
            <Globe />
            Publish
          </Button>
          <ProfileMenu />
        </div>
      </div>
    </header>

    {/* Secondary row, mobile/tablet only, case study only — there's no room
        for Back/Hide/Password protect/Analyze in the primary mobile row
        above (it's already full with the hamburger, logo, Publish, avatar),
        and none of them belong in that hamburger menu either since they're
        specific to this one page, not site-wide actions. A second bar keeps
        the primary row identical in every state instead of growing/shrinking
        it, and scrolls horizontally rather than wrapping or truncating —
        this is a real toolbar, not a nav a user reads top to bottom. */}
    {isCaseStudy && (
      <div className="flex md:hidden h-12 shrink-0 items-center gap-2 overflow-x-auto border-b border-white/10 bg-[#18181b] px-4">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => navigate('/')}
          aria-label="Go back to home"
          className="shrink-0 text-white/70 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft />
        </Button>
        <div className="h-4 w-px shrink-0 bg-white/10" />
        <div className="shrink-0">
          <HideToggle />
        </div>
        <div className="shrink-0">
          <PasswordProtectControl />
        </div>
        <div className="shrink-0">
          <AnalyzeButton />
        </div>
      </div>
    )}
    </>
  )
}
