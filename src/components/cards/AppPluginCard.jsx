const apps = [
  { name: 'Figma', status: 'Recommended', color: 'bg-neutral-900' },
  { name: 'Google Calendar', status: null, color: 'bg-blue-500' },
  { name: 'GitHub', status: null, color: 'bg-neutral-800' },
  { name: 'Slack', status: null, color: 'bg-purple-500' },
]

export default function AppPluginCard() {
  return (
    <div className="rounded-2xl bg-panel dark:bg-zinc-900 h-[340px] flex items-center justify-center overflow-hidden transition-colors duration-500">
      <div className="w-[170px] rounded-xl bg-white shadow-xl p-3 text-[9px] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-ink text-[10px]">Add Apps</span>
          <span className="text-neutral-400">···</span>
        </div>
        <div className="rounded-md bg-neutral-100 px-2 py-1 mb-2 text-neutral-400">
          Find The App
        </div>
        <div className="flex flex-col gap-1.5">
          {apps.map((a) => (
            <div key={a.name} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className={`w-3.5 h-3.5 rounded ${a.color}`} />
                <span className="text-ink">{a.name}</span>
              </div>
              {a.status ? (
                <span className="text-[6px] px-1 py-0.5 rounded bg-orange-100 text-orange-600">
                  {a.status}
                </span>
              ) : (
                <span className="text-neutral-300">+</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
