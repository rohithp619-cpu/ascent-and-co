const STATS = [
  { value: '8+', label: 'Years in the Himalayas' },
  { value: '40+', label: 'Expeditions led' },
  { value: '6,000m', label: 'Highest summit' },
  { value: '500+', label: 'Trekkers guided' },
]

const CREDENTIALS = [
  'Wilderness First Responder (WFR) certified',
  'NOLS Mountain Leadership graduate',
  'Certified High Altitude Guide — Himalayan Mountaineering Institute',
  'Fluent in Hindi, Ladakhi & English',
]

export function GuideSection() {
  return (
    <section id="guide" className="py-24 md:py-32 bg-base overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">

        {/* Section label */}
        <div className="flex items-center gap-3 mb-14">
          <span className="h-px flex-1 max-w-8 bg-accent/40" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">Your Guide</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* Image column */}
          <div className="relative">
            {/* Decorative background block */}
            <div className="absolute -top-6 -left-6 right-12 bottom-12 bg-slate-alpine/8 rounded-3xl" />
            {/* Corner accent */}
            <div className="absolute -bottom-3 -right-3 size-24 border-2 border-accent/20 rounded-2xl" />

            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/guide.jpg"
                alt="Rohith — Lead Guide, Ascent & Co."
                className="w-full object-cover object-top"
                style={{ maxHeight: '580px' }}
              />
              {/* Overlay gradient at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ink/70 to-transparent" />
              {/* Location chip */}
              <div className="absolute bottom-5 left-5 flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                <span className="size-2 bg-accent rounded-full animate-pulse" />
                <span className="text-white text-xs font-bold tracking-wide">Spiti Valley, India · 4,270 m</span>
              </div>
            </div>
          </div>

          {/* Bio column */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent mb-3">Lead Guide &amp; Founder</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-ink leading-none mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              Rohith<br />
              <span className="italic font-medium text-accent">Ray</span>
            </h2>

            <p className="text-ink/65 leading-relaxed mb-5">
              Born with the mountains in view, Rohith has spent over eight years navigating the high passes and hidden valleys of the Indian and Nepali Himalayas. What began as a personal obsession with altitude became a calling — sharing these landscapes with adventurers from every corner of the world.
            </p>
            <p className="text-ink/65 leading-relaxed mb-8">
              From the turquoise lakes of Spiti to the shadow of Everest, Rohith brings an intimate local knowledge, a deep respect for Himalayan culture, and an unwavering focus on safety. Every expedition he designs is a balance of ambition and care — pushing you further than you thought possible, while bringing you home safe.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              {STATS.map((s) => (
                <div key={s.label} className="text-center p-4 bg-white border border-ink/8 rounded-2xl shadow-sm">
                  <p className="text-2xl font-extrabold tracking-tight text-accent mb-0.5">{s.value}</p>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-ink/45 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Credentials */}
            <div className="space-y-2.5 mb-10">
              {CREDENTIALS.map((c) => (
                <div key={c} className="flex items-start gap-3">
                  <span className="size-5 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0 mt-0.5">
                    <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                  <p className="text-sm text-ink/70">{c}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-3">
              <a href="#/chat?tab=advisor"
                className="inline-flex items-center gap-2.5 bg-accent text-white px-6 py-3 rounded-full text-sm font-bold tracking-wide hover:brightness-110 transition-all shadow-lg shadow-accent/20">
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
                Plan with Rohith's AI
              </a>
              <a href="#/"
                className="inline-flex items-center gap-2 border border-ink/15 text-ink px-6 py-3 rounded-full text-sm font-bold tracking-wide hover:border-accent hover:text-accent transition-all">
                View expeditions
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
