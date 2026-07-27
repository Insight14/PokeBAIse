# Project Specification: PocketDeck - Smart Deck Builder for Pokémon TCG Pocket (TCGP)

## 1. Project Overview
PocketDeck is a database, card viewer, and utility platform tailored specifically for *Pokémon TCG Pocket (TCGP)*. 

Due to real-time pack opening timers and limited crafting resources (Pack Points), players frequently operate with partial card collections. The core value proposition of this application is a **Smart Deck Recommendation Engine (MVP)**: users input their current card inventory, and the application instantly ranks and recommends meta/competitive decks based on proximity to completion, offering optimal card substitution strategies for missing pieces.

---

## 2. Core MVP Feature Architecture

### A. Digital Collection Checklist (User Inventory)
*   A high-performance grid UI showcasing the TCGP card catalog.
*   Users tap/click cards to cycle through quantities owned (`0`, `1`, or `2`).
*   Local state management for instantaneous UI feedback, backed by low-latency database sync.

### B. Smart Recommendation Engine
*   Compares the active user's inventory against a curated table of active meta-deck archetypes.
*   Sorts recommended decks dynamically by **Completion Percentage** (highest to lowest).
*   Prioritizes decks where the user owns the high-rarity, irreplaceable core pieces (e.g., *ex* cards, specific Trainer cards).

### C. Smart Substitution & Crafting Budgeting
*   **Visual Diffing:** Displays the recommended deck list, clearly highlighting missing cards in red and owned cards in green.
*   **Fallback Engine:** Suggests viable lower-rarity or alternative budget replacements for missing utility cards (e.g., *Swap 1x missing Zapdos ex with 1x Blitzle*).
*   **Point Budgeting:** Aggregates the total **Pack Points** required to manually craft the exact missing cards needed to make the deck competitive.

---

## 3. Database Architecture (PostgreSQL / Supabase Schema)

```sql
-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. GLOBAL CARDS DICTIONARY
CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,          -- Electric, Fire, Water, Psychic, Trainer, Item
    stage VARCHAR(50) DEFAULT 'Basic', -- Basic, Stage 1, Stage 2, Supporter, Item
    rarity VARCHAR(50) NOT NULL,        -- 1-Diamond, 4-Diamond, 1-Star, Crown, etc.
    crafting_cost INT NOT NULL,         -- Pack Points required to craft (e.g., 400 for ex)
    image_url TEXT,
    is_core_meta_piece BOOLEAN DEFAULT FALSE
);

-- 2. META DECK ARCHETYPES
CREATE TABLE meta_decks (
    id SERIAL PRIMARY KEY,
    deck_name VARCHAR(255) NOT NULL,
    tier VARCHAR(10) NOT NULL,          -- Tier 1, Tier 2, Rogue
    description TEXT,
    -- JSONB Array Structure: [{"card_id": 101, "qty": 2}, {"card_id": 104, "qty": 2}]
    deck_list JSONB NOT NULL 
);

-- 3. USER COLLECTIONS (Many-to-Many Bridge Table)
CREATE TABLE user_collections (
    user_id UUID NOT NULL,
    card_id INT REFERENCES cards(id) ON DELETE CASCADE,
    quantity_owned INT DEFAULT 0 CHECK (quantity_owned BETWEEN 0 AND 2),
    PRIMARY KEY (user_id, card_id)
);

-- 4. CARD SUBSTITUTIONS (Fallback lookup table)
CREATE TABLE card_substitutions (
    missing_card_id INT REFERENCES cards(id) ON DELETE CASCADE,
    replacement_card_id INT REFERENCES cards(id) ON DELETE CASCADE,
    priority INT DEFAULT 1,             -- 1 = Best match, 2 = Backup match
    reason VARCHAR(255),                -- e.g., "Budget Electric Attacker"
    PRIMARY KEY (missing_card_id, replacement_card_id)
);

-- Indexes for lightning-fast matching queries
CREATE INDEX idx_user_collections_user ON user_collections(user_id);
CREATE INDEX idx_cards_id ON cards(id);
```

---

## 4. Smart Matching Algorithm Logic (TypeScript)

The core recommendation function calculates completion metrics by checking user inventory maps against meta-deck JSON blueprints.

```typescript
interface DeckItem {
  card_id: number;
  qty: number;
}

interface UserInventory {
  [card_id: number]: number; // Maps card_id -> quantity_owned
}

interface DeckRecommendation {
  deckId: number;
  deckName: string;
  tier: string;
  ownedCount: number;
  totalRequired: number;
  completionPercentage: number;
  missingCards: { card_id: number; qtyMissing: number; costToCraft: number }[];
  totalPointsToCraft: number;
}

export function generateDeckRecommendations(
  userInventory: UserInventory,
  metaDecks: any[] // Array of rows fetched from meta_decks table
): DeckRecommendation[] {
  const recommendations: DeckRecommendation[] = [];

  for (const deck of metaDecks) {
    const list: DeckItem[] = deck.deck_list;
    let ownedCount = 0;
    let totalRequired = 0;
    let totalPointsToCraft = 0;
    const missingCards: DeckRecommendation['missingCards'] = [];

    for (const item of list) {
      totalRequired += item.qty;
      const ownedQty = userInventory[item.card_id] || 0;
      
      // Calculate how many of this specific card are actually useful for this deck
      const effectiveOwned = Math.min(ownedQty, item.qty);
      ownedCount += effectiveOwned;

      // Handle deficit calculation
      if (effectiveOwned < item.qty) {
        const qtyMissing = item.qty - effectiveOwned;
        // In production, fetch 'crafting_cost' from cached global cards dictionary
        const mockCraftingCost = 400; 
        
        missingCards.push({
          card_id: item.card_id,
          qtyMissing: qtyMissing,
          costToCraft: mockCraftingCost
        });
        
        totalPointsToCraft += (mockCraftingCost * qtyMissing);
      }
    }

    const completionPercentage = Math.round((ownedCount / totalRequired) * 100);

    recommendations.push({
      deckId: deck.id,
      deckName: deck.deck_name,
      tier: deck.tier,
      ownedCount,
      totalRequired,
      completionPercentage,
      missingCards,
      totalPointsToCraft
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
```

---

## 5. Development Phase Roadmap

*   **Phase 1 (Database & Assets):** Seed the `cards` table with current TCGP card sets. Set up static asset paths for images (extracted via APK or sourced from fan scrapers).
*   **Phase 2 (Checklist UI):** Build a rapid grid-selection interface allowing users to build up their `user_collections` state quickly.
*   **Phase 3 (Algorithm Integration):** Implement the `generateDeckRecommendations` engine on the backend (or edge functions) to dynamically output data to the user dashboard.
*   **Phase 4 (Substitution System):** Connect the `card_substitutions` table to render intuitive UI suggestions inside the missing-card panels.

---

## 6. Critical Legal Guidelines
1.  **IP Protection:** Do not use copyrighted assets (such as official branding fonts or commercial Pokémon logos) in marketing materials or UI chrome.
2.  **No Commercialization:** Keep the project completely free of monetization (no subscriptions, paywalls, or aggressive ad networks) to strictly adhere to Fair Use / Non-Commercial Fan Project statuses.
3.  **Disclaimer Footprint:** Every page template must contain a visible disclaimer declaring that the project is an independent, unofficial platform unaffiliated with Nintendo, Game Freak, or The Pokémon Company.