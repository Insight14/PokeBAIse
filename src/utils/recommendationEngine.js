// Smart Recommendation Engine for Pokémon TCG Pocket
import { CARDS_BY_ID, CARD_SUBSTITUTIONS } from '../data/pokemonData.js';

/**
 * Calculates deck recommendations based on user inventory.
 * 
 * @param {Object} userInventory - Map of card_id -> quantity_owned (0, 1, or 2)
 * @param {Array} metaDecks - List of meta deck archetypes
 * @returns {Array} List of DeckRecommendation objects sorted by completion % and craft cost
 */
export function generateDeckRecommendations(userInventory = {}, metaDecks = []) {
  const recommendations = [];

  for (const deck of metaDecks) {
    const list = deck.deck_list;
    let ownedCount = 0;
    let totalRequired = 0;
    let totalPointsToCraft = 0;
    const missingCards = [];
    const ownedCards = [];

    for (const item of list) {
      totalRequired += item.qty;
      const ownedQty = userInventory[item.card_id] || 0;
      
      // Calculate how many of this specific card are actually useful for this deck
      const effectiveOwned = Math.min(ownedQty, item.qty);
      ownedCount += effectiveOwned;

      const cardDetails = CARDS_BY_ID[item.card_id] || {
        name: `Card #${item.card_id}`,
        craftingCost: 35,
        rarity: '1-Diamond'
      };

      if (effectiveOwned > 0) {
        ownedCards.push({
          card_id: item.card_id,
          qtyOwned: effectiveOwned,
          qtyRequired: item.qty,
          cardDetails
        });
      }

      // Handle deficit calculation
      if (effectiveOwned < item.qty) {
        const qtyMissing = item.qty - effectiveOwned;
        const craftingCost = cardDetails.craftingCost || 35;
        
        // Find potential substitutions from database
        const substitutions = CARD_SUBSTITUTIONS.filter(
          s => s.missing_card_id === item.card_id
        ).map(sub => {
          const replacementCard = CARDS_BY_ID[sub.replacement_card_id];
          const replacementOwned = userInventory[sub.replacement_card_id] || 0;
          return {
            ...sub,
            replacementCard,
            isOwned: replacementOwned > 0,
            replacementOwnedQty: replacementOwned
          };
        });

        missingCards.push({
          card_id: item.card_id,
          qtyMissing,
          costToCraft: craftingCost,
          totalCostForCard: craftingCost * qtyMissing,
          cardDetails,
          substitutions
        });
        
        totalPointsToCraft += (craftingCost * qtyMissing);
      }
    }

    const completionPercentage = Math.round((ownedCount / totalRequired) * 100);

    recommendations.push({
      deckId: deck.id,
      deckName: deck.deck_name,
      tier: deck.tier,
      energyType: deck.energyType,
      description: deck.description,
      ownedCount,
      totalRequired,
      completionPercentage,
      missingCards,
      ownedCards,
      totalPointsToCraft,
      isFullyCraftable: totalPointsToCraft === 0
    });
  }

  // Sort primarily by Completion %, secondarily by lowest Point Crafting cost
  return recommendations.sort((a, b) => {
    if (b.completionPercentage !== a.completionPercentage) {
      return b.completionPercentage - a.completionPercentage;
    }
    return a.totalPointsToCraft - b.totalPointsToCraft;
  });
}
