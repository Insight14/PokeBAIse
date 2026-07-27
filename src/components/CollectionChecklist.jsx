import React, { useState, useMemo } from 'react';
import { useInventory } from '../context/InventoryContext.jsx';
import { ENERGY_TYPES } from '../data/pokemonData.js';
import { CardImage } from './CardImage.jsx';
import { EnergyIcon } from './EnergyIcon.jsx';
import { 
  Search, 
  Check, 
  RotateCcw, 
  ShieldCheck, 
  Layers,
  Sparkles,
  SlidersHorizontal,
  Loader2,
  PackageOpen
} from 'lucide-react';

export function CollectionChecklist() {
  const { userInventory, cycleQuantity, setQuantity, setAllToTwo, clearInventory, stats, fullCatalog, catalogLoading } = useInventory();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedRarity, setSelectedRarity] = useState('ALL');
  const [selectedStage, setSelectedStage] = useState('ALL');
  const [ownershipFilter, setOwnershipFilter] = useState('ALL');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  function setCoreMetaToTwo() {
    fullCatalog.filter(c => c.isCoreMetaPiece).forEach(c => {
      setQuantity(c.id, 2);
    });
  }

  const filteredCards = useMemo(() => {
    return fullCatalog.filter(card => {
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = card.name.toLowerCase().includes(query);
        const matchesAttack = card.attack && card.attack.toLowerCase().includes(query);
        const matchesDesc = card.description && card.description.toLowerCase().includes(query);
        if (!matchesName && !matchesAttack && !matchesDesc) return false;
      }

      if (selectedType !== 'ALL' && card.type !== selectedType) {
        return false;
      }

      if (selectedRarity !== 'ALL') {
        if (selectedRarity === 'EX' && !card.rarity.includes('ex')) return false;
        if (selectedRarity === 'DIAMOND' && !card.rarity.includes('Diamond')) return false;
        if (selectedRarity === 'STAR' && (!card.rarity.includes('Star') && !card.rarity.includes('Crown'))) return false;
        if (selectedRarity !== 'EX' && selectedRarity !== 'DIAMOND' && selectedRarity !== 'STAR' && card.rarity !== selectedRarity) return false;
      }

      if (selectedStage !== 'ALL' && card.stage !== selectedStage) {
        return false;
      }

      const qty = userInventory[card.id] || 0;
      if (ownershipFilter === 'MISSING' && qty !== 0) return false;
      if (ownershipFilter === 'OWNED_1' && qty !== 1) return false;
      if (ownershipFilter === 'OWNED_2' && qty !== 2) return false;
      if (ownershipFilter === 'CORE_META' && !card.isCoreMetaPiece) return false;

      return true;
    });
  }, [searchTerm, selectedType, selectedRarity, selectedStage, ownershipFilter, userInventory, fullCatalog]);

  return (
    <div className="checklist-container">
      {/* Clean Header Bar */}
      <div className="view-header glass-card">
        <div className="header-left">
          <h2><Layers size={22} /> Card Collection</h2>
          <p className="subtext">Tap any card to cycle owned copies (0 → 1 → 2). Your collection syncs across all tabs in real-time.</p>
        </div>

        <div className="header-stats-row">
          <div className="clean-stat">
            <span className="num">{stats.totalUniqueCardsOwned} / {fullCatalog.length}</span>
            <span className="lbl">Unique Cards</span>
          </div>
          <div className="clean-stat">
            <span className="num">{stats.totalCardsOwned} / {stats.maxPossibleCards}</span>
            <span className="lbl">Total Copies</span>
          </div>
          <div className="clean-stat accent">
            <span className="num">{stats.catalogCompletionPercentage}%</span>
            <span className="lbl">Completed</span>
          </div>
        </div>
      </div>

      {/* RenderZ-Style Clean Search & Type Filter Bar */}
      <div className="clean-filter-bar glass-card">
        <div className="search-filter-row">
          <div className="clean-search-box">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search Pokémon, Trainers, attacks… (e.g. Pikachu, Sabrina, Mewtwo)" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-btn" onClick={() => setSearchTerm('')}>×</button>
            )}
          </div>

          <button 
            className={`filter-toggle-btn ${showAdvancedFilters ? 'active' : ''}`}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <SlidersHorizontal size={15} /> Filters
          </button>
        </div>

        {/* Clean Energy Type Pills */}
        <div className="energy-type-pills">
          <button 
            className={`type-pill ${selectedType === 'ALL' ? 'active' : ''}`}
            onClick={() => setSelectedType('ALL')}
          >
            All Types
          </button>
          {Object.keys(ENERGY_TYPES).map(key => {
            const type = ENERGY_TYPES[key];
            const isSelected = selectedType === type.name;
            return (
              <button
                key={key}
                className={`type-pill ${isSelected ? 'active' : ''}`}
                style={{
                  '--pill-accent': type.color,
                  '--pill-bg': type.bg
                }}
                onClick={() => setSelectedType(isSelected ? 'ALL' : type.name)}
              >
                <EnergyIcon type={type.name} size={15} />
                <span>{type.name}</span>
              </button>
            );
          })}
        </div>

        {/* Advanced Filters Dropdown (Collapsible) */}
        {showAdvancedFilters && (
          <div className="advanced-filters-panel">
            <div className="filter-group">
              <label>Rarity:</label>
              <select value={selectedRarity} onChange={(e) => setSelectedRarity(e.target.value)}>
                <option value="ALL">All Rarities</option>
                <option value="EX">4-Diamond ex</option>
                <option value="STAR">Secret Stars / Crown</option>
                <option value="1-Diamond">1-Diamond</option>
                <option value="2-Diamond">2-Diamond</option>
                <option value="3-Diamond">3-Diamond</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Stage:</label>
              <select value={selectedStage} onChange={(e) => setSelectedStage(e.target.value)}>
                <option value="ALL">All Stages</option>
                <option value="Basic">Basic</option>
                <option value="Stage 1">Stage 1</option>
                <option value="Stage 2">Stage 2</option>
                <option value="Supporter">Supporter</option>
                <option value="Item">Item</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Status:</label>
              <select value={ownershipFilter} onChange={(e) => setOwnershipFilter(e.target.value)}>
                <option value="ALL">All Cards</option>
                <option value="MISSING">Missing (0 Owned)</option>
                <option value="OWNED_1">Partial (1 Owned)</option>
                <option value="OWNED_2">Maxed Out (2 Owned)</option>
                <option value="CORE_META">Core Meta Pieces Only</option>
              </select>
            </div>

            <div className="quick-presets-group">
              <button className="btn micro-btn" onClick={setCoreMetaToTwo}>
                <ShieldCheck size={13} /> Max Core Meta
              </button>
              <button className="btn micro-btn" onClick={setAllToTwo}>
                <Check size={13} /> Max All (2x)
              </button>
              <button className="btn micro-btn danger" onClick={clearInventory}>
                <RotateCcw size={13} /> Reset to 0x
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Card Counter */}
      <div className="catalog-counter-text">
        {catalogLoading
          ? 'Loading full card catalog from TCGdex…'
          : <><strong>{filteredCards.length}</strong> of {fullCatalog.length} cards shown</>
        }
      </div>

      {/* Loading State */}
      {catalogLoading && (
        <div className="checklist-loading-state glass-card">
          <Loader2 size={36} className="spin-icon" />
          <p>Fetching the complete Pokémon TCG Pocket card catalog…</p>
          <span className="loading-sub">Pulling from TCGdex API across all released sets.</span>
        </div>
      )}

      {/* Empty State */}
      {!catalogLoading && filteredCards.length === 0 && (
        <div className="checklist-empty-state glass-card">
          <PackageOpen size={48} />
          <h3>No cards match your filters</h3>
          <p>Try removing a filter or clearing the search.</p>
          <button className="btn" onClick={() => {
            setSearchTerm('');
            setSelectedType('ALL');
            setSelectedRarity('ALL');
            setSelectedStage('ALL');
            setOwnershipFilter('ALL');
          }}>Clear All Filters</button>
        </div>
      )}

      {/* Card Grid */}
      {!catalogLoading && filteredCards.length > 0 && (
        <div className="clean-cards-grid">
          {filteredCards.map(card => {
            const qtyOwned = userInventory[card.id] || 0;
            const typeKey = card.type ? card.type.toUpperCase() : 'COLORLESS';
            const typeObj = ENERGY_TYPES[typeKey] || ENERGY_TYPES.COLORLESS;

            return (
              <div 
                key={card.id} 
                className={`renderz-card ${qtyOwned === 0 ? 'unowned' : ''} ${qtyOwned === 2 ? 'maxed' : ''}`}
                style={{
                  '--card-accent': typeObj?.color || '#888',
                  '--card-bg': typeObj?.bg || 'rgba(136,136,136,0.1)'
                }}
                onClick={() => cycleQuantity(card.id)}
              >
                {/* Top Header */}
                <div className="renderz-card-header">
                  <span className="card-stage-label">{card.stage}</span>
                  {card.hp > 0 && <span className="card-hp-badge">{card.hp} HP</span>}
                  <div className="type-icon-badge">
                    <EnergyIcon type={card.type} size={15} />
                  </div>
                </div>

                {/* Center Artwork */}
                <div className="renderz-art-container">
                  <CardImage card={card} quality="low" className="renderz-card-img" />
                  {card.isCoreMetaPiece && (
                    <span className="ai-meta-chip">
                      <Sparkles size={9} /> CORE META
                    </span>
                  )}
                </div>

                {/* Footer Meta & Name */}
                <div className="renderz-card-info">
                  <h4 className="renderz-card-name">{card.name}</h4>
                  <div className="renderz-card-sub">
                    <span className="rarity-text">{card.rarity}</span>
                    <span className="pts-text">{card.craftingCost} pts</span>
                  </div>
                </div>

                {/* Clean 0 / 1 / 2 Quantity Pill Bar */}
                <div className="renderz-qty-bar" onClick={e => e.stopPropagation()}>
                  <span className={`qty-pill-status q-${qtyOwned}`}>
                    {qtyOwned === 2 ? '2x MAX' : `${qtyOwned}x Owned`}
                  </span>

                  <div className="qty-stepper-pills">
                    <button className={`stepper-btn ${qtyOwned === 0 ? 'active' : ''}`} onClick={() => setQuantity(card.id, 0)}>0</button>
                    <button className={`stepper-btn ${qtyOwned === 1 ? 'active' : ''}`} onClick={() => setQuantity(card.id, 1)}>1</button>
                    <button className={`stepper-btn ${qtyOwned === 2 ? 'active' : ''}`} onClick={() => setQuantity(card.id, 2)}>2</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
