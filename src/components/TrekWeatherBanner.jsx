import { useEffect, useState } from 'react'

// ─── Keyframes ────────────────────────────────────────────────────────────────
const STYLES = `
  /* Sun */
  @keyframes wxSunRot   { to   { transform: rotate(360deg); } }
  @keyframes wxSunPulse { 0%,100% { transform:scale(1);    filter:blur(32px) brightness(1);   }
                          50%     { transform:scale(1.12); filter:blur(40px) brightness(1.15); } }
  @keyframes wxRayFade  { 0%,100% { opacity:.35; } 50% { opacity:.65; } }

  /* Clouds — three drift speeds */
  @keyframes wxCld1 { 0%,100% { transform:translateX(0);    } 50% { transform:translateX(14px);  } }
  @keyframes wxCld2 { 0%,100% { transform:translateX(6px);  } 50% { transform:translateX(-10px); } }
  @keyframes wxCld3 { 0%,100% { transform:translateX(-4px); } 50% { transform:translateX(8px);   } }

  /* Rain — diagonal streaks */
  @keyframes wxRain {
    0%   { transform:translate(0,-20px);      opacity:0;   }
    12%  { opacity:.8; }
    88%  { opacity:.55; }
    100% { transform:translate(-22px,300px);  opacity:0;   }
  }

  /* Snow — three sway directions for parallax depth */
  @keyframes wxSnow1 {
    0%   { transform:translate(0,-15px) rotate(0deg);       opacity:0; }
    14%  { opacity:.95; }
    86%  { opacity:.85; }
    100% { transform:translate(14px,300px)  rotate(200deg); opacity:0; }
  }
  @keyframes wxSnow2 {
    0%   { transform:translate(0,-15px) rotate(0deg);        opacity:0; }
    14%  { opacity:.75; }
    86%  { opacity:.65; }
    100% { transform:translate(-11px,300px) rotate(-200deg); opacity:0; }
  }
  @keyframes wxSnow3 {
    0%   { transform:translate(0,-15px);   opacity:0; }
    14%  { opacity:.5;  }
    86%  { opacity:.4;  }
    100% { transform:translate(5px,300px); opacity:0; }
  }

  /* Fog — horizontal band slides */
  @keyframes wxFogA { 0% { transform:translateX(-14%); opacity:.25; } 100% { transform:translateX(8%);   opacity:.5;  } }
  @keyframes wxFogB { 0% { transform:translateX(8%);   opacity:.4;  } 100% { transform:translateX(-7%);  opacity:.2;  } }
  @keyframes wxFogC { 0% { transform:translateX(-5%);  opacity:.3;  } 100% { transform:translateX(12%);  opacity:.55; } }
  @keyframes wxFogD { 0% { transform:translateX(12%);  opacity:.2;  } 100% { transform:translateX(-10%); opacity:.45; } }

  /* Lightning — whole-card flash */
  @keyframes wxFlash {
    0%,78%,100%  { opacity:0;   }
    80%,84%      { opacity:.6;  }
    82%,88%      { opacity:0;   }
    90%,94%      { opacity:.35; }
  }

  /* Banner atmospheric shimmer */
  @keyframes wxAtmos { 0%,100% { opacity:.55; transform:scaleX(.96) translateX(-4%); }
                       50%     { opacity:.85; transform:scaleX(1)    translateX(0);   } }
`

// ─── Deterministic particle data (module-level — never re-randomized) ─────────
const RAIN = Array.from({ length: 32 }, (_, i) => ({
  x:   `${((i * 3.17 + 6.4) % 100).toFixed(1)}%`,
  del: `${((i * 0.059) % 1.6).toFixed(3)}s`,
  h:   10 + (i % 4) * 9,
  op:  (0.18 + (i % 3) * 0.14).toFixed(2),
  dur: `${(0.55 + (i % 3) * 0.22).toFixed(2)}s`,
}))

const SNOW = Array.from({ length: 24 }, (_, i) => ({
  x:    `${((i * 4.23 + 4.7) % 100).toFixed(1)}%`,
  del:  `${((i * 0.105) % 2.6).toFixed(3)}s`,
  sz:   3 + (i % 3) * 2,
  op:   (0.3 + (i % 3) * 0.25).toFixed(2),
  dur:  `${(1.4 + (i % 3) * 0.65).toFixed(1)}s`,
  anim: `wxSnow${(i % 3) + 1}`,
}))

const RAYS = Array.from({ length: 16 }, (_, i) => ({
  deg: i * (360 / 16),
  len: 130 + (i % 4) * 35,
  op:  (0.18 + (i % 3) * 0.08).toFixed(2),
}))

// ─── Full-card background scenes ──────────────────────────────────────────────

function SunScene() {
  return (
    <div className="absolute inset-0 overflow-hidden"
      style={{ background: 'linear-gradient(175deg, #f59e0b 0%, #fcd34d 20%, #fdba74 50%, #bae6fd 100%)' }}>
      {/* Atmospheric glow behind sun */}
      <div className="absolute left-1/2 -translate-x-1/2"
        style={{ top: -60, width: 260, height: 260, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(253,230,138,.9) 0%, rgba(251,191,36,.5) 45%, transparent 72%)',
          animation: 'wxSunPulse 4s ease-in-out infinite' }} />
      {/* Rotating rays (origin = sun centre at top) */}
      <div className="absolute left-1/2 -translate-x-1/2"
        style={{ top: 0, animation: 'wxSunRot 28s linear infinite', transformOrigin: '50% 0%' }}>
        {RAYS.map((r, i) => (
          <div key={i} style={{
            position: 'absolute', width: 2, height: r.len,
            left: -1, top: 0,
            transformOrigin: '50% 0%', transform: `rotate(${r.deg}deg)`,
            background: 'linear-gradient(to bottom, rgba(253,224,71,.6), transparent)',
            opacity: r.op, animation: `wxRayFade ${3 + (i % 3)}s ${(i * 0.2) % 2}s ease-in-out infinite`,
          }} />
        ))}
      </div>
      {/* Sun disc */}
      <div className="absolute left-1/2 -translate-x-1/2 rounded-full"
        style={{ top: -28, width: 90, height: 90,
          background: 'radial-gradient(circle at 40% 35%, #fef08a, #f59e0b)',
          boxShadow: '0 0 50px 20px rgba(251,191,36,.4)' }} />
      {/* Ground haze */}
      <div className="absolute bottom-0 inset-x-0 h-2/3 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(255,255,255,.22), transparent)' }} />
    </div>
  )
}

function Cloud({ w, h, top, left, anim, dur, del, opacity = 1, blur = 0 }) {
  return (
    <div style={{ position: 'absolute', top, left, width: w, height: h,
      animation: `${anim} ${dur}s ${del}s ease-in-out infinite`, opacity,
      filter: blur ? `blur(${blur}px)` : undefined }}>
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '60%',
        borderRadius: 999, background: 'rgba(255,255,255,.88)' }} />
      <div style={{ position: 'absolute', bottom: '28%', left: '12%', width: '48%', height: '90%',
        borderRadius: 999, background: 'rgba(255,255,255,.88)' }} />
      <div style={{ position: 'absolute', bottom: '28%', left: '48%', width: '35%', height: '75%',
        borderRadius: 999, background: 'rgba(255,255,255,.88)' }} />
    </div>
  )
}

function CloudyScene() {
  return (
    <div className="absolute inset-0 overflow-hidden"
      style={{ background: 'linear-gradient(175deg, #1d4ed8 0%, #3b82f6 30%, #93c5fd 70%, #dbeafe 100%)' }}>
      {/* Sun peek top-right */}
      <div style={{ position: 'absolute', top: -30, right: 40, width: 90, height: 90, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(253,230,138,.85) 0%, rgba(251,191,36,.3) 60%, transparent 80%)',
        animation: 'wxSunPulse 5s ease-in-out infinite' }} />
      {/* Far layer clouds (blur, low opacity) */}
      <Cloud w={220} h={55} top={10} left={-20}  anim="wxCld3" dur={14} del={0}   opacity={.35} blur={4} />
      <Cloud w={180} h={45} top={20} left={'55%'} anim="wxCld2" dur={18} del={2}   opacity={.3}  blur={3} />
      {/* Mid clouds */}
      <Cloud w={200} h={60} top={30} left={'15%'} anim="wxCld1" dur={10} del={0.5} opacity={.7} />
      <Cloud w={160} h={50} top={55} left={'58%'} anim="wxCld3" dur={13} del={1.5} opacity={.6} />
      {/* Near clouds (crisp) */}
      <Cloud w={240} h={70} top={15} left={-10}   anim="wxCld2" dur={8}  del={0}   opacity={.95} />
      <Cloud w={190} h={60} top={40} left={'52%'} anim="wxCld1" dur={11} del={3}   opacity={.9}  />
      {/* Ground haze */}
      <div className="absolute bottom-0 inset-x-0 h-1/2 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(255,255,255,.2), transparent)' }} />
    </div>
  )
}

function RainScene() {
  return (
    <div className="absolute inset-0 overflow-hidden"
      style={{ background: 'linear-gradient(175deg, #0f172a 0%, #1e3a5f 40%, #1e40af 100%)' }}>
      {/* Cloud bank at top */}
      <div style={{ position: 'absolute', top: -20, left: '-10%', width: '120%', height: 80,
        borderRadius: '0 0 60% 60%', background: 'rgba(15,23,42,.75)', filter: 'blur(8px)' }} />
      {/* Rain streaks */}
      {RAIN.map((d, i) => (
        <div key={i} style={{
          position: 'absolute', left: d.x, top: 0,
          width: 1.5, height: d.h,
          background: 'linear-gradient(to bottom, transparent, rgba(147,197,253,.8), transparent)',
          borderRadius: 99, opacity: d.op,
          animation: `wxRain ${d.dur} ${d.del} linear infinite`,
        }} />
      ))}
      {/* Wet ground shimmer */}
      <div className="absolute bottom-0 inset-x-0 h-16 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(96,165,250,.12), transparent)' }} />
    </div>
  )
}

function SnowScene() {
  return (
    <div className="absolute inset-0 overflow-hidden"
      style={{ background: 'linear-gradient(175deg, #475569 0%, #7dd3fc 35%, #bae6fd 70%, #f0f9ff 100%)' }}>
      {/* Cloud mass at top */}
      <div style={{ position: 'absolute', top: -25, left: '-5%', width: '110%', height: 80,
        background: 'rgba(148,163,184,.55)', borderRadius: '0 0 50% 50%', filter: 'blur(10px)' }} />
      {/* Snowflakes */}
      {SNOW.map((f, i) => (
        <div key={i} style={{
          position: 'absolute', left: f.x, top: 0,
          width: f.sz, height: f.sz, borderRadius: '50%',
          background: 'rgba(255,255,255,.92)',
          boxShadow: '0 0 3px rgba(255,255,255,.6)',
          opacity: f.op,
          animation: `${f.anim} ${f.dur} ${f.del} ease-in infinite`,
        }} />
      ))}
      {/* Snow ground */}
      <div className="absolute bottom-0 inset-x-0 h-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(255,255,255,.3), transparent)' }} />
    </div>
  )
}

function FogScene() {
  const bands = [
    { top: '10%', h: 55, anim: 'wxFogA', dur: '9s',  del: '0s',    op: .35 },
    { top: '28%', h: 65, anim: 'wxFogB', dur: '12s', del: '1.5s',  op: .45 },
    { top: '45%', h: 70, anim: 'wxFogC', dur: '8s',  del: '0.5s',  op: .3  },
    { top: '62%', h: 60, anim: 'wxFogD', dur: '11s', del: '2s',    op: .4  },
    { top: '75%', h: 80, anim: 'wxFogA', dur: '10s', del: '1s',    op: .35 },
  ]
  return (
    <div className="absolute inset-0 overflow-hidden"
      style={{ background: 'linear-gradient(175deg, #374151 0%, #6b7280 40%, #9ca3af 75%, #d1d5db 100%)' }}>
      {bands.map((b, i) => (
        <div key={i} style={{
          position: 'absolute', left: '-15%', top: b.top,
          width: '130%', height: b.h,
          background: 'rgba(209,213,219,.7)',
          filter: 'blur(14px)', opacity: b.op,
          animation: `${b.anim} ${b.dur} ${b.del} ease-in-out infinite alternate`,
        }} />
      ))}
    </div>
  )
}

function StormScene() {
  return (
    <div className="absolute inset-0 overflow-hidden"
      style={{ background: 'linear-gradient(175deg, #0f0a1a 0%, #1e1b4b 25%, #1e3a5f 65%, #0f172a 100%)' }}>
      {/* Cloud bank */}
      <div style={{ position: 'absolute', top: -30, left: '-10%', width: '120%', height: 90,
        borderRadius: '0 0 50% 50%', background: 'rgba(15,10,26,.8)', filter: 'blur(10px)' }} />
      {/* Rain */}
      {RAIN.map((d, i) => (
        <div key={i} style={{
          position: 'absolute', left: d.x, top: 0,
          width: 1.5, height: d.h,
          background: 'linear-gradient(to bottom, transparent, rgba(147,197,253,.6), transparent)',
          borderRadius: 99, opacity: d.op,
          animation: `wxRain ${d.dur} ${d.del} linear infinite`,
        }} />
      ))}
      {/* Full-card lightning flash */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'rgba(255,255,255,.9)', animation: 'wxFlash 5s ease-in-out infinite' }} />
    </div>
  )
}

const SCENES = {
  clear: SunScene, cloudy: CloudyScene,
  rain: RainScene, snow: SnowScene,
  fog: FogScene, storm: StormScene,
}

// ─── Compact banner gradient themes ──────────────────────────────────────────
const BANNER = {
  clear:  { bg: 'from-amber-400 via-orange-300 to-yellow-200', atmos: 'rgba(251,191,36,.35)', text: 'text-amber-900',  border: 'border-amber-300/50' },
  cloudy: { bg: 'from-blue-500 via-blue-400 to-sky-200',       atmos: 'rgba(96,165,250,.25)', text: 'text-blue-900',   border: 'border-blue-300/50'  },
  fog:    { bg: 'from-gray-500 via-gray-400 to-gray-200',      atmos: 'rgba(156,163,175,.4)', text: 'text-gray-900',   border: 'border-gray-300/50'  },
  rain:   { bg: 'from-slate-700 via-blue-700 to-blue-500',     atmos: 'rgba(30,58,138,.4)',   text: 'text-blue-50',    border: 'border-blue-700/50'  },
  snow:   { bg: 'from-slate-500 via-sky-400 to-sky-200',       atmos: 'rgba(186,230,253,.3)', text: 'text-sky-950',    border: 'border-sky-300/50'   },
  storm:  { bg: 'from-slate-900 via-indigo-900 to-slate-700',  atmos: 'rgba(15,10,26,.5)',    text: 'text-slate-100',  border: 'border-indigo-700/50' },
}

// ─── Coord + fetch ────────────────────────────────────────────────────────────
const REGIONS = [
  [['khumbu', 'everest'],                                              [27.99, 86.93]],
  [['annapurna'],                                                      [28.60, 84.03]],
  [['langtang', 'helambu', 'tamang'],                                  [28.21, 85.52]],
  [['manaslu', 'tsum', 'rolwaling'],                                   [28.55, 84.56]],
  [['mustang', 'dolpo', 'humla', 'limi'],                              [28.90, 83.72]],
  [['kanchenjunga', 'makalu', 'dhaulagiri'],                           [27.80, 87.80]],
  [['ladakh', 'zanskar', 'chadar', 'sham'],                            [34.10, 77.58]],
  [['kashmir', 'tarsar', 'kolahoi', 'warwan'],                         [34.08, 74.80]],
  [['sikkim', 'dzongri', 'singalila', 'dzukou'],                       [27.60, 88.30]],
  [['uttarakhand', 'garhwal', 'kumaon', 'kedarkantha', 'har ki dun',
    'roopkund', 'kuari', 'brahmatal', 'dayara', 'tungnath', 'pindari'],[30.72, 79.22]],
  [['himachal', 'kullu', 'spiti', 'hampta', 'bhrigu', 'sar pass',
    'rupin', 'buran', 'pin parvati', 'chandrakhani', 'miyar'],         [32.10, 77.20]],
  [['western ghats', 'kudremukh', 'kumara', 'harishchandra', 'chembra'],[11.50, 76.10]],
]

function getCoords(trek) {
  const hay = `${trek.region} ${trek.name} ${trek.baseTown || ''}`.toLowerCase()
  for (const [keys, coords] of REGIONS) {
    if (keys.some((k) => hay.includes(k))) return coords
  }
  return trek.country === 'India' ? [31.00, 78.50] : [28.00, 84.50]
}

async function fetchWeatherData(lat, lon) {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m` +
    `&wind_speed_unit=kmh&timezone=auto`
  )
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const { current: c } = await res.json()
  return {
    temp:      Math.round(c.temperature_2m),
    feelsLike: Math.round(c.apparent_temperature),
    humidity:  c.relative_humidity_2m,
    wind:      Math.round(c.wind_speed_10m),
    code:      c.weather_code,
  }
}

function classify(code) {
  if (code === 0)  return { label: 'Clear Sky',     type: 'clear'  }
  if (code <= 3)   return { label: 'Partly Cloudy', type: 'cloudy' }
  if (code <= 48)  return { label: 'Foggy',         type: 'fog'    }
  if (code <= 67)  return { label: 'Rain',          type: 'rain'   }
  if (code <= 77)  return { label: 'Snow',          type: 'snow'   }
  if (code <= 82)  return { label: 'Rain Showers',  type: 'rain'   }
  if (code <= 86)  return { label: 'Snow Showers',  type: 'snow'   }
  return               { label: 'Thunderstorm',  type: 'storm'  }
}

function useWeather(trek) {
  const [weather, setWeather] = useState(null)
  const [status, setStatus]   = useState('idle')

  useEffect(() => {
    if (!trek) { setWeather(null); setStatus('idle'); return }
    let cancelled = false
    setStatus('loading')
    const [lat, lon] = getCoords(trek)
    fetchWeatherData(lat, lon)
      .then((w) => { if (!cancelled) { setWeather(w); setStatus('done') } })
      .catch(()  => { if (!cancelled) setStatus('error') })
    return () => { cancelled = true }
  }, [trek?.slug])

  return { weather, status }
}

// ─── TrekWeatherCard — Apple Weather full-bleed scene ────────────────────────
export function TrekWeatherCard({ trek }) {
  const { weather, status } = useWeather(trek)
  const wInfo  = weather ? classify(weather.code) : null
  const type   = wInfo?.type ?? 'clear'
  const Scene  = SCENES[type]

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-xl" style={{ minHeight: 230 }}>
      <style>{STYLES}</style>

      {/* ── Animated full-card background ── */}
      <Scene />

      {/* ── Content overlaid on scene ── */}
      <div className="relative z-10 flex flex-col h-full" style={{ minHeight: 230 }}>

        {/* Trek identity — top */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-2">
          <div className="size-12 rounded-xl overflow-hidden shrink-0 shadow-lg ring-2 ring-white/30">
            <img src={trek.image} alt={trek.name} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <p className="font-mono text-[9px] uppercase tracking-widest text-white/65 mb-0.5">
              Trek Advisor · Active Context
            </p>
            <p className="text-base font-extrabold text-white tracking-tight leading-tight drop-shadow truncate">
              {trek.name}
            </p>
            <p className="text-[11px] text-white/55 truncate">
              {trek.region} · {trek.days}d · {trek.difficulty}
            </p>
          </div>
        </div>

        {/* Temperature — centrepiece */}
        <div className="flex-1 flex flex-col items-center justify-center py-3">
          {status === 'loading' && (
            <div className="flex gap-1.5">
              {[0, .18, .36].map((d, i) => (
                <div key={i} className="size-2 rounded-full bg-white/50 animate-bounce"
                  style={{ animationDelay: `${d}s` }} />
              ))}
            </div>
          )}
          {status === 'done' && weather && wInfo && (
            <>
              <p className="text-6xl font-black text-white leading-none"
                style={{ textShadow: '0 2px 24px rgba(0,0,0,.35)' }}>
                {weather.temp}°
              </p>
              <p className="text-sm font-semibold text-white/75 mt-1 tracking-wide">
                {wInfo.label}
              </p>
            </>
          )}
          {status === 'error' && (
            <p className="text-xs text-white/40 italic">Weather unavailable</p>
          )}
        </div>

        {/* Stats — frosted glass bottom bar */}
        {status === 'done' && weather && (
          <div className="flex items-center gap-px mx-0"
            style={{ background: 'rgba(0,0,0,.28)', backdropFilter: 'blur(12px)',
              borderTop: '1px solid rgba(255,255,255,.12)' }}>
            {[
              { label: 'Feels like', value: `${weather.feelsLike}°` },
              { label: 'Wind',       value: `${weather.wind} km/h`  },
              { label: 'Humidity',   value: `${weather.humidity}%`  },
              { label: 'Price from', value: trek.priceUSD ? `$${trek.priceUSD.toLocaleString()}` : '—' },
            ].map((s, i, arr) => (
              <div key={s.label} className="flex-1 text-center py-3"
                style={{ borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,.1)' : 'none' }}>
                <p className="text-sm font-bold text-white leading-none">{s.value}</p>
                <p className="font-mono text-[9px] uppercase tracking-wide text-white/40 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── TrekWeatherBanner — compact top-of-chat bar ─────────────────────────────
export function TrekWeatherBanner({ trek }) {
  const { weather, status } = useWeather(trek)
  const wInfo  = weather ? classify(weather.code) : null
  const type   = wInfo?.type ?? 'clear'
  const theme  = BANNER[type]
  const Scene  = SCENES[type]

  return (
    <div className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl overflow-hidden border ${theme.border}`}>
      <style>{STYLES}</style>

      {/* Full animated scene — clipped to banner height */}
      <Scene />

      {/* Darkening scrim so text stays readable at compact height */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'rgba(0,0,0,.18)' }} />

      {/* Trek image */}
      <div className="relative size-10 rounded-xl overflow-hidden shrink-0 shadow-md ring-1 ring-white/30">
        <img src={trek.image} alt={trek.name} className="w-full h-full object-cover" />
      </div>

      {/* Trek info */}
      <div className="relative flex-1 min-w-0">
        <p className="font-mono text-[9px] uppercase tracking-widest text-white/70 mb-0.5">
          Trek Advisor Context
        </p>
        <p className="text-sm font-extrabold text-white truncate drop-shadow">{trek.name}</p>
        <p className="text-[11px] text-white/60 truncate">{trek.region} · {trek.days}d</p>
      </div>

      {/* Weather data */}
      <div className="relative flex items-center gap-3 shrink-0"
        style={{ borderLeft: '1px solid rgba(255,255,255,.2)', paddingLeft: 12 }}>
        {status === 'loading' && (
          <div className="flex gap-1">
            {[0, .15, .3].map((d, i) => (
              <div key={i} className="size-1.5 rounded-full bg-white/40 animate-bounce"
                style={{ animationDelay: `${d}s` }} />
            ))}
          </div>
        )}
        {status === 'done' && weather && wInfo && (
          <div className="flex flex-col items-end text-right">
            <p className="text-2xl font-black text-white leading-none"
              style={{ textShadow: '0 1px 8px rgba(0,0,0,.3)' }}>
              {weather.temp}°
            </p>
            <p className="text-[10px] text-white/70 font-medium mt-0.5">{wInfo.label}</p>
            <div className="flex gap-2 mt-1">
              <span className="font-mono text-[9px] text-white/55">💨 {weather.wind} km/h</span>
              <span className="font-mono text-[9px] text-white/55">💧 {weather.humidity}%</span>
            </div>
          </div>
        )}
        {status === 'error' && (
          <span className="text-[9px] text-white/35 italic">unavailable</span>
        )}
      </div>
    </div>
  )
}
