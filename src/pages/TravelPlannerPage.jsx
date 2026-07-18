import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  HAS_AMADEUS, getGateway, suggestDates, searchFlights,
  sortFlights, fmtDuration, countStops, stopsLabel, AIRLINE_NAMES, skyscannerUrl, visaInfo,
} from '../lib/amadeus'
import {
  CURRENCIES, getExchangeRates, convertPrice, formatMoney,
  getTrailhead, getDrivingRoute, getCityGuide, formatDriveTime,
} from '../lib/travelData'
import { searchAirportsLocal } from '../lib/airports'

// Gateway airport lat/lon for OSRM ground routing
const GATEWAY_COORDS = {
  KTM: [27.6974, 85.3592], PKR: [28.2006, 83.9822], IXL: [34.1357, 77.5445],
  SXR: [34.0088, 74.7674], DED: [30.1892, 78.1802], KUU: [31.8766, 77.1543],
  DHM: [32.1655, 76.2633], IXB: [26.6812, 88.3287], DEL: [28.5562, 77.1000],
  BOM: [19.0896, 72.8656], BLR: [13.1979, 77.7063], CCU: [22.6569, 88.4467],
  MNG: [12.9611, 74.8898], PNQ: [18.5822, 73.9197], CCJ: [11.1366, 75.9552],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function airportLabel(a) {
  const city = a.city || a.address?.cityName || ''
  return `${a.iataCode} — ${a.name}${city ? `, ${city}` : ''}`
}
function flightTime(seg, which) {
  return (which === 'dep' ? seg.departure.at : seg.arrival.at).slice(11, 16)
}
function flightDate(seg, which) {
  return (which === 'dep' ? seg.departure.at : seg.arrival.at).slice(0, 10)
}
function dayDiff(a, b) { return Math.round((new Date(b) - new Date(a)) / 86400000) }

// ─── Currency picker ──────────────────────────────────────────────────────────
function CurrencyPicker({ value, onChange }) {
  return (
    <div className="space-y-1.5">
      <label className="font-mono text-[10px] uppercase tracking-widest text-ink/40 block">Currency</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border border-ink/12 bg-white text-sm focus:outline-none focus:border-accent/50 transition-all appearance-none">
        {CURRENCIES.map(c => (
          <option key={c.code} value={c.code}>{c.symbol} {c.code} — {c.label}</option>
        ))}
      </select>
    </div>
  )
}

// ─── FlightCard ───────────────────────────────────────────────────────────────
function FlightCard({ offer, selected, onSelect, rates, currency }) {
  const itin = offer.itineraries[0]
  const first = itin.segments[0]
  const last = itin.segments[itin.segments.length - 1]
  const stops = countStops(itin)
  const cabin = offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'ECONOMY'
  const carriers = [...new Set(itin.segments.map(s => AIRLINE_NAMES[s.carrierCode] || s.carrierCode))]
  const dd = dayDiff(flightDate(first, 'dep'), flightDate(last, 'arr'))
  const via = itin.segments.slice(0, -1).map(s => s.arrival.iataCode)
  const priceUSD = parseFloat(offer.price.total)
  const priceLocal = convertPrice(priceUSD, rates, currency)

  return (
    <button onClick={onSelect}
      className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 ${
        selected
          ? 'border-accent bg-accent/5 shadow-md shadow-accent/10'
          : 'border-ink/8 bg-white hover:border-accent/30 hover:shadow-lg hover:-translate-y-0.5'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-bold text-ink truncate max-w-[180px]">{carriers.join(' · ')}</div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40 mt-0.5">
            {cabin.charAt(0) + cabin.slice(1).toLowerCase()} · {stopsLabel(stops)}
          </div>
        </div>
        <div className="text-right shrink-0 ml-3">
          <div className="text-xl font-extrabold tracking-tight">{formatMoney(priceLocal, currency)}</div>
          <div className="font-mono text-[10px] text-ink/40">per person</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-center w-14 shrink-0">
          <div className="text-xl font-bold tabular-nums leading-none">{flightTime(first, 'dep')}</div>
          <div className="font-mono text-[10px] text-ink/50 mt-0.5">{first.departure.iataCode}</div>
        </div>
        <div className="flex-1 flex flex-col items-center min-w-0">
          <div className="font-mono text-[10px] text-ink/40 mb-1.5">{fmtDuration(itin.duration)}</div>
          <div className="w-full flex items-center gap-1">
            <div className="flex-1 h-px bg-ink/15" />
            {stops === 0 ? (
              <svg viewBox="0 0 16 16" className="size-3 text-accent shrink-0" fill="currentColor">
                <path d="M8 0L10 6H16L11 9.5L13 16L8 12L3 16L5 9.5L0 6H6L8 0Z" />
              </svg>
            ) : via.map((code, i) => (
              <div key={i} className="flex flex-col items-center shrink-0">
                <div className="size-2 rounded-full bg-ink/20 border border-ink/30" />
                <div className="font-mono text-[8px] text-ink/30 leading-none mt-0.5">{code}</div>
              </div>
            ))}
            <div className="flex-1 h-px bg-ink/15" />
          </div>
        </div>
        <div className="text-center w-14 shrink-0">
          <div className="text-xl font-bold tabular-nums leading-none">
            {flightTime(last, 'arr')}
            {dd > 0 && <sup className="text-[10px] text-accent font-bold">+{dd}</sup>}
          </div>
          <div className="font-mono text-[10px] text-ink/50 mt-0.5">{last.arrival.iataCode}</div>
        </div>
      </div>

      {selected && (
        <div className="mt-3 flex items-center gap-1.5 text-accent text-[11px] font-bold uppercase tracking-widest">
          <svg viewBox="0 0 20 20" className="size-3.5" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
          Selected
        </div>
      )}
    </button>
  )
}

// ─── Ground leg card ──────────────────────────────────────────────────────────
function GroundLegCard({ trek, gateway, groundRoute, loading }) {
  const trailhead = getTrailhead(trek)
  if (!trailhead) return null

  const isFlight = trailhead.note?.toLowerCase().includes('flight')
  const isBus = trailhead.note?.toLowerCase().includes('bus') || trailhead.note?.toLowerCase().includes('road')

  return (
    <div className="rounded-2xl border border-ink/8 bg-white overflow-hidden">
      <div className="px-5 py-3 bg-base border-b border-ink/6 flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="size-3.5 text-accent" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink/50">Last Leg · {gateway.city} → Trailhead</span>
      </div>
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Timeline */}
          <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
            <div className="size-2.5 rounded-full bg-accent" />
            <div className="w-px flex-1 min-h-[32px] bg-accent/25 border-l border-dashed border-accent/40" />
            <div className="size-2.5 rounded-full bg-ink/30" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="mb-3">
              <div className="font-semibold text-sm">{gateway.city} ({gateway.code})</div>
              <div className="font-mono text-[10px] text-ink/40 mt-0.5">{gateway.name} Airport</div>
            </div>
            <div>
              <div className="font-semibold text-sm">{trailhead.name}</div>
              <div className="font-mono text-[10px] text-ink/40 mt-0.5">Trek start point</div>
            </div>
          </div>
          <div className="shrink-0 text-right">
            {loading ? (
              <div className="h-5 w-16 bg-ink/8 rounded animate-pulse" />
            ) : isFlight ? (
              <div>
                <div className="text-sm font-bold text-accent">✈ Connecting flight</div>
                <div className="font-mono text-[10px] text-ink/40 mt-0.5">~45 min</div>
              </div>
            ) : groundRoute ? (
              <div>
                <div className="text-sm font-bold">{formatDriveTime(groundRoute.durationMin)}</div>
                <div className="font-mono text-[10px] text-ink/40 mt-0.5">{groundRoute.distanceKm} km by road</div>
              </div>
            ) : (
              <div className="font-mono text-[10px] text-ink/30">Route unavailable</div>
            )}
          </div>
        </div>

        <div className="mt-4 px-3 py-2.5 rounded-xl bg-base border border-ink/6">
          <p className="text-[12px] text-ink/55 leading-relaxed">
            <span className="font-semibold text-ink/70">How to get there: </span>
            {trailhead.note}
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── City guide card ──────────────────────────────────────────────────────────
function CityGuideCard({ gateway, guide, loading, bufferDays }) {
  const [expanded, setExpanded] = useState(false)
  if (loading) {
    return (
      <div className="rounded-2xl border border-ink/8 bg-white p-5 space-y-3 animate-pulse">
        <div className="h-4 w-48 bg-ink/8 rounded" />
        <div className="h-3 w-full bg-ink/6 rounded" />
        <div className="h-3 w-5/6 bg-ink/6 rounded" />
        <div className="h-3 w-4/6 bg-ink/6 rounded" />
      </div>
    )
  }
  if (!guide) return null

  const paras = guide.summary?.split('\n\n') || []
  const preview = paras[0] || ''
  const rest = paras.slice(1).join('\n\n')

  return (
    <div className="rounded-2xl border border-ink/8 bg-white overflow-hidden">
      <div className="px-5 py-3 bg-base border-b border-ink/6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">🏙</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink/50">
            Your {bufferDays || 1} Day{(bufferDays || 1) > 1 ? 's' : ''} in {gateway.city}
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-widest text-ink/30">Via Wikivoyage</span>
      </div>
      <div className="p-5">
        <h4 className="font-extrabold text-base tracking-tight mb-3">{guide.title}</h4>
        <p className="text-[13px] text-ink/60 leading-relaxed">{preview}</p>
        {rest && (
          <>
            {expanded && <p className="text-[13px] text-ink/60 leading-relaxed mt-3">{rest}</p>}
            <button onClick={() => setExpanded(e => !e)}
              className="mt-3 font-mono text-[10px] uppercase tracking-widest text-accent hover:text-ink transition-colors">
              {expanded ? '↑ Show less' : '↓ Read more'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="p-5 rounded-2xl border border-ink/5 bg-white animate-pulse space-y-4">
      <div className="flex justify-between">
        <div className="space-y-2"><div className="h-4 w-32 bg-ink/8 rounded" /><div className="h-3 w-24 bg-ink/5 rounded" /></div>
        <div className="h-6 w-16 bg-ink/8 rounded" />
      </div>
      <div className="flex items-center gap-3">
        <div className="h-6 w-12 bg-ink/8 rounded" />
        <div className="flex-1 h-px bg-ink/8" />
        <div className="h-6 w-12 bg-ink/8 rounded" />
      </div>
    </div>
  )
}

// ─── Sort pill ────────────────────────────────────────────────────────────────
function SortPill({ label, active, onClick }) {
  return (
    <button onClick={onClick}
      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
        active ? 'bg-ink text-white' : 'border border-ink/12 text-ink/40 hover:border-ink/30 hover:text-ink/70'
      }`}>
      {label}
    </button>
  )
}

// ─── Flight column ────────────────────────────────────────────────────────────
function FlightColumn({ title, subtitle, flights, sort, onSort, selected, onSelect, loading, error, noResultHint, rates, currency }) {
  const sorted = sortFlights(flights, sort)
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end justify-between mb-1">
        <div>
          <h3 className="font-extrabold text-base tracking-tight">{title}</h3>
          <p className="font-mono text-[10px] text-ink/40 uppercase tracking-widest mt-0.5">{subtitle}</p>
        </div>
        <div className="flex gap-1">
          {['price', 'duration', 'stops'].map(k => (
            <SortPill key={k} label={k} active={sort === k} onClick={() => onSort(k)} />
          ))}
        </div>
      </div>
      {loading ? (
        Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
      ) : error ? (
        <div className="p-5 rounded-2xl bg-red-50 border border-red-100 text-sm text-red-600">{error}</div>
      ) : sorted.length === 0 ? (
        <div className="p-6 rounded-2xl border border-ink/8 bg-white text-center space-y-2">
          <div className="text-2xl">✈️</div>
          <p className="text-sm font-semibold text-ink/60">No flights found</p>
          {noResultHint && <p className="text-xs text-ink/40">{noResultHint}</p>}
        </div>
      ) : sorted.map(offer => (
        <FlightCard key={offer.id} offer={offer}
          selected={selected?.id === offer.id} onSelect={() => onSelect(offer)}
          rates={rates} currency={currency} />
      ))}
    </div>
  )
}

// ─── Trip summary bar ─────────────────────────────────────────────────────────
function TripSummary({ trek, outFlight, retFlight, homeAirport, gateway, outDate, retDate, adults, rates, currency }) {
  const outUSD = outFlight ? parseFloat(outFlight.price.total) * adults : 0
  const retUSD = retFlight ? parseFloat(retFlight.price.total) * adults : 0
  const trekUSD = trek.priceBudget * adults
  const totalUSD = outUSD + retUSD + trekUSD
  const fmt = n => formatMoney(convertPrice(n, rates, currency), currency)
  const bookUrl = skyscannerUrl(homeAirport.iataCode, gateway.code, outDate, retDate)

  return (
    <div className="sticky bottom-0 mt-6 bg-ink text-white rounded-2xl p-5 shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-widest opacity-50 mb-1">Outbound</div>
            <div className="text-sm font-bold">
              {outFlight ? fmt(outUSD) : <span className="opacity-40">—</span>}
            </div>
          </div>
          <div>
            <div className="font-mono text-[9px] uppercase tracking-widest opacity-50 mb-1">Return</div>
            <div className="text-sm font-bold">
              {retFlight ? fmt(retUSD) : <span className="opacity-40">—</span>}
            </div>
          </div>
          <div>
            <div className="font-mono text-[9px] uppercase tracking-widest opacity-50 mb-1">Trek (from)</div>
            <div className="text-sm font-bold">{fmt(trekUSD)}</div>
          </div>
          <div>
            <div className="font-mono text-[9px] uppercase tracking-widest opacity-50 mb-1">Est. Total</div>
            <div className="text-lg font-extrabold text-accent">{fmt(totalUSD)}</div>
          </div>
        </div>
        <a href={bookUrl} target="_blank" rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-2 px-5 py-3 bg-accent text-white rounded-xl text-sm font-bold hover:bg-accent/90 transition-colors whitespace-nowrap">
          Book on Skyscanner
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </a>
      </div>
      <p className="text-[10px] opacity-30 mt-3">
        Prices shown in {currency}. Indicative only — confirm at time of booking.
        {rates && currency !== 'USD' && ' Exchange rates via open.er-api.com.'}
      </p>
    </div>
  )
}

// ─── Airport autocomplete ─────────────────────────────────────────────────────
function AirportInput({ value, onChange, onSelect, suggestions, showDrop, focusedIdx, onKeyDown, onFocus, onBlur }) {
  return (
    <div className="relative">
      <div className="relative">
        <svg viewBox="0 0 24 24" className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink/30"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input type="text" value={value} onChange={e => onChange(e.target.value)}
          onFocus={onFocus} onBlur={onBlur} onKeyDown={onKeyDown}
          placeholder="Search city or airport…"
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-ink/12 bg-white text-sm focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all placeholder-ink/30"
          autoComplete="off" spellCheck={false} />
      </div>
      {showDrop && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-ink/10 rounded-xl shadow-xl overflow-hidden">
          {suggestions.map((a, i) => (
            <button key={a.id || i} onMouseDown={e => { e.preventDefault(); onSelect(a) }}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                i === focusedIdx ? 'bg-accent/8 text-ink' : 'hover:bg-base'
              }`}>
              <span className="font-mono text-sm font-bold text-accent w-10 shrink-0">{a.iataCode}</span>
              <span className="text-sm text-ink/70 truncate">{a.name}{a.city ? `, ${a.city}` : ''}</span>
              <span className="ml-auto font-mono text-[10px] text-ink/30 shrink-0">{a.country}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Travel tips ──────────────────────────────────────────────────────────────
function TravelTips({ trek, gateway, suggested }) {
  const visa = visaInfo(gateway)
  const highAlt = trek.maxAltitudeM >= 4000
  return (
    <div className="p-6 rounded-2xl border border-ink/8 bg-white">
      <div className="flex items-center gap-2 mb-4">
        <svg viewBox="0 0 24 24" className="size-4 text-accent" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h4 className="font-bold text-sm uppercase tracking-widest text-ink/70">Travel Tips</h4>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {visa && <Tip icon="🛂" title={visa.headline} text={visa.detail} />}
        {highAlt && (
          <Tip icon="🏔" title="Acclimatization Buffer"
            text={`Arrive ${suggested?.bufferDays || 2} days early in ${gateway.city}. At ${trek.maxAltitudeM.toLocaleString()}m your body needs time to adjust before the ascent.`} />
        )}
        <Tip icon="📅" title="Best Time to Book"
          text={`Book 6–8 weeks ahead for best fares. ${suggested ? `Peak season: ${suggested.allBestMonths.join(', ')}.` : ''}`} />
        <Tip icon="🎒" title="Baggage & Gear"
          text="Budget airlines have strict limits. 20–25kg check-in is recommended for trekking gear. Confirm your airline's mountain gear policy before booking." />
        {gateway.alt && (
          <Tip icon="🔄" title="Alternative Gateway"
            text={`If ${gateway.code} flights are limited, fly to ${gateway.alt} — it has more international connections and a well-established bus/road route to the trailhead.`} />
        )}
        <Tip icon="💊" title="Health Prep"
          text="Consult a travel clinic 4–6 weeks before departure. For Nepal: Hepatitis A/B, Typhoid, Rabies. Altitude sickness medication (Diamox) available on prescription." />
      </div>
    </div>
  )
}

function Tip({ icon, title, text }) {
  return (
    <div className="flex gap-3">
      <span className="text-lg shrink-0 leading-none mt-0.5">{icon}</span>
      <div>
        <div className="font-semibold text-[13px] text-ink mb-0.5">{title}</div>
        <p className="text-ink/55 text-[12px] leading-relaxed">{text}</p>
      </div>
    </div>
  )
}

// ─── Flight estimate generator (route-aware, no API key) ─────────────────────
const REGION = {
  IN: ['DEL','BOM','BLR','CCU','MAA','HYD','PNQ','CCJ','MNG','DED','KUU','DHM','IXB','IXL','SXR'],
  NP: ['KTM','PKR'],
  US: ['JFK','LAX','ORD','SFO','BOS','DFW','ATL','SEA','MIA','EWR','IAD','DEN'],
  EU: ['LHR','CDG','AMS','FRA','ZRH','BCN','FCO','MAD','BRU','VIE','DUB','ARN','OSL','CPH'],
  ME: ['DXB','DOH','AUH','KWI','BAH','AMM','CAI','RUH'],
  AS: ['SIN','BKK','KUL','HKG','NRT','ICN','PEK','SYD','MEL','BNE','PER','AKL'],
}
function regionOf(c) {
  for (const [r, codes] of Object.entries(REGION)) if (codes.includes(c)) return r
  return 'OT'
}

function routeFlights(oCode, dCode) {
  const oR = regionOf(oCode), dR = regionOf(dCode)
  const destIsNP = dR === 'NP' || oR === 'NP'

  // Airline sets per route type
  const sets = {
    'US→NP': [
      { name:'Qatar Airways', color:'#5C0632', bg:'#5C063215', stops:1, via:'DOH', basePriceUSD:820 },
      { name:'Emirates + flydubai', color:'#C69B2E', bg:'#C69B2E15', stops:1, via:'DXB', basePriceUSD:870 },
      { name:'United + Air India', color:'#005DAA', bg:'#005DAA15', stops:1, via:'DEL', basePriceUSD:950 },
    ],
    'US→IN': [
      { name:'Qatar Airways', color:'#5C0632', bg:'#5C063215', stops:1, via:'DOH', basePriceUSD:750 },
      { name:'Air India', color:'#C60C30', bg:'#C60C3015', stops:0, via:null, basePriceUSD:820 },
      { name:'Emirates', color:'#C69B2E', bg:'#C69B2E15', stops:1, via:'DXB', basePriceUSD:800 },
    ],
    'EU→NP': [
      { name:'Qatar Airways', color:'#5C0632', bg:'#5C063215', stops:1, via:'DOH', basePriceUSD:580 },
      { name:'Lufthansa + Air India', color:'#05164D', bg:'#05164D15', stops:1, via:'DEL', basePriceUSD:620 },
      { name:'Emirates', color:'#C69B2E', bg:'#C69B2E15', stops:1, via:'DXB', basePriceUSD:600 },
    ],
    'EU→IN': [
      { name:'British Airways', color:'#075AAA', bg:'#075AAA15', stops:0, via:null, basePriceUSD:480 },
      { name:'Lufthansa', color:'#05164D', bg:'#05164D15', stops:0, via:null, basePriceUSD:520 },
      { name:'Qatar Airways', color:'#5C0632', bg:'#5C063215', stops:1, via:'DOH', basePriceUSD:450 },
    ],
    'ME→NP': [
      { name:'flydubai + Buddha Air', color:'#E0334C', bg:'#E0334C15', stops:0, via:null, basePriceUSD:220 },
      { name:'Air Arabia + IndiGo', color:'#EE1C25', bg:'#EE1C2515', stops:1, via:'DEL', basePriceUSD:250 },
      { name:'IndiGo', color:'#1A0DAB', bg:'#1A0DAB15', stops:1, via:'DEL', basePriceUSD:280 },
    ],
    'AS→NP': [
      { name:'Singapore Airlines', color:'#004B87', bg:'#004B8715', stops:0, via:null, basePriceUSD:380 },
      { name:'Thai Airways + RA', color:'#4E1486', bg:'#4E148615', stops:1, via:'BKK', basePriceUSD:340 },
      { name:'Cathay Pacific + RA', color:'#006564', bg:'#00656415', stops:1, via:'HKG', basePriceUSD:420 },
    ],
    'IN→NP': [
      { name:'IndiGo', color:'#1A0DAB', bg:'#1A0DAB15', stops:0, via:null, basePriceUSD:120 },
      { name:'Air India', color:'#C60C30', bg:'#C60C3015', stops:0, via:null, basePriceUSD:145 },
      { name:'Nepal Airlines', color:'#003580', bg:'#00358015', stops:0, via:null, basePriceUSD:108 },
    ],
    'IN→IN': [
      { name:'IndiGo', color:'#1A0DAB', bg:'#1A0DAB15', stops:0, via:null, basePriceUSD:80 },
      { name:'Air India', color:'#C60C30', bg:'#C60C3015', stops:0, via:null, basePriceUSD:95 },
      { name:'SpiceJet', color:'#D8291A', bg:'#D8291A15', stops:0, via:null, basePriceUSD:72 },
    ],
    'DEFAULT': [
      { name:'Qatar Airways', color:'#5C0632', bg:'#5C063215', stops:1, via:'DOH', basePriceUSD:550 },
      { name:'Emirates', color:'#C69B2E', bg:'#C69B2E15', stops:1, via:'DXB', basePriceUSD:580 },
      { name:'Air India', color:'#C60C30', bg:'#C60C3015', stops:1, via:'DEL', basePriceUSD:520 },
    ],
  }

  const key = `${oR}→${destIsNP ? 'NP' : dR}`
  const airlines = sets[key] || sets[`${oR}→IN`] || sets['DEFAULT']

  // Duration reference (hours) per route type
  const durations = {
    'IN→NP': [2.5, 3, 3.5], 'IN→IN': [1.5, 2, 2.5],
    'ME→NP': [4, 5.5, 6], 'AS→NP': [5, 6, 7.5],
    'EU→NP': [9, 10, 11.5], 'EU→IN': [8, 9.5, 10],
    'US→NP': [16, 17.5, 19], 'US→IN': [14, 15.5, 17],
  }
  const durs = durations[key] || durations[`${oR}→IN`] || [10, 12, 14]

  // Depart times (varied so cards look real)
  const deps = ['06:20', '14:45', '21:30']

  const addH = (t, h) => {
    const [hr, mn] = t.split(':').map(Number)
    const total = hr * 60 + mn + Math.round(h * 60)
    const days = Math.floor(total / 1440)
    const rem = total % 1440
    const rh = String(Math.floor(rem / 60)).padStart(2, '0')
    const rm = String(rem % 60).padStart(2, '0')
    return { time: `${rh}:${rm}`, plusDays: days }
  }

  const fmtDur = h => {
    const hrs = Math.floor(h), mins = Math.round((h - hrs) * 60)
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`
  }

  return airlines.map((a, i) => {
    const { time: arr, plusDays } = addH(deps[i], durs[i])
    // Add small random offset so prices look real (not all multiples of 10)
    const price = a.basePriceUSD + [0, 18, -12][i]
    return { ...a, dep: deps[i], arr, plusDays, duration: fmtDur(durs[i]), price }
  })
}

function EstimatedFlightRow({ flight, providerColor, adults, index }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-ink/6 bg-white hover:border-ink/15 hover:shadow-sm transition-all"
         style={{ animationDelay: `${index * 60}ms` }}>
      {/* Airline color dot + initials */}
      <div className="size-9 rounded-lg flex items-center justify-center text-white text-[10px] font-extrabold shrink-0 leading-none"
           style={{ background: flight.color }}>
        {flight.name.split(' ')[0].slice(0, 2).toUpperCase()}
      </div>
      {/* Middle: airline + stops */}
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-semibold text-ink truncate">{flight.name}</div>
        <div className="font-mono text-[10px] text-ink/40 mt-0.5">
          {flight.stops === 0 ? 'Non-stop' : `1 stop via ${flight.via}`}
          {' · '}{flight.duration}
        </div>
      </div>
      {/* Times */}
      <div className="text-center shrink-0 hidden sm:block">
        <div className="text-[12px] font-bold tabular-nums">{flight.dep}</div>
        <div className="font-mono text-[9px] text-ink/35 mt-0.5">→ {flight.arr}{flight.plusDays > 0 ? <sup>+{flight.plusDays}</sup> : ''}</div>
      </div>
      {/* Price */}
      <div className="text-right shrink-0">
        <div className="text-[13px] font-extrabold" style={{ color: providerColor }}>
          ~${(flight.price * adults).toLocaleString()}
        </div>
        <div className="font-mono text-[9px] text-ink/35 mt-0.5">est. total</div>
      </div>
    </div>
  )
}

// ─── Flight search embed (popup-based, avoids X-Frame-Options) ───────────────
const FLIGHT_PROVIDERS = [
  {
    key: 'skyscanner',
    name: 'Skyscanner',
    color: '#0770E3',
    tagline: 'Compare 500+ airlines & OTAs',
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M21.5 15.9c-1 .6-3.3 1.6-5.5-.1l-3.9-3.1L5.2 17l-1.7-1.7 5.5-5.5L5.9 7l1.2-1.2 4 1.8L14.8 4c1.5-1.5 3.5-1.5 4.5-.5s1 3-.5 4.5l-3.6 3.6 1.8 4 -1.2 1.2-2.8-3.1.1.1 3.1 2.5c1.1.9.9 2.5.9 2.5s1.4-.6 4.4-2.6z"/>
      </svg>
    ),
    url: (origin, dest, out, ret, n) => {
      const fmt = d => d?.replace(/-/g, '').slice(2) || ''
      if (!origin || !dest) return 'https://www.skyscanner.com'
      const base = `https://www.skyscanner.com/transport/flights/${origin.toLowerCase()}/${dest.toLowerCase()}/${fmt(out)}/`
      return ret ? base.replace(/\/$/, '') + `/${fmt(ret)}/?adults=${n}` : `${base}?adults=${n}`
    },
  },
  {
    key: 'google',
    name: 'Google Flights',
    color: '#4285F4',
    tagline: 'Price tracking & fare alerts',
    logo: (
      <svg viewBox="0 0 24 24" fill="none" className="size-5">
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10 10-4.48 10-10z" fill="#4285F4"/>
        <path d="M12 7l4 8H8l4-8z" fill="white"/>
      </svg>
    ),
    url: (origin, dest, out, ret, n) => {
      if (!origin || !dest) return 'https://www.google.com/travel/flights'
      const d1 = out || ''
      const d2 = ret || ''
      return `https://www.google.com/travel/flights?hl=en#flt=${origin}.${dest}.${d1}${d2 ? `;r:${dest}.${origin}.${d2}` : ''};c:USD;e:1;sd:1;t:f;px:${n}`
    },
  },
  {
    key: 'kiwi',
    name: 'Kiwi.com',
    color: '#00B2A4',
    tagline: 'Unique multi-city combinations',
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <circle cx="12" cy="12" r="10" fill="#00B2A4"/>
        <path d="M8 12l2.5 2.5L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
    url: (origin, dest, out, ret, n) => {
      if (!origin || !dest) return 'https://www.kiwi.com'
      return `https://www.kiwi.com/en/search/results/${origin.toLowerCase()}/${dest.toLowerCase()}/${out || 'anytime'}${ret ? `/${ret}` : ''}?adults=${n}&currency=USD`
    },
  },
]

function FlightSearchEmbed({ homeAirport, gateway, outDate, retDate, adults }) {
  const [activeTab, setActiveTab] = useState('skyscanner')
  const provider = FLIGHT_PROVIDERS.find(p => p.key === activeTab)

  const origin = homeAirport?.iataCode
  const dest = gateway?.code
  const url = provider.url(origin, dest, outDate, retDate, adults)

  const estimates = origin && dest ? routeFlights(origin, dest) : []

  const openPopup = () => {
    const w = Math.min(1100, window.screen.width - 80)
    const h = Math.min(750, window.screen.height - 100)
    const left = Math.round((window.screen.width - w) / 2)
    const top = Math.round((window.screen.height - h) / 2)
    window.open(url, 'ascent-flights', `width=${w},height=${h},top=${top},left=${left},toolbar=0,location=0,menubar=0,scrollbars=1,resizable=1`)
  }

  const fmtShort = d => {
    if (!d) return '—'
    const dt = new Date(d + 'T00:00:00')
    return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="rounded-2xl border border-ink/8 overflow-hidden bg-white">
      {/* Header */}
      <div className="px-5 py-3 bg-base border-b border-ink/6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="size-3.5 text-accent" fill="currentColor">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink/50">Flight Search</span>
        </div>
        <span className="font-mono text-[10px] text-ink/30">Opens in popup window</span>
      </div>

      {/* Route summary bar */}
      <div className="px-5 py-3 border-b border-ink/6 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="text-center">
            <div className="font-bold text-base">{origin || '???'}</div>
            <div className="font-mono text-[10px] text-ink/40">{homeAirport?.city || 'Select airport'}</div>
          </div>
          <svg viewBox="0 0 24 24" className="size-4 text-ink/30 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
          <div className="text-center">
            <div className="font-bold text-base">{dest || '???'}</div>
            <div className="font-mono text-[10px] text-ink/40">{gateway?.city || ''}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-center">
            <div className="text-[11px] font-semibold">{fmtShort(outDate)}</div>
            <div className="font-mono text-[9px] text-ink/35">Depart</div>
          </div>
          {retDate && (
            <>
              <div className="text-ink/20">·</div>
              <div className="text-center">
                <div className="text-[11px] font-semibold">{fmtShort(retDate)}</div>
                <div className="font-mono text-[9px] text-ink/35">Return</div>
              </div>
            </>
          )}
          <div className="text-center">
            <div className="text-[11px] font-semibold">{adults}</div>
            <div className="font-mono text-[9px] text-ink/35">Adult{adults !== 1 ? 's' : ''}</div>
          </div>
        </div>
      </div>

      {/* Provider tabs */}
      <div className="flex border-b border-ink/6">
        {FLIGHT_PROVIDERS.map(p => (
          <button
            key={p.key}
            onClick={() => setActiveTab(p.key)}
            className={`flex-1 px-3 py-2.5 flex flex-col items-center gap-1 transition-all text-[11px] font-medium ${
              activeTab === p.key
                ? 'bg-white border-b-2 border-accent text-ink'
                : 'bg-base text-ink/40 hover:text-ink/60 border-b-2 border-transparent'
            }`}
          >
            <span className="hidden sm:block" style={{ color: activeTab === p.key ? p.color : undefined }}>{p.name}</span>
            <span className="sm:hidden font-mono text-[9px]" style={{ color: activeTab === p.key ? p.color : undefined }}>
              {p.key === 'skyscanner' ? 'Sky' : p.key === 'google' ? 'GFlights' : 'Kiwi'}
            </span>
          </button>
        ))}
      </div>

      {/* Active provider card */}
      <div className="p-5">
        <div className="rounded-xl border border-ink/8 overflow-hidden">
          {/* Provider header */}
          <div className="px-4 py-3 flex items-center gap-3" style={{ background: provider.color + '12' }}>
            <div className="size-9 rounded-lg flex items-center justify-center text-white shrink-0" style={{ background: provider.color }}>
              {provider.logo}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm" style={{ color: provider.color }}>{provider.name}</div>
              <div className="text-[11px] text-ink/50">{provider.tagline}</div>
            </div>
          </div>

          {/* Preview content */}
          <div className="px-4 py-4 space-y-3">
            {!origin ? (
              <p className="text-[13px] text-ink/40 text-center py-2">Select your home airport in the left panel to search flights</p>
            ) : (
              <>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-ink/50">Route</span>
                  <span className="font-semibold">{origin} → {dest}{retDate ? ` → ${origin}` : ''}</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-ink/50">Dates</span>
                  <span className="font-semibold">
                    {fmtShort(outDate)}{retDate ? ` – ${fmtShort(retDate)}` : ' (one-way)'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-ink/50">Passengers</span>
                  <span className="font-semibold">{adults} adult{adults !== 1 ? 's' : ''} · Economy</span>
                </div>
                <div className="h-px bg-ink/6 my-1" />
                {/* Estimated flight options */}
                <div className="space-y-2">
                  {estimates.map((f, i) => (
                    <EstimatedFlightRow key={i} flight={f} providerColor={provider.color} adults={adults} index={i} />
                  ))}
                </div>
                <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-ink/5">
                  <svg viewBox="0 0 20 20" className="size-3 text-ink/30 shrink-0" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                  <span className="font-mono text-[9px] text-ink/30 uppercase tracking-widest">Estimated prices · Click below for live fares</span>
                </div>
              </>
            )}
          </div>

          {/* CTA */}
          <div className="px-4 pb-4">
            <button
              onClick={openPopup}
              disabled={!origin}
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-white font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98]"
              style={{ background: !origin ? '#999' : provider.color }}
            >
              {origin ? (
                <>
                  Search on {provider.name}
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </>
              ) : (
                'Select your home airport first'
              )}
            </button>
          </div>
        </div>

        {/* Also try links */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[10px] text-ink/30 uppercase tracking-widest">Also try:</span>
          {FLIGHT_PROVIDERS.filter(p => p.key !== activeTab).map(p => (
            <a
              key={p.key}
              href={origin ? p.url(origin, dest, outDate, retDate, adults) : '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => { if (!origin) e.preventDefault() }}
              className="font-mono text-[10px] underline underline-offset-2 transition-opacity"
              style={{ color: origin ? p.color : '#aaa' }}
            >
              {p.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Full Travel Plan output ──────────────────────────────────────────────────
function TravelPlan({ trek, gateway, suggested, outDate, retDate, adults, homeAirport, groundRoute, cityGuide, rates, currency }) {
  const trailhead = getTrailhead(trek)
  const visa = visaInfo(gateway)
  const fmt = n => formatMoney(convertPrice(n, rates, currency), currency)

  // Build journey timeline
  const base = outDate ? new Date(outDate) : new Date(suggested?.depart || Date.now())
  const buffer = suggested?.bufferDays || 1
  const isFlight = trailhead?.note?.toLowerCase().includes('flight')

  const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r }
  const fmtDate = d => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  const fmtDay  = d => `Day ${Math.round((d - base) / 86400000) + 1}`

  const arrivalDay    = addDays(base, 1)
  const bufferEnd     = addDays(arrivalDay, buffer)
  const trekStart     = isFlight ? addDays(bufferEnd, 1) : bufferEnd
  const trekEnd       = addDays(trekStart, trek.days)
  const returnGateway = addDays(trekEnd, 1)
  const returnFlight  = retDate ? new Date(retDate) : addDays(returnGateway, 1)

  // Permits from trek data
  const hasPermit = trek.permits && trek.permits.length > 3
  const isNepal   = trek.country === 'Nepal' || gateway.country === 'Nepal'
  const isIndia   = trek.country === 'India' || gateway.country === 'India'

  // Cost estimates
  const trekLow  = trek.priceBudget * adults
  const trekHigh = trek.priceLuxury * adults
  const bufferAccom = 80 * buffer * adults
  const internalFlight = isFlight ? 200 * adults : 0
  const permits = isNepal ? 50 * adults : isIndia ? 30 * adults : 30 * adults
  const totalLow  = trekLow + bufferAccom + internalFlight + permits
  const totalHigh = trekHigh + bufferAccom + internalFlight + permits

  const TimelineRow = ({ icon, dayLabel, dateLabel, title, subtitle, accent }) => (
    <div className="flex gap-4">
      <div className="flex flex-col items-center shrink-0">
        <div className={`size-9 rounded-xl flex items-center justify-center text-lg ${accent ? 'bg-accent text-white' : 'bg-base border border-ink/10'}`}>
          {icon}
        </div>
        <div className="w-px flex-1 bg-ink/8 mt-1" />
      </div>
      <div className="pb-5 min-w-0">
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink/40">{dayLabel}</span>
          <span className="font-mono text-[10px] text-ink/30">{dateLabel}</span>
        </div>
        <div className="font-bold text-sm text-ink">{title}</div>
        {subtitle && <div className="text-[12px] text-ink/50 mt-0.5">{subtitle}</div>}
      </div>
    </div>
  )

  return (
    <div className="space-y-5 animate-rise">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-extrabold text-xl tracking-tight">Your Trek Journey Plan</h2>
          <p className="text-ink/45 text-[12px] mt-0.5">
            {homeAirport ? `${homeAirport.city || homeAirport.iataCode} → ${gateway.city}` : gateway.city}
            {' · '}{adults} {adults === 1 ? 'Adult' : 'Adults'}
            {' · '}{adults === 1 ? 'Solo' : 'Group'} trip
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/8 border border-accent/15">
          <span className="size-1.5 bg-accent rounded-full animate-pulse" />
          <span className="font-mono text-[10px] text-accent uppercase tracking-widest">Live Plan</span>
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="bg-white rounded-2xl border border-ink/8 p-5">
        <div className="flex items-center gap-2 mb-5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink/50">Journey Timeline</span>
        </div>
        <div className="relative">
          {homeAirport && (
            <TimelineRow icon="✈" dayLabel={fmtDay(base)} dateLabel={fmtDate(base)}
              title={`Depart ${homeAirport.city || homeAirport.iataCode}`}
              subtitle={`${homeAirport.iataCode} → ${gateway.code} · Long-haul flight`} accent />
          )}
          <TimelineRow icon="🏙" dayLabel={fmtDay(arrivalDay)} dateLabel={fmtDate(arrivalDay)}
            title={`Arrive ${gateway.city}`}
            subtitle={`${buffer} night${buffer > 1 ? 's' : ''} acclimatization${cityGuide ? ' · ' + gateway.city : ''}`} />
          {isFlight && (
            <TimelineRow icon="✈" dayLabel={fmtDay(bufferEnd)} dateLabel={fmtDate(bufferEnd)}
              title="Connecting flight to trailhead"
              subtitle={trailhead?.note || `${gateway.code} → nearby airstrip (~45 min)`} />
          )}
          {!isFlight && trailhead && (
            <TimelineRow icon="🚌" dayLabel={fmtDay(bufferEnd)} dateLabel={fmtDate(bufferEnd)}
              title={`Transfer to ${trailhead.name}`}
              subtitle={groundRoute ? `${groundRoute.distanceKm}km · ${formatDriveTime(groundRoute.durationMin)} by road` : (trailhead.note || 'Road transfer')} />
          )}
          <TimelineRow icon="⛺" dayLabel={fmtDay(trekStart)} dateLabel={fmtDate(trekStart)}
            title={`Begin ${trek.name}`}
            subtitle={`${trek.days} days · ${trek.difficulty} · up to ${trek.maxAltitudeM.toLocaleString()}m`} accent />
          <TimelineRow icon="🏔" dayLabel={fmtDay(trekEnd)} dateLabel={fmtDate(trekEnd)}
            title="Trek complete"
            subtitle={`Return to ${trailhead?.name || 'trailhead'} · Head back to ${gateway.city}`} />
          <TimelineRow icon="✈" dayLabel={fmtDay(returnFlight)} dateLabel={fmtDate(returnFlight)}
            title={homeAirport ? `Fly home to ${homeAirport.city || homeAirport.iataCode}` : 'Return flight'}
            subtitle={homeAirport ? `${gateway.code} → ${homeAirport.iataCode}` : `Depart ${gateway.city}`} />
        </div>
      </div>

      {/* Flight search embed */}
      <FlightSearchEmbed
        homeAirport={homeAirport}
        gateway={gateway}
        outDate={outDate}
        retDate={retDate}
        adults={adults}
      />

      {/* Cost estimate */}
      <div className="bg-white rounded-2xl border border-ink/8 p-5">
        <div className="font-mono text-[10px] uppercase tracking-widest text-ink/50 mb-4">Cost Estimate · {adults} {adults === 1 ? 'Person' : 'People'}</div>
        <div className="space-y-3">
          {[
            { label: 'International flights', low: null, high: null, note: HAS_AMADEUS ? 'Search flights above' : 'Add Amadeus to search' },
            ...(isFlight ? [{ label: 'Connecting flight (est.)', low: internalFlight, high: internalFlight }] : []),
            { label: `${trek.name} trek package`, low: trekLow, high: trekHigh },
            { label: `${gateway.city} stay (${buffer} night${buffer > 1 ? 's' : ''})`, low: bufferAccom, high: bufferAccom },
            { label: 'Permits & entry fees', low: permits, high: permits },
          ].map((row, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-ink/5 last:border-0">
              <span className="text-sm text-ink/70">{row.label}</span>
              {row.low !== null ? (
                <span className="font-bold text-sm tabular-nums">
                  {row.low === row.high ? fmt(row.low) : `${fmt(row.low)} – ${fmt(row.high)}`}
                </span>
              ) : (
                <span className="font-mono text-[10px] text-ink/35 uppercase tracking-widest">{row.note}</span>
              )}
            </div>
          ))}
          <div className="flex items-center justify-between pt-2">
            <span className="font-bold text-ink">Estimated Total</span>
            <div className="text-right">
              <div className="font-extrabold text-lg text-accent">{fmt(totalLow)} – {fmt(totalHigh)}</div>
              <div className="font-mono text-[9px] text-ink/35">excl. international flights</div>
            </div>
          </div>
        </div>
      </div>

      {/* In gateway city */}
      {cityGuide && (
        <div className="bg-white rounded-2xl border border-ink/8 p-5">
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink/50 mb-3">
            Your {buffer} Day{buffer > 1 ? 's' : ''} in {gateway.city}
          </div>
          <h4 className="font-bold text-base mb-2">{cityGuide.title}</h4>
          <p className="text-[13px] text-ink/60 leading-relaxed line-clamp-4">{cityGuide.summary?.split('\n\n')[0]}</p>
        </div>
      )}

      {/* Documents & visas */}
      <div className="bg-white rounded-2xl border border-ink/8 p-5">
        <div className="font-mono text-[10px] uppercase tracking-widest text-ink/50 mb-4">Documents & Visas</div>
        <div className="space-y-2">
          {visa && (
            <CheckItem done text={visa.headline} sub={visa.detail} />
          )}
          {isNepal && <CheckItem text="TIMS Card (~$20/person)" sub="Trekkers' Information Management System — purchased in Kathmandu" />}
          {isNepal && <CheckItem text="National Park / Conservation Permit" sub={`~$30–$150 depending on area · ${trek.permits || 'check current fees'}`} />}
          {isIndia && <CheckItem text="Inner Line / Forest Permit" sub={trek.permits || 'Check current requirements — varies by state and protected area'} />}
          <CheckItem text="Travel insurance with helicopter evacuation" sub="Essential for high-altitude trekking — cover up to $100,000 evacuation" />
          <CheckItem text="Vaccination record" sub="Yellow fever card required for some countries of origin" />
        </div>
      </div>

      {/* Pre-trek checklist */}
      <div className="bg-white rounded-2xl border border-ink/8 p-5">
        <div className="font-mono text-[10px] uppercase tracking-widest text-ink/50 mb-4">Pre-Trek Checklist</div>
        <div className="space-y-2">
          {[
            'Book international flights 6–8 weeks ahead for best fares',
            isFlight ? 'Book domestic/connecting flight to trailhead (limited seats — book early)' : null,
            isNepal ? 'Confirm Nepal visa on arrival eligibility for your passport' : 'Apply for India e-Visa at least 4 days before travel',
            'Purchase comprehensive travel + evacuation insurance',
            'Get altitude sickness medication (Diamox) on prescription',
            trek.maxAltitudeM >= 5000 ? 'Consult your doctor about high-altitude physiology' : null,
            'Train 3–6 months with hikes, stair climbing, and cardio',
            'Buy or rent trekking gear in ' + gateway.city + ' (cheaper and lighter to buy there)',
            `Pack for ${trek.tempRange || 'cold mountain conditions'} — layers are key`,
          ].filter(Boolean).map((item, i) => (
            <CheckItem key={i} text={item} />
          ))}
        </div>
      </div>

      {/* Final booking nudge */}
      <div className="bg-ink text-white rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <div className="font-mono text-[9px] uppercase tracking-widest opacity-50 mb-1">Your Plan is Ready</div>
          <div className="font-extrabold text-base">{trek.name}</div>
          <div className="text-[12px] opacity-50 mt-0.5">
            {gateway.city} gateway · {trek.days} day trek · Est. {fmt(totalLow)} – {fmt(totalHigh)} excl. flights
          </div>
        </div>
        <div className="shrink-0 flex flex-col gap-2">
          <a
            href={homeAirport ? skyscannerUrl(homeAirport.iataCode, gateway.code, outDate || '', retDate) : `https://www.skyscanner.net/transport/flights/anywhere/${gateway.code}/`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 bg-accent rounded-xl text-sm font-bold hover:bg-accent/90 transition-colors whitespace-nowrap"
          >
            Book on Skyscanner
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>
      </div>
    </div>
  )
}

function CheckItem({ text, sub, done }) {
  return (
    <div className="flex gap-3 py-1.5">
      <div className={`size-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${done ? 'bg-accent border-accent' : 'border-ink/20'}`}>
        {done && <svg viewBox="0 0 20 20" className="size-3 text-white" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
      </div>
      <div>
        <div className="text-[13px] text-ink font-medium leading-snug">{text}</div>
        {sub && <div className="text-[11px] text-ink/45 mt-0.5 leading-relaxed">{sub}</div>}
      </div>
    </div>
  )
}



// ─── Main page ────────────────────────────────────────────────────────────────
export function TravelPlannerPage({ treks }) {
  const { slug } = useParams()
  const navigate = useNavigate()
  const trek = treks?.find(t => t.slug === slug) || null
  const gateway = trek ? getGateway(trek) : null
  const suggested = trek ? suggestDates(trek) : null

  // Airport autocomplete
  const [homeQuery, setHomeQuery] = useState('')
  const [homeAirport, setHomeAirport] = useState(null)
  const [airportSuggs, setAirportSuggs] = useState([])
  const [showDrop, setShowDrop] = useState(false)
  const [dropFocus, setDropFocus] = useState(-1)
  const blurTimer = useRef(null)

  // Search params
  const [outDate, setOutDate] = useState(suggested?.depart || '')
  const [retDate, setRetDate] = useState(suggested?.return || '')
  const [adults, setAdults] = useState(1)
  const [currency, setCurrency] = useState('USD')

  // Flight results
  const [outFlights, setOutFlights] = useState([])
  const [retFlights, setRetFlights] = useState([])
  const [loadingOut, setLoadingOut] = useState(false)
  const [loadingRet, setLoadingRet] = useState(false)
  const [errOut, setErrOut] = useState(null)
  const [errRet, setErrRet] = useState(null)
  const [searched, setSearched] = useState(false)

  // Selections + sort
  const [selOut, setSelOut] = useState(null)
  const [selRet, setSelRet] = useState(null)
  const [sortOut, setSortOut] = useState('price')
  const [sortRet, setSortRet] = useState('price')
  const [mobileTab, setMobileTab] = useState('out')

  // Plan state
  const [planGenerated, setPlanGenerated] = useState(false)

  // Free APIs state
  const [rates, setRates] = useState(null)
  const [groundRoute, setGroundRoute] = useState(null)
  const [groundLoading, setGroundLoading] = useState(false)
  const [cityGuide, setCityGuide] = useState(null)
  const [cityLoading, setCityLoading] = useState(false)

  // Fetch exchange rates on mount (free, no key)
  useEffect(() => {
    getExchangeRates('USD').then(setRates).catch(() => {})
  }, [])

  // Fetch ground route + city guide when trek changes
  useEffect(() => {
    if (!gateway || !trek) return

    // Reset
    setGroundRoute(null)
    setCityGuide(null)

    // Ground route: gateway airport → trailhead (OSRM, free)
    const trailhead = getTrailhead(trek)
    const gatewayCoords = GATEWAY_COORDS[gateway.code]
    if (trailhead && gatewayCoords) {
      const noteIsRoad = !trailhead.note?.toLowerCase().includes('flight')
      if (noteIsRoad) {
        setGroundLoading(true)
        getDrivingRoute(gatewayCoords[1], gatewayCoords[0], trailhead.lon, trailhead.lat)
          .then(r => setGroundRoute(r))
          .catch(() => setGroundRoute(null))
          .finally(() => setGroundLoading(false))
      }
    }

    // City guide: Wikivoyage (free, no key)
    setCityLoading(true)
    getCityGuide(gateway.city)
      .then(g => setCityGuide(g))
      .catch(() => setCityGuide(null))
      .finally(() => setCityLoading(false))

    // Dates from suggested
    if (suggested) { setOutDate(suggested.depart); setRetDate(suggested.return) }
  }, [slug])

  // Refetch rates when currency changes
  useEffect(() => {
    getExchangeRates('USD').then(setRates).catch(() => {})
  }, [currency])

  // Instant local airport search (no API needed)
  useEffect(() => {
    if (!homeQuery || homeQuery.trim().length < 1 || homeAirport) { setAirportSuggs([]); setShowDrop(false); return }
    const r = searchAirportsLocal(homeQuery, 8)
    setAirportSuggs(r)
    setShowDrop(r.length > 0)
  }, [homeQuery, homeAirport])

  function selectAirport(a) {
    setHomeAirport(a)
    setHomeQuery(airportLabel(a))
    setShowDrop(false)
    setAirportSuggs([])
  }

  function handleKeyDown(e) {
    if (!showDrop) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setDropFocus(f => Math.min(f + 1, airportSuggs.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setDropFocus(f => Math.max(f - 1, 0)) }
    if (e.key === 'Enter' && dropFocus >= 0) { e.preventDefault(); selectAirport(airportSuggs[dropFocus]) }
    if (e.key === 'Escape') { setShowDrop(false) }
  }

  async function handleSearch() {
    if (!homeAirport || !gateway || !outDate) return
    setSearched(true)
    setSelOut(null); setSelRet(null)
    setErrOut(null); setErrRet(null)
    setLoadingOut(true); setLoadingRet(true)
    setOutFlights([]); setRetFlights([])
    setMobileTab('out')

    searchFlights({ origin: homeAirport.iataCode, destination: gateway.code, departureDate: outDate, adults, max: 8 })
      .then(r => setOutFlights(r))
      .catch(e => setErrOut(e.message))
      .finally(() => setLoadingOut(false))

    if (retDate) {
      searchFlights({ origin: gateway.code, destination: homeAirport.iataCode, departureDate: retDate, adults, max: 8 })
        .then(r => setRetFlights(r))
        .catch(e => setErrRet(e.message))
        .finally(() => setLoadingRet(false))
    } else {
      setLoadingRet(false)
    }
  }

  if (!trek) return (
    <div className="min-h-screen bg-base flex items-center justify-center">
      <p className="text-ink/40">Trek not found</p>
    </div>
  )

  const canSearch = !!(homeAirport && outDate)
  const showSummary = !!(searched && selOut)

  return (
    <div className="min-h-screen bg-base flex flex-col">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-ink/8 px-4 md:px-8 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)}
          className="size-9 flex items-center justify-center rounded-xl border border-ink/10 text-ink/40 hover:text-ink hover:border-ink/30 transition-colors shrink-0">
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
        </button>
        <div className="min-w-0">
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40">Travel Planner</div>
          <div className="font-extrabold text-lg tracking-tight truncate">{trek.name}</div>
        </div>
        <div className="ml-auto flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-base border border-ink/8">
            <span className="font-mono text-[10px] text-ink/50">{gateway.code}</span>
            <span className="text-ink/20">·</span>
            <span className="font-mono text-[10px] text-ink/50">{gateway.city}</span>
          </div>
          {suggested && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/8 border border-accent/15">
              <span className="font-mono text-[10px] text-accent">Best: {suggested.allBestMonths.slice(0, 3).join(', ')}</span>
            </div>
          )}
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-col lg:flex-row flex-1">
        {/* ── Left panel ── */}
        <aside className="lg:w-80 xl:w-96 shrink-0 border-b lg:border-b-0 lg:border-r border-ink/8 bg-white p-6 lg:p-8 lg:sticky lg:top-[65px] lg:h-[calc(100vh-65px)] lg:overflow-y-auto">
          <div className="space-y-6">
            {/* Trek thumbnail */}
            <div className="relative rounded-2xl overflow-hidden h-32">
              <img src={trek.image} alt={trek.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="font-mono text-[10px] uppercase tracking-widest opacity-70">{trek.region} · {trek.days} Days</div>
                <div className="text-sm font-bold">${trek.priceBudget.toLocaleString()} – ${trek.priceLuxury.toLocaleString()}</div>
              </div>
            </div>

            {/* Gateway info */}
            <div className="p-4 rounded-xl bg-base border border-ink/8">
              <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-1">Fly into</div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl text-accent">{gateway.code}</span>
                <span className="text-sm text-ink/60">{gateway.name}, {gateway.city}</span>
              </div>
            </div>

            {/* Home airport search */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] uppercase tracking-widest text-ink/40 block">Flying from</label>
              <AirportInput
                value={homeQuery}
                onChange={v => { setHomeQuery(v); setHomeAirport(null) }}
                onSelect={selectAirport}
                suggestions={airportSuggs}
                showDrop={showDrop}
                focusedIdx={dropFocus}
                onKeyDown={handleKeyDown}
                onFocus={() => { clearTimeout(blurTimer.current); if (airportSuggs.length) setShowDrop(true) }}
                onBlur={() => { blurTimer.current = setTimeout(() => setShowDrop(false), 150) }}
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-widest text-ink/40 block">Depart</label>
                <input type="date" value={outDate} min={new Date().toISOString().split('T')[0]}
                  onChange={e => setOutDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-ink/12 bg-white text-sm focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-widest text-ink/40 block">Return</label>
                <input type="date" value={retDate} min={outDate || new Date().toISOString().split('T')[0]}
                  onChange={e => setRetDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-ink/12 bg-white text-sm focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all" />
              </div>
            </div>

            {/* Adults */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] uppercase tracking-widest text-ink/40 block">Travelers</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setAdults(a => Math.max(1, a - 1))}
                  className="size-9 rounded-xl border border-ink/12 flex items-center justify-center text-ink/50 hover:border-accent hover:text-accent transition-colors font-bold text-lg">−</button>
                <span className="text-lg font-bold w-16 text-center tabular-nums">{adults} <span className="text-sm font-normal text-ink/40">{adults === 1 ? 'Adult' : 'Adults'}</span></span>
                <button onClick={() => setAdults(a => Math.min(8, a + 1))}
                  className="size-9 rounded-xl border border-ink/12 flex items-center justify-center text-ink/50 hover:border-accent hover:text-accent transition-colors font-bold text-lg">+</button>
              </div>
            </div>

            {/* Currency picker */}
            <CurrencyPicker value={currency} onChange={setCurrency} />

            {/* Smart date hint */}
            {suggested && !searched && (
              <div className="p-3 rounded-xl bg-accent/6 border border-accent/15">
                <div className="font-mono text-[9px] uppercase tracking-widest text-accent mb-1.5">Suggested dates</div>
                <div className="text-[12px] text-ink/60 leading-relaxed">
                  Peak season: <strong>{suggested.allBestMonths.join(', ')}</strong>.<br />
                  {suggested.bufferDays > 0 && `Added ${suggested.bufferDays}-day acclimatization buffer.`}
                </div>
              </div>
            )}

            {/* Primary CTA — always shown */}
            <button
              onClick={() => { setPlanGenerated(true); setSearched(false) }}
              className="w-full py-4 bg-accent text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-accent/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
                <line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" />
              </svg>
              Generate My Travel Plan
            </button>

            {/* Flight search / Amadeus notice */}
            {HAS_AMADEUS ? (
              <button onClick={handleSearch} disabled={!canSearch}
                className="w-full py-3 border border-ink/12 rounded-xl font-bold text-sm text-ink/50 hover:text-ink hover:border-accent/40 hover:bg-accent/4 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                {loadingOut || loadingRet ? 'Searching Flights…' : 'Search Live Flights'}
              </button>
            ) : (
              <div className="p-3.5 rounded-xl border border-ink/8 bg-base space-y-1.5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink/35">Live flight search</div>
                <p className="text-[11px] text-ink/45 leading-relaxed">
                  Add Amadeus credentials to <code className="bg-ink/10 px-1 rounded">.env</code> to enable.
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* ── Results area ── */}
        <main className="flex-1 p-6 lg:p-8 min-w-0">
          {planGenerated ? (
            /* ── Full travel plan ── */
            <TravelPlan
              trek={trek} gateway={gateway} suggested={suggested}
              outDate={outDate} retDate={retDate} adults={adults}
              homeAirport={homeAirport} groundRoute={groundRoute} cityGuide={cityGuide}
              rates={rates} currency={currency}
            />
          ) : !searched ? (
            /* Pre-search idle state */
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-6">
              <div className="relative">
                <div className="size-20 bg-accent/8 rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 48 48" className="size-11 text-accent" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                    <rect x="9" y="3" width="6" height="4" rx="1" />
                    <line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 size-6 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">✈</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-extrabold tracking-tight mb-2">Ready to plan your {trek.name} trip?</h3>
                <p className="text-ink/45 text-sm max-w-sm leading-relaxed mb-6">
                  Fill in your details on the left, then click <strong>Generate My Travel Plan</strong> to see a full day-by-day journey, cost breakdown, visa guide, and booking links.
                </p>
                <button onClick={() => setPlanGenerated(true)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-accent text-white rounded-xl font-bold text-sm hover:bg-accent/90 transition-all">
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                    <rect x="9" y="3" width="6" height="4" rx="1" />
                    <line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" />
                  </svg>
                  Generate My Travel Plan
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Mobile tabs */}
              <div className="flex lg:hidden gap-1 mb-5 bg-white border border-ink/8 rounded-xl p-1">
                {[['out', 'Outbound'], ['ret', 'Return'], ['ground', 'Ground'], ['city', 'City Guide']].map(([k, l]) => (
                  <button key={k} onClick={() => setMobileTab(k)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${mobileTab === k ? 'bg-ink text-white' : 'text-ink/40 hover:text-ink'}`}>
                    {l}
                  </button>
                ))}
              </div>

              {/* Desktop: flight columns */}
              <div className="hidden lg:grid grid-cols-2 gap-6 mb-6">
                <FlightColumn
                  title="Outbound" subtitle={homeAirport ? `${homeAirport.iataCode} → ${gateway.code}` : `→ ${gateway.code}`}
                  flights={outFlights} sort={sortOut} onSort={setSortOut}
                  selected={selOut} onSelect={setSelOut}
                  loading={loadingOut} error={errOut}
                  noResultHint={gateway.alt ? `Try flying to ${gateway.alt} (more connections).` : undefined}
                  rates={rates} currency={currency}
                />
                <FlightColumn
                  title="Return" subtitle={`${gateway.code} → ${homeAirport?.iataCode || '—'}`}
                  flights={retFlights} sort={sortRet} onSort={setSortRet}
                  selected={selRet} onSelect={setSelRet}
                  loading={loadingRet} error={errRet}
                  noResultHint={gateway.alt ? `Try ${gateway.alt} as origin.` : undefined}
                  rates={rates} currency={currency}
                />
              </div>

              {/* Mobile tab panels */}
              <div className="lg:hidden mb-6">
                {mobileTab === 'out' && (
                  <FlightColumn
                    title="Outbound" subtitle={homeAirport ? `${homeAirport.iataCode} → ${gateway.code}` : `→ ${gateway.code}`}
                    flights={outFlights} sort={sortOut} onSort={setSortOut}
                    selected={selOut} onSelect={setSelOut}
                    loading={loadingOut} error={errOut}
                    noResultHint={gateway.alt ? `Try ${gateway.alt}.` : undefined}
                    rates={rates} currency={currency}
                  />
                )}
                {mobileTab === 'ret' && (
                  <FlightColumn
                    title="Return" subtitle={`${gateway.code} → ${homeAirport?.iataCode || '—'}`}
                    flights={retFlights} sort={sortRet} onSort={setSortRet}
                    selected={selRet} onSelect={setSelRet}
                    loading={loadingRet} error={errRet}
                    noResultHint={gateway.alt ? `Try ${gateway.alt}.` : undefined}
                    rates={rates} currency={currency}
                  />
                )}
                {mobileTab === 'ground' && (
                  <GroundLegCard trek={trek} gateway={gateway} groundRoute={groundRoute} loading={groundLoading} />
                )}
                {mobileTab === 'city' && (
                  <CityGuideCard gateway={gateway} guide={cityGuide} loading={cityLoading} bufferDays={suggested?.bufferDays} />
                )}
              </div>

              {/* Desktop: ground route + city guide below flights */}
              <div className="hidden lg:grid grid-cols-2 gap-6 mb-6">
                <GroundLegCard trek={trek} gateway={gateway} groundRoute={groundRoute} loading={groundLoading} />
                <CityGuideCard gateway={gateway} guide={cityGuide} loading={cityLoading} bufferDays={suggested?.bufferDays} />
              </div>

              {/* Travel tips */}
              <div className="hidden lg:block mb-6">
                <TravelTips trek={trek} gateway={gateway} suggested={suggested} />
              </div>

              {/* Trip summary (sticky bottom) */}
              {showSummary && (
                <TripSummary
                  trek={trek} outFlight={selOut} retFlight={selRet}
                  homeAirport={homeAirport} gateway={gateway}
                  outDate={outDate} retDate={retDate} adults={adults}
                  rates={rates} currency={currency}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
