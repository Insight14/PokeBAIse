import React, { createContext, useContext, useState, useEffect } from 'react';
import { CARDS, META_DECKS } from '../data/pokemonData.js';
import { fetchAllTcgpCards } from '../utils/tcgdexApi.js';

const STORAGE_KEY = 'pocketdeck_user_inventory_v1';

// Starter presets for quick testing
export const PRESETS = {
  EMPTY: 'Empty Collection',
  STARTER_PIKACHU: 'Electric Aggro Starter (75%)',
  STARTER_MEWTWO: 'Psychic Control Starter (80%)',
  META_CHASER: 'Meta Core Collection (90%)',
  COMPLETE: 'Full Master Set (100%)'
};

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const [userInventory, setUserInventory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load user inventory from localStorage', e);
    }
    // Default starter kit so first time experience is engaging!
    return createPresetInventory(PRESETS.STARTER_PIKACHU);
  });

  const [activeTab, setActiveTab] = useState('recommendations');
  const [selectedDeckId, setSelectedDeckId] = useState(null);

  // Full live card catalog fetched from TCGdex API
  const [fullCatalog, setFullCatalog] = useState(CARDS); // seed with static cards immediately
  const [catalogLoading, setCatalogLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setCatalogLoading(true);
    fetchAllTcgpCards()
      .then(apiCards => {
        if (cancelled) return;
        if (apiCards && apiCards.length > 0) {
          // Merge: API cards take precedence; keep static cards that the API may not cover
          // (e.g. hand-curated meta cards that have detailed descriptions / isCoreMetaPiece flags).
          // We index by setId+localId to deduplicate.
          const apiIndex = new Map(apiCards.map(c => [`${c.setId}:${c.localId}`, c]));
          const staticOnly = CARDS.filter(c => !apiIndex.has(`${c.setId}:${c.localId}`));
          // For static cards that exist in the API, enrich them with API image metadata
          const enriched = CARDS.map(sc => {
            const apiCard = apiIndex.get(`${sc.setId}:${sc.localId}`);
            return apiCard ? { ...apiCard, ...sc, id: sc.id } : sc;
          });
          const enrichedKeys = new Set(enriched.map(c => `${c.setId}:${c.localId}`));
          const newCards = apiCards.filter(c => !enrichedKeys.has(`${c.setId}:${c.localId}`));
          setFullCatalog([...enriched, ...newCards]);
        }
      })
      .catch(err => {
        console.warn('[PokeBaise] TCGdex catalog fetch failed, using static seed.', err);
      })
      .finally(() => {
        if (!cancelled) setCatalogLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userInventory));
    } catch (e) {
      console.error('Failed to save user inventory to localStorage', e);
    }
  }, [userInventory]);

  function cycleQuantity(cardId) {
    setUserInventory(prev => {
      const current = prev[cardId] || 0;
      const next = (current + 1) % 3; // 0 -> 1 -> 2 -> 0
      return {
        ...prev,
        [cardId]: next
      };
    });
  }

  function setQuantity(cardId, qty) {
    const validQty = Math.max(0, Math.min(2, parseInt(qty, 10) || 0));
    setUserInventory(prev => ({
      ...prev,
      [cardId]: validQty
    }));
  }

  function applyPreset(presetType) {
    const newInventory = createPresetInventory(presetType);
    setUserInventory(newInventory);
  }

  function clearInventory() {
    setUserInventory({});
  }

  function setAllToTwo() {
    const full = {};
    fullCatalog.forEach(c => {
      full[c.id] = 2;
    });
    setUserInventory(full);
  }

  function importInventoryJson(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (typeof parsed === 'object' && parsed !== null) {
        // Sanitize
        const sanitized = {};
        Object.keys(parsed).forEach(key => {
          const id = Number(key);
          const qty = Number(parsed[key]);
          if (!isNaN(id) && qty >= 0 && qty <= 2) {
            sanitized[id] = Math.min(2, Math.max(0, qty));
          }
        });
        setUserInventory(sanitized);
        return { success: true, count: Object.keys(sanitized).length };
      }
      return { success: false, error: 'Invalid JSON format' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  function exportInventoryJson() {
    return JSON.stringify(userInventory, null, 2);
  }

  // Calculate high-level stats
  const totalCardsOwned = Object.values(userInventory).reduce((a, b) => a + b, 0);
  const totalUniqueCardsOwned = Object.keys(userInventory).filter(k => userInventory[k] > 0).length;
  const catalogSize = fullCatalog.length;
  const maxPossibleCards = catalogSize * 2;
  const catalogCompletionPercentage = Math.round((totalCardsOwned / maxPossibleCards) * 100);

  return (
    <InventoryContext.Provider value={{
      userInventory,
      cycleQuantity,
      setQuantity,
      applyPreset,
      clearInventory,
      setAllToTwo,
      importInventoryJson,
      exportInventoryJson,
      activeTab,
      setActiveTab,
      selectedDeckId,
      setSelectedDeckId,
      fullCatalog,
      catalogLoading,
      stats: {
        totalCardsOwned,
        totalUniqueCardsOwned,
        catalogSize,
        maxPossibleCards,
        catalogCompletionPercentage
      }
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}

// Helper to generate realistic starter inventories
function createPresetInventory(presetType) {
  const inv = {};

  if (presetType === PRESETS.EMPTY) {
    return inv;
  }

  if (presetType === PRESETS.COMPLETE) {
    CARDS.forEach(c => {
      inv[c.id] = 2;
    });
    return inv;
  }

  if (presetType === PRESETS.STARTER_PIKACHU) {
    // 75% owned Pikachu Aggro deck
    const pikachuDeck = META_DECKS.find(d => d.id === 1);
    if (pikachuDeck) {
      pikachuDeck.deck_list.forEach(item => {
        // Own 2 of basic/trainers, 1 Zapdos ex, 1 Pikachu ex
        if (item.card_id === 101 || item.card_id === 102) {
          inv[item.card_id] = 1;
        } else {
          inv[item.card_id] = 2;
        }
      });
    }
    // Add some random basics
    inv[203] = 2; // Ralts
    inv[204] = 1; // Kirlia
    inv[402] = 2; // Staryu
    inv[901] = 2; // Prof Research
    inv[902] = 2; // Poké Ball
    return inv;
  }

  if (presetType === PRESETS.STARTER_MEWTWO) {
    // Mewtwo ex deck starter
    const mewtwoDeck = META_DECKS.find(d => d.id === 2);
    if (mewtwoDeck) {
      mewtwoDeck.deck_list.forEach(item => {
        if (item.card_id === 201) {
          inv[item.card_id] = 1; // 1 Mewtwo ex owned
        } else {
          inv[item.card_id] = 2;
        }
      });
    }
    inv[101] = 1; // 1 Pikachu ex
    inv[901] = 2;
    inv[902] = 2;
    return inv;
  }

  if (presetType === PRESETS.META_CHASER) {
    // Own all 1-Diamond, 2-Diamond, 3-Diamond, and 1 copy of all ex cards
    CARDS.forEach(c => {
      if (c.rarity === '4-Diamond ex') {
        inv[c.id] = 1;
      } else {
        inv[c.id] = 2;
      }
    });
    return inv;
  }

  return inv;
}
