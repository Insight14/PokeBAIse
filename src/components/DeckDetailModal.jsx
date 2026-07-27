import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext.jsx';
import { META_DECKS, CARDS_BY_ID, ENERGY_TYPES } from '../data/pokemonData.js';
import { generateDeckRecommendations } from '../utils/recommendationEngine.js';
import { CardImage } from './CardImage.jsx';
import { EnergyIcon } from './EnergyIcon.jsx';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRightLeft, 
  Coins, 
  Copy, 
  Check, 
  Sparkles
} from 'lucide-react';

export function DeckDetailModal() {
  const { selectedDeckId, setSelectedDeckId, userInventory } = useInventory();
  const [copied, setCopied] = useState(false);

  if (!selectedDeckId) return null;

  const metaDeck = META_DECKS.find(d => d.id === selectedDeckId);
  if (!metaDeck) return null;

  // Compute exact stats for this deck
  const recommendations = generateDeckRecommendations(userInventory, [metaDeck]);
  const deckRec = recommendations[0];

  const energyObj = ENERGY_TYPES[metaDeck.energyType.toUpperCase()] || ENERGY_TYPES.COLORLESS;

  function handleCopyDeckList() {
    let text = `=== POKEBAISE DECK LIST: ${metaDeck.deck_name} (${metaDeck.tier}) ===\n`;
    text += `Energy Type: ${metaDeck.energyType}\n`;
    text += `Completion Status: ${deckRec.completionPercentage}% Owned\n\n`;
    text += `CARDS (20 total):\n`;

    metaDeck.deck_list.forEach(item => {
      const card = CARDS_BY_ID[item.card_id];
      const owned = userInventory[item.card_id] || 0;
      text += `- ${item.qty}x ${card ? card.name : 'Unknown Card'} (${owned >= item.qty ? 'OWNED' : `MISSING ${item.qty - owned}`})\n`;
    });

    if (deckRec.missingCards.length > 0) {
      text += `\nCRAFTING BUDGET NEEDED: ${deckRec.totalPointsToCraft} Pack Points\n`;
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="modal-overlay" onClick={() => setSelectedDeckId(null)}>
      <div 
        className="modal-content glass-card deck-modal-large" 
        onClick={e => e.stopPropagation()}
        style={{
          '--deck-accent': energyObj.color,
          '--deck-bg': energyObj.bg
        }}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="deck-header-info">
            <span className="tier-pill">{metaDeck.tier}</span>
            <span className="energy-pill-large" style={{ backgroundColor: energyObj.color, color: '#000' }}>
              <EnergyIcon type={metaDeck.energyType} size={16} /> {metaDeck.energyType}
            </span>
            <h2>{metaDeck.deck_name}</h2>
          </div>
          
          <button className="close-btn" onClick={() => setSelectedDeckId(null)}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Subhead & Progress */}
        <div className="deck-modal-banner">
          <p className="deck-modal-desc">{metaDeck.description}</p>

          <div className="deck-modal-stats-row">
            <div className="stat-box">
              <span className="stat-lbl">Completion</span>
              <span className={`stat-val ${deckRec.completionPercentage === 100 ? 'green' : ''}`}>
                {deckRec.completionPercentage}%
              </span>
            </div>

            <div className="stat-box">
              <span className="stat-lbl">Cards Owned</span>
              <span className="stat-val">{deckRec.ownedCount} / 20</span>
            </div>

            <div className="stat-box">
              <span className="stat-lbl">Pack Points to Craft</span>
              <span className="stat-val gold">
                <Coins size={16} /> {deckRec.totalPointsToCraft} pts
              </span>
            </div>

            <button className="btn primary-btn copy-deck-btn" onClick={handleCopyDeckList}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied Deck!' : 'Export Deck List'}
            </button>
          </div>
        </div>

        {/* Modal Main Grid */}
        <div className="deck-modal-body">
          {/* Section 1: Visual 20-Card Roster Diff */}
          <div className="deck-section">
            <h3><Sparkles size={18} /> Visual 20-Card Deck Roster</h3>
            <p className="section-note">
              Green highlights = Owned required cards. Red highlights = Missing pieces.
            </p>

            <div className="deck-roster-grid">
              {metaDeck.deck_list.map(item => {
                const card = CARDS_BY_ID[item.card_id];
                const ownedQty = userInventory[item.card_id] || 0;
                const effectiveOwned = Math.min(ownedQty, item.qty);
                const isFullyOwned = effectiveOwned >= item.qty;

                if (!card) return null;

                return (
                  <div 
                    key={item.card_id}
                    className={`roster-card-item ${isFullyOwned ? 'owned-item' : 'missing-item'}`}
                  >
                    <div className="roster-card-badge">
                      {isFullyOwned ? (
                        <span className="badge-owned"><CheckCircle2 size={12} /> {effectiveOwned}/{item.qty}</span>
                      ) : (
                        <span className="badge-missing"><AlertTriangle size={12} /> Need {item.qty - effectiveOwned}</span>
                      )}
                    </div>

                    <div className="roster-art">
                      <CardImage card={card} quality="high" className="modal-roster-img" />
                    </div>

                    <div className="roster-info">
                      <span className="roster-name">{card.name}</span>
                      <span className="roster-qty">x{item.qty} in deck</span>
                    </div>

                    <div className="roster-rarity">
                      <span>{card.rarity}</span>
                      {!isFullyOwned && (
                        <span className="cost-pill">{card.craftingCost} pts</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Smart Substitution Engine */}
          <div className="deck-section">
            <h3><ArrowRightLeft size={18} /> Smart Substitutions Engine</h3>
            {deckRec.missingCards.length === 0 ? (
              <div className="no-substitutions-notice glass-card">
                <CheckCircle2 size={24} className="green-icon" />
                <div>
                  <strong>No Substitutions Required!</strong>
                  <p>You own all 20 cards needed to run this archetype at maximum potential.</p>
                </div>
              </div>
            ) : (
              <div className="substitutions-list">
                {deckRec.missingCards.map(missing => {
                  return (
                    <div key={missing.card_id} className="sub-card-box glass-card">
                      <div className="missing-card-col">
                        <span className="sub-tag danger">Missing</span>
                        <div className="sub-card-title">
                          <strong>{missing.qtyMissing}x {missing.cardDetails.name}</strong>
                          <span className="cost-text">({missing.costToCraft} pts each)</span>
                        </div>
                      </div>

                      <div className="sub-arrow">
                        <ArrowRightLeft size={20} />
                      </div>

                      <div className="replacement-card-col">
                        {missing.substitutions && missing.substitutions.length > 0 ? (
                          missing.substitutions.map(sub => (
                            <div key={sub.replacement_card_id} className="sub-recommendation">
                              <span className={`sub-tag ${sub.isOwned ? 'success' : 'warning'}`}>
                                {sub.isOwned ? `Recommended Replacement (${sub.replacementOwnedQty}x Owned)` : 'Alternative Replacement'}
                              </span>
                              <div className="replacement-name">
                                <strong>1x {sub.replacementCard.name}</strong>
                              </div>
                              <p className="sub-reason">{sub.reason}</p>
                            </div>
                          ))
                        ) : (
                          <div className="sub-recommendation fallback">
                            <span className="sub-tag warning">Core Irreplaceable Card</span>
                            <p className="sub-reason">
                              This card is a core cornerstone for this deck archetype. Crafting this card with <strong>{missing.costToCraft} Pack Points</strong> is strongly recommended.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 3: Pack Points Crafting Plan */}
          {deckRec.missingCards.length > 0 && (
            <div className="deck-section">
              <h3><Coins size={18} /> Pack Points Crafting Breakdown</h3>
              <div className="crafting-table-box glass-card">
                <table className="crafting-table">
                  <thead>
                    <tr>
                      <th>Card Name</th>
                      <th>Rarity</th>
                      <th>Qty Missing</th>
                      <th>Cost / Card</th>
                      <th>Subtotal Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deckRec.missingCards.map(item => (
                      <tr key={item.card_id}>
                        <td><strong>{item.cardDetails.name}</strong></td>
                        <td><span className="rarity-badge-sm">{item.cardDetails.rarity}</span></td>
                        <td>{item.qtyMissing}x</td>
                        <td>{item.costToCraft} pts</td>
                        <td className="gold-text"><strong>{item.totalCostForCard} pts</strong></td>
                      </tr>
                    ))}
                    <tr className="total-row">
                      <td colSpan={4}><strong>TOTAL PACK POINTS REQUIRED TO CRAFT DECK:</strong></td>
                      <td className="gold-text total-val">
                        <strong><Coins size={16} /> {deckRec.totalPointsToCraft} PTS</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
