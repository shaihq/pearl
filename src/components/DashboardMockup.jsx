function Row({ label, sub, value, positive }) {
  return (
    <div className="flex items-center justify-between px-3 py-1.5 text-[9px] text-neutral-300">
      <div className="flex items-center gap-1.5">
        <span className="w-3.5 h-3.5 rounded-full bg-neutral-700 shrink-0" />
        <div>
          <div className="text-neutral-200">{label}</div>
          {sub && <div className="text-neutral-500 text-[8px]">{sub}</div>}
        </div>
      </div>
      <span className={positive ? 'text-emerald-400' : 'text-red-400'}>{value}</span>
    </div>
  )
}

export default function DashboardMockup() {
  return (
    <div className="w-full max-w-[560px] rounded-xl bg-[#15161b] text-white shadow-2xl overflow-hidden border border-white/5">
      {/* window bar */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5">
        <span className="w-2 h-2 rounded-full bg-white/20" />
        <span className="w-2 h-2 rounded-full bg-white/20" />
        <span className="w-2 h-2 rounded-full bg-white/20" />
      </div>

      <div className="grid grid-cols-[110px_1fr_130px]">
        {/* left nav */}
        <div className="border-r border-white/5 p-3 flex flex-col gap-3 text-[8px] text-neutral-400">
          <div className="flex items-center gap-1.5 text-white">
            <span className="w-3 h-3 rounded bg-indigo-500" /> Exchange
          </div>
          <div>Overview</div>
          <div>Payments</div>
          <div className="text-white">Portfolio</div>
          <div>History</div>
          <div className="mt-auto pt-6">Messages</div>
          <div>Support</div>
        </div>

        {/* main */}
        <div className="p-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold">0.8932</span>
            <span className="text-[9px] text-neutral-400">Euro</span>
          </div>
          {/* fake chart */}
          <svg viewBox="0 0 220 60" className="w-full h-14 mt-2">
            <polyline
              fill="none"
              stroke="#818cf8"
              strokeWidth="1.5"
              points="0,45 20,40 35,48 50,30 70,35 90,20 110,28 130,15 150,22 170,10 190,18 220,8"
            />
          </svg>

          <div className="mt-3 grid grid-cols-3 gap-1 text-[8px] text-neutral-400">
            <div className="text-white/80">Markets</div>
            <div>Volume</div>
            <div className="text-right">Change</div>
          </div>
          <div className="mt-1 flex flex-col gap-1.5">
            <Row label="BTC/USD" value="+2.4%" positive />
            <Row label="ETH/USD" value="-0.8%" />
            <Row label="SOL/USD" value="+5.1%" positive />
          </div>
        </div>

        {/* right panel */}
        <div className="border-l border-white/5 p-3 text-[8px] text-neutral-400 flex flex-col gap-2">
          <div className="text-white text-[9px]">Order Preview</div>
          <div className="flex justify-between">
            <span>Buy price</span>
            <span className="text-white">0.3600 %</span>
          </div>
          <div className="h-px bg-white/5" />
          <div className="flex justify-between">
            <span>Total</span>
            <span className="text-white">$1,023.70</span>
          </div>
          <div className="flex justify-between text-emerald-400">
            <span>Profit</span>
            <span>+156.30 %</span>
          </div>
          <button className="mt-2 rounded-md bg-indigo-500 text-white text-[8px] py-1.5">
            Sell Order
          </button>
        </div>
      </div>
    </div>
  )
}
