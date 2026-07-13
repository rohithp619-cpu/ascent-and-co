const QUOTES = [
  {
    q: "We summited Mera Peak in a whiteout without a single scare — the guides read the mountain like a book. Every acclimatisation day was earned.",
    a: "Priya M.", country: "🇮🇳", r: "Mera Peak · 2025", color: "bg-rose-500",
  },
  {
    q: "Booked Annapurna Circuit six weeks out. They handled visas, permits, and even my vegetarian meals at 4,500 m. I just showed up and walked.",
    a: "David K.", country: "🇬🇧", r: "Annapurna Circuit · 2024", color: "bg-sky-600",
  },
  {
    q: "The AI advisor picked a trek I'd never heard of and it turned out to be the best three weeks of my life. That's not marketing, that's Nar-Phu.",
    a: "Elena R.", country: "🇩🇪", r: "Nar-Phu Valley · 2025", color: "bg-violet-600",
  },
  {
    q: "Rohith met us at 5am with hot chai before the final push to Thorong La. Small detail, but it tells you everything about how this team operates.",
    a: "James T.", country: "🇦🇺", r: "Annapurna Circuit · 2025", color: "bg-amber-600",
  },
  {
    q: "Solo traveller, first Himalayan trek. They paired me with a small group and I came home with four friends and zero safety incidents. Hard to beat.",
    a: "Soo-Jin L.", country: "🇰🇷", r: "Everest Base Camp · 2024", color: "bg-emerald-600",
  },
  {
    q: "Spiti in early winter felt like another planet. The photography light is insane and the villages untouched. Exactly what Rohith promised on the call.",
    a: "Marco F.", country: "🇮🇹", r: "Spiti Valley · 2025", color: "bg-orange-600",
  },
]

function Stars() {
  return (
    <div className="flex gap-0.5 mb-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="size-4 text-amber-400 fill-current">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-ink text-white overflow-hidden">
      <div className="px-6 md:px-10 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent mb-4">Trekker log</p>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter">
              Unedited field
              <br />
              reports.
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {/* Stacked avatars */}
            <div className="flex -space-x-2">
              {QUOTES.slice(0, 4).map((t) => (
                <div key={t.a}
                  className={`size-9 rounded-full ${t.color} ring-2 ring-ink flex items-center justify-center text-white text-xs font-bold`}>
                  {t.a[0]}
                </div>
              ))}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-white/40 leading-relaxed">
              <div className="flex items-center gap-1 text-amber-400 text-sm mb-0.5">
                {'★★★★★'}
                <span className="text-white/70 font-mono text-[10px] normal-case tracking-normal ml-1">4.9 avg</span>
              </div>
              <div>612 verified reviews</div>
            </div>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {QUOTES.map((t, i) => (
            <figure key={t.a}
              className={`bg-white/5 border border-white/8 rounded-2xl p-7 flex flex-col justify-between hover:border-accent/40 hover:bg-white/8 transition-all group ${i === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
              <div>
                <Stars />
                <blockquote className="text-white/80 text-[15px] leading-relaxed group-hover:text-white transition-colors">
                  "{t.q}"
                </blockquote>
              </div>
              <figcaption className="mt-7 pt-5 border-t border-white/8 flex items-center gap-3">
                <div className={`size-10 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                  {t.a[0]}
                </div>
                <div>
                  <div className="font-extrabold tracking-tight text-white text-sm">
                    {t.a} <span className="ml-1">{t.country}</span>
                  </div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-white/35 mt-0.5">{t.r}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

      </div>
    </section>
  )
}
