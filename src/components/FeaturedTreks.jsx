import { Link } from 'react-router-dom'

export function FeaturedTreks({ treks = [], loading = false }) {
  const featured = treks.slice(0, 8);

  return (
    <section id="treks" className="pb-32 bg-base pt-8">
      <div className="px-6 md:px-8 max-w-7xl mx-auto mb-10 flex justify-between items-end">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent mb-2">Ritual · 002</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter">Priority Routes</h2>
        </div>
        <div className="flex gap-4 items-center">
          <span className="h-px w-16 md:w-32 bg-ink/10" />
          {!loading && (
            <span className="text-xs font-bold text-ink/40">
              {treks.length} expeditions
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex overflow-x-auto snap-x no-scrollbar px-6 md:px-8 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-none w-[300px] md:w-[360px] snap-center">
              <div className="w-full aspect-[3/4] rounded-sm mb-5 bg-ink/5 animate-pulse" />
              <div className="h-4 bg-ink/5 rounded animate-pulse mb-2 w-3/4" />
              <div className="h-3 bg-ink/5 rounded animate-pulse w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex overflow-x-auto snap-x no-scrollbar px-6 md:px-8 gap-6">
          {featured.map((t) => (
            <div key={t.slug} className="flex-none w-[300px] md:w-[360px] snap-center group flex flex-col">
              <a href={`/trek/${t.slug}`} className="block">
                <div className="relative w-full aspect-[3/4] rounded-sm mb-5 overflow-hidden bg-slate-alpine/30">
                  <img
                    src={t.image}
                    alt={t.name}
                    loading="lazy"
                    width={720}
                    height={960}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-white/90 backdrop-blur px-2.5 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider">{t.country}</span>
                    <span className="bg-accent text-white px-2.5 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider">{t.difficulty}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="font-mono text-[10px] uppercase tracking-widest opacity-70 mb-1">Alt · {t.maxAltitudeM.toLocaleString()}m</div>
                    <div className="text-2xl font-extrabold tracking-tight leading-tight">{t.name}</div>
                  </div>
                </div>
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <div className="font-mono text-[10px] text-ink/40 uppercase tracking-widest">{t.region} · {t.days} Days</div>
                    <div className="text-ink/70 text-sm mt-1">{t.tagline}</div>
                  </div>
                  <span className="text-sm font-bold">${t.priceUSD.toLocaleString()}</span>
                </div>
              </a>
              <div className="mt-auto grid grid-cols-2 gap-2">
                <Link
                  to={`/trek/${t.slug}/map`}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-ink/10 text-[11px] font-semibold text-ink/50 hover:text-ink hover:border-accent/50 hover:bg-accent/4 transition-all group/map"
                >
                  <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                    <line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" />
                  </svg>
                  3D Route
                </Link>
                <Link
                  to={`/trek/${t.slug}/travel`}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-ink/10 text-[11px] font-semibold text-ink/50 hover:text-ink hover:border-accent/50 hover:bg-accent/4 transition-all group/travel"
                >
                  <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
                  </svg>
                  Plan Travel
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
