import { useState, useEffect } from 'react'

// 100 stars — deterministic positions in upper sky (SVG viewBox 0 0 100 60)
const STARS = Array.from({ length: 100 }, (_, i) => ({
  cx: ((i * 137.508) % 97 + 1.5).toFixed(1),
  cy: ((i * 53.27)  % 40 + 1).toFixed(1),
  r:  [0.23, 0.16, 0.11, 0.07][i % 4],
  dur:   (1.4 + (i % 5) * 0.45).toFixed(1),
  delay: ((i * 0.29) % 3.5).toFixed(2),
}))

// Pine tree positions in the landscape SVG (x = 0-100, viewBox cols)
const PINES = Array.from({ length: 24 }, (_, i) => ({
  x:  ((i * 4.35 + (i % 5) * 1.6) % 99) + 0.5,
  h:  0.52 + (i % 4) * 0.14,
  op: [0.93, 0.78, 0.62][i % 3],
}))

// Campfire embers
const EMBERS = Array.from({ length: 9 }, (_, i) => ({
  x:    (i - 4) * 2.9,
  dur:  (0.65 + (i % 4) * 0.22).toFixed(2),
  delay: (i * 0.19).toFixed(2),
}))

// Shared keyTimes for all SVG <animate> — 9 frames across 60 s
//  0s  5s  12s  24s  36s  46s  52s  57s  60s
const KT = '0; 0.083; 0.2; 0.4; 0.6; 0.767; 0.867; 0.95; 1'

// ─── Walker silhouette ────────────────────────────────────────────────────────
function WalkerFigure({ isLeader = false, poseDelay = 0, color = '#18102e' }) {
  const pd  = `${poseDelay}s`
  const H   = isLeader ? 86 : 76           // figure height in SVG units
  const sc  = isLeader ? 1.14 : 1
  const vH  = H + 8
  const col = color

  const Shared = () => (
    <>
      <circle cx="0" cy={-H + 2}  r="3.5"  fill={col} />
      <rect   x="-7.5" y={-H + 6} width="15" height="9" rx="4.5" fill={col} />
      <circle cx="0" cy={-H + 18} r="6.5"  fill={col} />
      <rect   x="-13"  y={-H + 24} width="9" height="16" rx="3"  fill={col} opacity="0.88"/>
      <path d={`M-6,${-H+25} L6,${-H+25} L5,${-H+44} L-5,${-H+44} Z`} fill={col}/>
      <line x1="-8" y1={-H+29} x2="-19" y2="-4" strokeWidth="2.5" stroke={col} strokeLinecap="round"/>
    </>
  )

  return (
    <svg width={Math.round(33 * sc)} height={Math.round(vH * sc)}
      viewBox={`-20 -${vH} 40 ${vH}`} overflow="visible" style={{ display: 'block' }}>

      {/* Pose A — right foot forward */}
      <g stroke={col} strokeLinecap="round" fill={col}
        style={{ animation: `poseA 0.45s steps(1) ${pd} infinite` }}>
        <Shared />
        <path d={`M-5,${-H+30} Q-9,${-H+39} -5,${-H+44}`}  strokeWidth="5" fill="none"/>
        {isLeader
          ? <path d={`M5,${-H+30} Q14,${-H+22} 18,${-H+16}`} strokeWidth="5" fill="none"/>
          : <path d={`M5,${-H+30} Q10,${-H+39}  6,${-H+44}`} strokeWidth="5" fill="none"/>}
        <path d={`M-3,${-H+44} Q-9,${-H+58} -12,${-H+69}`} strokeWidth="5.5" fill="none"/>
        <path d={`M3, ${-H+44} Q8, ${-H+58}  7, ${-H+69}`} strokeWidth="5.5" fill="none"/>
        <ellipse cx="-12" cy={-H+72} rx="6"   ry="3.2"/>
        <ellipse cx="7"   cy={-H+72} rx="6"   ry="3.2"/>
      </g>

      {/* Pose B — left foot forward */}
      <g stroke={col} strokeLinecap="round" fill={col}
        style={{ animation: `poseB 0.45s steps(1) ${pd} infinite` }}>
        <Shared />
        <path d={`M-5,${-H+30} Q-10,${-H+39} -7,${-H+44}`} strokeWidth="5" fill="none"/>
        {isLeader
          ? <path d={`M5,${-H+30} Q14,${-H+22} 18,${-H+16}`} strokeWidth="5" fill="none"/>
          : <path d={`M5,${-H+30} Q9, ${-H+39}  5,${-H+44}`} strokeWidth="5" fill="none"/>}
        <path d={`M-3,${-H+44} Q-8,${-H+58} -7, ${-H+69}`} strokeWidth="5.5" fill="none"/>
        <path d={`M3, ${-H+44} Q9, ${-H+58} 12, ${-H+69}`} strokeWidth="5.5" fill="none"/>
        <ellipse cx="-7"  cy={-H+72} rx="6"   ry="3.2"/>
        <ellipse cx="12"  cy={-H+72} rx="6"   ry="3.2"/>
      </g>
    </svg>
  )
}

// ─── Seated silhouette ────────────────────────────────────────────────────────
function SeatedFigure({ color = '#18102e' }) {
  return (
    <svg width="30" height="46" viewBox="-15 -46 30 49" overflow="visible" style={{ display: 'block' }}>
      <circle cx="0" cy="-46" r="3"   fill={color}/>
      <rect x="-6" y="-43" width="12" height="8" rx="4" fill={color}/>
      <circle cx="0" cy="-35" r="6"   fill={color}/>
      <path d="M-6,-28 Q0,-22 6,-28 L5,-15 L-5,-15 Z" fill={color}/>
      <path d="M-5,-22 Q-10,-14 -9,-7"  stroke={color} strokeWidth="4.5" fill="none" strokeLinecap="round"/>
      <path d="M5,-22  Q10,-14  9,-7"   stroke={color} strokeWidth="4.5" fill="none" strokeLinecap="round"/>
      <path d="M-4,-15 Q-9,-8 -13,-4"   stroke={color} strokeWidth="5"   fill="none" strokeLinecap="round"/>
      <path d="M4,-15  Q9,-8  13,-4"    stroke={color} strokeWidth="5"   fill="none" strokeLinecap="round"/>
      <path d="M-13,-4 Q0,1 13,-4"      stroke={color} strokeWidth="4"   fill="none" strokeLinecap="round"/>
    </svg>
  )
}

// ─── Main hero ────────────────────────────────────────────────────────────────
export function TrekStoryHero({ trekCount = 0 }) {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <section className="relative overflow-hidden select-none" style={{ height: '90vh', minHeight: 600 }}>
      <style>{`
        @keyframes poseA { 0%,49%{opacity:1} 50%,100%{opacity:0} }
        @keyframes poseB { 0%,49%{opacity:0} 50%,100%{opacity:1} }
        @keyframes twinkle { 0%,100%{opacity:0.12} 50%{opacity:1} }

        /* Group walks across from 0→90% of the 60 s cycle, then stays at camp */
        @keyframes groupWalk {
          0%  { transform: translateX(-320px) }
          90% { transform: translateX(calc(60vw - 50px)) }
          100%{ transform: translateX(calc(60vw - 50px)) }
        }
        @keyframes groupFade {
          0%,85%{opacity:1} 92%{opacity:0} 100%{opacity:0}
        }
        @keyframes seatedIn {
          0%,87%{opacity:0} 94%{opacity:1} 100%{opacity:1}
        }

        /* Tent pitching */
        @keyframes tent1Up {
          0%,81%{transform:scaleY(0);opacity:0}
          82%{opacity:1} 90%{transform:scaleY(1)} 100%{transform:scaleY(1)}
        }
        @keyframes tent2Up {
          0%,84%{transform:scaleY(0);opacity:0}
          85%{opacity:1} 92%{transform:scaleY(1)} 100%{transform:scaleY(1)}
        }

        /* Campfire */
        @keyframes fireIn { 0%,85%{opacity:0} 92%{opacity:1} 100%{opacity:1} }
        @keyframes flame1 { 0%,100%{transform:scaleY(1) skewX(0deg)} 33%{transform:scaleY(1.3) skewX(-8deg)} 67%{transform:scaleY(0.85) skewX(6deg)} }
        @keyframes flame2 { 0%,100%{transform:scaleY(0.88) skewX(3deg)} 45%{transform:scaleY(1.35) skewX(-6deg)} }
        @keyframes emberRise { 0%{transform:translateY(0) scale(1);opacity:0.9} 100%{transform:translateY(-44px) scale(0.15);opacity:0} }
        @keyframes fireGlow  { 0%,100%{opacity:0.5} 50%{opacity:0.95} }

        /* Cloud drift */
        @keyframes cloudDrift { from{transform:translateX(0)} to{transform:translateX(-210vw)} }

        /* Text reveal */
        @keyframes heroUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes arrowBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(7px)} }
      `}</style>

      {/* ════════════════════════════════════════════════════════════════════════
          One background SVG — sky gradient + stars + sun + moon + mountains
          All celestial animations use the same 60 s keyTimes (KT) for sync.
          Sky colours:  0s=pre-dawn  5s=sunrise  12s=morning  24s=midday
                       36s=golden   46s=dusk     52s=twilight 57s=night
         ════════════════════════════════════════════════════════════════════════ */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 60"
        preserveAspectRatio="xMidYMid slice"
        style={{ transform: `translateY(${scrollY * 0.025}px)` }}
      >
        <defs>
          {/* Continuously animated sky gradient — no opacity layer hacks */}
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%">
              <animate attributeName="stop-color"
                values="#160428; #3a0c0c; #0c2070; #0a3098; #0c2888; #1c0848; #10051e; #04020e; #160428"
                keyTimes={KT} dur="60s" repeatCount="indefinite"/>
            </stop>
            <stop offset="48%">
              <animate attributeName="stop-color"
                values="#48091c; #861e0e; #1845b8; #2068d8; #3068c8; #781632; #36084a; #0a0418; #48091c"
                keyTimes={KT} dur="60s" repeatCount="indefinite"/>
            </stop>
            <stop offset="100%">
              <animate attributeName="stop-color"
                values="#a83c1c; #ff6e1c; #82b8f5; #b2d8ff; #f0ae3c; #ee5c1c; #bc281a; #180828; #a83c1c"
                keyTimes={KT} dur="60s" repeatCount="indefinite"/>
            </stop>
          </linearGradient>

          {/* Sun glow blur */}
          <filter id="sunBlur" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1.6"/>
          </filter>
          {/* Milky Way blur */}
          <filter id="mwBlur" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="1.4"/>
          </filter>

          {/* Milky Way band gradient */}
          <linearGradient id="mwGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="rgba(155,168,255,0)"/>
            <stop offset="28%"  stopColor="rgba(170,182,255,0.3)"/>
            <stop offset="50%"  stopColor="rgba(182,196,255,0.55)"/>
            <stop offset="72%"  stopColor="rgba(170,182,255,0.3)"/>
            <stop offset="100%" stopColor="rgba(155,168,255,0)"/>
          </linearGradient>

          {/* Clip sky to upper portion so sun/moon don't show below mountains */}
          <clipPath id="skyClip">
            <rect x="0" y="0" width="100" height="48"/>
          </clipPath>
        </defs>

        {/* Sky rect */}
        <rect x="0" y="0" width="100" height="60" fill="url(#skyGrad)"/>

        {/* ── Stars + Milky Way — fade in for night, out for day ── */}
        <g clipPath="url(#skyClip)">
          <animate attributeName="opacity"
            values="0.85; 0; 0; 0; 0; 0; 0.6; 1; 0.85"
            keyTimes={KT} dur="60s" repeatCount="indefinite"/>
          {/* Milky Way */}
          <ellipse cx="50" cy="17" rx="56" ry="7"
            fill="url(#mwGrad)" filter="url(#mwBlur)" transform="rotate(-22 50 17)"/>
          {/* Dense band cluster */}
          {Array.from({ length: 55 }, (_, i) => (
            <circle key={`b${i}`}
              cx={((i * 2.03 + 4) % 98).toFixed(1)}
              cy={((i * 0.62 + 7) % 22).toFixed(1)}
              r={[0.11, 0.08, 0.06][i % 3]}
              fill="rgba(205,215,255,0.9)"
              style={{ animation: `twinkle ${1.1 + (i % 4) * 0.35}s ${(i * 0.12 % 2.5).toFixed(2)}s ease-in-out infinite` }}/>
          ))}
          {/* Field stars */}
          {STARS.map((s, i) => (
            <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="white"
              style={{ animation: `twinkle ${s.dur}s ${s.delay}s ease-in-out infinite` }}/>
          ))}
        </g>

        {/* ── Sun — arcs from left horizon to right horizon ── */}
        <g clipPath="url(#skyClip)">
          {/* Soft glow behind disc */}
          <circle r="7" fill="#ff8030" filter="url(#sunBlur)">
            <animate attributeName="cx"
              values="2; 6; 20; 50; 76; 92; 100; 106; 2"
              keyTimes={KT} dur="60s" repeatCount="indefinite"/>
            <animate attributeName="cy"
              values="74; 62; 44; 10; 30; 56; 70; 78; 74"
              keyTimes={KT} dur="60s" repeatCount="indefinite"/>
            <animate attributeName="r"
              values="5; 9; 5; 4; 5; 9; 11; 11; 5"
              keyTimes={KT} dur="60s" repeatCount="indefinite"/>
            <animate attributeName="opacity"
              values="0; 0.65; 0.28; 0.18; 0.28; 0.7; 0.45; 0; 0"
              keyTimes={KT} dur="60s" repeatCount="indefinite"/>
          </circle>
          {/* Sun disc */}
          <circle>
            <animate attributeName="cx"
              values="2; 6; 20; 50; 76; 92; 100; 106; 2"
              keyTimes={KT} dur="60s" repeatCount="indefinite"/>
            <animate attributeName="cy"
              values="74; 62; 44; 10; 30; 56; 70; 78; 74"
              keyTimes={KT} dur="60s" repeatCount="indefinite"/>
            <animate attributeName="r"
              values="2.8; 4.5; 2.8; 2.4; 2.8; 4.2; 5.5; 5.5; 2.8"
              keyTimes={KT} dur="60s" repeatCount="indefinite"/>
            <animate attributeName="fill"
              values="#c03010; #ff6e18; #ffec88; #fffce0; #ffd058; #ff7020; #ff3608; #ff3608; #c03010"
              keyTimes={KT} dur="60s" repeatCount="indefinite"/>
            <animate attributeName="opacity"
              values="0; 1; 1; 1; 1; 1; 0.8; 0; 0"
              keyTimes={KT} dur="60s" repeatCount="indefinite"/>
          </circle>
        </g>

        {/* ── Moon — rises from east at dusk, stays through night ── */}
        <g clipPath="url(#skyClip)">
          <circle r="2.8" fill="#f4e2b8"
            style={{ filter: 'drop-shadow(0 0 2px rgba(244,226,184,0.6))' }}>
            <animate attributeName="cx"
              values="88; 88; 88; 88; 88; 88; 82; 74; 88"
              keyTimes={KT} dur="60s" repeatCount="indefinite"/>
            <animate attributeName="cy"
              values="14; 72; 72; 72; 72; 62; 34; 16; 14"
              keyTimes={KT} dur="60s" repeatCount="indefinite"/>
            <animate attributeName="opacity"
              values="0.7; 0; 0; 0; 0; 0; 0.95; 1; 0.7"
              keyTimes={KT} dur="60s" repeatCount="indefinite"/>
          </circle>
          {/* Moon halo */}
          <circle r="4.5" fill="rgba(244,226,184,0.1)">
            <animate attributeName="cx"
              values="88; 88; 88; 88; 88; 88; 82; 74; 88"
              keyTimes={KT} dur="60s" repeatCount="indefinite"/>
            <animate attributeName="cy"
              values="14; 72; 72; 72; 72; 62; 34; 16; 14"
              keyTimes={KT} dur="60s" repeatCount="indefinite"/>
            <animate attributeName="opacity"
              values="0.7; 0; 0; 0; 0; 0; 0.95; 1; 0.7"
              keyTimes={KT} dur="60s" repeatCount="indefinite"/>
          </circle>
        </g>

        {/* ── Horizon glow — warm band near mountain tops ── */}
        <rect x="0" y="42" width="100" height="6"
          fill="url(#mwGrad)"
          style={{ filter: 'blur(4px)' }}
          opacity="0.0">
          <animate attributeName="opacity"
            values="0.6; 1; 0.3; 0; 0.4; 1; 0.8; 0.2; 0.6"
            keyTimes={KT} dur="60s" repeatCount="indefinite"/>
          <animate attributeName="fill"
            values="#a83c1c; #ff8030; #b0d0f8; #e0f0ff; #f8b840; #ff5818; #cc2810; #200820; #a83c1c"
            keyTimes={KT} dur="60s" repeatCount="indefinite"/>
        </rect>

        {/* ── Mountains — 4 layered paths, back to front ── */}
        <path fill="#1e2e58" opacity="0.52"
          d="M0,60 0,38 C7,35 13,33 19.5,30 26,26 29.5,29 36,25 42.5,21 46.5,24 53,19 59.5,14.5 63,17 70,14 76.5,11 80,14 87,11 93.5,8.5 97.5,12 100,9 L100,60 Z"/>
        <path fill="#14264a" opacity="0.72"
          d="M0,60 0,46 C5.5,43 10.5,45 16.2,42 22,39 25.5,42 31.5,38.5 37.5,35.5 41.2,38 47.5,35 53.8,32 57.2,35 63.8,32 70.4,29 73.8,32 80.5,29 87.2,26 90.8,29.5 97.5,26 L100,43 100,60 Z"/>
        <path fill="#0c1c30" opacity="0.86"
          d="M0,60 0,52 C4.8,49 9.2,51 14.8,48.5 20.4,46 23.8,48 29.6,45.5 35.4,43 39,45.5 45,43 51,40.5 54.5,43 60.8,40.5 67.1,38 70.6,40.5 76.5,38 82.4,35.5 85.8,38.5 91.4,36 100,43 100,60 Z"/>
        {/* Closest layer — darkest, pine tree silhouettes integrated */}
        <path fill="#06101a"
          d="M0,60 0,55.5 C2.6,53 5.2,55 7.8,52.5 10.4,50 13,52 15.6,50 18.2,48 20.8,50 23.4,47.5 26,45 28.6,47.5 31.2,45 33.8,42.5 36.4,45 39,42.5 41.6,40 44.2,43 46.8,40.5 49.4,38 52,40.5 54.6,38 57.2,35.5 59.8,38 62.4,35.5 65,33 67.6,35.5 70.2,33 72.8,30.5 75.4,33 78,30.5 80.6,28 83.2,31 85.8,28 88.4,25.5 91,28.5 93.6,26 96.2,23.5 L100,50 100,60 Z"/>

        {/* ── Pine trees integrated into foreground (always visible) ── */}
        {PINES.map((t, i) => {
          const h  = 13 * t.h
          const hw = 5  * t.h
          return (
            <g key={i}>
              <polygon points={`${t.x},${60 - h} ${t.x - hw},60 ${t.x + hw},60`}
                fill="#050c05" opacity={t.op}/>
              <polygon points={`${t.x},${60 - h} ${t.x - hw * 0.7},${60 - h * 0.38} ${t.x + hw * 0.7},${60 - h * 0.38}`}
                fill="#091209" opacity={t.op * 0.65}/>
            </g>
          )
        })}
      </svg>

      {/* ── Clouds — two layers at different speeds ── */}
      {[
        { top: '8%',  dur: '54s', delay: '0s',   op: 0.42 },
        { top: '16%', dur: '80s', delay: '12s',  op: 0.26 },
      ].map((layer, li) => (
        <div key={li} className="absolute left-0 w-full pointer-events-none"
          style={{ top: layer.top, opacity: layer.op }}>
          <div style={{ display: 'flex', gap: '112px', animation: `cloudDrift ${layer.dur} linear ${layer.delay} infinite` }}>
            {[92, 145, 72, 115, 86, 128, 68, 102, 84, 94].map((w, i) => (
              <div key={i} className="shrink-0 rounded-full blur-2xl bg-white/20"
                style={{ width: w, height: li === 0 ? 27 : 18 }}/>
            ))}
          </div>
        </div>
      ))}

      {/* ── Basecamp (fixed right, always in scene) ── */}
      <div className="absolute pointer-events-none" style={{ bottom: '20%', left: '62%', zIndex: 6 }}>
        {/* Tent 1 */}
        <div style={{ display: 'inline-block', transformOrigin: 'bottom center', marginRight: 20,
          animation: 'tent1Up 60s linear infinite' }}>
          <svg width="72" height="58" viewBox="0 0 72 58">
            <polygon points="36,3 0,55 72,55" fill="#3a1f6a"/>
            <polygon points="36,3 0,55 72,55" fill="none" stroke="#5a3090" strokeWidth="1.5"/>
            <line x1="36" y1="3" x2="36" y2="55" stroke="#7a50b0" strokeWidth="1"/>
            <polygon points="36,22 18,55 54,55" fill="#2a1450" opacity="0.85"/>
            <path d="M28,55 Q36,40 44,55" fill="#120828"/>
          </svg>
        </div>
        {/* Tent 2 */}
        <div style={{ display: 'inline-block', transformOrigin: 'bottom center',
          animation: 'tent2Up 60s linear infinite' }}>
          <svg width="58" height="46" viewBox="0 0 58 46">
            <polygon points="29,3 0,43 58,43" fill="#1f3060"/>
            <polygon points="29,3 0,43 58,43" fill="none" stroke="#304898" strokeWidth="1.5"/>
            <line x1="29" y1="3" x2="29" y2="43" stroke="#4060c0" strokeWidth="1"/>
            <polygon points="29,18 14,43 44,43" fill="#162040" opacity="0.85"/>
            <path d="M22,43 Q29,32 36,43" fill="#080e20"/>
          </svg>
        </div>
      </div>

      {/* ── Campfire ── */}
      <div className="absolute pointer-events-none"
        style={{ bottom: 'calc(20% + 12px)', left: 'calc(62% + 78px)', zIndex: 7,
          animation: 'fireIn 60s linear infinite' }}>
        {/* Ground glow */}
        <div style={{
          position: 'absolute', width: 100, height: 42, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(255,110,20,0.6) 0%, transparent 70%)',
          left: -32, top: 16,
          animation: 'fireGlow 0.9s ease-in-out infinite',
        }}/>
        <svg width="36" height="54" viewBox="-18 -54 36 57" overflow="visible">
          <line x1="-15" y1="0"  x2="15" y2="-7"  strokeWidth="5.5" stroke="#3d1a08" strokeLinecap="round"/>
          <line x1="-15" y1="-5" x2="15" y2="2"   strokeWidth="5.5" stroke="#3d1a08" strokeLinecap="round"/>
          <g style={{ transformOrigin: '0 0', animation: 'flame1 0.65s ease-in-out infinite' }}>
            <path d="M0,0 C-9,-14 -11,-30 0,-45 C11,-30 9,-14 0,0" fill="#ff7000" opacity="0.92"/>
          </g>
          <g style={{ transformOrigin: '0 0', animation: 'flame2 0.5s ease-in-out infinite' }}>
            <path d="M0,-3 C-5,-14 -6,-25 0,-35 C6,-25 5,-14 0,-3" fill="#ffb800" opacity="0.9"/>
          </g>
          <ellipse cx="0" cy="-8" rx="4.5" ry="3.5" fill="#fffde0" opacity="0.75"/>
          {EMBERS.map((e, i) => (
            <circle key={i} cx={e.x} cy="-2" r="1.6" fill="#ff8800"
              style={{ animation: `emberRise ${e.dur}s ${e.delay}s ease-out infinite` }}/>
          ))}
        </svg>
      </div>

      {/* ── Walking group — leader + 7 trekkers ── */}
      <div className="absolute pointer-events-none" style={{ bottom: '22%', zIndex: 8,
        display: 'flex', alignItems: 'flex-end', gap: '5px',
        animation: 'groupWalk 60s linear infinite, groupFade 60s linear infinite' }}>
        <WalkerFigure isLeader poseDelay={0}    color="#18102e"/>
        <WalkerFigure poseDelay={0.09} color="#1c1436"/>
        <WalkerFigure poseDelay={0.18} color="#18102e"/>
        <WalkerFigure poseDelay={0.27} color="#201340"/>
        <WalkerFigure poseDelay={0.36} color="#18102e"/>
        <WalkerFigure poseDelay={0.45} color="#1c1436"/>
        <WalkerFigure poseDelay={0.54} color="#18102e"/>
        <WalkerFigure poseDelay={0.63} color="#201340"/>
      </div>

      {/* ── Seated group around fire (appears as night falls) ── */}
      <div className="absolute pointer-events-none"
        style={{ bottom: '20%', left: 'calc(62% - 44px)', zIndex: 8,
          display: 'flex', alignItems: 'flex-end', gap: '3px',
          animation: 'seatedIn 60s linear infinite' }}>
        {['#18102e','#201340','#18102e','#1c1030','#18102e','#201340','#18102e','#1c1030'].map((c, i) => (
          <SeatedFigure key={i} color={c}/>
        ))}
      </div>

      {/* ── Text overlay ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 pb-24"
        style={{ zIndex: 10 }}>
        <p className="font-mono text-[10px] uppercase tracking-[0.38em] text-amber-300/70 mb-5"
          style={{ animation: 'heroUp .7s ease both .15s', opacity: 0 }}>
          {trekCount} expeditions · India &amp; Nepal
        </p>
        <h1 className="font-extrabold tracking-tighter leading-[0.88] mb-6"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(3rem, 9vw, 7rem)',
            animation: 'heroUp .7s ease both .3s', opacity: 0 }}>
          Every Trail,<br/>
          <em className="not-italic text-amber-300 font-medium">A Story</em>
        </h1>
        <p className="text-white/50 text-sm max-w-xs leading-relaxed"
          style={{ animation: 'heroUp .7s ease both .45s', opacity: 0 }}>
          Browse all expeditions, filter by region or difficulty, and flip any card for the full route brief.
        </p>
        <svg viewBox="0 0 24 24" className="size-5 text-white/25 mt-10"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          style={{ animation: 'arrowBounce 1.6s ease-in-out 1.2s infinite' }}>
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    </section>
  )
}
