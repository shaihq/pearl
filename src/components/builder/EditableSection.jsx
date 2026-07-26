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

      {/* Right-to-left reveal: rests translated right + invisible, slides to
          its resting spot on hover instead of just fading in place. */}
      <div
        className="pointer-events-none absolute top-3 right-4 z-10 flex translate-x-3 flex-col gap-0.5 rounded-lg border border-white/10 bg-[#18181b] p-1.5 opacity-0 shadow-lg transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100"
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
