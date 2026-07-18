import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import { getRouteData, interpolateRoute, fetchOsmRoute } from '../lib/trekRoutes'

// ─── Constants ────────────────────────────────────────────────────────────────
const TILE_TOPO   = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
const TILE_OSM    = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const TILE_ATTRIB = '© <a href="https://opentopomap.org">OpenTopoMap</a> | © <a href="https://openstreetmap.org">OpenStreetMap</a>'

const SPEEDS = [1, 2, 5, 10]   // animation speed multipliers
const BASE_DURATION = 60000     // ms at 1× to traverse full route

// View transforms applied to the map wrapper
const VIEW_CSS = {
  top:       'perspective(1200px) rotateX(0deg)   scale(1)',
  tilt:      'perspective(700px)  rotateX(52deg)  scale(1.55) translateY(-18%)',
  elevation: 'perspective(1200px) rotateX(0deg)   scale(1)',
  pov:       'perspective(1200px) rotateX(0deg)   scale(1)',
}

// Waypoint icon styles
const ICON_STYLE = {
  start:   { bg: '#10b981', label: '▶' },
  village: { bg: '#f59e0b', label: '⌂' },
  camp:    { bg: '#3b82f6', label: '⛺' },
  pass:    { bg: '#8b5cf6', label: '⛰' },
  peak:    { bg: '#ef4444', label: '▲' },
  end:     { bg: '#ef4444', label: '⚑' },
}

// ─── Elevation SVG chart ──────────────────────────────────────────────────────
function ElevationChart({ waypoints, progress, trek }) {
  if (!waypoints?.length) return null
  const W = 900, H = 220, PAD = { t: 20, r: 20, b: 44, l: 56 }
  const IW = W - PAD.l - PAD.r, IH = H - PAD.t - PAD.b

  const alts   = waypoints.map((w) => w[2])
  const minAlt = Math.min(...alts)
  const maxAlt = Math.max(...alts)
  const range  = maxAlt - minAlt || 1
  const n      = waypoints.length

  const x = (i) => PAD.l + (i / (n - 1)) * IW
  const y = (a) => PAD.t + IH - ((a - minAlt) / range) * IH

  const linePts  = waypoints.map((w, i) => `${x(i)},${y(w[2])}`).join(' ')
  const areaPts  = `${x(0)},${PAD.t + IH} ${linePts} ${x(n - 1)},${PAD.t + IH}`
  const curX     = PAD.l + progress * IW
  const curAlt   = Math.round(minAlt + progress * range)

  // Altitude grid lines
  const gridAlts = Array.from({ length: 5 }, (_, i) => Math.round(minAlt + (i / 4) * range))

  return (
    <div className="absolute inset-x-0 bottom-20 z-20 px-4">
      <div className="max-w-3xl mx-auto bg-ink/85 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        <div className="px-5 pt-4 pb-1 flex items-center justify-between">
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">Elevation Profile</p>
          <p className="text-xs text-white/60">{(minAlt).toLocaleString()} – {(maxAlt).toLocaleString()} m</p>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 160 }}>
          <defs>
            <linearGradient id="elGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ade80" stopOpacity=".5" />
              <stop offset="100%" stopColor="#4ade80" stopOpacity=".03" />
            </linearGradient>
            <linearGradient id="progGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>

          {/* Grid */}
          {gridAlts.map((alt, i) => (
            <g key={i}>
              <line x1={PAD.l} y1={y(alt)} x2={PAD.l + IW} y2={y(alt)}
                stroke="rgba(255,255,255,.06)" strokeWidth="1" />
              <text x={PAD.l - 6} y={y(alt) + 4} textAnchor="end"
                fill="rgba(255,255,255,.3)" fontSize="10" fontFamily="monospace">
                {alt >= 1000 ? `${(alt / 1000).toFixed(1)}k` : alt}
              </text>
            </g>
          ))}

          {/* Terrain fill */}
          <polygon points={areaPts} fill="url(#elGrad)" />

          {/* Full route line (dim) */}
          <polyline points={linePts} fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="2" />

          {/* Progress line (bright) */}
          {(() => {
            const pi = Math.min(Math.floor(progress * (n - 1)), n - 2)
            const partial = (progress * (n - 1)) - pi
            const progPts = [...waypoints.slice(0, pi + 1).map((w, i) => `${x(i)},${y(w[2])}`),
              `${x(pi) + (x(pi + 1) - x(pi)) * partial},${y(waypoints[pi][2]) + (y(waypoints[pi + 1]?.[2] ?? waypoints[pi][2]) - y(waypoints[pi][2])) * partial}`].join(' ')
            return <polyline points={progPts} fill="none" stroke="url(#progGrad)" strokeWidth="3" strokeLinecap="round" />
          })()}

          {/* Waypoint dots */}
          {waypoints.map((w, i) => {
            const style = ICON_STYLE[w[4]] || ICON_STYLE.camp
            return (
              <g key={i}>
                <circle cx={x(i)} cy={y(w[2])} r="5" fill={style.bg} stroke="white" strokeWidth="1.5" />
                {(i === 0 || i === n - 1 || w[4] === 'pass' || w[4] === 'peak') && (
                  <text x={x(i)} y={y(w[2]) - 9} textAnchor="middle"
                    fill="rgba(255,255,255,.7)" fontSize="9" fontFamily="sans-serif">{w[3]}</text>
                )}
              </g>
            )
          })}

          {/* Current position cursor */}
          <line x1={curX} y1={PAD.t} x2={curX} y2={PAD.t + IH}
            stroke="white" strokeWidth="1.5" strokeDasharray="4 3" opacity=".7" />
          <text x={curX} y={PAD.t - 4} textAnchor="middle"
            fill="white" fontSize="11" fontWeight="bold" fontFamily="monospace">
            {curAlt.toLocaleString()}m
          </text>
        </svg>
      </div>
    </div>
  )
}

// ─── POV HUD overlay ──────────────────────────────────────────────────────────
function PovHud({ currentAlt, distTotal, progress, trekName }) {
  const distDone = Math.round((distTotal || 0) * progress)
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-3 pointer-events-none">
      {[
        { label: 'Altitude', value: `${currentAlt?.toLocaleString() ?? '—'} m` },
        { label: 'Distance', value: `${distDone} km` },
        { label: 'Progress', value: `${Math.round(progress * 100)}%` },
      ].map((s) => (
        <div key={s.label} className="text-center px-4 py-2 rounded-xl bg-ink/70 backdrop-blur border border-white/10">
          <p className="text-lg font-black text-white leading-none">{s.value}</p>
          <p className="font-mono text-[9px] uppercase tracking-widest text-white/40 mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function TrekMapPage({ treks }) {
  const { slug }    = useParams()
  const navigate    = useNavigate()
  const trek        = treks.find((t) => t.slug === slug)

  const mapDivRef   = useRef(null)    // DOM node Leaflet mounts to
  const leafletMap  = useRef(null)    // L.Map instance
  const routeLine   = useRef(null)    // animated L.Polyline
  const ghostLine   = useRef(null)    // full route ghost
  const hikerMarker = useRef(null)    // moving marker
  const wptMarkers  = useRef([])      // waypoint markers
  const tileLayer   = useRef(null)

  const rafId       = useRef(null)
  const startTime   = useRef(null)
  const pausedAt    = useRef(0)       // progress saved on pause (0–1)

  const [view,      setView]      = useState('top')
  const [playing,   setPlaying]   = useState(false)
  const [speed,     setSpeed]     = useState(1)
  const [progress,  setProgress]  = useState(0)
  const [routeData, setRouteData] = useState(null)   // { waypoints, fullPath, center, zoom }
  const [osmStatus, setOsmStatus] = useState('idle') // idle | loading | done | failed
  const [activeWpt, setActiveWpt] = useState(null)

  // ── Derive interpolated path ──────────────────────────────────────────────
  const fullPath = routeData?.fullPath ?? []
  const waypoints = routeData?.waypoints ?? []

  // Current position in fullPath
  const currentIdx = Math.min(Math.floor(progress * (fullPath.length - 1)), fullPath.length - 2)
  const currentPt  = fullPath[currentIdx] ?? null
  const currentAlt = currentPt?.[2] ?? null

  // ── Init Leaflet ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!trek || !mapDivRef.current) return
    let L
    import('leaflet').then((mod) => {
      L = mod.default

      // Destroy previous instance
      if (leafletMap.current) { leafletMap.current.remove(); leafletMap.current = null }

      const route = getRouteData(trek)
      const path  = interpolateRoute(route.waypoints, 16)
      setRouteData({ waypoints: route.waypoints, fullPath: path, center: route.center, zoom: route.zoom })

      const map = L.map(mapDivRef.current, {
        center: route.center,
        zoom:   route.zoom,
        zoomControl: false,
        attributionControl: false,
      })
      leafletMap.current = map

      // Topo tile layer (falls back to OSM if unavailable)
      tileLayer.current = L.tileLayer(TILE_TOPO, { attribution: TILE_ATTRIB, maxZoom: 17 }).addTo(map)

      L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map)
      L.control.zoom({ position: 'bottomright' }).addTo(map)

      // Ghost route (full path, dim)
      ghostLine.current = L.polyline(path.map(([la, lo]) => [la, lo]), {
        color: 'rgba(255,255,255,.22)', weight: 3, dashArray: '6 5',
      }).addTo(map)

      // Animated route (starts empty)
      routeLine.current = L.polyline([], {
        color: '#4ade80', weight: 5, lineCap: 'round', lineJoin: 'round',
      }).addTo(map)

      // Hiker marker
      hikerMarker.current = L.marker(route.center, {
        icon: L.divIcon({
          className: '',
          html: `<div style="
            width:20px;height:20px;border-radius:50%;
            background:#4ade80;border:3px solid white;
            box-shadow:0 0 0 4px rgba(74,222,128,.35),0 2px 8px rgba(0,0,0,.4);
          "></div>`,
          iconSize: [20, 20], iconAnchor: [10, 10],
        }),
        zIndexOffset: 1000,
      }).addTo(map)

      // Waypoint markers
      wptMarkers.current.forEach((m) => map.removeLayer(m))
      wptMarkers.current = route.waypoints.map((wpt, i) => {
        const st = ICON_STYLE[wpt[4]] || ICON_STYLE.camp
        const m = L.marker([wpt[0], wpt[1]], {
          icon: L.divIcon({
            className: '',
            html: `<div title="${wpt[3]}" style="
              width:28px;height:28px;border-radius:50%;
              background:${st.bg};border:2.5px solid white;
              display:flex;align-items:center;justify-content:center;
              font-size:12px;box-shadow:0 2px 8px rgba(0,0,0,.35);
              cursor:pointer;
            ">${st.label}</div>`,
            iconSize: [28, 28], iconAnchor: [14, 14],
          }),
        }).addTo(map)
        m.on('click', () => setActiveWpt(wpt))
        return m
      })

      // Fly to fit the full route
      map.fitBounds(ghostLine.current.getBounds(), { padding: [40, 40] })

      // Try Overpass in background
      setOsmStatus('loading')
      fetchOsmRoute(route.osmName).then((osmCoords) => {
        if (!osmCoords || osmCoords.length < 30 || !leafletMap.current) { setOsmStatus('failed'); return }
        const enhanced = interpolateRoute(osmCoords.map(([la, lo]) => [la, lo, 0]), 2)
        ghostLine.current?.setLatLngs(enhanced.map(([la, lo]) => [la, lo]))
        setRouteData((prev) => ({ ...prev, fullPath: enhanced }))
        setOsmStatus('done')
      }).catch(() => setOsmStatus('failed'))
    })

    return () => {
      cancelAnimationFrame(rafId.current)
      if (leafletMap.current) { leafletMap.current.remove(); leafletMap.current = null }
    }
  }, [trek?.slug])

  // ── Animation loop ────────────────────────────────────────────────────────
  const tick = useCallback((ts) => {
    if (!startTime.current) startTime.current = ts
    const elapsed  = ts - startTime.current
    const duration = BASE_DURATION / speed
    const p        = Math.min(pausedAt.current + elapsed / duration, 1)

    setProgress(p)

    const path = routeLine.current
    const ghost = ghostLine.current
    const hiker = hikerMarker.current
    const map   = leafletMap.current

    if (path && ghost) {
      const pts = ghost.getLatLngs()
      if (pts.length > 1) {
        const endIdx = Math.floor(p * (pts.length - 1))
        const drawn  = pts.slice(0, endIdx + 1)
        path.setLatLngs(drawn)
        const pos = pts[endIdx]
        if (pos && hiker) {
          hiker.setLatLng(pos)
          if (view === 'pov') map?.panTo(pos, { animate: true, duration: 0.3 })
        }
      }
    }

    if (p < 1) rafId.current = requestAnimationFrame(tick)
    else { pausedAt.current = 1; setPlaying(false) }
  }, [speed, view])

  useEffect(() => {
    cancelAnimationFrame(rafId.current)
    startTime.current = null
    if (playing) rafId.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId.current)
  }, [playing, tick])

  // ── Seek (progress slider) ────────────────────────────────────────────────
  function seek(p) {
    cancelAnimationFrame(rafId.current)
    setPlaying(false)
    pausedAt.current = p
    startTime.current = null
    setProgress(p)

    const pts = ghostLine.current?.getLatLngs() ?? []
    if (pts.length > 1) {
      const endIdx = Math.floor(p * (pts.length - 1))
      routeLine.current?.setLatLngs(pts.slice(0, endIdx + 1))
      const pos = pts[endIdx]
      if (pos) {
        hikerMarker.current?.setLatLng(pos)
        if (view === 'pov') leafletMap.current?.panTo(pos)
      }
    }
  }

  // ── View changes ──────────────────────────────────────────────────────────
  function switchView(v) {
    setView(v)
    const map = leafletMap.current
    if (!map) return
    setTimeout(() => map.invalidateSize(), 900)
    if (v === 'pov') {
      map.setZoom(14, { animate: true })
      const pts = ghostLine.current?.getLatLngs() ?? []
      const pos = pts[Math.floor(progress * (pts.length - 1))]
      if (pos) map.panTo(pos, { animate: true })
    } else if (v !== 'elevation') {
      if (ghostLine.current) map.fitBounds(ghostLine.current.getBounds(), { padding: [40, 40], animate: true })
    }
  }

  if (!trek) {
    return (
      <div className="fixed inset-0 z-50 bg-ink flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl font-bold mb-4">Trek not found</p>
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-accent rounded-xl text-sm font-bold">Go back</button>
        </div>
      </div>
    )
  }

  const views = [
    { id: 'top',       icon: '🌍', label: 'Top'  },
    { id: 'tilt',      icon: '📐', label: 'Tilt' },
    { id: 'elevation', icon: '📊', label: 'Elev' },
    { id: 'pov',       icon: '👁',  label: 'POV'  },
  ]

  const dayProgress = waypoints.length > 1
    ? Math.min(Math.round(progress * (trek.days ?? waypoints.length - 1)), trek.days ?? waypoints.length - 1)
    : 0

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-ink overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 py-3 bg-ink/90 backdrop-blur border-b border-white/8 shrink-0 z-30">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-xs font-medium shrink-0">
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          <span className="hidden sm:inline">Chat</span>
        </button>

        <div className="flex-1 min-w-0">
          <p className="font-mono text-[9px] uppercase tracking-widest text-accent">Route & Map</p>
          <p className="text-sm font-extrabold text-white truncate">{trek.name}</p>
        </div>

        {/* OSM status badge */}
        <div className="shrink-0">
          {osmStatus === 'loading' && (
            <span className="font-mono text-[9px] text-white/30 flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-amber-400 animate-pulse inline-block" /> OSM loading
            </span>
          )}
          {osmStatus === 'done' && (
            <span className="font-mono text-[9px] text-green-400 flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-green-400 inline-block" /> OSM live
            </span>
          )}
        </div>

        {/* View switcher */}
        <div className="flex gap-1 bg-white/8 rounded-xl p-1 shrink-0">
          {views.map((v) => (
            <button key={v.id} onClick={() => switchView(v.id)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${view === v.id ? 'bg-accent text-white' : 'text-white/40 hover:text-white'}`}>
              <span>{v.icon}</span>
              <span className="hidden sm:inline">{v.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Map area ── */}
      <div className="relative flex-1 overflow-hidden">

        {/* Map wrapper — CSS 3D transform applied here */}
        <div className="absolute inset-0 transition-transform duration-700 ease-out will-change-transform"
          style={{ transform: VIEW_CSS[view] }}>
          <div ref={mapDivRef} className="w-full h-full" />
        </div>

        {/* Tilt mode overlay */}
        {view === 'tilt' && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <div className="px-4 py-2 bg-ink/70 backdrop-blur rounded-full border border-white/10">
              <p className="text-[10px] text-white/50 font-mono uppercase tracking-widest text-center">
                3D tilt — switch to Top to interact
              </p>
            </div>
          </div>
        )}

        {/* Elevation chart */}
        {view === 'elevation' && (
          <ElevationChart waypoints={waypoints} progress={progress} trek={trek} />
        )}

        {/* POV hud */}
        {view === 'pov' && (
          <PovHud currentAlt={currentAlt} distTotal={trek.distanceKm} progress={progress} trekName={trek.name} />
        )}

        {/* Waypoint info popup */}
        {activeWpt && (
          <div className="absolute top-4 left-4 z-20 max-w-xs">
            <div className="bg-ink/90 backdrop-blur rounded-2xl border border-white/10 p-4 shadow-2xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-accent mb-1">
                    {activeWpt[4]?.toUpperCase() || 'WAYPOINT'}
                  </p>
                  <p className="text-sm font-extrabold text-white">{activeWpt[3]}</p>
                  <p className="text-xs text-white/50 mt-0.5">
                    ⛰ {activeWpt[2]?.toLocaleString()} m &nbsp;·&nbsp;
                    {activeWpt[0].toFixed(4)}°N, {activeWpt[1].toFixed(4)}°E
                  </p>
                </div>
                <button onClick={() => setActiveWpt(null)} className="text-white/30 hover:text-white shrink-0">
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom control bar ── */}
      <div className="shrink-0 bg-ink/95 backdrop-blur border-t border-white/8 px-4 py-3 z-30">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">

          {/* Play / Pause */}
          <button onClick={() => {
              if (progress >= 1) { seek(0); setTimeout(() => setPlaying(true), 50) }
              else if (playing) { pausedAt.current = progress; setPlaying(false) }
              else setPlaying(true)
            }}
            className="size-10 rounded-full bg-accent hover:brightness-110 text-white flex items-center justify-center shrink-0 shadow-lg transition-all">
            {playing
              ? <svg viewBox="0 0 24 24" className="size-4" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
              : <svg viewBox="0 0 24 24" className="size-5" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            }
          </button>

          {/* Progress scrubber */}
          <div className="flex-1 flex flex-col gap-1">
            <input type="range" min="0" max="1" step="0.001" value={progress}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #4ade80 ${progress * 100}%, rgba(255,255,255,.15) ${progress * 100}%)`
              }} />
            <div className="flex justify-between">
              <span className="font-mono text-[9px] text-white/30">Day 0</span>
              <span className="font-mono text-[9px] text-white/60 font-bold">
                Day {dayProgress} / {trek.days ?? waypoints.length - 1}
                {currentAlt ? ` · ${currentAlt.toLocaleString()}m` : ''}
              </span>
              <span className="font-mono text-[9px] text-white/30">Day {trek.days}</span>
            </div>
          </div>

          {/* Speed selector */}
          <div className="flex gap-1 shrink-0">
            {SPEEDS.map((s) => (
              <button key={s} onClick={() => setSpeed(s)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${speed === s ? 'bg-accent text-white' : 'bg-white/8 text-white/40 hover:text-white'}`}>
                {s}×
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
