import React, { useState } from 'react';
import { TYPE_ICONS } from '../utils/assetPipeline.js';

const TYPE_EMOJI_FALLBACK = {
  Electric: '⚡',
  Lightning: '⚡',
  Fire: '🔥',
  Water: '💧',
  Grass: '🌿',
  Psychic: '👁️',
  Fighting: '👊',
  Darkness: '🌙',
  Metal: '⚙️',
  Dragon: '🐲',
  Colorless: '⚪',
  Trainer: '🎒'
};

export function EnergyIcon({ type = 'Colorless', size = 18, className = '' }) {
  const [hasError, setHasError] = useState(false);
  const iconUrl = TYPE_ICONS[type] || TYPE_ICONS.Colorless;
  const emoji = TYPE_EMOJI_FALLBACK[type] || '⚪';

  if (hasError || !iconUrl) {
    return (
      <span className={`energy-icon-fallback ${className}`} style={{ fontSize: `${size}px` }}>
        {emoji}
      </span>
    );
  }

  return (
    <img 
      src={iconUrl} 
      alt={`${type} Energy`} 
      className={`energy-icon-img ${className}`}
      style={{ width: `${size}px`, height: `${size}px`, objectFit: 'contain' }}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
}
