// Automated Asset Pipeline for Pokémon TCG Pocket (TCGP)
// Card Images Engine: TCGdex API & Cloud CDN (https://assets.tcgdex.net)
// Type Icons Engine: PokeAPI / duiker101 SVG Type Icons via jsDelivr CDN

export const TYPE_ICONS = {
  Grass: 'https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons@master/icons/grass.svg',
  Fire: 'https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons@master/icons/fire.svg',
  Water: 'https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons@master/icons/water.svg',
  Lightning: 'https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons@master/icons/electric.svg',
  Electric: 'https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons@master/icons/electric.svg',
  Psychic: 'https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons@master/icons/psychic.svg',
  Fighting: 'https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons@master/icons/fighting.svg',
  Darkness: 'https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons@master/icons/dark.svg',
  Metal: 'https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons@master/icons/steel.svg',
  Dragon: 'https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons@master/icons/dragon.svg',
  Colorless: 'https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons@master/icons/normal.svg',
  Trainer: 'https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons@master/icons/normal.svg'
};

/**
 * Constructs official TCGdex Cloud CDN Card Image URL.
 * Format: https://assets.tcgdex.net/{language}/{series}/{set}/{localId}/{quality}.{extension}
 *
 * @param {Object} card
 * @param {string} quality - 'low' (grid/checklist) or 'high' (modal/detail view)
 * @param {string} extension - 'webp', 'png', or 'jpg'
 * @returns {string} Fully qualified image URL
 */
export function getCardImageUrl(card, quality = 'low', extension = 'webp') {
  if (!card) return '';

  const series = 'tcgp';
  const setId = card.setId || 'A1';
  const localId = card.localId || String(card.id).padStart(3, '0');

  return `https://assets.tcgdex.net/en/${series}/${setId}/${localId}/${quality}.${extension}`;
}
