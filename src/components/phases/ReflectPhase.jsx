// components/phases/ReflectPhase.jsx
import { useState } from 'react';
import { BADGES } from '../../utils/badgeEngine.js';
import { calcStars, calcTotalStars } from '../../utils/scoring.js';
import { narrate } from '../../hooks/useAudio.js';
import { ACTIONS } from '../../App.jsx';

export default function ReflectPhase({ state, dispatch, audioEnabled, onRestart }) {
  const { xp, badges, worldScores, maxStreak, totalStars } = state;
  const [journal, setJournal] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const totalCorrect = worldScores.reduce((s, ws) => s + (ws||0), 0);
  const pct = Math.round((totalCorrect / 120) * 100);

  const handleSubmit = () => {
    setSubmitted(true);
    dispatch({ type: ACTIONS.COMPLETE_PHASE, payload: 'reflect' });
    if (audioEnabled) narrate([{ text: 'Lesson complete! You are a Proof Champion!', style: 'celebration' }]);
  };

  return (
    <div className="reflect-phase">
      {/* Left — summary */}
      <div className="reflect-left">
        <div className="wonder-tag">Phase 5 · Reflect</div>
        <h2 className="reflect-title">
          Lesson <span>Complete!</span><br/>What did you discover?
        </h2>

        {/* Journal */}
        <div className="journal-prompt">
          In your own words: <strong style={{color:'var(--gold)'}}>What is the difference between congruent and similar triangles?</strong><br/>
          Give an example from the story.
        </div>
        <textarea
          className="journal-textarea"
          placeholder="Write your thoughts here…"
          value={journal}
          onChange={e=>setJournal(e.target.value)}
          disabled={submitted}
        />

        {/* XP summary */}
        <div className="xp-summary">
          <div className="xp-summary__row">
            <span className="xp-summary__label">⚡ Total XP</span>
            <span className="xp-summary__val">{xp}</span>
          </div>
          <div className="xp-summary__row">
            <span className="xp-summary__label">⭐ Total Stars</span>
            <span className="xp-summary__val">{totalStars} / 36</span>
          </div>
          <div className="xp-summary__row">
            <span className="xp-summary__label">✅ Score</span>
            <span className="xp-summary__val">{totalCorrect}/120 ({pct}%)</span>
          </div>
          <div className="xp-summary__row">
            <span className="xp-summary__label">🔥 Best Streak</span>
            <span className="xp-summary__val">{maxStreak}</span>
          </div>
          <div className="xp-summary__row">
            <span className="xp-summary__label">🏅 Badges Earned</span>
            <span className="xp-summary__val">{badges.length} / {BADGES.length}</span>
          </div>
        </div>

        <div style={{display:'flex',gap:10}}>
          {!submitted && (
            <button className="btn-primary" onClick={handleSubmit}
              disabled={journal.trim().length < 10} id="btn-reflect-submit">
              🎓 Complete Lesson
            </button>
          )}
          {submitted && (
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              <div style={{color:'var(--green)',fontFamily:'var(--font-display)',fontSize:'1.1rem'}}>
                🌟 Journey complete! Amazing work!
              </div>
              <button className="btn-secondary" onClick={onRestart}>↺ Restart Lesson</button>
            </div>
          )}
        </div>
      </div>

      {/* Right — badges */}
      <div className="reflect-right">
        <div className="control-label" style={{marginBottom:4}}>🏅 Your Badges</div>
        <div className="badge-grid">
          {BADGES.map(badge => {
            const earned = badges.includes(badge.id);
            return (
              <div key={badge.id} className={`badge-item ${earned?'unlocked':''}`}>
                <div className="badge-item__emoji">{earned ? badge.emoji : '🔒'}</div>
                <div>{badge.label.replace(/^.+? /, '')}</div>
                {!earned && <div style={{fontSize:'0.6rem',color:'var(--gray-600)'}}>{badge.description}</div>}
              </div>
            );
          })}
        </div>

        {/* World scores */}
        <div className="control-label" style={{marginTop:16,marginBottom:8}}>🌍 World Results</div>
        <div style={{display:'flex',flexDirection:'column',gap:4}}>
          {worldScores.slice(0,6).map((ws,i)=>{
            const stars = ws!==null?calcStars(ws):0;
            return (
              <div key={i} style={{display:'flex',alignItems:'center',gap:8,fontSize:'0.75rem'}}>
                <span style={{color:'var(--gray-400)',minWidth:14}}>{i+1}</span>
                <div style={{flex:1,height:6,background:'rgba(255,255,255,0.07)',borderRadius:3,overflow:'hidden'}}>
                  <div style={{height:'100%',width:ws?`${ws*10}%`:'0%',
                    background:'linear-gradient(90deg,var(--cyan),var(--amber))',borderRadius:3,transition:'width 1s'}}/>
                </div>
                <span style={{color:'var(--gray-400)',minWidth:28}}>{ws||0}/10</span>
                <span>{[0,1,2].map(j=><span key={j} style={{color:j<stars?'var(--gold)':'rgba(255,255,255,0.15)',fontSize:'0.7rem'}}>★</span>)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
