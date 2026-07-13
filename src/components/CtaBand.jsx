export function CtaBand() {
  return (
    <section className="py-20 md:py-28 bg-accent text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.08]">
        <svg viewBox="0 0 800 400" className="w-full h-full" preserveAspectRatio="none">
          {Array.from({ length: 10 }).map((_, i) => (
            <path
              key={i}
              d={`M0 ${380 - i * 30} Q 200 ${340 - i * 32} 400 ${360 - i * 28} T 800 ${330 - i * 30}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>
      <div className="relative px-6 md:px-10 max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
        <div className="flex items-start gap-6 max-w-2xl">
          {/* Rohith avatar */}
          <div className="shrink-0 hidden sm:block">
            <div className="size-16 rounded-full overflow-hidden ring-2 ring-white/30 shadow-xl">
              <img src="/guide.jpg" alt="Rohith" className="w-full h-full object-cover object-top" />
            </div>
            <div className="mt-2 text-center font-mono text-[8px] uppercase tracking-widest text-white/50">Rohith</div>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/70 mb-3">Next season · Autumn 2026</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter">18 departures still open.</h2>
            <p className="mt-4 text-white/80 max-w-lg leading-relaxed">
              Start with a free 20-minute call with Rohith — no deposit, no pressure. He'll only book you if the mountain genuinely fits your level.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <a
            href="#matcher"
            className="text-[11px] font-bold uppercase tracking-widest bg-white text-ink px-6 py-3.5 rounded-full hover:bg-white/90 transition-all"
          >
            Plan my expedition →
          </a>
          <a
            href="#/chat?tab=advisor"
            className="text-[11px] font-bold uppercase tracking-widest border border-white/40 px-6 py-3.5 rounded-full hover:bg-white/10 transition-all"
          >
            Ask Basecamp AI
          </a>
        </div>
      </div>
    </section>
  );
}
