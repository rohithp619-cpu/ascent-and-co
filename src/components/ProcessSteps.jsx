const steps = [
  { n: "01", t: "Match your trek", d: "Use the finder or chat with our AI advisor. We shortlist expeditions that fit your season, fitness, and calendar." },
  { n: "02", t: "Book a call", d: "A lead guide reviews your goals, medical history, and gear list. You get a written itinerary within 48 hours." },
  { n: "03", t: "We handle logistics", d: "Permits, insurance, domestic flights, hotels, porters, dietary needs, and rescue coverage — all arranged before you land." },
  { n: "04", t: "Trek with us", d: "Meet your guide at basecamp. Small groups, satellite comms, daily medical checks, ethical porter loads, zero-waste kitchens." },
];

export function ProcessSteps() {
  return (
    <section id="process" className="py-24 md:py-32 bg-ink text-white">
      <div className="px-6 md:px-10 max-w-7xl mx-auto">
        <div className="max-w-2xl mb-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent mb-4">How it works</p>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter">
            From shortlist to summit
            <br />
            in four steps.
          </h2>
        </div>
        <ol className="grid md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <li key={s.n} className="relative">
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent">Step {s.n}</span>
                {i < steps.length - 1 && <span className="hidden md:block flex-1 h-px bg-white/15" />}
              </div>
              <h3 className="text-xl font-extrabold tracking-tight mb-3">{s.t}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
