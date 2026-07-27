import React, { useState } from 'react';
import { rateDeckWithAI } from '../utils/aiDeckRater.js';
import {
  Cpu,
  Star,
  Zap,
  Shield,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ArrowRightLeft,
  Loader2,
  CheckCircle2,
  XCircle,
  Key
} from 'lucide-react';

function GradeCircle({ grade, score }) {
  const gradeColors = {
    'A+': '#16a34a', 'A': '#22c55e', 'A-': '#4ade80',
    'B+': '#0284c7', 'B': '#38bdf8', 'B-': '#7dd3fc',
    'C+': '#ca8a04', 'C': '#facc15', 'C-': '#fde047',
    'D': '#ea580c', 'F': '#dc2626',
  };
  const color = gradeColors[grade] || '#6b7280';

  return (
    <div className="ai-grade-circle" style={{ '--grade-color': color }}>
      <span className="grade-letter">{grade}</span>
      <span className="grade-score">{score}/100</span>
    </div>
  );
}

function RatingBar({ label, value, max = 10, color = '#0284c7' }) {
  return (
    <div className="ai-rating-bar">
      <div className="rating-bar-header">
        <span>{label}</span>
        <span className="rating-val" style={{ color }}>{value}/{max}</span>
      </div>
      <div className="rating-bar-bg">
        <div
          className="rating-bar-fill"
          style={{ width: `${(value / max) * 100}%`, background: color }}
        />
      </div>
    </div>
  );
}

export function AIDeckRater({ deckCards, deckName }) {
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiKeyInput, setApiKeyInput] = useState('');

  const hasApiKey = !!import.meta.env.VITE_GEMINI_API_KEY &&
    import.meta.env.VITE_GEMINI_API_KEY !== 'your_gemini_api_key_here';

  async function handleRate() {
    setLoading(true);
    setError(null);
    setRating(null);
    try {
      const result = await rateDeckWithAI(deckCards, deckName);
      setRating(result);
    } catch (err) {
      if (err.message === 'NO_API_KEY') {
        setError('no_key');
      } else if (err.message === 'EMPTY_DECK') {
        setError('empty');
      } else {
        setError(err.message || 'Unknown error');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ai-rater-container glass-card">
      <div className="ai-rater-header">
        <div className="ai-rater-title">
          <div className="ai-engine-badge">
            <Cpu size={14} /> PokeBaise AI Engine
          </div>
          <h3>AI Deck Rater</h3>
          <p className="subtext">
            Get a deep strategic analysis of your deck — win conditions, synergies, weaknesses, and
            suggested improvements powered by Gemini AI.
          </p>
        </div>
        <button
          className="rate-deck-btn"
          onClick={handleRate}
          disabled={loading || deckCards.length === 0}
        >
          {loading ? (
            <><Loader2 size={16} className="spin-icon" /> Analyzing…</>
          ) : (
            <><Star size={16} /> Rate My Deck</>
          )}
        </button>
      </div>

      {/* No API Key State */}
      {error === 'no_key' && (
        <div className="ai-rater-no-key">
          <Key size={32} />
          <h4>Gemini API Key Required</h4>
          <p>
            Add your free Gemini API key to enable AI deck analysis. Get one in 30 seconds at{' '}
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">
              aistudio.google.com
            </a>
            .
          </p>
          <p className="no-key-instructions">
            Once you have it, paste it in the chat and I'll add it to your <code>.env</code> file.
          </p>
        </div>
      )}

      {/* Empty Deck Error */}
      {error === 'empty' && (
        <div className="ai-rater-error">
          <AlertTriangle size={24} />
          <p>Add at least one card to your deck before rating it.</p>
        </div>
      )}

      {/* Other Errors */}
      {error && error !== 'no_key' && error !== 'empty' && (
        <div className="ai-rater-error">
          <XCircle size={24} />
          <p>Analysis failed: {error}</p>
          <button className="btn micro-btn" onClick={handleRate}>Try Again</button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="ai-rater-loading">
          <Loader2 size={32} className="spin-icon" />
          <p>Gemini AI is analyzing your deck…</p>
          <span className="loading-sub">Evaluating synergies, win conditions &amp; matchups</span>
        </div>
      )}

      {/* Results */}
      {rating && !loading && (
        <div className="ai-rating-results">
          {/* Top: Grade + Summary */}
          <div className="ai-results-top">
            <GradeCircle grade={rating.overallGrade} score={rating.overallScore} />
            <div className="ai-results-summary">
              <p className="ai-summary-text">{rating.summary}</p>
              <div className="ai-verdict">
                <CheckCircle2 size={16} />
                <strong>{rating.verdict}</strong>
              </div>
            </div>
          </div>

          {/* Rating Bars */}
          <div className="ai-rating-bars">
            <RatingBar label="Consistency" value={rating.consistencyRating} color="#0284c7" />
            <RatingBar label="Aggression" value={rating.aggressionRating} color="#dc2626" />
          </div>

          {/* Win Condition */}
          <div className="ai-section">
            <div className="ai-section-title"><Zap size={15} /> Win Condition</div>
            <p>{rating.winCondition}</p>
          </div>

          {/* Synergies & Weaknesses row */}
          <div className="ai-two-col">
            <div className="ai-section">
              <div className="ai-section-title"><TrendingUp size={15} /> Key Synergies</div>
              <ul className="ai-list synergy-list">
                {rating.synergies?.map((s, i) => (
                  <li key={i}><CheckCircle2 size={13} /> {s}</li>
                ))}
              </ul>
            </div>
            <div className="ai-section">
              <div className="ai-section-title"><Shield size={15} /> Weaknesses</div>
              <ul className="ai-list weakness-list">
                {rating.weaknesses?.map((w, i) => (
                  <li key={i}><AlertTriangle size={13} /> {w}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Improvements */}
          {rating.improvements && rating.improvements.length > 0 && (
            <div className="ai-section">
              <div className="ai-section-title"><Lightbulb size={15} /> Suggested Improvements</div>
              <div className="ai-improvements">
                {rating.improvements.map((imp, i) => (
                  <div key={i} className="ai-improvement-card">
                    {imp.type === 'replace' ? (
                      <>
                        <div className="improvement-swap">
                          <span className="remove-card">−{imp.remove}</span>
                          <ArrowRightLeft size={14} />
                          <span className="add-card">+{imp.add}</span>
                        </div>
                        <p>{imp.reason}</p>
                      </>
                    ) : (
                      <>
                        <div className="improvement-adjust">
                          <span className="adjust-card">{imp.card}</span>
                          <span className="adjust-action">{imp.action}</span>
                        </div>
                        <p>{imp.reason}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Cards */}
          {rating.missingCards && rating.missingCards.length > 0 && (
            <div className="ai-section">
              <div className="ai-section-title"><Star size={15} /> Cards That Would Help</div>
              <div className="ai-missing-cards">
                {rating.missingCards.map((c, i) => (
                  <span key={i} className="missing-card-chip">{c}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
