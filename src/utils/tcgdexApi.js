/**
 * TCGdex API Client — Pokémon TCG Pocket
 * Fetches the complete card catalog dynamically from the TCGdex REST API.
 * API Base: https://api.tcgdex.net/v2/en
 * Sets covered: A1–A4a, B1–B2a, P-A (Promos-A)
 */

const API_BASE = 'https://api.tcgdex.net/v2/en';

// All released TCGP set IDs (order matches release sequence for sorting)
const TCGP_SET_IDS = [
  'A1', 'A1a',
  'A2', 'A2a', 'A2b',
  'A3', 'A3a', 'A3b',
  'A4', 'A4a',
  'B1', 'B1a',
  'B2', 'B2a',
  'P-A',
];

// Map TCGdex category/type strings to our internal type strings
const TYPE_MAP = {
  Grass: 'Grass',
  Fire: 'Fire',
  Water: 'Water',
  Lightning: 'Electric',
  Electric: 'Electric',
  Psychic: 'Psychic',
  Fighting: 'Fighting',
  Darkness: 'Darkness',
  Dark: 'Darkness',
  Metal: 'Metal',
  Dragon: 'Dragon',
  Colorless: 'Colorless',
  Normal: 'Colorless',
  Trainer: 'Trainer',
  Item: 'Trainer',
  Supporter: 'Trainer',
  Stadium: 'Trainer',
};

// Map TCGdex rarity strings to our rarity strings & crafting costs
const RARITY_MAP = {
  '◆': { label: '1-Diamond', cost: 35 },
  '◆◆': { label: '2-Diamond', cost: 70 },
  '◆◆◆': { label: '3-Diamond', cost: 150 },
  '◆◆◆◆': { label: '4-Diamond ex', cost: 500 },
  '★': { label: '1-Star', cost: 400 },
  '★★': { label: '2-Star', cost: 1250 },
  '★★★': { label: '3-Star', cost: 1500 },
  '☆': { label: '1-Star', cost: 400 },
  '☆☆': { label: '2-Star', cost: 1250 },
  '☆☆☆': { label: '3-Star', cost: 1500 },
  '👑': { label: 'Crown', cost: 2500 },
  Crown: { label: 'Crown', cost: 2500 },
  'Promo': { label: 'Promo', cost: 0 },
};

function mapRarity(rarityStr) {
  if (!rarityStr) return { label: '1-Diamond', cost: 35 };
  const match = RARITY_MAP[rarityStr.trim()];
  if (match) return match;
  // Fuzzy fallback: count diamond symbols
  if (rarityStr.includes('◆◆◆◆') || rarityStr.toLowerCase().includes('ex')) return RARITY_MAP['◆◆◆◆'];
  if (rarityStr.includes('◆◆◆')) return RARITY_MAP['◆◆◆'];
  if (rarityStr.includes('◆◆')) return RARITY_MAP['◆◆'];
  if (rarityStr.includes('◆')) return RARITY_MAP['◆'];
  if (rarityStr.includes('★★★') || rarityStr.includes('☆☆☆')) return RARITY_MAP['★★★'];
  if (rarityStr.includes('★★') || rarityStr.includes('☆☆')) return RARITY_MAP['★★'];
  if (rarityStr.includes('★') || rarityStr.includes('☆')) return RARITY_MAP['★'];
  if (rarityStr.toLowerCase().includes('crown')) return RARITY_MAP['Crown'];
  return { label: '1-Diamond', cost: 35 };
}

function mapType(card) {
  // Trainers
  if (card.category === 'Trainer' || card.trainerType) return 'Trainer';
  // Energy
  if (card.category === 'Energy') return 'Colorless';
  // Pokémon: use types array
  const rawType = card.types?.[0] || card.type || 'Colorless';
  return TYPE_MAP[rawType] || 'Colorless';
}

function mapStage(card) {
  if (card.category === 'Trainer') return card.trainerType || 'Trainer';
  if (card.category === 'Energy') return 'Energy';
  return card.stage || 'Basic';
}

/**
 * Normalize a TCGdex card object into our internal card schema.
 * Uses a composite numeric ID: setIndex * 10000 + localId_number
 */
function normalizeCard(raw, setId, setIndex) {
  const localIdNum = parseInt(raw.localId, 10);
  if (isNaN(localIdNum)) return null; // skip promo cards with non-numeric local IDs

  const numericId = setIndex * 10000 + localIdNum;
  const { label: rarity, cost: craftingCost } = mapRarity(raw.rarity);
  const type = mapType(raw);
  const stage = mapStage(raw);

  return {
    id: numericId,
    setId,
    localId: raw.localId.padStart(3, '0'),
    name: raw.name,
    type,
    stage,
    rarity,
    craftingCost,
    hp: raw.hp || 0,
    attack: raw.attacks?.[0]
      ? `${raw.attacks[0].name} (${raw.attacks[0].damage || '–'})`
      : raw.abilities?.[0]?.name || '–',
    isCoreMetaPiece: false,
    description: raw.description || raw.effect || '',
    artBg: 'linear-gradient(135deg, #1a2030 0%, #0b0f17 100%)',
    artEmoji: '',
    // extra details preserved for future use
    _raw: raw,
  };
}

/**
 * Fetch all cards from all TCGP sets and return a flat, normalized array.
 * Results are cached in memory for the session.
 */
let _cardCache = null;

export async function fetchAllTcgpCards() {
  if (_cardCache) return _cardCache;

  const results = [];
  const errors = [];

  await Promise.allSettled(
    TCGP_SET_IDS.map(async (setId, setIndex) => {
      try {
        const res = await fetch(`${API_BASE}/sets/${setId}`);
        if (!res.ok) return;

        const data = await res.json();
        const cards = data.cards || [];

        cards.forEach(raw => {
          const normalized = normalizeCard(raw, setId, setIndex + 1);
          if (normalized) results.push(normalized);
        });
      } catch (err) {
        errors.push({ setId, err });
      }
    })
  );

  if (errors.length) {
    console.warn('[TCGdex] Some sets failed to load:', errors.map(e => e.setId).join(', '));
  }

  // Sort by setId order then localId number
  results.sort((a, b) => {
    if (a.setId !== b.setId) return TCGP_SET_IDS.indexOf(a.setId) - TCGP_SET_IDS.indexOf(b.setId);
    return parseInt(a.localId) - parseInt(b.localId);
  });

  _cardCache = results;
  return results;
}

/** Clear the in-memory cache (useful for testing). */
export function clearTcgdexCache() {
  _cardCache = null;
}
