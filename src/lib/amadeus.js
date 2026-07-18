// Amadeus Self-Service API client
// Test env: test.api.amadeus.com  |  Prod env: api.amadeus.com
// Register free at https://developers.amadeus.com

const BASE = 'https://test.api.amadeus.com'

export const HAS_AMADEUS = !!(
  import.meta.env.VITE_AMADEUS_CLIENT_ID &&
  import.meta.env.VITE_AMADEUS_CLIENT_SECRET
)

let _tok = null

async function getToken() {
  if (_tok && Date.now() < _tok.exp) return _tok.value
  const res = await fetch(`${BASE}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: import.meta.env.VITE_AMADEUS_CLIENT_ID,
      client_secret: import.meta.env.VITE_AMADEUS_CLIENT_SECRET,
    }),
  })
  if (!res.ok) throw new Error(`Amadeus auth failed (${res.status})`)
  const d = await res.json()
  _tok = { value: d.access_token, exp: Date.now() + (d.expires_in - 60) * 1000 }
  return _tok.value
}

async function api(path, params = {}) {
  const token = await getToken()
  const url = new URL(`${BASE}${path}`)
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) url.searchParams.set(k, v)
  }
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.errors?.[0]?.detail || `Amadeus error ${res.status}`)
  }
  return res.json()
}

export async function searchAirports(keyword) {
  if (!keyword || keyword.length < 2) return []
  const d = await api('/v1/reference-data/locations', {
    keyword,
    subType: 'AIRPORT,CITY',
    'page[limit]': 7,
    sort: 'analytics.travelers.score',
    view: 'LIGHT',
  })
  return d.data || []
}

export async function searchFlights({ origin, destination, departureDate, adults = 1, max = 7, currencyCode = 'USD' }) {
  const d = await api('/v2/shopping/flight-offers', {
    originLocationCode: origin,
    destinationLocationCode: destination,
    departureDate,
    adults,
    max,
    currencyCode,
  })
  return d.data || []
}

// ─── Trek → nearest gateway airport ──────────────────────────────────────────
export const TREK_GATEWAYS = {
  // Nepal — Khumbu / Everest / Manaslu / Langtang / Kanchenjunga (all route through KTM)
  default_nepal:              { code: 'KTM', city: 'Kathmandu',  country: 'Nepal', name: 'Tribhuvan International' },
  // Nepal — Annapurna (Pokhara is closer; KTM as fallback)
  'annapurna-circuit':        { code: 'PKR', city: 'Pokhara',   country: 'Nepal', name: 'Pokhara International', alt: 'KTM' },
  'annapurna-base-camp':      { code: 'PKR', city: 'Pokhara',   country: 'Nepal', name: 'Pokhara International', alt: 'KTM' },
  'ghorepani-poon-hill':      { code: 'PKR', city: 'Pokhara',   country: 'Nepal', name: 'Pokhara International', alt: 'KTM' },
  'mardi-himal':              { code: 'PKR', city: 'Pokhara',   country: 'Nepal', name: 'Pokhara International', alt: 'KTM' },
  'jomsom-muktinath':         { code: 'PKR', city: 'Pokhara',   country: 'Nepal', name: 'Pokhara International', alt: 'KTM' },
  'khopra-ridge-khopra-danda':{ code: 'PKR', city: 'Pokhara',   country: 'Nepal', name: 'Pokhara International', alt: 'KTM' },
  'mohare-danda-community-trek':{ code: 'PKR', city: 'Pokhara', country: 'Nepal', name: 'Pokhara International', alt: 'KTM' },
  // India — Ladakh
  'chadar-trek-frozen-zanskar':{ code: 'IXL', city: 'Leh',    country: 'India', name: 'Kushok Bakula Rimpochhe' },
  'markha-valley':            { code: 'IXL', city: 'Leh',      country: 'India', name: 'Kushok Bakula Rimpochhe' },
  'sham-valley-baby-trek':    { code: 'IXL', city: 'Leh',      country: 'India', name: 'Kushok Bakula Rimpochhe' },
  'lamayuru-to-alchi':        { code: 'IXL', city: 'Leh',      country: 'India', name: 'Kushok Bakula Rimpochhe' },
  'rumtse-to-tso-moriri':     { code: 'IXL', city: 'Leh',      country: 'India', name: 'Kushok Bakula Rimpochhe' },
  // India — Kashmir
  'kashmir-great-lakes':      { code: 'SXR', city: 'Srinagar', country: 'India', name: 'Sheikh ul-Alam', alt: 'DEL' },
  'tarsar-marsar':            { code: 'SXR', city: 'Srinagar', country: 'India', name: 'Sheikh ul-Alam', alt: 'DEL' },
  'kolahoi-base-camp':        { code: 'SXR', city: 'Srinagar', country: 'India', name: 'Sheikh ul-Alam', alt: 'DEL' },
  'warwan-valley':            { code: 'SXR', city: 'Srinagar', country: 'India', name: 'Sheikh ul-Alam', alt: 'DEL' },
  'stok-village-to-stok-la':  { code: 'IXL', city: 'Leh',     country: 'India', name: 'Kushok Bakula Rimpochhe' },
  // India — Uttarakhand
  'kedarkantha':              { code: 'DED', city: 'Dehradun', country: 'India', name: 'Jolly Grant', alt: 'DEL' },
  'har-ki-dun':               { code: 'DED', city: 'Dehradun', country: 'India', name: 'Jolly Grant', alt: 'DEL' },
  'valley-of-flowers-hemkund-sahib':{ code: 'DED', city: 'Dehradun', country: 'India', name: 'Jolly Grant', alt: 'DEL' },
  'roopkund':                 { code: 'DED', city: 'Dehradun', country: 'India', name: 'Jolly Grant', alt: 'DEL' },
  'kuari-pass':               { code: 'DED', city: 'Dehradun', country: 'India', name: 'Jolly Grant', alt: 'DEL' },
  'brahmatal':                { code: 'DED', city: 'Dehradun', country: 'India', name: 'Jolly Grant', alt: 'DEL' },
  'dayara-bugyal':            { code: 'DED', city: 'Dehradun', country: 'India', name: 'Jolly Grant', alt: 'DEL' },
  'gaumukh-tapovan':          { code: 'DED', city: 'Dehradun', country: 'India', name: 'Jolly Grant', alt: 'DEL' },
  'kedartal':                 { code: 'DED', city: 'Dehradun', country: 'India', name: 'Jolly Grant', alt: 'DEL' },
  'bali-pass':                { code: 'DED', city: 'Dehradun', country: 'India', name: 'Jolly Grant', alt: 'DEL' },
  // India — Himachal Pradesh
  'hampta-pass':              { code: 'KUU', city: 'Kullu',    country: 'India', name: 'Bhuntar', alt: 'DEL' },
  'bhrigu-lake':              { code: 'KUU', city: 'Kullu',    country: 'India', name: 'Bhuntar', alt: 'DEL' },
  'beas-kund':                { code: 'KUU', city: 'Kullu',    country: 'India', name: 'Bhuntar', alt: 'DEL' },
  'pin-parvati-pass':         { code: 'KUU', city: 'Kullu',    country: 'India', name: 'Bhuntar', alt: 'DEL' },
  'buran-ghati':              { code: 'KUU', city: 'Kullu',    country: 'India', name: 'Bhuntar', alt: 'DEL' },
  'sar-pass':                 { code: 'KUU', city: 'Kullu',    country: 'India', name: 'Bhuntar', alt: 'DEL' },
  'rupin-pass':               { code: 'KUU', city: 'Kullu',    country: 'India', name: 'Bhuntar', alt: 'DEL' },
  'indrahar-pass':            { code: 'DHM', city: 'Dharamshala', country: 'India', name: 'Kangra', alt: 'DEL' },
  'triund':                   { code: 'DHM', city: 'Dharamshala', country: 'India', name: 'Kangra', alt: 'DEL' },
  'kheerganga':               { code: 'KUU', city: 'Kullu',    country: 'India', name: 'Bhuntar', alt: 'DEL' },
  // India — Sikkim / Northeast
  'goecha-la':                { code: 'IXB', city: 'Bagdogra', country: 'India', name: 'Bagdogra International', alt: 'CCU' },
  'dzongri-trek':             { code: 'IXB', city: 'Bagdogra', country: 'India', name: 'Bagdogra International', alt: 'CCU' },
  'sandakphu-phalut-singalila-ridge':{ code: 'IXB', city: 'Bagdogra', country: 'India', name: 'Bagdogra International', alt: 'CCU' },
  'sandakphu-via-gurdum-short':{ code: 'IXB', city: 'Bagdogra', country: 'India', name: 'Bagdogra International', alt: 'CCU' },
  // India — South / Western Ghats
  'kudremukh':                { code: 'MNG', city: 'Mangalore', country: 'India', name: 'Mangalore International', alt: 'BLR' },
  'kumara-parvatha':          { code: 'MNG', city: 'Mangalore', country: 'India', name: 'Mangalore International', alt: 'BLR' },
  'harishchandragad':         { code: 'PNQ', city: 'Pune',     country: 'India', name: 'Pune International', alt: 'BOM' },
  'chembra-peak':             { code: 'CCJ', city: 'Kozhikode', country: 'India', name: 'Kozhikode International', alt: 'COK' },
  // Default India
  default_india:              { code: 'DEL', city: 'New Delhi', country: 'India', name: 'Indira Gandhi International' },
}

export function getGateway(trek) {
  if (TREK_GATEWAYS[trek.slug]) return TREK_GATEWAYS[trek.slug]
  if (trek.country === 'India') return TREK_GATEWAYS.default_india
  return TREK_GATEWAYS.default_nepal
}

// ─── Smart date suggestions based on trek best months ─────────────────────────
const MONTH_KEY = { jan:0, feb:1, mar:2, apr:3, may:4, jun:5, jul:6, aug:7, sep:8, oct:9, nov:10, dec:11 }
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']

export function suggestDates(trek) {
  const raw = trek.bestMonths || ''
  const found = raw.toLowerCase().match(/[a-z]{3,}/g) || []
  const indices = [...new Set(found.map(w => MONTH_KEY[w.slice(0, 3)]).filter(m => m !== undefined))]

  const now = new Date()
  const cur = now.getMonth()
  const curYear = now.getFullYear()

  let targetMonth = indices.find(m => m > cur) ?? indices.find(m => m === cur) ?? indices[0] ?? (cur + 2) % 12
  let year = curYear
  if (targetMonth <= cur) year++

  // Set departure ~10 days into the target month for better pricing
  const depart = new Date(year, targetMonth, 10)

  // Acclimatization buffer: 1 day for <4000m, 2 days for high altitude treks
  const bufferDays = trek.maxAltitudeM >= 4000 ? 2 : 1
  const trekEnd = new Date(depart)
  trekEnd.setDate(trekEnd.getDate() + bufferDays + trek.days)
  const returnDate = new Date(trekEnd)
  returnDate.setDate(returnDate.getDate() + bufferDays + 1)

  const fmt = d => d.toISOString().split('T')[0]
  return {
    depart: fmt(depart),
    return: fmt(returnDate),
    bufferDays,
    month: MONTH_NAMES[targetMonth],
    allBestMonths: indices.map(i => MONTH_NAMES[i]),
  }
}

// ─── Display helpers ──────────────────────────────────────────────────────────
export function fmtDuration(iso) {
  if (!iso) return '—'
  const h = iso.match(/(\d+)H/)?.[1]
  const m = iso.match(/(\d+)M/)?.[1]
  return [h && `${h}h`, m && `${m}m`].filter(Boolean).join(' ')
}

export function countStops(itinerary) {
  return (itinerary?.segments?.length ?? 1) - 1
}

export function stopsLabel(n) {
  if (n === 0) return 'Direct'
  if (n === 1) return '1 Stop'
  return `${n} Stops`
}

// Carrier code → name (common Himalayan routes)
export const AIRLINE_NAMES = {
  AI: 'Air India', '6E': 'IndiGo', SG: 'SpiceJet', UK: 'Vistara', G8: 'Go First',
  RA: 'Nepal Airlines', YT: 'Yeti Airlines', B6: 'Buddha Air', ST: 'Saurya Airlines',
  EK: 'Emirates', QR: 'Qatar Airways', EY: 'Etihad Airways', TK: 'Turkish Airlines',
  SQ: 'Singapore Airlines', CX: 'Cathay Pacific', TG: 'Thai Airways', MH: 'Malaysia Airlines',
  UL: 'SriLankan Airlines', BR: 'EVA Air', CI: 'China Airlines', CA: 'Air China',
  LH: 'Lufthansa', BA: 'British Airways', AF: 'Air France', KL: 'KLM', AZ: 'ITA Airways',
  DL: 'Delta', UA: 'United', AA: 'American', WY: 'Oman Air', GF: 'Gulf Air',
}

// Skyscanner deep link for manual booking
export function skyscannerUrl(origin, dest, outDate, retDate) {
  const fmt = d => d.replace(/-/g, '').slice(2) // YYYY-MM-DD → YYMMDD
  const base = `https://www.skyscanner.net/transport/flights/${origin.toLowerCase()}/${dest.toLowerCase()}/${fmt(outDate)}`
  return retDate ? `${base}/${fmt(retDate)}/` : `${base}/`
}

// Sort a flights array
export function sortFlights(flights, by) {
  if (!flights?.length) return []
  const copy = [...flights]
  if (by === 'price') return copy.sort((a, b) => +a.price.total - +b.price.total)
  if (by === 'duration') {
    const mins = iso => {
      const h = +(iso.match(/(\d+)H/)?.[1] || 0)
      const m = +(iso.match(/(\d+)M/)?.[1] || 0)
      return h * 60 + m
    }
    return copy.sort((a, b) => mins(a.itineraries[0].duration) - mins(b.itineraries[0].duration))
  }
  if (by === 'stops') return copy.sort((a, b) => countStops(a.itineraries[0]) - countStops(b.itineraries[0]))
  return copy
}

// Visa info helper
export function visaInfo(gateway) {
  if (!gateway) return null
  if (gateway.country === 'Nepal') {
    return {
      headline: 'Nepal Visa on Arrival',
      detail: 'Most nationalities can obtain a visa on arrival at KTM airport. 15-day ($30), 30-day ($50), or 90-day ($125). Bring passport photos and USD cash.',
    }
  }
  if (gateway.country === 'India') {
    return {
      headline: 'India e-Visa Required',
      detail: 'Apply for an Indian e-Tourist Visa at indianvisaonline.gov.in at least 4 days before travel. Valid for 30–180 days depending on type.',
    }
  }
  return null
}
