import { SiteNav } from '../components/SiteNav'
import { GuideSection } from '../components/GuideSection'
import { SiteFooter } from '../components/SiteFooter'

const REASONS = [
  { icon: '🏔️', title: 'Expedition fit check', body: 'Rohith reviews your fitness, experience, and calendar to shortlist the two or three routes that genuinely match your level.' },
  { icon: '🗓️', title: 'Itinerary in 48 hours', body: 'After the call you receive a written day-by-day itinerary with altitude profile, accommodation, and full cost breakdown.' },
  { icon: '🎒', title: 'Gear & prep advice', body: 'Walk away knowing exactly what to pack, what to train, and what permits to start collecting — months before you fly.' },
  { icon: '💰', title: 'No deposit, no pressure', body: 'The call is free. We only proceed if you are genuinely confident the mountain fits. No hard sell, ever.' },
]

function BookingSection() {
  return (
    <section className="py-20 md:py-28 bg-ink text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left — reasons */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent mb-4">Free planning call</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-6">
              20 minutes with Rohith.<br />
              <span className="text-white/40">No deposit. No pressure.</span>
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mb-12 max-w-md">
              Every booking starts here — a quick voice or video call where Rohith understands your goals and you understand what the mountain actually demands.
            </p>
            <div className="grid sm:grid-cols-2 gap-5">
              {REASONS.map((r) => (
                <div key={r.title} className="p-5 bg-white/5 border border-white/8 rounded-2xl hover:border-accent/30 transition-all">
                  <span className="text-2xl mb-3 block">{r.icon}</span>
                  <h3 className="text-sm font-extrabold tracking-tight text-white mb-1.5">{r.title}</h3>
                  <p className="text-white/50 text-xs leading-relaxed">{r.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — booking form */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-7">
                <div className="size-10 rounded-full overflow-hidden ring-2 ring-accent/30 shrink-0">
                  <img src="/guide.jpg" alt="Rohith" className="w-full h-full object-cover object-top" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-white">Book a call with Rohith</p>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-white/35 mt-0.5">Usually responds within 2 hours</p>
                </div>
                <span className="ml-auto flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-emerald-400">
                  <span className="size-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Available
                </span>
              </div>

              <form
                onSubmit={(e) => e.preventDefault()}
                className="space-y-4"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-white/40 mb-1.5">First name</label>
                    <input type="text" placeholder="Alex"
                      className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-accent/40" />
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-white/40 mb-1.5">Last name</label>
                    <input type="text" placeholder="Rivera"
                      className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-accent/40" />
                  </div>
                </div>
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-white/40 mb-1.5">Email</label>
                  <input type="email" placeholder="alex@email.com"
                    className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-accent/40" />
                </div>
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-white/40 mb-1.5">Trek in mind (optional)</label>
                  <input type="text" placeholder="e.g. Everest Base Camp, Spiti…"
                    className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-accent/40" />
                </div>
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-white/40 mb-1.5">Tell Rohith about your goal</label>
                  <textarea rows={3} placeholder="First Himalayan trek, moderate fitness, March 2026…"
                    className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none" />
                </div>
                <button type="submit"
                  className="w-full bg-accent text-white py-3.5 rounded-xl text-sm font-bold tracking-wide hover:brightness-110 transition-all shadow-lg shadow-accent/20">
                  Request a free call →
                </button>
                <p className="text-center text-white/25 text-[10px] font-mono uppercase tracking-widest">
                  No spam · Reply within 2 hours · Zoom or WhatsApp
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export function GuidePage() {
  return (
    <div className="min-h-screen bg-base text-ink">
      <SiteNav variant="light" />
      <div className="pt-20">
        <GuideSection />
        <BookingSection />
      </div>
      <SiteFooter />
    </div>
  )
}
