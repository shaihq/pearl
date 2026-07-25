export default function NavRow({ icon: Icon, label, active, compact = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        (compact
          ? 'flex h-7 w-full items-center gap-2 rounded-md px-2.5 text-xs '
          : 'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm ') +
        'transition-colors ' +
        (active ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white')
      }
    >
      <Icon className={compact ? 'size-3.5 shrink-0' : 'size-4 shrink-0'} />
      <span className="truncate">{label}</span>
    </button>
  )
}
