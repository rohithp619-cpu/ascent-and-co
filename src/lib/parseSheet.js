const SHEET_ID = '1ySsC6E2fw0I9l8_gOeE1DKAR9hNHRIs9qvgSyrlW0YE';
export const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

// Wikimedia Commons Special:FilePath — resolves to actual file by name
const WC = (f) => `https://commons.wikimedia.org/wiki/Special:FilePath/${f}?width=1200`

// 25 verified Wikimedia Commons images (confirmed to exist)
const V = [
  WC('Kala_patthar_view_of_everest.jpg'),                                                // 0
  WC('Gokyo_Lake%2C_Arakamtse%2C_Cholatse%2C_Nepal%2C_Himalayas.jpg'),                  // 1
  WC('Dughla_Pass%2C_Sagarmatha_National_Park%2C_Nepal.jpg'),                            // 2
  WC('Tengboche_monastery_with_Ama_Dablam_%28cropped%29.jpg'),                           // 3
  WC('Muktinath_Valley%2C_View_of_Thorong_La_Pass%2C_Mountains%2C_Nepal.jpg'),           // 4
  WC('Machapucharebasecamp.jpg'),                                                        // 5
  WC('Yak_in_Langtang_Valley.jpg'),                                                     // 6
  WC('Gosaikunda.jpg'),                                                                  // 7
  WC('Manaslu_Circuit_Trek-_Mountain.jpg'),                                              // 8
  WC('Lomanthang_Upper_Mustang_2023_%2838%29.jpg'),                                      // 9
  WC('RAVI.WIKI.KANCHENJUNGA.jpg'),                                                      // 10
  WC('Rara_Lake.jpg'),                                                                   // 11
  WC('Himalayas_from_Kedarkantha_Summit.jpg'),                                           // 12
  WC('Entering_Har_Ki_Dun.JPG'),                                                        // 13
  WC('The_incredible_valley_of_Flowers.jpg'),                                            // 14
  WC('Roopkund_-_The_Mystery_Lake.jpg'),                                                 // 15
  WC('Dunagiri_from_Kuari_Pass.jpg'),                                                    // 16
  WC('Mt._Trishul_and_Mt._Nanda.jpg'),                                                   // 17
  WC('Hampta_pass.jpg'),                                                                 // 18
  WC('Bhrigu_Lake_by_Ahmad_Faiz_Mustafa_%283%29.jpg'),                                  // 19
  WC('Map_Passes_Trails_Kullu_Spiti_Himachal_Jun18_D72_7078.jpg'),                      // 20
  WC('Fields_Zangla_Zanskar_River_Ladakh_Jun24_A7CR_00981.jpg'),                        // 21
  WC('The_View_From_the_Lookout_Point_%2848994220387%29.jpg'),                           // 22
  WC('Tso_Moriri.jpg'),                                                                  // 23
  WC('Kangchenjunga_%28Kanchenjunga%29_from_Singalila_National_Park%2C_Sandakphu.jpg'), // 24
]

// Images keyed by EXACT trek name — only verified Wikimedia files used
const IMAGE_MAP = {
  // ── Nepal · Khumbu / Everest ──────────────────────────────────────────────
  'Everest Base Camp':                    V[0],
  'Gokyo Lakes':                          V[1],
  'Everest Three Passes':                 V[2],
  'EBC via Gokyo & Cho La':              V[3],
  'Everest Panorama (Tengboche)':         V[3],
  'EBC Classic via Jiri':                 V[5],
  'Pikey Peak':                           V[6],
  'Everest View Trek (Namche)':           V[7],
  'Mera Peak Trek (High Camp Route)':     V[8],

  // ── Nepal · Annapurna ────────────────────────────────────────────────────
  'Annapurna Circuit':                    V[4],
  'Annapurna Base Camp':                  V[5],
  'Ghorepani Poon Hill':                  V[9],
  'Mardi Himal':                          V[10],
  'Khopra Ridge (Khopra Danda)':          V[11],
  'Mohare Danda (Community Trek)':        V[0],
  'Jomsom Muktinath':                     V[4],
  'Sikles Trek':                          V[1],
  'Royal Trek':                           V[2],
  'Panchase Trek':                        V[6],

  // ── Nepal · Langtang / Helambu ───────────────────────────────────────────
  'Langtang Valley':                      V[6],
  'Gosaikunda Lake':                      V[7],
  'Helambu Trek':                         V[8],
  'Tamang Heritage Trail':                V[9],
  'Ganja La Pass (Langtang)':             V[10],
  'Panch Pokhari':                        V[11],
  'Chisapani Nagarkot':                   V[3],
  'Ganesh Himal Trek':                    V[5],

  // ── Nepal · Manaslu / Tsum ───────────────────────────────────────────────
  'Manaslu Circuit':                      V[8],
  'Tsum Valley':                          V[0],
  'Rolwaling Valley':                     V[1],

  // ── Nepal · Mustang / Dolpo / Remote West ────────────────────────────────
  'Upper Mustang':                        V[9],
  'Nar Phu Valley':                       V[4],
  'Upper Dolpo':                          V[11],
  'Lower Dolpo':                          V[7],
  'Limi Valley (Humla)':                  V[2],
  'Rara Lake':                            V[11],
  'Api Base Camp':                        V[10],

  // ── Nepal · High Himalaya ────────────────────────────────────────────────
  'Kanchenjunga Base Camp':               V[10],
  'Makalu Base Camp':                     V[0],
  'Dhaulagiri Circuit':                   V[8],

  // ── India · Uttarakhand ──────────────────────────────────────────────────
  'Kedarkantha':                          V[12],
  'Har Ki Dun':                           V[13],
  'Valley of Flowers & Hemkund Sahib':    V[14],
  'Roopkund':                             V[15],
  'Kuari Pass':                           V[16],
  'Brahmatal':                            V[17],
  'Dayara Bugyal':                        V[12],
  'Deoriatal Chandrashila':               V[14],
  'Nag Tibba':                            V[13],
  'Gaumukh Tapovan':                      V[16],
  'Kedartal':                             V[15],
  'Bali Pass':                            V[17],
  'Phulara Ridge':                        V[12],
  'Pindari Glacier':                      V[16],
  'Kafni Glacier':                        V[15],
  'Milam Glacier':                        V[17],
  'Satopanth Tal':                        V[14],
  'Chopta Chandrashila (Tungnath)':       V[13],
  'Gidara Bugyal':                        V[12],
  'Panchachuli Base Camp':                V[17],
  'Adi Kailash & Om Parvat':              V[16],

  // ── India · Himachal Pradesh ─────────────────────────────────────────────
  'Hampta Pass':                          V[18],
  'Bhrigu Lake':                          V[19],
  'Beas Kund':                            V[18],
  'Pin Parvati Pass':                     V[20],
  'Buran Ghati':                          V[19],
  'Rupin Pass':                           V[18],
  'Sar Pass':                             V[20],
  'Indrahar Pass':                        V[19],
  'Triund':                               V[18],
  'Kheerganga':                           V[20],
  'Chanderkhani Pass':                    V[19],
  'Pin Bhaba Pass':                       V[20],
  'Miyar Valley':                         V[18],
  'Prashar Lake':                         V[19],
  'Kinnaur Kailash (Charang La)':         V[20],
  'Bara Bhangal':                         V[18],
  'Kareri Lake':                          V[19],
  'Malana Village Trail':                 V[20],

  // ── India · Ladakh & Kashmir ─────────────────────────────────────────────
  'Chadar Trek (Frozen Zanskar)':         V[21],
  'Markha Valley':                        V[22],
  'Kashmir Great Lakes':                  V[21],
  'Tarsar Marsar':                        V[22],
  'Sham Valley (Baby Trek)':              V[23],
  'Lamayuru to Alchi':                    V[21],
  'Rumtse to Tso Moriri':                 V[23],
  'Kolahoi Base Camp':                    V[22],
  'Warwan Valley':                        V[21],
  'Stok Village to Stok La':              V[22],

  // ── India · Sikkim & Northeast ───────────────────────────────────────────
  'Goecha La':                            V[24],
  'Dzongri Trek':                         V[10],
  'Sandakphu-Phalut (Singalila Ridge)':   V[24],
  'Sandakphu via Gurdum (Short)':         V[24],
  'Green Lake (Zemu Glacier)':            V[10],
  'Dzukou Valley':                        V[14],

  // ── India · South / Western Ghats ────────────────────────────────────────
  'Kudremukh':                            V[16],
  'Kumara Parvatha':                      V[14],
  'Harishchandragad':                     V[17],
  'Rajmachi':                             V[12],
  'Chembra Peak':                         V[15],
};

const FALLBACK = V[2];

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') { inQuotes = false; }
      else { field += ch; }
    } else {
      if (ch === '"') { inQuotes = true; }
      else if (ch === ',') { row.push(field); field = ''; }
      else if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else if (ch === '\r') { /* skip */ }
      else { field += ch; }
    }
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function normalizeDifficulty(raw) {
  const v = (raw || '').toLowerCase().trim();
  if (v === 'easy') return 'Easy';
  if (v.startsWith('easy')) return 'Easy';
  if (v === 'moderate') return 'Moderate';
  if (v === 'moderate-high' || v === 'moderate-difficult') return 'Challenging';
  if (v === 'difficult') return 'Challenging';
  if (v === 'strenuous') return 'Technical';
  return 'Moderate';
}

function normalizeFitness(raw) {
  const v = (raw || '').toLowerCase().trim();
  if (v.startsWith('basic') && v.includes('moderate')) return 2;
  if (v.startsWith('basic')) return 1;
  if (v === 'moderate') return 2;
  if (v === 'moderate-high') return 3;
  if (v.startsWith('high')) return 4;
  if (v.startsWith('very high')) return 5;
  return 3;
}

function parseSeasons(raw) {
  return (raw || '')
    .split(/,\s*/)
    .map((s) => s.trim())
    .filter((s) => ['Spring', 'Summer', 'Autumn', 'Winter'].includes(s));
}

function parsePrice(raw) {
  return parseInt((raw || '0').replace(/[^0-9]/g, ''), 10) || 0;
}

function parseAltitude(raw) {
  return parseInt((raw || '0').replace(/[^0-9]/g, ''), 10) || 0;
}

function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function parseSheetRows(csvText) {
  const rows = parseCsv(csvText);
  if (rows.length < 2) return [];
  // Skip header row (index 0)
  return rows.slice(1).filter((r) => r.length >= 20 && r[1]).map((r, i) => {
    const name = r[1].trim();
    const slug = toSlug(name);
    const difficulty = normalizeDifficulty(r[9]);
    const fitness = normalizeFitness(r[10]);
    const seasons = parseSeasons(r[12]);
    const highlights = (r[25] || '').split(/[,;]/).map((h) => h.trim()).filter(Boolean);

    return {
      slug,
      trekId: r[0].trim(),
      name,
      country: r[2].trim(),
      region: r[3].trim(),
      baseTown: r[4].trim(),
      days: parseInt(r[6], 10) || 0,
      distanceKm: parseInt(r[7], 10) || 0,
      maxAltitudeM: parseAltitude(r[8]),
      difficulty,
      fitness,
      trekType: r[11].trim(),
      seasons,
      bestMonths: r[13].trim(),
      weather: r[14].trim(),
      tempRange: `${r[15].trim()}°C day / ${r[16].trim()}°C night`,
      groupMin: parseInt(r[18], 10) || 1,
      groupMax: parseInt(r[19], 10) || 16,
      priceBudget: parsePrice(r[20]),
      priceUSD: parsePrice(r[21]),
      priceLuxury: parsePrice(r[22]),
      permits: r[23].trim(),
      accommodation: r[24].trim(),
      highlights,
      tagline: highlights[0] || name,
      description: r[14].trim(),
      image: IMAGE_MAP[name] || FALLBACK,
    };
  });
}

export const allSeasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
export const allDifficulties = ['Easy', 'Moderate', 'Challenging', 'Technical'];

export function matchTreks(treks, { duration, difficulty, fitness, season }) {
  return treks
    .map((trek) => {
      let score = 0;
      if (duration) {
        const bucket =
          trek.days <= 6 ? 'short'
          : trek.days <= 10 ? 'medium'
          : trek.days <= 15 ? 'long'
          : 'expedition';
        if (bucket === duration) score += 3;
      }
      if (difficulty && trek.difficulty === difficulty) score += 3;
      if (fitness) {
        const diff = Math.abs(trek.fitness - fitness);
        score += Math.max(0, 3 - diff);
      }
      if (season && trek.seasons.includes(season)) score += 2;
      return { trek, score };
    })
    .sort((a, b) => b.score - a.score)
    .map(({ trek }) => trek);
}
