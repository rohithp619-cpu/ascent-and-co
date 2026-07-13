const SHEET_ID = '1ySsC6E2fw0I9l8_gOeE1DKAR9hNHRIs9qvgSyrlW0YE';
export const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

// Wikimedia Commons Special:FilePath — no hash prefix needed, resolves to actual file
const WC = (f) => `https://commons.wikimedia.org/wiki/Special:FilePath/${f}?width=1200`

// Images keyed by EXACT trek name from the Google Sheet — one unique image per trek
const IMAGE_MAP = {
  // ── Nepal · Khumbu / Everest ──────────────────────────────────────────────
  'Everest Base Camp':
    WC('Kala_patthar_view_of_everest.jpg'),
  'Gokyo Lakes':
    WC('Gokyo_Lake%2C_Arakamtse%2C_Cholatse%2C_Nepal%2C_Himalayas.jpg'),
  'Everest Three Passes':
    WC('Cho_La_Pass_in_2009.jpg'),
  'EBC via Gokyo & Cho La':
    WC('Ngozumpa_Glacier_from_Gokyo_Ri.jpg'),
  'Everest Panorama (Tengboche)':
    WC('Tengboche_monastery_with_Ama_Dablam_%28cropped%29.jpg'),
  'EBC Classic via Jiri':
    WC('Jiri_Bazar.jpg'),
  'Pikey Peak':
    WC('Pikey_Peak_Solu_Khumbu_Nepal.jpg'),
  'Everest View Trek (Namche)':
    WC('Namche_Bazaar.jpg'),
  'Mera Peak Trek (High Camp Route)':
    WC('Mera_Peak_from_Khare.jpg'),

  // ── Nepal · Annapurna ────────────────────────────────────────────────────
  'Annapurna Circuit':
    WC('Muktinath_Valley%2C_View_of_Thorong_La_Pass%2C_Mountains%2C_Nepal.jpg'),
  'Annapurna Base Camp':
    WC('Machapucharebasecamp.jpg'),
  'Ghorepani Poon Hill':
    WC('Poon_Hill_Sunrise_Annapurna.jpg'),
  'Mardi Himal':
    WC('Mardi_Himal_Base_Camp_Trek.jpg'),
  'Khopra Ridge (Khopra Danda)':
    WC('Annapurna_South_and_Hiunchuli.jpg'),
  'Mohare Danda (Community Trek)':
    WC('Mohare_Danda_Trek_Nepal.jpg'),
  'Jomsom Muktinath':
    WC('Jomsom_Nepal.jpg'),
  'Sikles Trek':
    WC('Annapurna_II_from_Sikles_Village.jpg'),
  'Royal Trek':
    WC('Begnas_Lake_Pokhara.jpg'),
  'Panchase Trek':
    WC('Panchase_Annapurna_View.jpg'),

  // ── Nepal · Langtang / Helambu ───────────────────────────────────────────
  'Langtang Valley':
    WC('Yak_in_Langtang_Valley.jpg'),
  'Gosaikunda Lake':
    WC('Gosaikunda.jpg'),
  'Helambu Trek':
    WC('Helambu_valley_nepal.jpg'),
  'Tamang Heritage Trail':
    WC('Tamang_Heritage_Trail_Nepal.jpg'),
  'Ganja La Pass (Langtang)':
    WC('Langtang_Lirung_from_Kyanjin_Ri.jpg'),
  'Panch Pokhari':
    WC('Panch_Pokhari_Sindhupalchok.jpg'),
  'Chisapani Nagarkot':
    WC('Nagarkot_Sunrise_Himalayas.jpg'),
  'Ganesh Himal Trek':
    WC('Ganesh_Himal_Nepal.jpg'),

  // ── Nepal · Manaslu / Tsum ───────────────────────────────────────────────
  'Manaslu Circuit':
    WC('Manaslu_Circuit_Trek-_Mountain.jpg'),
  'Tsum Valley':
    WC('Tsum_Valley_Nepal.jpg'),
  'Rolwaling Valley':
    WC('Rolwaling_Valley_Nepal.jpg'),

  // ── Nepal · Mustang / Dolpo / Remote West ────────────────────────────────
  'Upper Mustang':
    WC('Lomanthang_Upper_Mustang_2023_%2838%29.jpg'),
  'Nar Phu Valley':
    WC('Nar_village_Nepal.jpg'),
  'Upper Dolpo':
    WC('Phoksundo_Lake_Nepal.jpg'),
  'Lower Dolpo':
    WC('Dolpo_landscape_Nepal.jpg'),
  'Limi Valley (Humla)':
    WC('Limi_valley_humla.jpg'),
  'Rara Lake':
    WC('Rara_Lake_Nepal.jpg'),
  'Api Base Camp':
    WC('Api_Saipal_Nepal.jpg'),

  // ── Nepal · High Himalaya ────────────────────────────────────────────────
  'Kanchenjunga Base Camp':
    WC('RAVI.WIKI.KANCHENJUNGA.jpg'),
  'Makalu Base Camp':
    WC('Makalu_from_Khongma_La.jpg'),
  'Dhaulagiri Circuit':
    WC('Dhaulagiri_from_Thorong_La.jpg'),

  // ── India · Uttarakhand ──────────────────────────────────────────────────
  'Kedarkantha':
    WC('Himalayas_from_Kedarkantha_Summit.jpg'),
  'Har Ki Dun':
    WC('Entering_Har_Ki_Dun.JPG'),
  'Valley of Flowers & Hemkund Sahib':
    WC('The_incredible_valley_of_Flowers.jpg'),
  'Roopkund':
    WC('Roopkund_-_The_Mystery_Lake.jpg'),
  'Kuari Pass':
    WC('Dunagiri_from_Kuari_Pass.jpg'),
  'Brahmatal':
    WC('Brahmatal_Lake_Uttarakhand.jpg'),
  'Dayara Bugyal':
    WC('Dayara_Bugyal_Uttarakhand.jpg'),
  'Deoriatal Chandrashila':
    WC('Deoriatal_lake_Uttarakhand.jpg'),
  'Nag Tibba':
    WC('Nag_Tibba_Summit_Uttarakhand.jpg'),
  'Gaumukh Tapovan':
    WC('Gaumukh_Glacier_Gangotri.jpg'),
  'Kedartal':
    WC('Kedartal_Lake_Uttarakhand.jpg'),
  'Bali Pass':
    WC('Bali_pass_trek_uttarkashi.jpg'),
  'Phulara Ridge':
    WC('Phulara_Ridge_Trek_Uttarakhand.jpg'),
  'Pindari Glacier':
    WC('Pindari_Glacier_Uttarakhand.jpg'),
  'Kafni Glacier':
    WC('Kafni_Glacier_Kumaon.jpg'),
  'Milam Glacier':
    WC('Milam_Glacier_Munsiyari.jpg'),
  'Satopanth Tal':
    WC('Satopanth_Lake_Uttarakhand.jpg'),
  'Chopta Chandrashila (Tungnath)':
    WC('Tungnath_Chandrashila_Chopta.jpg'),
  'Gidara Bugyal':
    WC('Gidara_Bugyal_Uttarakhand.jpg'),
  'Panchachuli Base Camp':
    WC('Panchachuli_peaks_Munsiyari.jpg'),
  'Adi Kailash & Om Parvat':
    WC('Om_Parvat_Pithoragarh.jpg'),

  // ── India · Himachal Pradesh ─────────────────────────────────────────────
  'Hampta Pass':
    WC('Hampta_pass.jpg'),
  'Bhrigu Lake':
    WC('Bhrigu_Lake_by_Ahmad_Faiz_Mustafa_%283%29.jpg'),
  'Beas Kund':
    WC('Beas_Kund_Manali.jpg'),
  'Pin Parvati Pass':
    WC('Pin_Parvati_Pass_Kullu.jpg'),
  'Buran Ghati':
    WC('Buran_Ghati_Pass_Himachal.jpg'),
  'Rupin Pass':
    WC('Rupin_Pass_Uttarakhand.jpg'),
  'Sar Pass':
    WC('Sar_Pass_Trek_Himachal.jpg'),
  'Indrahar Pass':
    WC('Indrahar_Pass_Dhauladhar.jpg'),
  'Triund':
    WC('Triund_Dharamshala_Himachal.jpg'),
  'Kheerganga':
    WC('Kheerganga_Parvati_Valley.jpg'),
  'Chanderkhani Pass':
    WC('Chanderkhani_Pass_Kullu.jpg'),
  'Pin Bhaba Pass':
    WC('Pin_Bhaba_Pass_Himachal.jpg'),
  'Miyar Valley':
    WC('Miyar_Valley_Lahaul.jpg'),
  'Prashar Lake':
    WC('Prashar_Lake_Mandi.jpg'),
  'Kinnaur Kailash (Charang La)':
    WC('Kinnaur_Kailash_Peak.jpg'),
  'Bara Bhangal':
    WC('Bara_Bhangal_Kangra.jpg'),
  'Kareri Lake':
    WC('Kareri_Lake_Dhauladhar.jpg'),
  'Malana Village Trail':
    WC('Malana_Village_Kullu.jpg'),

  // ── India · Ladakh & Kashmir ─────────────────────────────────────────────
  'Chadar Trek (Frozen Zanskar)':
    WC('Fields_Zangla_Zanskar_River_Ladakh_Jun24_A7CR_00981.jpg'),
  'Markha Valley':
    WC('The_View_From_the_Lookout_Point_%2848994220387%29.jpg'),
  'Kashmir Great Lakes':
    WC('Kashmir_Great_Lakes_Trek.jpg'),
  'Tarsar Marsar':
    WC('Tarsar_Lake_Kashmir.jpg'),
  'Sham Valley (Baby Trek)':
    WC('Sham_valley_ladakh.jpg'),
  'Lamayuru to Alchi':
    WC('Lamayuru_Monastery_Ladakh.jpg'),
  'Rumtse to Tso Moriri':
    WC('Tso_Moriri_Lake_Ladakh.jpg'),
  'Kolahoi Base Camp':
    WC('Kolahoi_Glacier_Kashmir.jpg'),
  'Warwan Valley':
    WC('Warwan_Valley_Kashmir.jpg'),
  'Stok Village to Stok La':
    WC('Stok_Kangri_Ladakh.jpg'),

  // ── India · Sikkim & Northeast ───────────────────────────────────────────
  'Goecha La':
    WC('Goechala_Sikkim.jpg'),
  'Dzongri Trek':
    WC('Dzongri_Sikkim.jpg'),
  'Sandakphu-Phalut (Singalila Ridge)':
    WC('Kangchenjunga_%28Kanchenjunga%29_from_Singalila_National_Park%2C_Sandakphu.jpg'),
  'Sandakphu via Gurdum (Short)':
    WC('Everest_from_Sandakphu.jpg'),
  'Green Lake (Zemu Glacier)':
    WC('Zemu_Glacier_Sikkim.jpg'),
  'Dzukou Valley':
    WC('Dzukou_Valley_Nagaland.jpg'),

  // ── India · South / Western Ghats ────────────────────────────────────────
  'Kudremukh':
    WC('Kudremukh_peak_Karnataka.jpg'),
  'Kumara Parvatha':
    WC('Kumara_Parvatha_trek_Karnataka.jpg'),
  'Harishchandragad':
    WC('Harishchandragad_fort_Maharashtra.jpg'),
  'Rajmachi':
    WC('Rajmachi_Fort_Maharashtra.jpg'),
  'Chembra Peak':
    WC('Chembra_Peak_Wayanad.jpg'),
};

const FALLBACK = WC('Dughla_Pass%2C_Sagarmatha_National_Park%2C_Nepal.jpg');

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
