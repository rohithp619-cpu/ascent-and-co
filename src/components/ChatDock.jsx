import { useNavigate } from 'react-router-dom'

const SUGGESTED = [
  { label: 'Best first Himalayan trek?', prompt: 'What is the best first Himalayan trek for someone with moderate fitness?' },
  { label: 'Budget treks under $500', prompt: 'Recommend a great Himalayan trek with a budget under $500 per person.' },
]

export function ChatDock() {
  const navigate = useNavigate()

  return (
    <>
      {/* Suggestion chips */}
      <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-2 pointer-events-none">
        {SUGGESTED.map((s, i) => (
          <button
            key={s.label}
            onClick={() => navigate(`/chat?q=${encodeURIComponent(s.prompt)}`)}
            className="pointer-events-auto bg-white/95 backdrop-blur border border-ink/10 px-4 py-2 rounded-full text-[11px] font-medium shadow-lg hover:border-accent hover:-translate-y-0.5 transition-all"
            style={{ animation: `slideUp 0.6s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.1}s both` }}
          >
            "{s.label}"
          </button>
        ))}
      </div>

      {/* Floating button */}
      <button
        onClick={() => navigate('/chat')}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-ink text-white p-2 pl-5 rounded-full shadow-2xl ring-1 ring-white/10 hover:pl-6 transition-all"
      >
        <span className="text-xs font-bold tracking-tight">Ask Basecamp AI</span>
        <span className="size-10 bg-accent rounded-full grid place-items-center shrink-0">
          <span className="size-2 bg-white rounded-full animate-pulse" />
        </span>
      </button>
    </>
  )
}
