const services = [
  { n: "01", t: "Guided Expeditions", d: "Fully-outfitted small-group departures on the 100 iconic Himalayan trails. Certified guides, porters, permits, and safety kit included.", p: "from $890" },
  { n: "02", t: "Custom Itineraries", d: "Private trips built around your team, calendar, and objective — first ascents, film shoots, family journeys, or wellness retreats.", p: "quoted" },
  { n: "03", t: "Permits & Logistics", d: "Restricted-area permits, TIMS cards, insurance, internal flights, gear rental, and airport transfers handled end-to-end.", p: "add-on" },
  { n: "04", t: "Basecamp AI Advisor", d: "24/7 planning companion trained on our expedition database — season windows, fitness fit, packing lists, dietary and altitude prep.", p: "free" },
];

export function ServicesGrid() {
  return (
    <section id="services" className="py-24 md:py-32 bg-base">
      <div className="px-6 md:px-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent mb-4">What we do</p>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-ink">
              Four services.
              <br />
              One expedition, done right.
            </h2>
          </div>
          <p className="max-w-sm text-ink/60 text-sm leading-relaxed">
            Whether you want a slot on a scheduled departure or a private trip built
            from a blank page — the same team, guides, and standards run behind every booking.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-px bg-ink/10 border border-ink/10 rounded-2xl overflow-hidden">
          {services.map((s) => (
            <div key={s.n} className="group bg-base p-8 md:p-10 hover:bg-white transition-colors relative">
              <div className="flex justify-between items-start mb-8">
                <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-ink/40">{s.n} / Service</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent">{s.p}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink mb-3">{s.t}</h3>
              <p className="text-ink/60 text-sm leading-relaxed max-w-md">{s.d}</p>
              <div className="mt-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-ink group-hover:text-accent transition-colors">
                Learn more
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
