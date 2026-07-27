import React, { useState, useMemo } from 'react';
import { useInventory } from '../context/InventoryContext.jsx';
import { META_DECKS, ENERGY_TYPES } from '../data/pokemonData.js';
import { generateDeckRecommendations } from '../utils/recommendationEngine.js';
import { EnergyIcon } from './EnergyIcon.jsx';
import { 
  Trophy, 
  AlertCircle, 
  CheckCircle2, 
  Filter, 
  Coins, 
  ChevronRight,
  Flame,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function DeckRecommendations() {
  const { userInventory, setSelectedDeckId } = useInventory();
  const [selectedTier, setSelectedTier] = useState('ALL');
  const [readinessFilter, setReadinessFilter] = useState('ALL');

  const recommendations = useMemo(() => {
    return generateDeckRecommendations(userInventory, META_DECKS);
  }, [userInventory]);

  const filteredRecs = useMemo(() => {
    return recommendations.filter(rec => {
      if (selectedTier !== 'ALL' && rec.tier !== selectedTier) return false;
      if (readinessFilter === 'READY' && rec.completionPercentage < 100) return false;
      if (readinessFilter === 'CRAFTABLE' && (rec.completionPercentage === 100 || rec.totalPointsToCraft > 600)) return false;
      return true;
    });
  }, [recommendations, selectedTier, readinessFilter]);

  function handleCardClick(rec) {
    if (rec.completionPercentage === 100) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
    setSelectedDeckId(rec.deckId);
  }

  const topPick = recommendations[0];

  return (
    <div className="recommendations-container">
      {/* Clean Top Banner */}
      <section className="view-header recommendations-hero">
        <div className="header-left">
          <div className="ai-engine-badge">
            <Cpu size={14} /> PokeBaise AI Engine
          </div>
          <h2>Smart Deck Recommendations</h2>
          <p className="subtext">
            Meta archetypes ranked dynamically by <strong>Completion %</strong> and lowest crafting cost in <strong>Pack Points</strong>.
          </p>
        </div>

        {topPick && (
          <div className="top-pick-card" onClick={() => handleCardClick(topPick)}>
            <div className="top-pick-tag"><Trophy size={13} /> BEST MATCH</div>
            <div className="top-pick-name">{topPick.deckName}</div>
            <div className="top-pick-meta">
              <span className="perc">{topPick.completionPercentage}% Owned</span>
              <span className="cost">
                {topPick.totalPointsToCraft === 0 ? 'READY TO PLAY' : `${topPick.totalPointsToCraft} pts to craft`}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Clean Filter Tabs */}
      <div className="recommendations-filter-row glass-card">
        <div className="filter-tab-group">
          <span className="filter-lbl"><Filter size={14} /> Tier:</span>
          <button className={`tab-btn ${selectedTier === 'ALL' ? 'active' : ''}`} onClick={() => setSelectedTier('ALL')}>All Tiers</button>
          <button className={`tab-btn ${selectedTier === 'Tier 1' ? 'active' : ''}`} onClick={() => setSelectedTier('Tier 1')}>🔥 Tier 1 Meta</button>
          <button className={`tab-btn ${selectedTier === 'Tier 2' ? 'active' : ''}`} onClick={() => setSelectedTier('Tier 2')}>⚡ Tier 2</button>
          <button className={`tab-btn ${selectedTier === 'Rogue' ? 'active' : ''}`} onClick={() => setSelectedTier('Rogue')}>🎲 Rogue Decks</button>
        </div>

        <div className="filter-tab-group">
          <button className={`tab-btn ${readinessFilter === 'ALL' ? 'active' : ''}`} onClick={() => setReadinessFilter('ALL')}>All Decks</button>
          <button className={`tab-btn ${readinessFilter === 'READY' ? 'active' : ''}`} onClick={() => setReadinessFilter('READY')}>✅ 100% Ready</button>
          <button className={`tab-btn ${readinessFilter === 'CRAFTABLE' ? 'active' : ''}`} onClick={() => setReadinessFilter('CRAFTABLE')}>💎 Craftable (&lt;600 pts)</button>
        </div>
      </div>

      {/* RenderZ Squad Style Deck Cards */}
      <div className="recommendations-grid">
        {filteredRecs.map((rec, index) => {
          const energyObj = ENERGY_TYPES[rec.energyType.toUpperCase()] || ENERGY_TYPES.COLORLESS;
          const isComplete = rec.completionPercentage === 100;

          return (
            <div 
              key={rec.deckId}
              className={`renderz-squad-card glass-card ${isComplete ? 'complete-border' : ''}`}
              style={{
                '--deck-color': energyObj.color,
                '--deck-bg': energyObj.bg
              }}
              onClick={() => handleCardClick(rec)}
            >
              {/* Card Top */}
              <div className="squad-card-top">
                <span className="rank-num">#{index + 1}</span>
                <span className={`squad-tier-tag ${rec.tier.toLowerCase().replace(' ', '-')}`}>
                  {rec.tier === 'Tier 1' && <Flame size={11} />} {rec.tier}
                </span>
                <div className="squad-energy-badge" style={{ backgroundColor: energyObj.color, color: '#000' }}>
                  <EnergyIcon type={rec.energyType} size={14} /> {rec.energyType}
                </div>
              </div>

              {/* Title & Strategy */}
              <div className="squad-card-body">
                <h3 className="squad-title">{rec.deckName}</h3>
                <p className="squad-desc">{rec.description}</p>
              </div>

              {/* Completion Progress Gauge */}
              <div className="squad-progress-block">
                <div className="progress-info-row">
                  <span className="owned-count-text">
                    Cards Owned: <strong>{rec.ownedCount} / {rec.totalRequired}</strong>
                  </span>
                  <span className={`perc-value ${isComplete ? 'green' : ''}`}>
                    {rec.completionPercentage}%
                  </span>
                </div>

                <div className="progress-bar-bg">
                  <div 
                    className={`progress-bar-fill ${isComplete ? 'full' : ''}`}
                    style={{ width: `${rec.completionPercentage}%`, backgroundColor: energyObj.color }}
                  ></div>
                </div>
              </div>

              {/* Footer Status & Visual Diff CTA */}
              <div className="squad-card-footer">
                {isComplete ? (
                  <div className="status-ready">
                    <CheckCircle2 size={15} /> 100% Ready to Play
                  </div>
                ) : (
                  <div className="status-deficit">
                    <span className="missing-text">
                      <AlertCircle size={13} /> {rec.missingCards.reduce((a, c) => a + c.qtyMissing, 0)} cards missing
                    </span>
                    <span className="pts-needed">
                      <Coins size={13} /> {rec.totalPointsToCraft} pts
                    </span>
                  </div>
                )}

                <button className="clean-action-link">
                  Visual Diff & Strategy <ChevronRight size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
