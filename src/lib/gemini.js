const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-flash-lite-latest'
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse&key=${API_KEY}`

// How many past turns to send (1 turn = 1 user + 1 assistant message)
const MAX_HISTORY_TURNS = 3

// ─── Catalogue builders ───────────────────────────────────────────────────────

// Ultra-compact: only fields needed for recommendations (~50 chars/row × 99 = ~1,200 tokens)
function compactRow(t) {
  const seasons = t.seasons.map((s) => s[0]).join('') // S/U/A/W initials
  return `${t.name}|${t.country[0]}|${t.region.split('/')[0].trim()}|${t.days}d|${t.maxAltitudeM}m|${t.difficulty[0]}|${t.fitness}|${seasons}|$${t.priceUSD}`
}

function buildCatalogue(treks) {
  const header = '# name|country(N=Nepal I=India)|region|days|maxAlt|diff(E/M/C/T)|fitness(1-5)|seasons(S/U/A/W initials)|stdPrice'
  return `${header}\n${treks.map(compactRow).join('\n')}`
}

// For Trek Advisor: full focus detail + only similar treks for comparison (no full 99-trek dump)
function buildFocusBlock(trek, allTreks) {
  const similar = allTreks
    .filter((t) => t.slug !== trek.slug && (t.country === trek.country || t.region === trek.region))
    .slice(0, 8)
    .map(compactRow)

  return `## Active Trek
${trek.name} | ${trek.country} | ${trek.region} | ${trek.days} days | ${trek.maxAltitudeM}m max altitude
Difficulty: ${trek.difficulty} | Fitness: ${trek.fitness}/5 | Type: ${trek.trekType}
Seasons: ${trek.seasons.join(', ')} | Best months: ${trek.bestMonths}
Weather: ${trek.weather} | Temp: ${trek.tempRange}
Prices: $${trek.priceBudget} budget / $${trek.priceUSD} standard / $${trek.priceLuxury} luxury
Stay: ${trek.accommodation} | Permits: ${trek.permits}
Highlights: ${trek.highlights?.join('; ')}

## Similar treks for comparison
# name|country|region|days|maxAlt|diff|fitness|seasons|stdPrice
${similar.join('\n')}`
}

function buildSystemPrompt(treks, focusTrek = null) {
  const catalogue = focusTrek
    ? buildFocusBlock(focusTrek, treks)
    : buildCatalogue(treks)

  return `You are Basecamp AI, a Himalayan trek advisor for Ascent & Co. Be warm, concise, and factual. Use metric units.

${catalogue}

## Response format
Always structure replies with emojis as visual anchors. Use this emoji guide:
⛰️ altitude/mountains · 🗓️ duration/dates · 💰 price/budget · 🥾 difficulty/fitness
🌡️ weather/temperature · 🎒 gear/packing · 🏕️ accommodation · 📍 location
✅ highlights/pros · ⚠️ warnings · 🌸 Spring · ☀️ Summer · 🍂 Autumn · ❄️ Winter
🇮🇳 India · 🇳🇵 Nepal · 🏆 top pick · 🔰 beginner-friendly · 🧗 technical

Format rules:
- Start with a one-line direct answer, then structure detail below it
- Use ## for section headers (e.g. ## ⛰️ At a Glance)
- Use bullet lists with a leading emoji per item
- **Bold** trek names always
- End with a 💡 tip or 📞 next step where relevant
- Max 400 tokens. Never invent data.`
}

// ─── Main streaming function ──────────────────────────────────────────────────

/**
 * @param {Array}  history   Full conversation [{role, content}] — trimmed internally
 * @param {string} userText  New user message
 * @param {Array}  treks     Live catalogue
 * @param {object} focusTrek Optional trek context
 * @yields {string} Text deltas
 */
export async function* streamChat(history, userText, treks, focusTrek = null) {
  if (!API_KEY) throw new Error('VITE_GEMINI_API_KEY is not set in .env')
  if (treks.length === 0) throw new Error('Trek catalogue is still loading — try again in a moment.')

  // Keep only last N turns to cap token cost on long conversations
  const trimmed = history.slice(-(MAX_HISTORY_TURNS * 2))

  const contents = [
    ...trimmed.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    { role: 'user', parts: [{ text: userText }] },
  ]

  const body = {
    system_instruction: { parts: [{ text: buildSystemPrompt(treks, focusTrek) }] },
    contents,
    generationConfig: { maxOutputTokens: 400 },
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try { const e = await res.json(); msg = e.error?.message || msg } catch { /* */ }
    throw new Error(msg)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const raw = line.slice(6).trim()
      if (!raw || raw === '[DONE]') continue
      try {
        const json = JSON.parse(raw)
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) yield text
      } catch { /* skip malformed chunk */ }
    }
  }
}
