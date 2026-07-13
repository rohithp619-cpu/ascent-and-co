import { useEffect, useRef, useState } from "react";
import heroImage from "../assets/himalaya-hero.jpg";

export function HimalayaHero() {
  const ref = useRef(null);
  const [scroll, setScroll] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => setScroll(window.scrollY);
    const onMove = (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouse({ x: nx, y: ny });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  const p = (depth) => ({
    transform: `translate3d(${mouse.x * depth * -20}px, ${scroll * depth * -0.15 + mouse.y * depth * -10}px, 0)`,
  });

  return (
    <section
      ref={ref}
      className="relative h-[110vh] overflow-hidden flex flex-col justify-end pb-24 bg-gradient-to-b from-[#f4d9b8] via-[#e5cfc4] to-base"
    >
      <div className="absolute inset-0 will-change-transform" style={{ ...p(0.15), scale: "1.1" }}>
        <img
          src={heroImage}
          alt="Himalayan peaks at dawn"
          width={1920}
          height={1200}
          className="w-full h-full object-cover opacity-90"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-base" />
      </div>

      <div
        className="absolute bottom-[22%] left-[-10%] w-[120%] h-[55%] bg-slate-alpine/25 will-change-transform animate-rise [animation-delay:100ms]"
        style={{ clipPath: "polygon(0% 100%, 25% 45%, 45% 65%, 65% 30%, 85% 55%, 100% 22%, 100% 100%)", ...p(0.35) }}
      />
      <div
        className="absolute bottom-[8%] left-[-5%] w-[110%] h-[55%] bg-slate-alpine/70 will-change-transform animate-rise [animation-delay:250ms]"
        style={{ clipPath: "polygon(0% 100%, 15% 50%, 35% 80%, 55% 40%, 75% 70%, 100% 35%, 100% 100%)", ...p(0.55) }}
      />
      <div
        className="absolute -bottom-4 left-0 w-full h-[45%] bg-ink will-change-transform animate-rise [animation-delay:450ms]"
        style={{ clipPath: "polygon(0% 100%, 10% 60%, 30% 90%, 50% 55%, 70% 85%, 100% 45%, 100% 100%)", ...p(0.85) }}
      />

      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.07] mix-blend-multiply" viewBox="0 0 800 600" preserveAspectRatio="none">
        {Array.from({ length: 14 }).map((_, i) => (
          <path
            key={i}
            d={`M0 ${520 - i * 25} Q 200 ${480 - i * 30} 400 ${500 - i * 25} T 800 ${470 - i * 28}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
        ))}
      </svg>

      <div className="relative z-10 px-6 md:px-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
          <div className="max-w-2xl mb-8">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-accent mb-4 animate-rise">
              Guided Himalayan Expeditions · Est. Since 2011
            </p>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-white leading-[0.9] text-balance drop-shadow-[0_4px_20px_rgba(0,0,0,0.35)] animate-rise [animation-delay:150ms]">
              WE GUIDE
              <br />
              THE ASCENT
            </h1>
            <p className="mt-6 max-w-md text-white/80 text-sm md:text-base leading-relaxed animate-rise [animation-delay:300ms]">
              Fully-outfitted, small-group expeditions across the 100 greatest trails
              in India &amp; Nepal. Certified mountain guides, hand-picked itineraries,
              zero logistics on your plate.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 animate-rise [animation-delay:450ms]">
              <a
                href="#matcher"
                className="text-[11px] font-bold uppercase tracking-widest bg-accent text-white px-6 py-3.5 rounded-full hover:brightness-110 transition-all"
              >
                Plan my expedition →
              </a>
              <a
                href="#/guide"
                className="text-[11px] font-bold uppercase tracking-widest bg-white/10 text-white border border-white/30 backdrop-blur-md px-6 py-3.5 rounded-full hover:bg-white/20 transition-all"
              >
                Talk to a guide
              </a>
            </div>
          </div>
          <div className="hidden lg:grid grid-cols-3 gap-8 pb-16 animate-rise [animation-delay:500ms] text-white">
            {[
              { n: "14+", l: "Years guiding" },
              { n: "2,400", l: "Trekkers led" },
              { n: "100%", l: "Safety record" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-4xl font-extrabold tracking-tighter">{s.n}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-white/60">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/70">
        <span className="font-mono text-[10px] uppercase tracking-[0.35em]">Scroll to match your trek</span>
        <div className="w-px h-8 bg-white/40" />
      </div>
    </section>
  );
}
