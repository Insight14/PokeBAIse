import React, { useState } from 'react';
import { META_DECKS } from '../data/pokemonData.js';
import { useInventory } from '../context/InventoryContext.jsx';
import { CardImage } from './CardImage.jsx';
import { AIDeckRater } from './AIDeckRater.jsx';
import { Hammer, Plus, Trash2, CheckCircle, AlertCircle, Copy, Check, Layers, Loader2 } from 'lucide-react';

export function CustomDeckBuilder() {
  const { userInventory, fullCatalog, catalogLoading } = useInventory();
  const [deckName, setDeckName] = useState('My Custom TCGP Deck');
  const [customList, setCustomList] = useState({}); // card_id -> qty in deck
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  // Total cards in current custom deck (Max 20 in TCGP)
  const totalCardsInDeck = Object.values(customList).reduce((a, b) => a + b, 0);

  function addCardToDeck(cardId) {
    const currentInDeck = customList[cardId] || 0;
    if (totalCardsInDeck >= 20) return;
    if (currentInDeck >= 2) return;

    setCustomList(prev => ({
      ...prev,
      [cardId]: currentInDeck + 1
    }));
  }

  function removeCardFromDeck(cardId) {
    setCustomList(prev => {
      const current = prev[cardId] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[cardId];
        return copy;
      }
      return {
        ...prev,
        [cardId]: current - 1
      };
    });
  }

  function loadMetaBlueprint(deck) {
    const newList = {};
    deck.deck_list.forEach(item => {
      newList[item.card_id] = item.qty;
    });
    setDeckName(`Custom ${deck.deck_name}`);
    setCustomList(newList);
  }

  function clearCustomDeck() {
    setCustomList({});
  }

  function handleExportCustomDeck() {
    let text = `=== POKEBAISE DECK LIST: ${deckName} ===\n`;
    text += `Total Cards: ${totalCardsInDeck}/20\n\n`;
    Object.keys(customList).forEach(idStr => {
      const id = Number(idStr);
      const card = fullCatalog.find(c => c.id === id);
      if (card) {
        text += `- ${customList[id]}x ${card.name}\n`;
      }
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Filtered card catalog for deck selection
  const filteredCatalog = fullCatalog.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="sandbox-container">
      {/* Sandbox Header */}
      <div className="sandbox-header glass-card">
        <div>
          <h2><Hammer size={24} /> Deck Sandbox & Builder</h2>
          <p>Construct a 20-card Pokémon TCG Pocket deck list or clone a meta blueprint to test card compositions.</p>
        </div>

        <div className="blueprint-dropdown-group">
          <span>Clone Blueprint:</span>
          <select onChange={(e) => {
            const deck = META_DECKS.find(d => d.id === Number(e.target.value));
            if (deck) loadMetaBlueprint(deck);
          }} defaultValue="">
            <option value="" disabled>Select Meta Deck to Clone...</option>
            {META_DECKS.map(d => (
              <option key={d.id} value={d.id}>{d.deck_name} ({d.tier})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="sandbox-main-grid">
        {/* Left Column: Deck Roster (20 Cards Max) */}
        <div className="sandbox-roster-box glass-card">
          <div className="roster-header">
            <input 
              type="text" 
              className="deck-name-input"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
            />
            
            <div className={`deck-count-badge ${totalCardsInDeck === 20 ? 'valid' : 'warning'}`}>
              {totalCardsInDeck} / 20 Cards
            </div>
          </div>

          {totalCardsInDeck === 20 ? (
            <div className="deck-rule-status success">
              <CheckCircle size={16} /> Deck complete & valid for Pokémon TCG Pocket rules!
            </div>
          ) : (
            <div className="deck-rule-status warning">
              <AlertCircle size={16} /> Add {20 - totalCardsInDeck} more cards to complete this 20-card deck.
            </div>
          )}

          <div className="custom-roster-list">
            {Object.keys(customList).length === 0 ? (
              <div className="empty-roster-notice">
                <Layers size={32} />
                <p>Your custom deck is currently empty.</p>
                <span>Click cards from the catalog on the right to add up to 2 copies per card.</span>
              </div>
            ) : (
              Object.keys(customList).map(idStr => {
                const cardId = Number(idStr);
                const qtyInDeck = customList[cardId];
                const card = fullCatalog.find(c => c.id === cardId);
                const ownedQty = userInventory[cardId] || 0;
                const isOwned = ownedQty >= qtyInDeck;

                if (!card) return null;

                return (
                  <div key={cardId} className={`custom-roster-item ${isOwned ? 'owned' : 'missing'}`}>
                    <div className="custom-item-art">
                      <CardImage card={card} quality="low" className="sandbox-roster-img" />
                    </div>

                    <div className="custom-item-info">
                      <strong className="item-name">{card.name}</strong>
                      <span className="item-details">{card.type} • {card.stage}</span>
                    </div>

                    <div className="ownership-status">
                      {isOwned ? (
                        <span className="pill green">Owned ({ownedQty}x)</span>
                      ) : (
                        <span className="pill red">Need {qtyInDeck - ownedQty}x</span>
                      )}
                    </div>

                    <div className="qty-controls-inline">
                      <button className="btn mini-btn" onClick={() => removeCardFromDeck(cardId)}>-</button>
                      <span className="qty-num">{qtyInDeck}x</span>
                      <button className="btn mini-btn" onClick={() => addCardToDeck(cardId)} disabled={qtyInDeck >= 2 || totalCardsInDeck >= 20}>+</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="sandbox-actions-row">
            <button className="btn danger-btn" onClick={clearCustomDeck} disabled={totalCardsInDeck === 0}>
              <Trash2 size={16} /> Clear Deck
            </button>
            <button className="btn primary-btn" onClick={handleExportCustomDeck} disabled={totalCardsInDeck === 0}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied Deck!' : 'Export Deck List'}
            </button>
          </div>
        </div>

        {/* Right Column: Catalog Picker */}
        <div className="sandbox-picker-box glass-card">
          <div className="picker-header">
            <h3>Add Cards to Deck</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {catalogLoading && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Loading all cards...
                </span>
              )}
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {filteredCatalog.length} cards
              </span>
            </div>
            <input 
              type="text" 
              className="picker-search"
              placeholder="Search name or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="picker-cards-grid">
            {filteredCatalog.map(card => {
              const inDeck = customList[card.id] || 0;
              const isDisabled = inDeck >= 2 || totalCardsInDeck >= 20;

              return (
                <div 
                  key={card.id}
                  className={`picker-card-mini ${inDeck > 0 ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                  onClick={() => !isDisabled && addCardToDeck(card.id)}
                >
                  <div className="mini-art">
                    <CardImage card={card} quality="low" className="sandbox-picker-img" />
                  </div>
                  <div className="mini-info">
                    <strong>{card.name}</strong>
                    <span>{card.rarity}</span>
                  </div>
                  <div className="mini-actions">
                    {inDeck > 0 && <span className="in-deck-badge">{inDeck}x in Deck</span>}
                    <button className="add-btn" disabled={isDisabled}>
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Deck Rater */}
      {(() => {
        const deckCards = Object.keys(customList).flatMap(idStr => {
          const card = fullCatalog.find(c => c.id === Number(idStr));
          if (!card) return [];
          return Array(customList[Number(idStr)]).fill(card);
        });
        return <AIDeckRater deckCards={deckCards} deckName={deckName} />;
      })()}
    </div>
  );
}
