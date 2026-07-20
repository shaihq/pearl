export default function InfographicCard() {
  return (
    <div className="rounded-2xl bg-panel dark:bg-zinc-900 h-[340px] flex items-center justify-center overflow-hidden transition-colors duration-500">
      <svg
        viewBox="0 0 200 140"
        className="w-44 h-32 text-neutral-400 dark:text-zinc-500 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        {/* phone */}
        <g transform="translate(90,10)">
          <rect x="0" y="0" width="46" height="90" rx="6" />
          <line x1="0" y1="14" x2="46" y2="14" />
          <line x1="0" y1="76" x2="46" y2="76" />
          <circle cx="23" cy="83" r="3" />
        </g>
        {/* card reader */}
        <g transform="translate(20,70)">
          <rect x="0" y="0" width="60" height="40" rx="6" />
          <rect x="8" y="10" width="18" height="12" rx="2" />
          <line x1="8" y1="30" x2="52" y2="30" />
        </g>
        {/* dashed connector */}
        <path d="M 78 90 Q 100 100 110 60" strokeDasharray="3 3" />
        {/* floating dots */}
        <circle cx="150" cy="40" r="14" />
        <circle cx="35" cy="30" r="3" fill="currentColor" />
        <circle cx="170" cy="90" r="3" fill="currentColor" />
        <path d="M60 20 h20" strokeDasharray="2 2" />
      </svg>
    </div>
  )
}
