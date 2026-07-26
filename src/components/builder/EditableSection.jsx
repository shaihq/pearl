import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useBuilderPanel } from '../../context/BuilderPanelContext'
import { resolveAction } from './panelActions'

// Builder chrome, not template content — always renders in the dark
// nav-shell style (bg-[#18181b]/white text/white-10 borders, same classes
// LeftNav's NavIcon uses) regardless of the template's own active theme. The
// outline ring uses the template's --accent so it still reads as "this
// section, in this theme" rather than a generic overlay.
const DEFAULT_ACTIONS = ['edit', 'hide', 'rearrange']

export default function EditableSection({
  sectionKey,
  label,
  actions = DEFAULT_ACTIONS,
  wrapperClassName = 'relative',
  children,
}) {
  const { openSection } = useBuilderPanel()

  return (
    <div className={`group ${wrapperClassName}`}>
      <div className="pointer-events-none absolute -inset-3 rounded-2xl opacity-0 ring-2 ring-[var(--accent)] transition-opacity duration-200 group-hover:opacity-100" />

      {/*
        Mobile-first: visible at rest by default (below lg there's no room
        for a hover-driven reveal to make sense on touch anyway), and only
        goes hidden-until-hover at lg+ — the same breakpoint the rest of the
        shell already switches to a desktop/mouse-oriented layout at. The
        right-to-left slide only applies at lg+ too, since it's a reveal
        animation for a state that doesn't exist below that.
      */}
      <div
        className="absolute top-3 right-4 z-10 flex flex-col gap-0.5 rounded-lg border border-white/10 bg-[#18181b] p-1.5 opacity-100 shadow-lg transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-3 lg:pointer-events-none lg:opacity-0 lg:group-hover:pointer-events-auto lg:group-hover:translate-x-0 lg:group-hover:opacity-100"
      >
        {actions.map(resolveAction).map(({ key, icon: Icon, label: actionLabel }) => (
          <Tooltip key={key}>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`${actionLabel} — ${label}`}
                onClick={key === 'edit' ? () => openSection(sectionKey, label) : undefined}
                className="rounded-lg text-white/50 hover:bg-white/10 hover:text-white"
              >
                <Icon />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="border border-white/10 bg-[#18181b] text-white">
              {actionLabel}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {children}
    </div>
  )
}
