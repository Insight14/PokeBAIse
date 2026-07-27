import React, { useId } from 'react';

/**
 * PokeBaise brand mark — standard Poké Ball with deck-grid motif on the red
 * hemisphere, plus PokeB-AI-se wordplay in the wordmark.
 */
export function PokeBaiseLogo({ size = 36, showText = true, className = '' }) {
  const clipId = useId().replace(/:/g, '');

  return (
    <div className={`pokebaise-logo ${className}`}>
      <div className="pokebaise-logo-icon" style={{ width: size, height: size }}>
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="pokeball-svg"
        >
          <defs>
            <clipPath id={clipId}>
              <rect x="0" y="0" width="36" height="18" />
            </clipPath>
          </defs>

          {/* Standard Poké Ball base */}
          <circle cx="18" cy="18" r="16" fill="#ffffff" stroke="#1a1a2e" strokeWidth="1.5" />
          <path d="M2 18 A16 16 0 0 1 34 18 Z" fill="#EE1515" />

          {/* Deck motif on the darker (red) half — mini card grid + stack lines */}
          <g clipPath={`url(#${clipId})`} opacity="0.38">
            {/* 2×3 card slot grid */}
            {[8, 14, 20].map(x =>
              [5, 10, 15].map(y => (
                <rect
                  key={`${x}-${y}`}
                  x={x}
                  y={y}
                  width="4.5"
                  height="3"
                  rx="0.6"
                  fill="#ffffff"
                />
              ))
            )}
            {/* Stacked deck silhouette */}
            <rect x="24" y="6" width="7" height="5" rx="0.8" fill="#ffffff" opacity="0.55" />
            <rect x="25.5" y="4.5" width="7" height="5" rx="0.8" fill="#ffffff" opacity="0.75" />
            <rect x="27" y="3" width="7" height="5" rx="0.8" fill="#ffffff" />
          </g>

          {/* Center band & button */}
          <rect x="0" y="16.75" width="36" height="2.5" fill="#1a1a2e" />
          <circle cx="18" cy="18" r="5.5" fill="#1a1a2e" />
          <circle cx="18" cy="18" r="4" fill="#ffffff" stroke="#1a1a2e" strokeWidth="0.75" />

          {/* AI core pulse ring inside the button */}
          <circle cx="18" cy="18" r="2.2" fill="none" stroke="#13c2c2" strokeWidth="0.6" className="ai-core-ring" />
          <circle cx="18" cy="18" r="0.9" fill="#13c2c2" className="ai-core-dot" />
        </svg>
      </div>

      {showText && (
        <div className="brand-text">
          <div className="title-row">
            <h1 className="brand-wordmark" aria-label="PokeBaise">
              <span className="brand-poke">Poke</span>
              <span className="brand-b">B</span>
              <span className="brand-ai">AI</span>
              <span className="brand-se">se</span>
            </h1>
            <span className="ai-chip-tag">
              <span className="ai-chip-dot" />
              LIVE
            </span>
          </div>
          
        </div>
      )}
    </div>
  );
}
