import React from 'react';
import { CARD_SUBSTITUTIONS, CARDS_BY_ID } from '../data/pokemonData.js';
import { useInventory } from '../context/InventoryContext.jsx';
import { CardImage } from './CardImage.jsx';
import { ArrowRightLeft, Compass, CheckCircle, AlertTriangle } from 'lucide-react';

export function SubstitutionMatrix() {
  const { userInventory } = useInventory();

  return (
    <div className="matrix-container">
      <div className="matrix-header glass-card">
        <h2><Compass size={24} /> Smart Card Substitution Matrix</h2>
        <p>
          Operating with partial pack pulls? Use this strategic matrix to substitute missing high-rarity meta cards with budget utility replacements while saving Pack Points.
        </p>
      </div>

      <div className="matrix-grid">
        {CARD_SUBSTITUTIONS.map((item, idx) => {
          const missingCard = CARDS_BY_ID[item.missing_card_id];
          const replacementCard = CARDS_BY_ID[item.replacement_card_id];

          if (!missingCard || !replacementCard) return null;

          const missingOwned = userInventory[item.missing_card_id] || 0;
          const replacementOwned = userInventory[item.replacement_card_id] || 0;

          return (
            <div key={idx} className="matrix-card glass-card">
              <div className="matrix-card-header">
                <span className="priority-badge">Priority #{item.priority} Match</span>
              </div>

              <div className="matrix-card-body">
                {/* Missing Target Card */}
                <div className="matrix-col missing">
                  <div className="card-mini-banner danger">
                    <span>Target Meta Card</span>
                    {missingOwned > 0 ? (
                      <span className="owned-tag success"><CheckCircle size={12} /> {missingOwned}x Owned</span>
                    ) : (
                      <span className="owned-tag warning"><AlertTriangle size={12} /> 0x Owned</span>
                    )}
                  </div>
                  <div className="mini-card-art">
                    <CardImage card={missingCard} quality="low" className="matrix-mini-img" />
                  </div>
                  <div className="card-mini-title">
                    <strong>{missingCard.name}</strong>
                    <span>{missingCard.rarity} ({missingCard.craftingCost} pts)</span>
                  </div>
                </div>

                <div className="matrix-swap-icon">
                  <ArrowRightLeft size={24} />
                  <span>SWAP FOR</span>
                </div>

                {/* Replacement Card */}
                <div className="matrix-col replacement">
                  <div className="card-mini-banner success">
                    <span>Budget Replacement</span>
                    {replacementOwned > 0 ? (
                      <span className="owned-tag success"><CheckCircle size={12} /> {replacementOwned}x Owned</span>
                    ) : (
                      <span className="owned-tag warning"><AlertTriangle size={12} /> 0x Owned</span>
                    )}
                  </div>
                  <div className="mini-card-art">
                    <CardImage card={replacementCard} quality="low" className="matrix-mini-img" />
                  </div>
                  <div className="card-mini-title">
                    <strong>{replacementCard.name}</strong>
                    <span>{replacementCard.rarity} ({replacementCard.craftingCost} pts)</span>
                  </div>
                </div>
              </div>

              {/* Rationale Footer */}
              <div className="matrix-rationale">
                <strong>Tactical Rationale:</strong> {item.reason}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
