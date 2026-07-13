export function SiteFooter() {
  return (
    <footer className="pt-16 pb-10 border-t border-ink/5 bg-base">
      <div className="px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <span className="size-5 bg-accent rounded-sm" />
              <span className="font-extrabold text-xl tracking-tighter">ASCENT &amp; CO.</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-ink/60 leading-relaxed">
              Certified guides, hand-crafted expeditions across the Indian &amp; Nepali Himalaya. Small groups. Zero shortcuts.
            </p>
            <div className="mt-6 font-mono text-[10px] uppercase tracking-widest text-ink/40">
              Basecamp · Pokhara, Nepal &nbsp;·&nbsp; +977 61 000 000
            </div>
          </div>
          {[
            { t: "Services", l: ["Guided Expeditions", "Custom Itineraries", "Permits & Logistics", "Corporate Retreats"] },
            { t: "Company", l: ["Our Guides", "Safety", "Sustainability", "Careers"] },
            { t: "Support", l: ["AI Advisor", "FAQ", "Contact", "Terms & Ethics"] },
          ].map((c) => (
            <div key={c.t}>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink/40 mb-4">{c.t}</div>
              <ul className="space-y-2 text-sm text-ink/80">
                {c.l.map((i) => (
                  <li key={i}>
                    <a href="#" className="hover:text-accent transition-colors">{i}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-ink/5 flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[10px] uppercase tracking-widest text-ink/40">
          <div>© 2026 Ascent &amp; Co. Expeditions Pvt. Ltd.</div>
          <div>IATO Certified · NMA Registered · Leave No Trace Partner</div>
        </div>
      </div>
    </footer>
  );
}
