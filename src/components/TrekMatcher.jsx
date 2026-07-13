import { useMemo, useState } from "react";
import { allDifficulties, allSeasons, matchTreks } from "../lib/parseSheet";

const DURATIONS = [
  { key: "short", label: "3–6", sub: "Weekend" },
  { key: "medium", label: "7–10", sub: "Classic" },
  { key: "long", label: "11–15", sub: "Deep dive" },
  { key: "expedition", label: "16+", sub: "Expedition" },
];

const FITNESS_LABELS = {
  1: "Walker",
  2: "Weekend hiker",
  3: "Trail runner",
  4: "Mountain-fit",
  5: "Alpine athlete",
};

export function TrekMatcher({ treks = [], loading = false }) {
  const [duration, setDuration] = useState("medium");
  const [difficulty, setDifficulty] = useState("Moderate");
  const [fitness, setFitness] = useState(3);
  const [season, setSeason] = useState("Autumn");

  const results = useMemo(
    () => matchTreks(treks, { duration, difficulty, fitness, season }).slice(0, 3),
    [treks, duration, difficulty, fitness, season],
  );
  const top = results[0];

  return (
    <section id="matcher" className="py-24 md:py-32 px-6 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent mb-3">Ritual · 001</p>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-pretty max-w-2xl">The Pursuit Finder</h2>
            <p className="mt-4 max-w-lg text-ink/60">
              Four decisions. One expedition. Adjust the dials — the match reshapes in real time.
            </p>
          </div>
          {!loading && treks.length > 0 && (
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink/30">
              Matching across {treks.length} expeditions
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-12">
            <Field label="Duration (Days)">
              <div className="flex flex-wrap gap-2">
                {DURATIONS.map((d) => {
                  const active = duration === d.key;
                  return (
                    <button
                      key={d.key}
                      onClick={() => setDuration(d.key)}
                      className={`group flex flex-col items-start px-5 py-3 rounded-2xl border ease-out-expo transition-all duration-500 ${
                        active ? "bg-ink text-white border-ink scale-[1.02]" : "border-ink/10 hover:border-accent hover:-translate-y-0.5"
                      }`}
                    >
                      <span className="text-base font-bold">{d.label}</span>
                      <span className="text-[10px] uppercase tracking-widest opacity-60">{d.sub}</span>
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label="Technical Grade">
              <div className="grid grid-cols-4 gap-1">
                {allDifficulties.map((d) => {
                  const active = difficulty === d;
                  return (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`p-4 text-center border ease-out-expo transition-all duration-500 ${
                        active ? "bg-accent text-white border-accent" : "border-ink/10 hover:bg-ink hover:text-white"
                      }`}
                    >
                      <span className="block text-xs uppercase font-bold">{d}</span>
                      <span className="text-[10px] opacity-60">
                        {d === "Easy" ? "Level 1" : d === "Moderate" ? "Level 2" : d === "Challenging" ? "Level 3" : "Level 4"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label={`Fitness · ${FITNESS_LABELS[fitness]}`}>
              <div className="space-y-3">
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={fitness}
                  onChange={(e) => setFitness(Number(e.target.value))}
                  className="w-full accent-accent"
                />
                <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest text-ink/40">
                  <span>Walker</span>
                  <span>Weekend</span>
                  <span>Runner</span>
                  <span>Mountain</span>
                  <span>Alpine</span>
                </div>
              </div>
            </Field>

            <Field label="Season Window">
              <div className="flex flex-wrap gap-2">
                {allSeasons.map((s) => {
                  const active = season === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setSeason(s)}
                      className={`px-5 py-2 rounded-full text-sm font-medium border ease-out-expo transition-all ${
                        active ? "bg-ink text-white border-ink" : "border-ink/10 hover:border-accent"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>

          <div className="relative">
            <div className="sticky top-28 space-y-4">
              {loading ? (
                <div className="rounded-3xl border border-ink/5 overflow-hidden animate-pulse">
                  <div className="h-48 bg-ink/5" />
                  <div className="p-8 space-y-4">
                    <div className="h-8 bg-ink/5 rounded w-2/3" />
                    <div className="h-4 bg-ink/5 rounded w-full" />
                    <div className="h-4 bg-ink/5 rounded w-4/5" />
                    <div className="h-12 bg-ink/5 rounded mt-6" />
                  </div>
                </div>
              ) : top ? (
                <>
                  <div key={top.slug} className="bg-white border border-ink/5 rounded-3xl shadow-xl shadow-ink/5 animate-rise overflow-hidden">
                    <div className="relative h-48 w-full overflow-hidden bg-slate-alpine/20">
                      <img src={top.image} alt={top.name} loading="lazy" width={800} height={400} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
                      <span className="absolute top-4 left-4 bg-accent text-white px-2.5 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider">Top match</span>
                    </div>
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">{top.name}</h3>
                          <p className="text-ink/60 text-sm mt-2 max-w-sm">{top.description}</p>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <div className="text-4xl font-extrabold tracking-tighter">{top.maxAltitudeM.toLocaleString()}</div>
                          <div className="font-mono text-[10px] uppercase text-ink/40 tracking-widest">Max Alt (m)</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 border-y border-ink/10 py-4 my-6">
                        <Stat label="Days" value={String(top.days).padStart(2, "0")} />
                        <Stat label="Region" value={top.region.split('/')[0].trim()} />
                        <Stat label="Grade" value={top.difficulty} />
                        <Stat label="Best" value={top.bestMonths.split(',')[0].trim()} />
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="font-mono text-[9px] uppercase tracking-widest text-ink/40">Price range</div>
                          <div className="text-sm font-bold">${top.priceBudget.toLocaleString()} – ${top.priceLuxury.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-[9px] uppercase tracking-widest text-ink/40">Accommodation</div>
                          <div className="text-sm font-bold">{top.accommodation}</div>
                        </div>
                      </div>
                      <a
                        href={`/trek/${top.slug}`}
                        className="block w-full py-4 bg-ink text-white text-xs font-bold uppercase tracking-widest text-center hover:bg-accent transition-colors rounded-xl"
                      >
                        View Full Itinerary →
                      </a>
                    </div>
                  </div>

                  {results.slice(1).length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      {results.slice(1).map((t) => (
                        <a
                          key={t.slug}
                          href={`/trek/${t.slug}`}
                          className="p-4 rounded-2xl bg-base border border-ink/5 hover:border-accent transition-colors group"
                        >
                          <div className="font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-1">Alt Match</div>
                          <div className="font-bold text-sm mb-1 group-hover:text-accent">{t.name}</div>
                          <div className="text-xs text-ink/50">{t.days}d · {t.difficulty} · ${t.priceUSD.toLocaleString()}</div>
                        </a>
                      ))}
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-4">
      <label className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40 block">{label}</label>
      {children}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-1">{label}</div>
      <div className="text-sm font-bold">{value}</div>
    </div>
  );
}
