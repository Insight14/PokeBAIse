import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { PokeBaiseLogo } from './PokeBaiseLogo.jsx';

export function Footer() {
  return (
    <footer className="app-footer">
      <section className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <PokeBaiseLogo size={28} className="footer-logo-mark" />
            <span className="footer-tagline">
              Base + AI Smart Recommendation Engine for Pokémon TCG Pocket
            </span>
          </div>

          <div className="footer-badges">
            <span className="fan-project-badge">
              <Sparkles size={13} /> 100% Free Non-Commercial Fan Platform
            </span>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-disclaimer">
          <div className="disclaimer-header">
            <ShieldCheck size={15} className="disclaimer-icon" />
            <strong>Legal Notice & Trademark Disclaimers</strong>
          </div>
          <p>
            PokeBaise is an independent, unofficial fan-made project unaffiliated with, endorsed, sponsored, or approved by Nintendo, Game Freak, Creatures Inc., or The Pokémon Company.
          </p>
          <p>
            Pokémon, Pokémon Trading Card Game, Pokémon TCG Pocket, character names, and card artwork are registered trademarks of Nintendo, Creatures Inc., and Game Freak.
          </p>
        </div>
      </section>
    </footer>
  );
}
