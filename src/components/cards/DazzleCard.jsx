import ArrowIcon from '../ArrowIcon'

export default function DazzleCard() {
  return (
    <div className="relative rounded-2xl bg-[#0b0b0d] h-[340px] flex items-center justify-center overflow-hidden">
      <span className="absolute bottom-4 left-4 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white">
        <ArrowIcon className="w-3 h-3" />
      </span>
      <svg
        viewBox="0 0 200 200"
        className="w-40 h-40 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <path
            key={i}
            d={`M ${20 + i * 8} 30 Q 100 100 ${20 + i * 8} 170`}
            fill="none"
            stroke="#6366f1"
            strokeOpacity={0.35 + i * 0.13}
            strokeWidth="3"
            strokeLinecap="round"
          />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <path
            key={i}
            d={`M ${180 - i * 8} 30 Q 100 100 ${180 - i * 8} 170`}
            fill="none"
            stroke="#818cf8"
            strokeOpacity={0.35 + i * 0.13}
            strokeWidth="3"
            strokeLinecap="round"
          />
        ))}
      </svg>
    </div>
  )
}
