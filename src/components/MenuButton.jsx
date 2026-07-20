export default function MenuButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open menu"
      className="w-10 h-10 shrink-0 rounded-full bg-ink dark:bg-white flex items-center justify-center hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
    >
      <span className="flex flex-col gap-[3px]">
        <span className="block w-4 h-[1.5px] bg-white dark:bg-ink rounded-full" />
        <span className="block w-4 h-[1.5px] bg-white dark:bg-ink rounded-full" />
      </span>
    </button>
  )
}
