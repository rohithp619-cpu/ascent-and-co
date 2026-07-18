// Free, no-key-required APIs for ground travel planning

// ─── Currency — open.er-api.com (free forever, ~1500 req/month) ───────────────
const _fxCache = {}

export const CURRENCIES = [
  { code: 'USD', symbol: '$',  label: 'US Dollar' },
  { code: 'EUR', symbol: '€',  label: 'Euro' },
  { code: 'GBP', symbol: '£',  label: 'British Pound' },
  { code: 'INR', symbol: '₹',  label: 'Indian Rupee' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar' },
  { code: 'SGD', symbol: 'S$', label: 'Singapore Dollar' },
  { code: 'NPR', symbol: '₨',  label: 'Nepali Rupee' },
]

export async function getExchangeRates(base = 'USD') {
  if (_fxCache[base] && Date.now() - _fxCache[base].ts < 3_600_000) return _fxCache[base].rates
  const res = await fetch(`https://open.er-api.com/v6/latest/${base}`)
  if (!res.ok) throw new Error('Exchange rate fetch failed')
  const d = await res.json()
  _fxCache[base] = { rates: d.rates, ts: Date.now() }
  return d.rates
}

export function convertPrice(amountUSD, rates, targetCode) {
  if (!rates || targetCode === 'USD') return amountUSD
  return amountUSD * (rates[targetCode] || 1)
}

export function formatMoney(amount, currencyCode) {
  const cur = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0]
  const rounded = Math.round(amount)
  return `${cur.symbol}${rounded.toLocaleString()}`
}

// ─── Nominatim geocoding — nominatim.openstreetmap.org (free, no key) ─────────
const _geoCache = {}

export async function geocodePlace(query) {
  if (_geoCache[query]) return _geoCache[query]
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
  const res = await fetch(url, { headers: { 'User-Agent': 'AscentCo-TrekPlanner/1.0' } })
  if (!res.ok) return null
  const d = await res.json()
  if (!d[0]) return null
  const result = { lat: parseFloat(d[0].lat), lon: parseFloat(d[0].lon), display: d[0].display_name }
  _geoCache[query] = result
  return result
}

// ─── OSRM road routing — router.project-osrm.org (free, no key) ──────────────
const _routeCache = {}

export async function getDrivingRoute(fromLon, fromLat, toLon, toLat) {
  const key = `${fromLon},${fromLat}->${toLon},${toLat}`
  if (_routeCache[key]) return _routeCache[key]
  const url = `https://router.project-osrm.org/route/v1/driving/${fromLon},${fromLat};${toLon},${toLat}?overview=false&steps=false`
  const res = await fetch(url)
  if (!res.ok) return null
  const d = await res.json()
  if (!d.routes?.[0]) return null
  const r = d.routes[0]
  const result = {
    distanceKm: Math.round(r.distance / 1000),
    durationMin: Math.round(r.duration / 60),
    durationH: (r.duration / 3600).toFixed(1),
  }
  _routeCache[key] = result
  return result
}

// ─── Trek trailhead coordinates (for OSRM ground leg) ─────────────────────────
// lat/lon of the standard starting town for each trek
export const TREK_TRAILHEADS = {
  // Nepal — Khumbu
  'everest-base-camp':          { name: 'Lukla / Namche Bazaar', lat: 27.6879, lon: 86.7303, note: '45-min flight from KTM to Lukla, then trek' },
  'gokyo-lakes':                { name: 'Lukla', lat: 27.6879, lon: 86.7303, note: '45-min flight from KTM to Lukla' },
  'everest-three-passes':       { name: 'Lukla', lat: 27.6879, lon: 86.7303, note: '45-min flight from KTM to Lukla' },
  'ebc-via-gokyo-cho-la':       { name: 'Lukla', lat: 27.6879, lon: 86.7303, note: '45-min flight from KTM to Lukla' },
  'ebc-classic-via-jiri':       { name: 'Jiri (via road)', lat: 27.6363, lon: 86.2316, note: '~5h bus from KTM to Jiri' },
  'mera-peak-trek-high-camp-route': { name: 'Lukla', lat: 27.6879, lon: 86.7303, note: '45-min flight KTM→Lukla' },
  // Nepal — Annapurna
  'annapurna-circuit':          { name: 'Besisahar', lat: 28.2308, lon: 84.3832, note: '~5–6h bus from PKR or KTM' },
  'annapurna-base-camp':        { name: 'Nayapul / Phedi', lat: 28.3297, lon: 83.7839, note: '1h taxi from Pokhara' },
  'ghorepani-poon-hill':        { name: 'Nayapul', lat: 28.3297, lon: 83.7839, note: '1h taxi from Pokhara' },
  'mardi-himal':                { name: 'Phedi (Kande)', lat: 28.3583, lon: 83.9104, note: '45-min taxi from Pokhara' },
  'jomsom-muktinath':           { name: 'Jomsom Airport', lat: 28.7795, lon: 83.7288, note: '20-min flight from Pokhara' },
  // Nepal — Langtang
  'langtang-valley':            { name: 'Syabrubesi', lat: 28.1587, lon: 85.3492, note: '~7–8h bus from KTM' },
  'gosaikunda-lake':            { name: 'Dhunche', lat: 28.1113, lon: 85.3015, note: '~5–6h bus from KTM' },
  'helambu-trek':               { name: 'Sundarijal', lat: 27.7894, lon: 85.4279, note: '~1h from KTM' },
  // Nepal — Manaslu
  'manaslu-circuit':            { name: 'Soti Khola / Machha Khola', lat: 28.4038, lon: 84.7748, note: '~8–9h road from KTM' },
  // Nepal — Mustang / Dolpo
  'upper-mustang':              { name: 'Jomsom Airport', lat: 28.7795, lon: 83.7288, note: '20-min flight from Pokhara' },
  'kanchenjunga-base-camp':     { name: 'Taplejung / Suketar Airport', lat: 27.3521, lon: 87.6633, note: '45-min flight from KTM' },
  // India — Uttarakhand
  'kedarkantha':                { name: 'Sankri Village', lat: 31.0879, lon: 78.1527, note: '~10h road from Dehradun (DED)' },
  'har-ki-dun':                 { name: 'Sankri / Taluka', lat: 31.0879, lon: 78.1527, note: '~10h road from Dehradun' },
  'valley-of-flowers-hemkund-sahib': { name: 'Govindghat', lat: 30.5773, lon: 79.5951, note: '~8h road from Haridwar/Rishikesh' },
  'roopkund':                   { name: 'Lohajung', lat: 30.0592, lon: 79.7844, note: '~8h road from Haridwar' },
  'kuari-pass':                 { name: 'Auli / Joshimath', lat: 30.5574, lon: 79.5644, note: '~7h road from Haridwar' },
  'brahmatal':                  { name: 'Lohajung', lat: 30.0592, lon: 79.7844, note: '~8h road from Haridwar' },
  'gaumukh-tapovan':            { name: 'Gangotri', lat: 30.9942, lon: 78.9389, note: '~9h road from Haridwar' },
  // India — Himachal
  'hampta-pass':                { name: 'Jobra / Prini (Manali)', lat: 32.2632, lon: 77.1892, note: '~50-min taxi from Bhuntar (KUU), ~8h from DEL' },
  'bhrigu-lake':                { name: 'Vashisht / Manali', lat: 32.2647, lon: 77.2005, note: '~50-min from Bhuntar (KUU)' },
  'beas-kund':                  { name: 'Solang Nala (Manali)', lat: 32.3266, lon: 77.1610, note: '~1h from Manali' },
  'sar-pass':                   { name: 'Kasol / Kheerganga', lat: 32.0098, lon: 77.3178, note: '~5h from Bhuntar' },
  // India — Ladakh
  'chadar-trek-frozen-zanskar': { name: 'Chilling Village', lat: 34.0167, lon: 77.2833, note: '~2h drive from Leh (IXL)' },
  'markha-valley':              { name: 'Spituk Village', lat: 34.0989, lon: 77.5665, note: '~25-min drive from Leh' },
  'kashmir-great-lakes':        { name: 'Sonamarg / Naranag', lat: 34.3004, lon: 75.2902, note: '~2–3h drive from Srinagar' },
  'tarsar-marsar':              { name: 'Aru Village (near Pahalgam)', lat: 34.0148, lon: 75.3097, note: '~2.5h drive from SXR' },
  'sham-valley-baby-trek':      { name: 'Leh city', lat: 34.1642, lon: 77.5849, note: 'Starts from Leh center' },
  'rumtse-to-tso-moriri':       { name: 'Rumtse Village', lat: 33.1815, lon: 78.1220, note: '~4h drive from Leh' },
  // India — Sikkim
  'goecha-la':                  { name: 'Yuksom', lat: 27.4167, lon: 88.2667, note: '~5h road from Bagdogra (IXB)' },
  'dzongri-trek':               { name: 'Yuksom', lat: 27.4167, lon: 88.2667, note: '~5h road from Bagdogra' },
  'sandakphu-phalut-singalila-ridge': { name: 'Manebhanjan', lat: 26.9792, lon: 87.9913, note: '~3h road from Siliguri/Bagdogra' },
}

export function getTrailhead(trek) {
  return TREK_TRAILHEADS[trek.slug] || null
}

// ─── Wikivoyage city guide — en.wikivoyage.org (free, no key) ─────────────────
const _wikiCache = {}

export async function getCityGuide(cityName) {
  if (_wikiCache[cityName]) return _wikiCache[cityName]
  const url = `https://en.wikivoyage.org/w/api.php?action=query&titles=${encodeURIComponent(cityName)}&prop=extracts&exintro=true&format=json&explaintext=true&origin=*`
  const res = await fetch(url)
  if (!res.ok) return null
  const d = await res.json()
  const pages = d.query?.pages
  if (!pages) return null
  const page = Object.values(pages)[0]
  if (!page?.extract) return null
  // Take just the first 2 paragraphs
  const paras = page.extract.split('\n').filter(p => p.trim().length > 80).slice(0, 2)
  const result = { title: page.title, summary: paras.join('\n\n') }
  _wikiCache[cityName] = result
  return result
}

// Format drive time nicely
export function formatDriveTime(durationMin) {
  if (durationMin < 60) return `${durationMin} min`
  const h = Math.floor(durationMin / 60)
  const m = durationMin % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}
