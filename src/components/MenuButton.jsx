export default function MenuButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open menu"
      className="w-10 h-10 shrink-0 rounded-full bg-[var(--primary)] flex items-center justify-center hover:bg-[var(--primary-hover)] transition-colors"
    >
      <span className="flex flex-col gap-[3px]">
        <span className="block w-4 h-[1.5px] bg-[var(--primary-foreground)] rounded-full" />
        <span className="block w-4 h-[1.5px] bg-[var(--primary-foreground)] rounded-full" />
      </span>
    </button>
  )
}
