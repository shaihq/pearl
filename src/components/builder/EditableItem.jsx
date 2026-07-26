import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useBuilderPanel } from '../../context/BuilderPanelContext'
import { resolveAction } from './panelActions'

const DEFAULT_ACTIONS = ['edit', { key: 'hide', label: 'Hide' }, 'delete']

// Per-item hover affordance nested *inside* a section that holds a
// collection (e.g. one project card inside the Projects section). Same dark
// nav-shell treatment as EditableSection, just scaled down (smaller ring,
// smaller buttons, tighter corner) to match wrapping a card instead of a
// full page section. "Edit" here opens the parent section's own editor
// panel — there's no separate per-item panel, editing one project happens
// via that project's fields in the Projects panel.
//
// Uses a NAMED group (`group/item`) rather than the plain `group` the
// containing card already uses for its own hover effects (e.g. the
// scale-110 zoom on the mockup) — two independent hover affordances on the
// same hovered element, without one clobbering the other's group-hover.
export default function EditableItem({ itemLabel, sectionKey, sectionLabel, actions = DEFAULT_ACTIONS, children }) {
  const { openSection } = useBuilderPanel()

  return (
    <div className="group/item relative">
      <div className="pointer-events-none absolute -inset-2 rounded-xl opacity-0 ring-2 ring-[var(--accent)] transition-opacity duration-200 group-hover/item:opacity-100" />

      {/*
        Deliberately not "smaller version of the section toolbar": horizontal
        row, top-center, dropping down from above — reads at a glance as a
        different kind of control than the section's vertical top-right
        stack, instead of an ambiguous scaled-down copy of it.

        Mobile-first: visible at rest below lg, hidden-until-hover only at
        lg+ (matches EditableSection and the rest of the shell's own
        mobile/desktop breakpoint). -translate-x-1/2 is pure horizontal
        centering, not part of the reveal, so it stays unconditional at
        every breakpoint instead of being toggled with the rest.
      */}
      <div
        className="absolute top-2 left-1/2 z-10 flex -translate-x-1/2 flex-row gap-0.5 rounded-md border border-white/10 bg-[#18181b] p-1 opacity-100 shadow-lg transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] lg:-translate-y-1 lg:pointer-events-none lg:opacity-0 lg:group-hover/item:pointer-events-auto lg:group-hover/item:translate-y-0 lg:group-hover/item:opacity-100"
      >
        {actions.map(resolveAction).map(({ key, icon: Icon, label: actionLabel }) => (
          <Tooltip key={key}>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={`${actionLabel} — ${itemLabel}`}
                onClick={key === 'edit' ? () => openSection(sectionKey, sectionLabel) : undefined}
                className="rounded-md text-white/50 hover:bg-white/10 hover:text-white"
              >
                <Icon />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="border border-white/10 bg-[#18181b] text-white">
              {actionLabel}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {children}
    </div>
  )
}
