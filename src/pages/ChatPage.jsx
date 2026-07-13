import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useConversations } from '../hooks/useConversations'
import { streamChat } from '../lib/gemini'

// ─── Suggested questions ──────────────────────────────────────────────────────
const GENERAL_SUGGESTIONS = [
  { label: 'Best first Himalayan trek?', prompt: 'What is the best first Himalayan trek for someone with moderate fitness and no high-altitude experience?' },
  { label: '5-day winter trek in India', prompt: 'Recommend the best 5-day winter trek in India for a weekend hiker.' },
  { label: 'EBC vs Annapurna Circuit', prompt: 'Compare Everest Base Camp and Annapurna Circuit — which should I do first?' },
  { label: 'Budget treks under $500', prompt: 'What are the best Himalayan treks with a total budget under $500 per person?' },
  { label: 'Best treks above 5,000 m', prompt: 'What are the most rewarding treks that reach above 5,000 metres?' },
  { label: 'Best autumn treks in Nepal', prompt: 'Which treks are best during autumn in Nepal and why?' },
]

const TREK_SUGGESTIONS = (name) => [
  { label: `Best time to do ${name}`, prompt: `When is the best time to do ${name} and why?` },
  { label: 'Fitness & training tips', prompt: `What fitness preparation do I need for ${name}?` },
  { label: 'Permits & logistics', prompt: `What permits and logistics are required for ${name}?` },
  { label: 'What to pack', prompt: `What should I pack for ${name}?` },
  { label: 'Altitude sickness risk', prompt: `What is the altitude sickness risk on ${name} and how do I prepare?` },
  { label: 'Full budget breakdown', prompt: `Break down the full budget for ${name} including permits, accommodation, food, and guide fees.` },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function relativeTime(ts) {
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function inlineFormat(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*\*[^*]*/g, '') // strip unmatched ** (truncated output)
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-ink/8 px-1 rounded text-[0.85em] font-mono">$1</code>')
}

function MarkdownText({ text }) {
  const lines = (text || '').split('\n')
  const blocks = []
  let listItems = []

  const flushList = () => {
    if (listItems.length) {
      blocks.push(`<ul class="space-y-1.5 my-2">${listItems.join('')}</ul>`)
      listItems = []
    }
  }

  for (const line of lines) {
    if (/^### (.+)/.test(line)) {
      flushList()
      blocks.push(`<p class="text-[11px] font-bold uppercase tracking-widest text-accent mt-3 mb-0.5">${inlineFormat(line.replace(/^### /, ''))}</p>`)
    } else if (/^## (.+)/.test(line)) {
      flushList()
      blocks.push(`<p class="text-sm font-extrabold tracking-tight text-ink mt-3 mb-1 border-b border-ink/8 pb-1">${inlineFormat(line.replace(/^## /, ''))}</p>`)
    } else if (/^[-*] (.+)/.test(line)) {
      const content = line.replace(/^[-*] /, '')
      listItems.push(`<li class="leading-snug">${inlineFormat(content)}</li>`)
    } else if (line.trim() === '') {
      flushList()
      blocks.push('<div class="h-1.5"></div>')
    } else {
      flushList()
      blocks.push(`<p class="leading-relaxed">${inlineFormat(line)}</p>`)
    }
  }
  flushList()

  return <span dangerouslySetInnerHTML={{ __html: blocks.join('') }} />
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ conversations, activeId, onSelect, onNewGeneral, onNewTrek, onDelete, open, setOpen, tab, setTab }) {
  const general = conversations.filter((c) => c.type === 'general')
  const trek = conversations.filter((c) => c.type === 'trek')
  const list = tab === 'general' ? general : trek

  return (
    <>
      {open && <div className="fixed inset-0 bg-ink/50 z-30 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed lg:relative inset-y-0 left-0 z-40 lg:z-auto w-72 bg-ink text-white flex flex-col shrink-0 transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Header */}
        <div className="px-5 pt-6 pb-4 border-b border-white/8">
          <div className="flex items-center justify-between mb-5">
            <a href="#/" className="flex items-center gap-2 group">
              <span className="size-7 bg-accent rounded-sm grid place-items-center shrink-0 group-hover:rotate-3 transition-transform">
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M3 20 L12 4 L21 20 Z" fill="white" />
                </svg>
              </span>
              <span className="text-sm font-extrabold tracking-tight">Ascent &amp; Co.</span>
            </a>
            <button onClick={() => setOpen(false)} className="lg:hidden text-white/40 hover:text-white">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
          {/* Tabs */}
          <div className="flex gap-1 bg-white/8 rounded-xl p-1">
            {[['general', 'Ask Anything'], ['trek', 'Trek Advisor']].map(([key, label]) => (
              <button key={key} onClick={() => { setTab(key); onNewGeneral && key === 'general' && setOpen(false) }}
                className={`flex-1 py-1.5 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all ${tab === key ? 'bg-accent text-white' : 'text-white/50 hover:text-white'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* New chat */}
        <div className="px-4 py-3 border-b border-white/8">
          <button onClick={tab === 'general' ? onNewGeneral : onNewTrek}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-accent hover:brightness-110 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all">
            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            New {tab === 'general' ? 'Conversation' : 'Trek Chat'}
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {list.length === 0 ? (
            <p className="text-center text-white/30 text-xs py-8">No conversations yet</p>
          ) : list.map((c) => (
            <div key={c.id}
              onClick={() => { onSelect(c.id); setOpen(false) }}
              className={`group flex items-start gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${c.id === activeId ? 'bg-accent/15' : 'hover:bg-white/5'}`}>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{c.title}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {c.trekName && <span className="text-[10px] font-mono uppercase tracking-wide text-accent truncate max-w-[100px]">{c.trekName}</span>}
                  <span className="text-[10px] text-white/30">{relativeTime(c.updatedAt)}</span>
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); onDelete(c.id) }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-red-400 mt-0.5 shrink-0">
                <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>

        <div className="px-5 py-4 border-t border-white/8">
          <p className="font-mono text-[9px] uppercase tracking-widest text-white/20 text-center">Basecamp AI · Powered by Gemini</p>
        </div>
      </aside>
    </>
  )
}

// ─── Trek picker ──────────────────────────────────────────────────────────────
const DIFF_COLOR = { Easy: 'bg-emerald-100 text-emerald-700', Moderate: 'bg-sky-100 text-sky-700', Challenging: 'bg-amber-100 text-amber-700', Technical: 'bg-red-100 text-red-700' }

function TrekCard({ trek, onSelect, index }) {
  return (
    <button
      onClick={() => onSelect(trek)}
      className="relative group rounded-2xl overflow-hidden text-left focus:outline-none focus:ring-2 focus:ring-accent/60 h-52"
      style={{ animation: `trekCardIn 0.55s cubic-bezier(0.16,1,0.3,1) ${index * 0.055}s both` }}
    >
      {/* Background image */}
      <img
        src={trek.image}
        alt={trek.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
      {/* Hover glow ring */}
      <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-accent/70 transition-all duration-300" />
      {/* Top badge */}
      <div className="absolute top-3 left-3">
        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${DIFF_COLOR[trek.difficulty] ?? 'bg-white/20 text-white'}`}>
          {trek.difficulty}
        </span>
      </div>
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-3.5">
        <p className="text-white font-extrabold text-sm leading-tight mb-1.5 truncate">{trek.name}</p>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-mono text-[9px] uppercase tracking-widest text-white/60">{trek.region}</span>
          <span className="text-white/30">·</span>
          <span className="font-mono text-[9px] text-white/60">{trek.days}d</span>
          <span className="text-white/30">·</span>
          <span className="font-mono text-[9px] text-white/60">{trek.maxAltitudeM?.toLocaleString()}m</span>
        </div>
      </div>
    </button>
  )
}

function TrekPicker({ treks, onSelect, onCancel }) {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() =>
    treks.filter((t) =>
      `${t.name} ${t.region} ${t.country}`.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 18), [treks, query])

  return (
    <div className="flex-1 overflow-y-auto">
      <style>{`
        @keyframes trekCardIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes advisorRingSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes advisorOrbit {
          from { transform: rotate(0deg)   translateX(44px) rotate(0deg);   }
          to   { transform: rotate(360deg) translateX(44px) rotate(-360deg); }
        }
        @keyframes advisorOrbit2 {
          from { transform: rotate(120deg)  translateX(44px) rotate(-120deg);  }
          to   { transform: rotate(480deg)  translateX(44px) rotate(-480deg);  }
        }
        @keyframes advisorOrbit3 {
          from { transform: rotate(240deg)  translateX(44px) rotate(-240deg);  }
          to   { transform: rotate(600deg)  translateX(44px) rotate(-600deg);  }
        }
        @keyframes floatUp {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
      `}</style>

      {/* Hero */}
      <div className="px-6 pt-10 pb-6 text-center bg-gradient-to-b from-ink/4 to-transparent">
        {/* AI animation */}
        <div className="relative size-28 mx-auto mb-5">
          {/* Outer dashed ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-accent/25"
            style={{ animation: 'advisorRingSpin 14s linear infinite reverse' }} />
          {/* Middle solid ring */}
          <div className="absolute inset-3 rounded-full border border-accent/35"
            style={{ animation: 'advisorRingSpin 8s linear infinite' }} />
          {/* Pulse glow */}
          <div className="absolute inset-6 rounded-full bg-accent/10 animate-pulse" />
          {/* Mountain icon — floating */}
          <div className="absolute inset-6 rounded-full flex items-center justify-center"
            style={{ animation: 'floatUp 3s ease-in-out infinite' }}>
            <svg viewBox="0 0 24 24" className="size-9 text-accent drop-shadow-[0_0_8px_rgba(var(--accent-rgb,74,90,73),0.6)]" fill="currentColor">
              <path d="M3 20 L12 4 L21 20 Z" opacity="0.25" />
              <path d="M6 20 L12 7 L18 20 Z" />
            </svg>
          </div>
          {/* Orbiting dots */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-2.5 bg-accent rounded-full shadow-[0_0_6px_2px_rgba(74,90,73,0.4)]"
              style={{ animation: 'advisorOrbit 4s linear infinite' }} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-2 bg-accent/60 rounded-full"
              style={{ animation: 'advisorOrbit2 4s linear infinite' }} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-1.5 bg-accent/40 rounded-full"
              style={{ animation: 'advisorOrbit3 4s linear infinite' }} />
          </div>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-ink mb-1.5">Trek Advisor</h2>
        <p className="text-ink/45 text-sm max-w-sm mx-auto">
          Pick an expedition — your AI guide will dive deep into that specific trek.
        </p>

        {/* Search */}
        <div className="relative mt-6 max-w-md mx-auto">
          <svg viewBox="0 0 24 24" className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-ink/30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search treks, regions, countries…"
            className="w-full pl-10 pr-4 py-3 bg-white border border-ink/10 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/30 text-ink placeholder-ink/30" />
        </div>
      </div>

      {/* Cards grid */}
      <div className="px-4 md:px-6 pb-8">
        {filtered.length === 0 ? (
          <p className="text-center text-ink/30 text-sm py-10">No treks found</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((t, i) => (
              <TrekCard key={t.slug} trek={t} onSelect={onSelect} index={i} />
            ))}
          </div>
        )}
        {onCancel && (
          <div className="text-center mt-6">
            <button onClick={onCancel} className="text-xs text-ink/35 hover:text-ink transition-colors">
              ← Back to Ask Anything
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Welcome / empty state ────────────────────────────────────────────────────
function WelcomeState({ type, trek, treks, suggestions, onSend, onPickTrek }) {
  if (type === 'trek' && !trek) {
    return <TrekPicker treks={treks} onSelect={onPickTrek} />
  }
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-16 overflow-y-auto">
      <div className="w-full max-w-xl">
        {trek ? (
          <div className="mb-8 p-4 bg-white border border-ink/8 rounded-2xl flex gap-4 items-center shadow-sm">
            <div className="size-14 rounded-xl overflow-hidden shrink-0 bg-slate-alpine/20">
              <img src={trek.image} alt={trek.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-1">Trek Advisor · Active Context</p>
              <p className="text-lg font-extrabold tracking-tight text-ink">{trek.name}</p>
              <p className="text-xs text-ink/50">{trek.region} · {trek.days} days · {trek.difficulty} · ${trek.priceUSD?.toLocaleString()}</p>
            </div>
          </div>
        ) : (
          <div className="mb-8 text-center">
            <div className="size-16 bg-accent/10 rounded-2xl grid place-items-center mx-auto mb-4">
              <span className="size-3 bg-accent rounded-full animate-pulse" />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-ink mb-2">What are we climbing today?</h2>
            <p className="text-ink/40 text-sm">Ask anything about Himalayan expeditions — live access to {treks.length} treks.</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          {suggestions.map((s) => (
            <button key={s.label} onClick={() => onSend(s.prompt)}
              className="text-left p-3.5 rounded-xl border border-ink/8 bg-white hover:border-accent/40 hover:bg-accent/3 transition-all group">
              <p className="text-[12px] font-medium text-ink/70 group-hover:text-ink leading-snug">{s.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Messages ─────────────────────────────────────────────────────────────────
function MessageList({ messages, trek, streamingId }) {
  const bottomRef = useRef(null)
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">
      {trek && (
        <div className="flex items-center gap-3 p-3 bg-accent/5 border border-accent/15 rounded-xl">
          <div className="size-9 rounded-lg overflow-hidden shrink-0"><img src={trek.image} alt={trek.name} className="w-full h-full object-cover" /></div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-accent">Trek Advisor Context</p>
            <p className="text-sm font-bold text-ink">{trek.name} · {trek.region} · {trek.days}d</p>
          </div>
        </div>
      )}
      {messages.map((msg, i) => (
        <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          {msg.role === 'assistant' && (
            <div className="size-8 bg-ink rounded-full grid place-items-center shrink-0 mt-0.5">
              <span className="size-2 bg-accent rounded-full" />
            </div>
          )}
          <div className={`max-w-[75%] md:max-w-[65%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            msg.role === 'user'
              ? 'bg-ink text-white rounded-tr-sm'
              : 'bg-white border border-ink/8 text-ink rounded-tl-sm shadow-sm'
          }`}>
            {msg.role === 'assistant' ? (
              <>
                <MarkdownText text={msg.content} />
                {i === streamingId && !msg.content && (
                  <span className="inline-flex gap-0.5">
                    {[0,1,2].map((j) => (
                      <span key={j} className="size-1 bg-accent rounded-full animate-bounce" style={{ animationDelay: `${j*0.15}s` }} />
                    ))}
                  </span>
                )}
              </>
            ) : msg.content}
          </div>
          {msg.role === 'user' && (
            <div className="size-8 bg-accent rounded-full grid place-items-center shrink-0 mt-0.5 text-white text-xs font-bold">U</div>
          )}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}

// ─── Input ────────────────────────────────────────────────────────────────────
function ChatInput({ onSend, streaming, disabled }) {
  const [input, setInput] = useState('')
  const ref = useRef(null)

  function submit() {
    const text = input.trim()
    if (!text || streaming || disabled) return
    onSend(text)
    setInput('')
    setTimeout(() => ref.current?.focus(), 0)
  }

  return (
    <div className="border-t border-ink/8 px-4 md:px-8 py-4 bg-white shrink-0">
      <div className="max-w-3xl mx-auto flex gap-3 items-end">
        <textarea ref={ref} rows={1} value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }}
          placeholder={disabled ? 'Loading trek data…' : 'Ask about treks, fitness, seasons, permits…'}
          disabled={disabled || streaming}
          className="flex-1 resize-none text-sm text-ink placeholder-ink/30 bg-base border border-ink/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50 max-h-36 overflow-y-auto"
          style={{ lineHeight: '1.5' }} />
        <button onClick={submit} disabled={!input.trim() || streaming || disabled}
          className="size-11 rounded-xl bg-accent text-white grid place-items-center shrink-0 hover:brightness-110 transition-all disabled:opacity-30">
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
          </svg>
        </button>
      </div>
      <p className="font-mono text-[8px] uppercase tracking-widest text-ink/20 mt-2 text-center">Basecamp AI · Ascent &amp; Co.</p>
    </div>
  )
}

// ─── ChatPage ─────────────────────────────────────────────────────────────────
export function ChatPage({ treks, loading: treksLoading }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const { conversations, createConversation, addMessage, updateLastMessage, deleteConversation } = useConversations()

  const [activeId, setActiveId] = useState(null)
  const [streaming, setStreaming] = useState(false)
  const [streamingMsgIdx, setStreamingMsgIdx] = useState(null)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('general')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showPicker, setShowPicker] = useState(false)

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null
  const activeTrek = useMemo(() => {
    if (!activeConversation?.trekSlug) return null
    return treks.find((t) => t.slug === activeConversation.trekSlug) ?? null
  }, [activeConversation, treks])

  // Handle ?tab=advisor — auto-open Trek Advisor picker
  const handledTab = useRef(false)
  useEffect(() => {
    if (handledTab.current) return
    if (searchParams.get('tab') === 'advisor') {
      handledTab.current = true
      setTab('trek')
      setShowPicker(true)
    }
  }, [searchParams])

  // Handle ?q= auto-prompt from dock chips
  const handledQ = useRef(false)
  useEffect(() => {
    const q = searchParams.get('q')
    if (!q || handledQ.current || treks.length === 0) return
    handledQ.current = true
    handleSend(q, 'general', null, true)
  }, [searchParams, treks.length])

  function newGeneral() { setActiveId(null); setShowPicker(false); setTab('general') }
  function newTrek() { setActiveId(null); setShowPicker(true); setTab('trek') }

  function selectConversation(id) {
    const c = conversations.find((x) => x.id === id)
    setActiveId(id)
    setShowPicker(false)
    if (c) setTab(c.type)
  }

  function pickTrek(trek) {
    setShowPicker(false)
    const id = createConversation('trek', trek)
    setActiveId(id)
    setTab('trek')
  }

  // Core send — creates conversation if needed, streams response
  async function handleSend(text, typeOverride, trekOverride, createNew = false) {
    if (!text || streaming) return
    setError(null)

    let id = activeId
    let focusTrek = activeTrek

    if (!id || createNew) {
      const type = typeOverride ?? tab
      const trek = trekOverride !== undefined ? trekOverride : activeTrek
      id = createConversation(type, trek)
      setActiveId(id)
      focusTrek = trek
    }

    // Get completed history (exclude any empty assistant placeholder)
    const conv = conversations.find((c) => c.id === id)
    const history = (conv?.messages ?? []).filter((m) => m.content)

    // Add user message
    addMessage(id, { role: 'user', content: text })
    // Add empty assistant placeholder
    addMessage(id, { role: 'assistant', content: '' })
    const newMsgIdx = (conv?.messages?.length ?? 0) + 1
    setStreamingMsgIdx(newMsgIdx)
    setStreaming(true)

    try {
      let full = ''
      for await (const delta of streamChat(history, text, treks, focusTrek)) {
        full += delta
        updateLastMessage(id, full)
      }
    } catch (err) {
      console.error('Gemini error:', err)
      setError(err.message || 'Something went wrong.')
      updateLastMessage(id, '⚠ ' + (err.message || 'Error getting response.'))
    } finally {
      setStreaming(false)
      setStreamingMsgIdx(null)
    }
  }

  const suggestions = tab === 'trek' && activeTrek
    ? TREK_SUGGESTIONS(activeTrek.name)
    : GENERAL_SUGGESTIONS

  const showWelcome = !showPicker && (!activeConversation || activeConversation.messages.length === 0)

  return (
    <div className="flex h-screen bg-base overflow-hidden">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={selectConversation}
        onNewGeneral={newGeneral}
        onNewTrek={newTrek}
        onDelete={(id) => { deleteConversation(id); if (activeId === id) { setActiveId(null); setShowPicker(false) } }}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        tab={tab}
        setTab={(t) => { setTab(t); setActiveId(null); setShowPicker(t === 'trek') }}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 md:px-6 py-4 border-b border-ink/8 bg-white shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-ink/40 hover:text-ink">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
          </button>
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-ink/40 hover:text-ink transition-colors text-xs font-medium">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
            <span className="hidden sm:inline">Back to site</span>
          </button>
          <div className="flex-1 flex items-center justify-center gap-2">
            <div className="size-6 bg-accent rounded-full grid place-items-center">
              <span className="size-1.5 bg-white rounded-full animate-pulse" />
            </div>
            <span className="text-sm font-extrabold tracking-tight">Basecamp AI</span>
            {!treksLoading && treks.length > 0 && (
              <span className="hidden sm:inline font-mono text-[9px] uppercase tracking-widest text-ink/30">{treks.length} treks · live</span>
            )}
          </div>
          {activeConversation && activeConversation.messages.length > 0 && (
            <button onClick={tab === 'trek' ? newTrek : newGeneral}
              className="flex items-center gap-1.5 text-xs font-medium text-ink/40 hover:text-accent transition-colors">
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
              <span className="hidden sm:inline">New</span>
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {showPicker ? (
            <TrekPicker treks={treks} onSelect={pickTrek}
              onCancel={() => { setShowPicker(false); setTab('general') }} />
          ) : showWelcome ? (
            <WelcomeState
              type={tab} trek={activeTrek} treks={treks} suggestions={suggestions}
              onSend={(text) => handleSend(text)}
              onPickTrek={pickTrek}
            />
          ) : (
            <MessageList
              messages={activeConversation?.messages ?? []}
              trek={activeTrek}
              streamingId={streamingMsgIdx}
            />
          )}

          {error && (
            <div className="px-4 md:px-8 py-2 shrink-0">
              <div className="max-w-3xl mx-auto text-[11px] text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2">
                {error}
              </div>
            </div>
          )}

          {!showPicker && (
            <ChatInput
              onSend={(text) => handleSend(text)}
              streaming={streaming}
              disabled={treksLoading && treks.length === 0}
            />
          )}
        </div>
      </div>
    </div>
  )
}
