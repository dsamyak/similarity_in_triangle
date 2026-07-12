// components/IntroScreen.jsx
import { BADGES } from '../utils/badgeEngine.js';

const PHASE_CARDS = [
  { emoji: '🔭', label: 'Wonder', desc: 'Hook' },
  { emoji: '📖', label: 'Story', desc: '6 Panels' },
  { emoji: '⚗️', label: 'Simulate', desc: '4 Stations' },
  { emoji: '🎮', label: 'Play', desc: '120 Qs' },
  { emoji: '💭', label: 'Reflect', desc: 'Badge' },
];

export default function IntroScreen({ onStart, xp, badges }) {
  return (
    <div className="intro-screen">
      {/* Background orbs */}
      <div className="intro-bg-orb intro-bg-orb--1" />
      <div className="intro-bg-orb intro-bg-orb--2" />
      <div className="intro-bg-orb intro-bg-orb--3" />

      {/* Badge icon */}
      <div className="intro-badge-icon">🔺</div>

      {/* Subtitle */}
      <div className="intro-subtitle">Grade 10 Mathematics · Intellia 360</div>

      {/* Title */}
      <h1 className="intro-title">
        Similarity & Congruence<br />in Triangles
      </h1>

      {/* Pill tags */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div className="intro-pill">📐 Geometric Transformations</div>
        <div className="intro-pill">🏆 120 Questions · 9 Badges</div>
        {xp > 0 && <div className="intro-pill" style={{ color: 'var(--cyan)', borderColor: 'rgba(0,212,255,0.3)', background: 'rgba(0,212,255,0.08)' }}>⚡ {xp} XP earned</div>}
      </div>

      {/* Phase map */}
      <div className="intro-phase-map">
        {PHASE_CARDS.map((p, i) => (
          <div key={p.label} className="intro-phase-card">
            <div className="intro-phase-card__emoji">{p.emoji}</div>
            <div className="intro-phase-card__label">{p.label}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--gray-400)', marginTop: 2 }}>{p.desc}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <button className="btn-primary" onClick={onStart} id="btn-start-journey">
          🚀 Start Journey
        </button>
        {xp > 0 && (
          <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
            Session auto-saved — your {xp} XP progress is restored.
          </p>
        )}
      </div>

      {/* Badge preview */}
      {badges.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 400 }}>
          {badges.map(id => {
            const b = BADGES.find(x => x.id === id);
            return b ? (
              <div key={id} style={{
                background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.25)',
                borderRadius: 20, padding: '3px 10px', fontSize: '0.75rem',
                color: 'var(--gold-dim)', display: 'flex', alignItems: 'center', gap: 4
              }}>
                {b.emoji} {b.label.replace(/^.+? /, '')}
              </div>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
