// components/ProgressMap.jsx
import { BADGES } from '../utils/badgeEngine.js';

const PHASE_DEFS = [
  { id: 'wonder',   label: 'Wonder',   emoji: '🔭' },
  { id: 'story',    label: 'Story',    emoji: '📖' },
  { id: 'simulate', label: 'Simulate', emoji: '⚗️' },
  { id: 'play',     label: 'Play',     emoji: '🎮' },
  { id: 'reflect',  label: 'Reflect',  emoji: '💭' },
];

export default function ProgressMap({ currentPhase, phaseComplete, xp, streak, audioEnabled, onToggleAudio, onReset }) {
  return (
    <nav className="progress-map">
      <div className="progress-map__logo">
        🔺 Intellia 360
      </div>

      <div className="progress-map__dots">
        {PHASE_DEFS.map((phase, i) => {
          const isActive = currentPhase === phase.id;
          const isComplete = phaseComplete?.[phase.id];
          return (
            <div key={phase.id} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <div className="phase-dot">
                <div className={`phase-dot__circle ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`}>
                  {isComplete ? '✓' : phase.emoji}
                </div>
                <span className={`phase-dot__label ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`}>
                  {phase.label}
                </span>
              </div>
              {i < PHASE_DEFS.length - 1 && (
                <div className={`phase-connector ${isComplete ? 'complete' : ''}`} style={{ marginBottom: 16 }} />
              )}
            </div>
          );
        })}
      </div>

      <div className="progress-map__stats">
        <div className="stat-chip stat-chip--xp">⚡ {xp} XP</div>
        {streak >= 2 && <div className="stat-chip stat-chip--streak">🔥 {streak}</div>}
        <button
          className="icon-btn"
          onClick={onToggleAudio}
          title={audioEnabled ? 'Mute narration' : 'Enable narration'}
        >
          {audioEnabled ? '🔊' : '🔇'}
        </button>
        <button
          className="icon-btn"
          onClick={() => { if (window.confirm('Reset progress?')) onReset(); }}
          title="Reset session"
        >
          ↺
        </button>
      </div>
    </nav>
  );
}
