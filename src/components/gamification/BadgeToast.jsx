// components/gamification/BadgeToast.jsx
import { useEffect } from 'react';
import { BADGES } from '../../utils/badgeEngine.js';
import { narrate } from '../../hooks/useAudio.js';

export default function BadgeToast({ badgeId, onDone }) {
  const badge = BADGES.find(b => b.id === badgeId);

  useEffect(() => {
    if (badge) {
      narrate([{ text: `Badge unlocked! ${badge.description}!`, style: 'celebration' }]);
      const timer = setTimeout(onDone, 4000);
      return () => clearTimeout(timer);
    }
  }, [badgeId]);

  if (!badge) return null;

  return (
    <div className="badge-toast" onClick={onDone} style={{ cursor:'pointer' }}>
      <div className="badge-toast__emoji">{badge.emoji}</div>
      <div className="badge-toast__info">
        <div className="badge-toast__title">🏅 Badge Unlocked!</div>
        <div style={{ fontFamily:'var(--font-display)', fontSize:'1rem', color:'var(--white)', margin:'2px 0' }}>
          {badge.label}
        </div>
        <div className="badge-toast__desc">{badge.description}</div>
      </div>
      <button
        onClick={onDone}
        style={{ background:'transparent', border:'none', color:'var(--gray-400)', cursor:'pointer', fontSize:'1.2rem', padding:0 }}
      >✕</button>
    </div>
  );
}
