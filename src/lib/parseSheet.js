const SHEET_ID = '1ySsC6E2fw0I9l8_gOeE1DKAR9hNHRIs9qvgSyrlW0YE';
export const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

// Known trek images keyed by exact Trek Name from the sheet
const IMAGE_MAP = {
  'Everest Base Camp': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Dughla_Pass%2C_Sagarmatha_National_Park%2C_Nepal.jpg/1920px-Dughla_Pass%2C_Sagarmatha_National_Park%2C_Nepal.jpg',
  'Annapurna Circuit': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Muktinath_Valley%2C_View_of_Thorong_La_Pass%2C_Mountains%2C_Nepal.jpg/1920px-Muktinath_Valley%2C_View_of_Thorong_La_Pass%2C_Mountains%2C_Nepal.jpg',
  'Annapurna Base Camp': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Machapucharebasecamp.jpg/1920px-Machapucharebasecamp.jpg',
  'Manaslu Circuit': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Manaslu_Circuit_Trek-_Mountain.jpg/1920px-Manaslu_Circuit_Trek-_Mountain.jpg',
  'Langtang Valley': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Yak_in_Langtang_Valley.jpg/1920px-Yak_in_Langtang_Valley.jpg',
  'Gokyo Lakes': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Gokyo_Lake%2C_Arakamtse%2C_Cholatse%2C_Nepal%2C_Himalayas.jpg/1920px-Gokyo_Lake%2C_Arakamtse%2C_Cholatse%2C_Nepal%2C_Himalayas.jpg',
  'Upper Mustang': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Lomanthang_Upper_Mustang_2023_%2838%29.jpg/1920px-Lomanthang_Upper_Mustang_2023_%2838%29.jpg',
  'Roopkund Trail': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Roopkund_-_The_Mystery_Lake.jpg/1920px-Roopkund_-_The_Mystery_Lake.jpg',
  'Valley of Flowers': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/The_incredible_valley_of_Flowers.jpg/1920px-The_incredible_valley_of_Flowers.jpg',
  'Kedarkantha': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Himalayas_from_Kedarkantha_Summit.jpg/1920px-Himalayas_from_Kedarkantha_Summit.jpg',
  'Hampta Pass': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Hampta_pass.jpg/1920px-Hampta_pass.jpg',
  'Chadar Trek': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Fields_Zangla_Zanskar_River_Ladakh_Jun24_A7CR_00981.jpg/1920px-Fields_Zangla_Zanskar_River_Ladakh_Jun24_A7CR_00981.jpg',
  'Markha Valley': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/The_View_From_the_Lookout_Point_%2848994220387%29.jpg/1920px-The_View_From_the_Lookout_Point_%2848994220387%29.jpg',
  'Goecha La': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/RAVI.WIKI.KANCHENJUNGA.jpg/1920px-RAVI.WIKI.KANCHENJUNGA.jpg',
  'Sandakphu-Phalut': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Kangchenjunga_%28Kanchenjunga%29_from_Singalila_National_Park%2C_Sandakphu.jpg/1920px-Kangchenjunga_%28Kanchenjunga%29_from_Singalila_National_Park%2C_Sandakphu.jpg',
  'Pin Parvati Pass': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Map_Passes_Trails_Kullu_Spiti_Himachal_Jun18_D72_7078.jpg/1920px-Map_Passes_Trails_Kullu_Spiti_Himachal_Jun18_D72_7078.jpg',
  'Brahmatal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Mt._Trishul_and_Mt._Nanda.jpg/1920px-Mt._Trishul_and_Mt._Nanda.jpg',
  'Kuari Pass': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Dunagiri_from_Kuari_Pass.jpg/1920px-Dunagiri_from_Kuari_Pass.jpg',
  'Har Ki Dun': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Entering_Har_Ki_Dun.JPG/1920px-Entering_Har_Ki_Dun.JPG',
  'Bhrigu Lake': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Bhrigu_Lake_by_Ahmad_Faiz_Mustafa_%283%29.jpg/1920px-Bhrigu_Lake_by_Ahmad_Faiz_Mustafa_%283%29.jpg',
};

// Fallback pool for treks without a specific image
const FALLBACK_IMAGES = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Dughla_Pass%2C_Sagarmatha_National_Park%2C_Nepal.jpg/1920px-Dughla_Pass%2C_Sagarmatha_National_Park%2C_Nepal.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Muktinath_Valley%2C_View_of_Thorong_La_Pass%2C_Mountains%2C_Nepal.jpg/1920px-Muktinath_Valley%2C_View_of_Thorong_La_Pass%2C_Mountains%2C_Nepal.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Gokyo_Lake%2C_Arakamtse%2C_Cholatse%2C_Nepal%2C_Himalayas.jpg/1920px-Gokyo_Lake%2C_Arakamtse%2C_Cholatse%2C_Nepal%2C_Himalayas.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Yak_in_Langtang_Valley.jpg/1920px-Yak_in_Langtang_Valley.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/RAVI.WIKI.KANCHENJUNGA.jpg/1920px-RAVI.WIKI.KANCHENJUNGA.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/The_incredible_valley_of_Flowers.jpg/1920px-The_incredible_valley_of_Flowers.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Lomanthang_Upper_Mustang_2023_%2838%29.jpg/1920px-Lomanthang_Upper_Mustang_2023_%2838%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Fields_Zangla_Zanskar_River_Ladakh_Jun24_A7CR_00981.jpg/1920px-Fields_Zangla_Zanskar_River_Ladakh_Jun24_A7CR_00981.jpg',
];

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
      image: IMAGE_MAP[name] || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length],
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
