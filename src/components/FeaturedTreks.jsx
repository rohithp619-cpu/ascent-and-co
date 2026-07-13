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
            <a
              key={t.slug}
              href={`/trek/${t.slug}`}
              className="flex-none w-[300px] md:w-[360px] snap-center group"
            >
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
              <div className="flex justify-between items-end">
                <div>
                  <div className="font-mono text-[10px] text-ink/40 uppercase tracking-widest">{t.region} · {t.days} Days</div>
                  <div className="text-ink/70 text-sm mt-1">{t.tagline}</div>
                </div>
                <span className="text-sm font-bold">${t.priceUSD.toLocaleString()}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
