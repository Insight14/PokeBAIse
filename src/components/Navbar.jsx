import React, { useState } from 'react';
import { useInventory, PRESETS } from '../context/InventoryContext.jsx';
import { PokeBaiseLogo } from './PokeBaiseLogo.jsx';
import { 
  Sparkles, 
  Layers, 
  Download, 
  Upload, 
  Compass, 
  Hammer,
  HelpCircle,
  Database,
  CheckCircle,
  X
} from 'lucide-react';

export function Navbar() {
  const { 
    activeTab, 
    setActiveTab, 
    stats, 
    applyPreset, 
    importInventoryJson,
    exportInventoryJson 
  } = useInventory();

  const [showImportExport, setShowImportExport] = useState(false);
  const [importText, setImportText] = useState('');
  const [importMsg, setImportMsg] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  function handleImport() {
    const res = importInventoryJson(importText);
    if (res.success) {
      setImportMsg({ type: 'success', text: `Successfully imported ${res.count} card entries!` });
      setTimeout(() => setShowImportExport(false), 1500);
    } else {
      setImportMsg({ type: 'error', text: `Import failed: ${res.error}` });
    }
  }

  function handleCopyExport() {
    const jsonStr = exportInventoryJson();
    navigator.clipboard.writeText(jsonStr);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  }

  return (
    <>
      <header className="navbar-header">
        <div className="navbar-container">
          {/* Creative Logo Branding: Poke (Pokemon) + Baise (Base + AI) */}
          <div className="navbar-brand" onClick={() => setActiveTab('recommendations')}>
            <PokeBaiseLogo />
          </div>

          {/* Navigation Pill Bar (RenderZ Style) */}
          <nav className="navbar-nav">
            <button 
              className={`nav-link ${activeTab === 'recommendations' ? 'active' : ''}`}
              onClick={() => setActiveTab('recommendations')}
            >
              <Sparkles className="nav-icon" size={16} />
              <span>AI Recommendations</span>
              <span className="badge-pill pulse">META</span>
            </button>

            <button 
              className={`nav-link ${activeTab === 'checklist' ? 'active' : ''}`}
              onClick={() => setActiveTab('checklist')}
            >
              <Layers className="nav-icon" size={16} />
              <span>Card Collection</span>
              <span className="badge-pill count">{stats.totalCardsOwned}/{stats.maxPossibleCards}</span>
            </button>

            <button 
              className={`nav-link ${activeTab === 'matrix' ? 'active' : ''}`}
              onClick={() => setActiveTab('matrix')}
            >
              <Compass className="nav-icon" size={16} />
              <span>Substitutions</span>
            </button>

            <button 
              className={`nav-link ${activeTab === 'sandbox' ? 'active' : ''}`}
              onClick={() => setActiveTab('sandbox')}
            >
              <Hammer className="nav-icon" size={16} />
              <span>Deck Sandbox</span>
            </button>
          </nav>

          {/* Quick Actions & Presets */}
          <div className="navbar-actions">
            <div className="preset-selector">
              <label htmlFor="preset-select" className="preset-label">
                <Database size={13} /> Preset:
              </label>
              <select 
                id="preset-select"
                className="preset-dropdown" 
                onChange={(e) => {
                  if (e.target.value) {
                    applyPreset(e.target.value);
                    e.target.value = '';
                  }
                }}
                defaultValue=""
              >
                <option value="" disabled>Load Starter Collection...</option>
                <option value={PRESETS.STARTER_PIKACHU}>⚡ Pikachu Aggro (75%)</option>
                <option value={PRESETS.STARTER_MEWTWO}>👁️ Mewtwo Control (80%)</option>
                <option value={PRESETS.META_CHASER}>👑 Core Meta Chaser (90%)</option>
                <option value={PRESETS.COMPLETE}>🌟 Full Master Set (100%)</option>
                <option value={PRESETS.EMPTY}>❌ Reset Inventory</option>
              </select>
            </div>

            <button 
              className="action-btn icon-only" 
              onClick={() => setShowImportExport(true)}
              title="Backup / Export JSON"
            >
              <Upload size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Backup / Restore Modal */}
      {showImportExport && (
        <div className="modal-overlay" onClick={() => setShowImportExport(false)}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><Database size={20} /> PokeBaise Data Backup</h3>
              <button className="close-btn" onClick={() => setShowImportExport(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-desc">
                Your collection progress is automatically synchronized with your local browser storage. You can also export or restore raw inventory JSON below.
              </p>

              {importMsg && (
                <div className={`alert-box ${importMsg.type}`}>
                  {importMsg.type === 'success' ? <CheckCircle size={16} /> : <HelpCircle size={16} />}
                  <span>{importMsg.text}</span>
                </div>
              )}

              <div className="modal-section">
                <h4>Export Collection JSON</h4>
                <div className="export-row">
                  <textarea 
                    className="json-textarea" 
                    readOnly 
                    value={exportInventoryJson()} 
                    rows={4}
                  />
                  <button className="btn primary-btn" onClick={handleCopyExport}>
                    <Download size={16} />
                    {copySuccess ? 'Copied!' : 'Copy JSON'}
                  </button>
                </div>
              </div>

              <div className="modal-section">
                <h4>Restore Collection JSON</h4>
                <textarea 
                  className="json-textarea editable" 
                  placeholder="Paste inventory JSON string here..." 
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  rows={4}
                />
                <div className="modal-actions-row">
                  <button className="btn secondary-btn" onClick={() => setImportText('')}>Clear</button>
                  <button className="btn accent-btn" onClick={handleImport} disabled={!importText.trim()}>
                    <Upload size={16} /> Restore Inventory
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
