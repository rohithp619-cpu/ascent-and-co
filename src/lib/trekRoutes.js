// Waypoints: [lat, lon, altM, 'Label', 'icon']
// icon: 'start' | 'village' | 'camp' | 'pass' | 'peak' | 'end'

export const TREK_ROUTES = {
  'everest-base-camp': {
    osmName: 'Everest Base Camp',
    center: [27.86, 86.80], zoom: 11,
    waypoints: [
      [27.6869, 86.7290, 2860,  'Lukla',            'start'],
      [27.7159, 86.7146, 2610,  'Phakding',         'village'],
      [27.8069, 86.7143, 3440,  'Namche Bazaar',    'village'],
      [27.8364, 86.7642, 3860,  'Tengboche',        'camp'],
      [27.8966, 86.8302, 4410,  'Dingboche',        'camp'],
      [27.9309, 86.8201, 4930,  'Lobuche',          'camp'],
      [27.9797, 86.8294, 5164,  'Gorak Shep',       'camp'],
      [28.0035, 86.8521, 5364,  'Base Camp',        'end'],
    ],
  },
  'gokyo-lakes': {
    osmName: 'Gokyo Lakes',
    center: [27.90, 86.68], zoom: 11,
    waypoints: [
      [27.6869, 86.7290, 2860,  'Lukla',            'start'],
      [27.8069, 86.7143, 3440,  'Namche Bazaar',    'village'],
      [27.8734, 86.7092, 3780,  'Phortse',          'village'],
      [27.9045, 86.6654, 4360,  'Machhermo',        'camp'],
      [27.9345, 86.6789, 4750,  'Gokyo',            'camp'],
      [27.9607, 86.6826, 4800,  'Gokyo Ri',         'peak'],
    ],
  },
  'everest-three-passes': {
    osmName: 'Everest Three Passes',
    center: [27.91, 86.82], zoom: 11,
    waypoints: [
      [27.6869, 86.7290, 2860,  'Lukla',            'start'],
      [27.8069, 86.7143, 3440,  'Namche Bazaar',    'village'],
      [27.9345, 86.6789, 4750,  'Gokyo',            'camp'],
      [27.9607, 86.7600, 5420,  'Cho La Pass',      'pass'],
      [27.9797, 86.8294, 5164,  'Gorak Shep',       'camp'],
      [28.0035, 86.8521, 5364,  'Base Camp',        'peak'],
      [27.9860, 86.9289, 5535,  'Kongma La',        'pass'],
      [27.8966, 86.8302, 4410,  'Dingboche',        'camp'],
      [27.8364, 86.7642, 3860,  'Tengboche',        'end'],
    ],
  },
  'annapurna-circuit': {
    osmName: 'Annapurna Circuit',
    center: [28.55, 83.95], zoom: 10,
    waypoints: [
      [28.2297, 84.3894,  760,  'Besisahar',        'start'],
      [28.3456, 84.3230,  890,  'Bhulbhule',        'village'],
      [28.4789, 84.2567, 1400,  'Jagat',            'village'],
      [28.5534, 84.2358, 2630,  'Chame',            'village'],
      [28.5892, 84.1812, 3300,  'Pisang',           'village'],
      [28.6659, 84.0216, 3519,  'Manang',           'village'],
      [28.7420, 83.9780, 4600,  'High Camp',        'camp'],
      [28.7997, 83.9308, 5416,  'Thorong La',       'pass'],
      [28.8176, 83.8720, 3760,  'Muktinath',        'village'],
      [28.7817, 83.7230, 2713,  'Jomsom',           'village'],
      [28.5421, 83.6789, 1189,  'Tatopani',         'village'],
      [28.4512, 83.7123, 2775,  'Ghorepani',        'camp'],
      [28.2096, 83.9856,  827,  'Pokhara',          'end'],
    ],
  },
  'annapurna-base-camp': {
    osmName: 'Annapurna Base Camp',
    center: [28.43, 83.88], zoom: 11,
    waypoints: [
      [28.2096, 83.9856,  827,  'Pokhara',          'start'],
      [28.3000, 83.9280, 1070,  'Nayapul',          'village'],
      [28.3802, 83.8920, 2160,  'Tikhedhunga',      'village'],
      [28.4512, 83.7123, 2775,  'Ghorepani',        'camp'],
      [28.4015, 83.8045, 1960,  'Chhomrong',        'village'],
      [28.4456, 83.8489, 2630,  'Dovan',            'camp'],
      [28.5060, 83.8771, 4130,  'Machhapuchhre BC', 'camp'],
      [28.5297, 83.8771, 4130,  'Annapurna BC',     'end'],
    ],
  },
  'langtang-valley': {
    osmName: 'Langtang Valley',
    center: [28.12, 85.52], zoom: 11,
    waypoints: [
      [27.9453, 85.3240,  860,  'Syabrubesi',       'start'],
      [28.0234, 85.4012, 2480,  'Lama Hotel',       'camp'],
      [28.1058, 85.5031, 3240,  'Langtang Village', 'village'],
      [28.1456, 85.5234, 3570,  'Mundu',            'camp'],
      [28.2096, 85.5432, 3870,  'Kyanjin Gompa',    'camp'],
      [28.2523, 85.5623, 4984,  'Kyanjin Ri',       'peak'],
    ],
  },
  'manaslu-circuit': {
    osmName: 'Manaslu Circuit',
    center: [28.55, 84.56], zoom: 10,
    waypoints: [
      [28.0542, 84.7856,  890,  'Arughat',          'start'],
      [28.1856, 84.7234, 1400,  'Sotikhola',        'village'],
      [28.3234, 84.6456, 2380,  'Jagat',            'village'],
      [28.4123, 84.6012, 2960,  'Deng',             'camp'],
      [28.5534, 84.5678, 3430,  'Namrung',          'village'],
      [28.6089, 84.5012, 3920,  'Samagaon',         'camp'],
      [28.6789, 84.4456, 4460,  'Samdo',            'camp'],
      [28.7234, 84.3890, 5106,  'Larkya La',        'pass'],
      [28.6345, 84.3012, 3520,  'Bimthang',         'camp'],
      [28.3456, 84.4234, 1830,  'Dharapani',        'end'],
    ],
  },
  'upper-mustang': {
    osmName: 'Upper Mustang',
    center: [28.90, 83.73], zoom: 10,
    waypoints: [
      [28.7817, 83.7230, 2713,  'Jomsom',           'start'],
      [28.8013, 83.7889, 2804,  'Kagbeni',          'village'],
      [28.8834, 83.7678, 3100,  'Chele',            'village'],
      [28.9345, 83.7890, 3700,  'Samar',            'camp'],
      [29.0234, 83.7456, 3840,  'Syangboche',       'camp'],
      [29.0789, 83.7123, 3810,  'Ghemi',            'village'],
      [29.1234, 83.7567, 3900,  'Lo Manthang',      'end'],
    ],
  },
  'kanchenjunga-base-camp': {
    osmName: 'Kanchenjunga Base Camp',
    center: [27.80, 87.95], zoom: 10,
    waypoints: [
      [27.3589, 87.9234, 1100,  'Taplejung',        'start'],
      [27.4456, 87.9678, 1420,  'Chirwa',           'village'],
      [27.5234, 88.0012, 1780,  'Ghunsa',           'camp'],
      [27.6012, 88.0456, 3595,  'Khambachen',       'camp'],
      [27.6789, 88.0890, 4050,  'Lhonak',           'camp'],
      [27.7234, 88.1234, 5140,  'Pangpema (N BC)',  'end'],
    ],
  },
  'kedarkantha': {
    osmName: 'Kedarkantha',
    center: [31.10, 78.20], zoom: 12,
    waypoints: [
      [31.0456, 78.1890, 2200,  'Sankri',           'start'],
      [31.0789, 78.2123, 2700,  'Juda Ka Talab',    'camp'],
      [31.1012, 78.2567, 3100,  'Base Camp',        'camp'],
      [31.1234, 78.2456, 3810,  'Kedarkantha Peak', 'end'],
    ],
  },
  'har-ki-dun': {
    osmName: 'Har Ki Dun',
    center: [31.18, 78.42], zoom: 11,
    waypoints: [
      [30.9678, 78.2890, 1400,  'Sankri',           'start'],
      [31.0234, 78.3456, 1900,  'Taluka',           'village'],
      [31.0890, 78.4012, 2430,  'Osla',             'village'],
      [31.1345, 78.4456, 3150,  'Har Ki Dun',       'end'],
    ],
  },
  'roopkund': {
    osmName: 'Roopkund',
    center: [30.25, 79.73], zoom: 11,
    waypoints: [
      [30.0678, 79.5890, 2286,  'Lohajung',         'start'],
      [30.1234, 79.6456, 2650,  'Didna',            'village'],
      [30.1890, 79.7012, 3354,  'Ali Bugyal',       'camp'],
      [30.2345, 79.7456, 3800,  'Patar Nachauni',   'camp'],
      [30.2789, 79.7890, 4200,  'Bhagwabasa',       'camp'],
      [30.3023, 79.7987, 4778,  'Roopkund',         'end'],
    ],
  },
  'chadar-trek-frozen-zanskar': {
    osmName: 'Chadar',
    center: [33.70, 76.90], zoom: 10,
    waypoints: [
      [33.9234, 77.0890, 3505,  'Chilling',         'start'],
      [33.8456, 76.9678, 3480,  'Gyalpo',           'camp'],
      [33.7890, 76.8456, 3460,  'Tibb Cave',        'camp'],
      [33.7234, 76.7234, 3440,  'Nerak',            'end'],
    ],
  },
  'markha-valley': {
    osmName: 'Markha Valley',
    center: [33.87, 77.50], zoom: 11,
    waypoints: [
      [33.9234, 77.5234, 3520,  'Spituk',           'start'],
      [33.8789, 77.5678, 3610,  'Rumbak',           'village'],
      [33.8345, 77.6012, 3900,  'Yurutse',          'camp'],
      [33.8012, 77.6456, 4700,  'Ganda La',         'pass'],
      [33.7678, 77.6234, 3980,  'Skiu',             'village'],
      [33.7345, 77.5890, 3900,  'Markha',           'camp'],
      [33.6890, 77.5456, 5150,  'Kang Yatse',       'peak'],
      [33.6456, 77.4890, 3900,  'Nimaling',         'end'],
    ],
  },
  'kashmir-great-lakes': {
    osmName: 'Kashmir Great Lakes',
    center: [34.08, 75.35], zoom: 10,
    waypoints: [
      [34.0456, 74.7456, 2400,  'Sonamarg',         'start'],
      [34.0789, 74.8234, 3600,  'Nichnai Pass',     'pass'],
      [34.1012, 74.9012, 3600,  'Vishansar Lake',   'camp'],
      [34.1345, 75.0234, 3700,  'Krishnasar Lake',  'camp'],
      [34.1678, 75.1456, 4200,  'Gadsar Pass',      'pass'],
      [34.1890, 75.2890, 3400,  'Satsar Lakes',     'camp'],
      [34.2012, 75.4012, 3700,  'Gangbal Lake',     'end'],
    ],
  },
  'hampta-pass': {
    osmName: 'Hampta Pass',
    center: [32.12, 77.28], zoom: 11,
    waypoints: [
      [32.0890, 77.1234, 2050,  'Manali',           'start'],
      [32.0890, 77.1890, 2800,  'Jobra',            'camp'],
      [32.1012, 77.2345, 3250,  'Chika',            'camp'],
      [32.1234, 77.2890, 3700,  'Balu Ka Ghera',    'camp'],
      [32.1456, 77.3345, 4270,  'Hampta Pass',      'pass'],
      [32.1678, 77.3890, 4100,  'Shea Goru',        'camp'],
      [32.1890, 77.4456, 4280,  'Chandratal Lake',  'end'],
    ],
  },
  'goecha-la': {
    osmName: 'Goecha La',
    center: [27.60, 88.20], zoom: 11,
    waypoints: [
      [27.3378, 88.2890, 1670,  'Yuksom',           'start'],
      [27.3890, 88.3234, 2300,  'Sachen',           'village'],
      [27.4345, 88.3678, 2900,  'Tshoka',           'camp'],
      [27.5012, 88.3890, 3550,  'Dzongri',          'camp'],
      [27.5456, 88.4012, 4700,  'Thansing',         'camp'],
      [27.5890, 88.4234, 5140,  'Lamuney',          'camp'],
      [27.6123, 88.4456, 4940,  'Goecha La',        'end'],
    ],
  },
  'bhrigu-lake': {
    osmName: 'Bhrigu Lake',
    center: [32.10, 77.17], zoom: 12,
    waypoints: [
      [32.0890, 77.1234, 2050,  'Manali',           'start'],
      [32.0678, 77.1456, 2600,  'Vashisht',         'village'],
      [32.0456, 77.1678, 3200,  'Rola Kholi',       'camp'],
      [32.0234, 77.1890, 4235,  'Bhrigu Lake',      'end'],
    ],
  },
}

// ─── Generate approximate route for treks not in database ────────────────────
const REGION_CENTERS = {
  khumbu:      { lat: 27.99, lon: 86.93 },
  annapurna:   { lat: 28.60, lon: 84.03 },
  langtang:    { lat: 28.21, lon: 85.52 },
  manaslu:     { lat: 28.55, lon: 84.56 },
  mustang:     { lat: 28.90, lon: 83.72 },
  dolpo:       { lat: 29.00, lon: 82.90 },
  kanchenjunga:{ lat: 27.70, lon: 87.80 },
  ladakh:      { lat: 34.10, lon: 77.58 },
  kashmir:     { lat: 34.08, lon: 74.80 },
  sikkim:      { lat: 27.60, lon: 88.30 },
  uttarakhand: { lat: 30.72, lon: 79.22 },
  himachal:    { lat: 32.10, lon: 77.20 },
}

function regionCenter(trek) {
  const r = (trek.region || '').toLowerCase()
  for (const [key, c] of Object.entries(REGION_CENTERS)) {
    if (r.includes(key)) return c
  }
  return trek.country === 'India' ? { lat: 31.0, lon: 78.5 } : { lat: 28.3, lon: 84.5 }
}

export function getRouteData(trek) {
  const known = TREK_ROUTES[trek.slug]
  if (known) return known

  // Generate approximate route from trek metadata
  const c = regionCenter(trek)
  const maxAlt = trek.maxAltitudeM || 5000
  const days = trek.days || 10
  const steps = Math.min(days, 10)
  const spread = 0.3 + (trek.distanceKm || 100) / 1000

  const waypoints = Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1)
    // Simulate out-and-back with altitude peak at ~60% of route
    const arcT = t <= 0.6 ? t / 0.6 : (1 - t) / 0.4
    const alt = Math.round(1000 + arcT * (maxAlt - 1000))
    return [
      parseFloat((c.lat + (t - 0.5) * spread * 0.5 + (i % 2) * 0.02).toFixed(4)),
      parseFloat((c.lon + (t - 0.5) * spread + (i % 3 - 1) * 0.01).toFixed(4)),
      alt,
      i === 0 ? trek.baseTown || 'Start' : i === steps - 1 ? 'Summit Area' : `Day ${i + 1}`,
      i === 0 ? 'start' : i === steps - 1 ? 'end' : t > 0.45 && t < 0.65 ? 'pass' : 'camp',
    ]
  })

  return {
    osmName: trek.name,
    center: [c.lat, c.lon],
    zoom: 11,
    waypoints,
  }
}

// ─── Interpolate waypoints for smooth animation ───────────────────────────────
export function interpolateRoute(waypoints, segments = 12) {
  const pts = []
  for (let i = 0; i < waypoints.length - 1; i++) {
    const a = waypoints[i], b = waypoints[i + 1]
    for (let j = 0; j < segments; j++) {
      const t = j / segments
      pts.push([
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
        Math.round(a[2] + (b[2] - a[2]) * t),
      ])
    }
  }
  const last = waypoints[waypoints.length - 1]
  pts.push([last[0], last[1], last[2]])
  return pts
}

// ─── Overpass API — real OSM route geometry ───────────────────────────────────
export async function fetchOsmRoute(osmName, bbox) {
  const query = `[out:json][timeout:25];relation["route"~"hiking"]["name"~"${osmName}",i]${bbox ? `(${bbox})` : ''};out geom;`
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
  const res = await fetch(url, { signal: AbortSignal.timeout(28000) })
  if (!res.ok) throw new Error(`Overpass HTTP ${res.status}`)
  const data = await res.json()

  const rel = data.elements?.find((e) => e.type === 'relation')
  if (!rel?.members) return null

  const coords = []
  for (const m of rel.members) {
    if (m.type === 'way' && Array.isArray(m.geometry)) {
      for (const p of m.geometry) coords.push([p.lat, p.lon])
    }
  }
  // Deduplicate adjacent identical points
  const deduped = coords.filter((p, i) => i === 0 || p[0] !== coords[i - 1][0] || p[1] !== coords[i - 1][1])
  return deduped.length > 20 ? deduped : null
}
