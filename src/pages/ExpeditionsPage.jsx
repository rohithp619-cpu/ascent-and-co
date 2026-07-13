import { useState, useMemo } from 'react'
import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'
import { TrekStoryHero } from '../components/TrekStoryHero'

// ─── Constants ────────────────────────────────────────────────────────────────

const DIFF = {
  Easy:        { front: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', back: 'text-emerald-400' },
  Moderate:    { front: 'bg-sky-500/20 text-sky-300 border-sky-500/30',            back: 'text-sky-400' },
  Challenging: { front: 'bg-amber-500/20 text-amber-300 border-amber-500/30',      back: 'text-amber-400' },
  Technical:   { front: 'bg-red-500/20 text-red-300 border-red-500/30',            back: 'text-red-400' },
}

const COUNTRIES    = ['All', 'Nepal', 'India']
const DIFFICULTIES = ['All', 'Easy', 'Moderate', 'Challenging', 'Technical']

// ─── Filter bar ───────────────────────────────────────────────────────────────
function FilterBar({ country, setCountry, difficulty, setDifficulty, count }) {
  return (
    <div className="sticky top-0 z-20 bg-base/90 backdrop-blur-md border-b border-ink/8 px-6 md:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2.5">
        <span className="font-mono text-[9px] uppercase tracking-widest text-ink/30 shrink-0 mr-1">Filter</span>

        {/* Country */}
        <div className="flex gap-1.5">
          {COUNTRIES.map(c => (
            <button key={c} onClick={() => setCountry(c)}
              className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all ${
                country === c
                  ? 'bg-ink text-white border-ink shadow-sm'
                  : 'border-ink/12 text-ink/45 hover:border-ink/25 hover:text-ink/70'
              }`}>
              {c === 'Nepal' ? '🇳🇵 ' : c === 'India' ? '🇮🇳 ' : ''}{c}
            </button>
          ))}
        </div>

        <div className="w-px h-4 bg-ink/15 mx-0.5" />

        {/* Difficulty */}
        <div className="flex gap-1.5 flex-wrap">
          {DIFFICULTIES.map(d => (
            <button key={d} onClick={() => setDifficulty(d)}
              className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all ${
                difficulty === d
                  ? 'bg-ink text-white border-ink shadow-sm'
                  : 'border-ink/12 text-ink/45 hover:border-ink/25 hover:text-ink/70'
              }`}>
              {d}
            </button>
          ))}
        </div>

        <span className="ml-auto font-mono text-[9px] uppercase tracking-widest text-ink/30 shrink-0">
          {count} routes
        </span>
      </div>
    </div>
  )
}

// ─── Trek card (3-D flip) ─────────────────────────────────────────────────────
function TrekCard({ trek, index }) {
  const [flipped, setFlipped] = useState(false)
  const diff = DIFF[trek.difficulty] ?? DIFF.Moderate
  const flag = trek.country === 'Nepal' ? '🇳🇵' : '🇮🇳'

  return (
    <div
      className="relative"
      style={{
        height: 420,
        perspective: '1100px',
        animation: `cardEntrance .55s cubic-bezier(.16,1,.3,1) ${index * 0.045}s both`,
      }}
    >
      <style>{`
        @keyframes cardEntrance {
          from { opacity:0; transform:translateY(22px) scale(.97); }
          to   { opacity:1; transform:translateY(0)   scale(1); }
        }
      `}</style>

      {/* Flip wrapper */}
      <div
        onClick={() => setFlipped(f => !f)}
        style={{
          position: 'absolute', inset: 0,
          transformStyle: 'preserve-3d',
          transition: 'transform .65s cubic-bezier(.4,0,.2,1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          cursor: 'pointer',
        }}
      >

        {/* ── FRONT ── */}
        <div style={{ position:'absolute', inset:0, backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden' }}
          className="rounded-2xl overflow-hidden group">
          <img src={trek.image} alt={trek.name} loading="lazy"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://commons.wikimedia.org/wiki/Special:FilePath/Dughla_Pass%2C_Sagarmatha_National_Park%2C_Nepal.jpg?width=1200' }}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/25 to-transparent" />

          {/* Top badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${diff.front}`}>
              {trek.difficulty}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/18 bg-white/10 text-white/80">
              {flag} {trek.country}
            </span>
          </div>

          {/* Flip hint */}
          <div className="absolute top-4 right-4 size-8 rounded-full bg-black/30 backdrop-blur border border-white/15 grid place-items-center opacity-60 group-hover:opacity-100 transition-opacity">
            <svg viewBox="0 0 24 24" className="size-4 text-white" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </div>

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="font-mono text-[9px] uppercase tracking-widest text-white/45 mb-1">
              {trek.region} · {trek.maxAltitudeM?.toLocaleString()}m
            </p>
            <h3 className="text-xl font-extrabold text-white tracking-tight leading-tight mb-3">{trek.name}</h3>
            <div className="flex flex-wrap gap-1.5">
              {[
                `🗓️ ${trek.days}d`,
                `💰 $${trek.priceUSD?.toLocaleString()}`,
                `🥾 Fit ${trek.fitness}/5`,
              ].map(chip => (
                <span key={chip} className="font-mono text-[9px] text-white/60 bg-white/8 border border-white/10 rounded-full px-2.5 py-1">
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── BACK ── */}
        <div
          style={{ position:'absolute', inset:0,
            backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden',
            transform:'rotateY(180deg)' }}
          className="rounded-2xl overflow-hidden bg-[#09141f] border border-white/8 flex flex-col p-5"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0 pr-2">
              <span className={`text-[9px] font-bold uppercase tracking-widest ${diff.back}`}>{trek.difficulty}</span>
              <h3 className="text-base font-extrabold text-white tracking-tight leading-snug mt-0.5">{trek.name}</h3>
              <p className="font-mono text-[9px] text-white/35 uppercase tracking-widest mt-0.5">{trek.region}</p>
            </div>
            <button
              onClick={e => { e.stopPropagation(); setFlipped(false) }}
              className="size-7 rounded-full bg-white/8 border border-white/12 grid place-items-center text-white/40 hover:text-white transition-colors shrink-0">
              <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Stats 2×2 */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              ['⛰️', 'Max Alt',  `${trek.maxAltitudeM?.toLocaleString()}m`],
              ['🗓️', 'Duration', `${trek.days} days`],
              ['💰', 'From',     `$${trek.priceBudget?.toLocaleString() ?? trek.priceUSD?.toLocaleString()}`],
              ['🥾', 'Fitness',  `${trek.fitness}/5`],
            ].map(([icon, label, val]) => (
              <div key={label} className="bg-white/5 border border-white/8 rounded-xl p-2.5">
                <span className="text-lg leading-none">{icon}</span>
                <p className="font-mono text-[8px] uppercase tracking-widest text-white/30 mt-1">{label}</p>
                <p className="text-xs font-bold text-white mt-0.5">{val}</p>
              </div>
            ))}
          </div>

          {/* Seasons */}
          {trek.seasons?.length > 0 && (
            <div className="mb-3.5">
              <p className="font-mono text-[8px] uppercase tracking-widest text-white/28 mb-1.5">Best seasons</p>
              <div className="flex flex-wrap gap-1.5">
                {trek.seasons.map(s => (
                  <span key={s} className="text-[9px] font-bold text-accent bg-accent/12 border border-accent/20 rounded-full px-2.5 py-0.5">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Highlights */}
          {trek.highlights?.length > 0 && (
            <div className="flex-1 overflow-hidden mb-4">
              <p className="font-mono text-[8px] uppercase tracking-widest text-white/28 mb-1.5">Highlights</p>
              <ul className="space-y-1.5">
                {trek.highlights.slice(0, 3).map(h => (
                  <li key={h} className="flex items-start gap-2 text-[11px] text-white/55 leading-snug">
                    <span className="text-accent shrink-0 mt-0.5 text-[8px]">✦</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA */}
          <a href="#/chat?tab=advisor"
            onClick={e => e.stopPropagation()}
            className="block w-full bg-accent text-white text-center text-[11px] font-bold uppercase tracking-widest py-3 rounded-xl hover:brightness-110 transition-all shadow-lg shadow-accent/20 mt-auto">
            Plan with Basecamp AI →
          </a>
        </div>

      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function ExpeditionsPage({ treks = [], loading }) {
  const [country,    setCountry]    = useState('All')
  const [difficulty, setDifficulty] = useState('All')

  const filtered = useMemo(() =>
    treks.filter(t =>
      (country    === 'All' || t.country    === country) &&
      (difficulty === 'All' || t.difficulty === difficulty)
    ), [treks, country, difficulty])

  return (
    <div className="min-h-screen bg-base text-ink">
      <SiteNav variant="dark" />

      <TrekStoryHero trekCount={treks.length} />

      <FilterBar
        country={country}    setCountry={setCountry}
        difficulty={difficulty} setDifficulty={setDifficulty}
        count={filtered.length}
      />

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 pb-24">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-[420px] rounded-2xl bg-ink/5 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-ink/30">
            <p className="text-4xl mb-3">🏔️</p>
            <p className="font-bold text-lg">No expeditions match those filters</p>
            <button onClick={() => { setCountry('All'); setDifficulty('All') }}
              className="mt-4 text-xs font-bold uppercase tracking-widest text-accent hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((t, i) => (
              <TrekCard key={t.slug} trek={t} index={i} />
            ))}
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  )
}
