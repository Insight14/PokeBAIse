/**
 * AI Deck Rater — PokeBaise
 * Sends a structured deck description to the Gemini API and returns
 * a parsed rating + strategic breakdown.
 *
 * API: Google Gemini 2.0 Flash (https://generativelanguage.googleapis.com)
 * Key: stored in VITE_GEMINI_API_KEY environment variable
 */

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Builds a structured prompt describing the deck to the AI.
 * @param {Array} deckCards - Array of card objects in the deck
 * @param {string} deckName - Name of the deck
 */
function buildDeckPrompt(deckCards, deckName) {
  const cardSummary = deckCards
    .map(card => {
      const parts = [
        `- ${card.name} (${card.type}, ${card.stage}, ${card.rarity})`,
      ];
      if (card.hp) parts.push(`HP: ${card.hp}`);
      if (card.attack && card.attack !== '–') parts.push(`Attack: ${card.attack}`);
      if (card.description) parts.push(`Ability/Effect: ${card.description}`);
      return parts.join(' | ');
    })
    .join('\n');

  const typeBreakdown = deckCards.reduce((acc, c) => {
    acc[c.type] = (acc[c.type] || 0) + 1;
    return acc;
  }, {});
  const typeStr = Object.entries(typeBreakdown)
    .map(([t, n]) => `${t}: ${n}`)
    .join(', ');

  return `You are an expert Pokémon TCG Pocket (TCGP) competitive analyst. Analyze the following 20-card TCGP deck and provide a detailed strategic evaluation.

DECK NAME: "${deckName}"
TOTAL CARDS: ${deckCards.length}
TYPE BREAKDOWN: ${typeStr}

DECK LIST:
${cardSummary}

Please respond with a JSON object (no markdown, just raw JSON) in EXACTLY this structure:
{
  "overallGrade": "A+|A|A-|B+|B|B-|C+|C|C-|D|F",
  "overallScore": <number 0-100>,
  "summary": "<2-3 sentence executive summary of the deck's identity and potential>",
  "winCondition": "<How this deck wins games>",
  "consistencyRating": <number 0-10>,
  "aggressionRating": <number 0-10>,
  "synergies": ["<synergy 1>", "<synergy 2>", "<synergy 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>"],
  "missingCards": ["<card name that would improve this deck>", "<another card>"],
  "improvements": [
    {"type": "replace", "remove": "<card name>", "add": "<card name>", "reason": "<why>"},
    {"type": "adjust", "card": "<card name>", "action": "<increase/decrease copies>", "reason": "<why>"}
  ],
  "verdict": "<One punchy sentence verdict — is it tournament-ready, fun casual, or needs work?>"
}`;
}

/**
 * Rate a deck using the Gemini API.
 * @param {Array} deckCards - Array of card objects in the deck
 * @param {string} deckName - Name of the deck
 * @returns {Promise<Object>} Parsed rating object
 */
export async function rateDeckWithAI(deckCards, deckName = 'My Custom Deck') {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('NO_API_KEY');
  }

  if (deckCards.length === 0) {
    throw new Error('EMPTY_DECK');
  }

  const prompt = buildDeckPrompt(deckCards, deckName);

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1500,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  try {
    // Gemini with responseMimeType=application/json should return clean JSON
    return JSON.parse(rawText);
  } catch {
    // Fallback: strip markdown code fences if present
    const cleaned = rawText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    return JSON.parse(cleaned);
  }
}
