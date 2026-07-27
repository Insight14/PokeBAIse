import React, { useState } from 'react';
import { getCardImageUrl } from '../utils/assetPipeline.js';

export function CardImage({ card, quality = 'low', alt, className = '' }) {
  const [hasError, setHasError] = useState(false);
  const imageUrl = getCardImageUrl(card, quality);

  if (hasError || !imageUrl) {
    return (
      <div 
        className={`card-img-placeholder ${className}`}
        style={{ background: card?.artBg || 'linear-gradient(135deg, #182338 0%, #0b0e14 100%)' }}
      >
        <span className="placeholder-emoji">{card?.artEmoji || '🃏'}</span>
        <span className="placeholder-name">{card?.name || 'Pokémon Card'}</span>
      </div>
    );
  }

  return (
    <img 
      src={imageUrl} 
      alt={alt || card?.name || 'Pokémon TCG Pocket Card'} 
      className={`card-img-live ${className}`}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
}
