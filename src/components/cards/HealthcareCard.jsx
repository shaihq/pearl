export default function HealthcareCard() {
  return (
    <div className="rounded-2xl bg-[var(--card)] h-[340px] flex items-center justify-center overflow-hidden transition-colors duration-500">
      <div className="w-[150px] rounded-xl bg-white shadow-xl p-3 text-[9px] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium text-ink text-[10px]">Summary</span>
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 flex items-center justify-center text-white text-[7px]">
            ✓
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-indigo-500 text-white p-2">
            <div className="text-sm font-semibold">120</div>
            <div className="text-[7px] opacity-80 leading-tight mt-0.5">
              Upcoming Appointments
            </div>
          </div>
          <div className="rounded-lg bg-neutral-100 text-ink p-2">
            <div className="text-sm font-semibold">72</div>
            <div className="text-[7px] text-neutral-500 leading-tight mt-0.5">
              Finished Appointments
            </div>
          </div>
        </div>
        <div className="mt-2 rounded-lg bg-neutral-50 p-2">
          <div className="flex justify-between items-center">
            <span className="text-neutral-500">Today's cases</span>
            <span className="text-ink font-medium">$1,023.70</span>
          </div>
          <svg viewBox="0 0 100 24" className="w-full h-5 mt-1">
            <polyline
              fill="none"
              stroke="#6366f1"
              strokeWidth="2"
              points="0,20 15,15 30,18 45,8 60,12 75,4 100,10"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
