// components/simulations/CongruenceDetective.jsx — Station B
import { useState } from 'react';
import { narrate } from '../../hooks/useAudio.js';

const ROUNDS = [
  {
    label: 'Round 1: Identify the congruence criterion for each triangle pair.',
    cards: [
      { criterion:'SSS', marks:'|||', label:'All 3 sides marked equal' },
      { criterion:'SAS', marks:'||∠||', label:'2 sides + included angle' },
      { criterion:'ASA', marks:'∠|∠', label:'2 angles + included side' },
      { criterion:'Not Enough Info', marks:'||', label:'Only 2 sides known' },
    ],
  },
  {
    label: 'Round 2: Distinguish ASA vs AAS — where is the marked angle relative to the marked side?',
    cards: [
      { criterion:'ASA', marks:'∠|∠', label:'Side between the 2 angles' },
      { criterion:'AAS', marks:'∠∠|', label:'Side NOT between angles' },
      { criterion:'SAS', marks:'||∠', label:'Angle between 2 sides' },
      { criterion:'Not Enough Info', marks:'∠|', label:'Only 1 angle + 1 side' },
    ],
  },
  {
    label: 'Round 3: RHS and tricky cases.',
    cards: [
      { criterion:'RHS', marks:'90°+H+|', label:'Right angle, hypotenuse + 1 leg' },
      { criterion:'SSS', marks:'|||', label:'3 pairs of equal sides' },
      { criterion:'Not Enough Info', marks:'∠∠', label:'Only 2 angles — similar, not congruent' },
      { criterion:'AAS', marks:'∠∠|', label:'2 angles + non-included side' },
    ],
  },
];

const CRITERIA_OPTIONS = ['SSS','SAS','ASA','AAS','RHS','Not Enough Info'];

const CRITERIA_HELP = {
  SSS:  'Side-Side-Side — all 3 corresponding sides are equal.',
  SAS:  'Side-Angle-Side — 2 sides and the angle BETWEEN them are equal.',
  ASA:  'Angle-Side-Angle — 2 angles and the side BETWEEN them are equal.',
  AAS:  'Angle-Angle-Side — 2 angles and a NON-INCLUDED side are equal.',
  RHS:  'Right angle–Hypotenuse–Side — for right triangles only.',
  'Not Enough Info': 'The given information is insufficient to prove congruence.',
};

function DiagramSVG({ card }) {
  const { criterion } = card;

  if (criterion === 'SSS') return (
    <svg viewBox="0 0 120 100" width={120} height={100}>
      <polygon points="10,90 110,90 60,10" fill="rgba(0,212,255,0.08)" stroke="rgba(0,212,255,0.7)" strokeWidth={2}/>
      {[[60,90],[35,50],[85,50]].map((p,i)=><text key={i} x={p[0]} y={p[1]} textAnchor="middle" fill="rgba(0,212,255,0.9)" fontSize={12} fontWeight={800}>|</text>)}
    </svg>
  );
  if (criterion === 'SAS') return (
    <svg viewBox="0 0 120 100" width={120} height={100}>
      <polygon points="10,90 110,90 60,10" fill="rgba(255,107,53,0.08)" stroke="rgba(255,107,53,0.7)" strokeWidth={2}/>
      <text x={35} y={50} textAnchor="middle" fill="rgba(255,107,53,0.9)" fontSize={12} fontWeight={800}>|</text>
      <text x={85} y={50} textAnchor="middle" fill="rgba(255,107,53,0.9)" fontSize={12} fontWeight={800}>|</text>
      <path d="M10,72 Q20,80 30,72" fill="none" stroke="rgba(255,215,0,0.9)" strokeWidth={2}/>
    </svg>
  );
  if (criterion === 'ASA') return (
    <svg viewBox="0 0 120 100" width={120} height={100}>
      <polygon points="10,90 110,90 60,10" fill="rgba(74,222,128,0.08)" stroke="rgba(74,222,128,0.7)" strokeWidth={2}/>
      <text x={60} y={95} textAnchor="middle" fill="rgba(74,222,128,0.9)" fontSize={12} fontWeight={800}>||</text>
      <path d="M10,72 Q20,80 30,72" fill="none" stroke="rgba(74,222,128,0.9)" strokeWidth={2}/>
      <path d="M90,72 Q100,80 110,72" fill="none" stroke="rgba(74,222,128,0.9)" strokeWidth={2}/>
    </svg>
  );
  if (criterion === 'AAS') return (
    <svg viewBox="0 0 120 100" width={120} height={100}>
      <polygon points="10,90 110,90 60,10" fill="rgba(199,125,255,0.08)" stroke="rgba(199,125,255,0.7)" strokeWidth={2}/>
      <text x={85} y={50} textAnchor="middle" fill="rgba(199,125,255,0.9)" fontSize={12} fontWeight={800}>|</text>
      <path d="M10,72 Q20,80 30,72" fill="none" stroke="rgba(199,125,255,0.9)" strokeWidth={2}/>
      <path d="M90,72 Q100,80 110,72" fill="none" stroke="rgba(199,125,255,0.9)" strokeWidth={2}/>
    </svg>
  );
  if (criterion === 'RHS') return (
    <svg viewBox="0 0 120 100" width={120} height={100}>
      <polygon points="10,90 110,90 10,10" fill="rgba(255,215,0,0.08)" stroke="rgba(255,215,0,0.7)" strokeWidth={2}/>
      <rect x={10} y={74} width={16} height={16} fill="none" stroke="rgba(255,215,0,0.9)" strokeWidth={2}/>
      <text x={60} y={95} textAnchor="middle" fill="rgba(255,215,0,0.9)" fontSize={11} fontWeight={800}>H</text>
      <text x={18} y={55} textAnchor="middle" fill="rgba(255,215,0,0.9)" fontSize={11} fontWeight={800}>|</text>
    </svg>
  );
  // Not Enough Info
  return (
    <svg viewBox="0 0 120 100" width={120} height={100}>
      <polygon points="10,90 110,90 60,10" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.3)" strokeWidth={2} strokeDasharray="5,3"/>
      <text x={60} y={55} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={22} fontWeight={800}>?</text>
    </svg>
  );
}

export default function CongruenceDetective({ round, audioEnabled, onRoundComplete, onStationPerfect }) {
  const cfg = ROUNDS[Math.min(round, ROUNDS.length-1)];
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  // Track if any wrong answer has been given this round (for the stationB perfect badge)
  const [hadWrong, setHadWrong] = useState(false);

  const handleSelect = (i, val) => {
    if (results) {
      // Allow re-selection if submitted and some were wrong
      const allCorrect = results.every(Boolean);
      if (allCorrect) return;
    }
    setAnswers(a => ({...a, [i]: val}));
    setResults(null);
  };

  const submit = () => {
    const res = cfg.cards.map((c,i) => answers[i] === c.criterion);
    setResults(res);
    const allCorrect = res.every(Boolean);

    if (audioEnabled) {
      narrate([{ text: allCorrect
        ? 'Perfect! All criteria identified correctly!'
        : 'Check the highlighted cards — some are incorrect.', style: allCorrect ? 'celebration' : 'encouragement' }]);
    }

    if (!allCorrect) {
      setHadWrong(true);
    } else {
      // Award badge only if the entire round was first-attempt correct
      if (!hadWrong && onStationPerfect) onStationPerfect();
      setTimeout(() => onRoundComplete(), 1400);
    }
  };

  const allAnswered = cfg.cards.every((_, i) => answers[i]);

  return (
    <div className="station-layout">
      <div className="station-canvas" style={{flexDirection:'column',gap:16}}>
        <div className="station-instruction">{cfg.label}</div>
        <div className="criterion-cards">
          {cfg.cards.map((card, i) => {
            const res = results?.[i];
            // null = not submitted, true = correct, false = incorrect
            const cls = results != null ? (res ? 'correct' : 'incorrect') : '';
            return (
              <div key={i} className={`criterion-card ${cls}`}>
                <DiagramSVG card={card}/>
                <div style={{fontSize:'0.72rem',color:'var(--gray-300)',textAlign:'center',marginBottom:4}}>
                  {card.label}
                </div>
                <select
                  className="criterion-select"
                  value={answers[i] || ''}
                  onChange={e=>handleSelect(i, e.target.value)}
                  // Allow re-selection if last submission had errors
                  disabled={results != null && results.every(Boolean)}
                >
                  <option value="">Select criterion…</option>
                  {CRITERIA_OPTIONS.map(o=><option key={o} value={o}>{o}</option>)}
                </select>
                {results != null && (
                  <div style={{fontSize:'0.72rem',fontWeight:700,color:res?'var(--green)':'#FF5757',marginTop:4}}>
                    {res ? '✓ Correct!' : `✗ Answer: ${card.criterion}`}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Re-try prompt */}
        {results != null && !results.every(Boolean) && (
          <div style={{fontSize:'0.78rem',color:'var(--gold)',textAlign:'center'}}>
            Fix the incorrect selections above, then submit again.
          </div>
        )}
      </div>

      <div className="station-controls">
        <div className="control-label" style={{marginBottom:8}}>Congruence Criteria Reference</div>
        {CRITERIA_OPTIONS.map(c=>(
          <div key={c} style={{fontSize:'0.74rem',color:'var(--gray-200)',padding:'5px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
            <strong style={{color:'var(--cyan)'}}>{c}:</strong>{' '}
            <span style={{color:'var(--gray-400)'}}>{CRITERIA_HELP[c]}</span>
          </div>
        ))}
        <div style={{marginTop:10,fontSize:'0.72rem',color:'var(--gray-400)',lineHeight:1.6}}>
          💡 Key: Is the angle <em>between</em> (included) or <em>outside</em> (non-included) the marked sides?
        </div>
        <button className="check-btn" onClick={submit}
          disabled={!allAnswered}
          style={{marginTop:'auto'}}>
          {results && !results.every(Boolean) ? 'Submit Again' : 'Check All Answers'}
        </button>
      </div>
    </div>
  );
}
