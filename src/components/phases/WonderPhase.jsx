// components/phases/WonderPhase.jsx
import { useEffect, useRef, useState } from 'react';
import { narrate } from '../../hooks/useAudio.js';

const NARRATION = [
  { text: "A city planner has a blueprint triangle with sides thirty, forty, and fifty metres.", style: 'statement' },
  { text: "A scale model shows six, eight, and ten centimetres. Are these triangles related?", style: 'question' },
  { text: "Let's uncover what makes two triangles similar, or exactly the same!", style: 'encouragement' },
];

function AnimatedTriangles() {
  const [t, setT] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      setT(((ts - startRef.current) % 4000) / 4000);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Large triangle (blueprint)
  const bigA = [120, 320], bigB = [320, 320], bigC = [120, 80];
  // Small similar triangle — animates scale
  const scale = 0.4 + 0.08 * Math.sin(t * 2 * Math.PI);
  const ox = 260, oy = 260;
  const smallA = [ox + (bigA[0]-120)*scale, oy + (bigA[1]-320)*scale];
  const smallB = [ox + (bigB[0]-120)*scale, oy + (bigB[1]-320)*scale];
  const smallC = [ox + (bigC[0]-120)*scale, oy + (bigC[1]-320)*scale];

  const glow = `drop-shadow(0 0 ${8 + 4*Math.sin(t*2*Math.PI)}px rgba(0,212,255,0.6))`;

  return (
    <svg viewBox="0 0 440 400" xmlns="http://www.w3.org/2000/svg"
         style={{ width: '100%', maxWidth: 440, filter: glow }}>
      {/* Grid lines */}
      {[80,120,160,200,240,280,320].map(y=>(
        <line key={`h${y}`} x1={40} y1={y} x2={400} y2={y} stroke="rgba(0,212,255,0.08)" strokeWidth={1}/>
      ))}
      {[80,120,160,200,240,280,320,360].map(x=>(
        <line key={`v${x}`} x1={x} y1={40} x2={x} y2={380} stroke="rgba(0,212,255,0.08)" strokeWidth={1}/>
      ))}

      {/* Large triangle — blueprint */}
      <polygon
        points={`${bigA} ${bigB} ${bigC}`}
        fill="rgba(0,212,255,0.08)"
        stroke="rgba(0,212,255,0.7)"
        strokeWidth={2.5}
      />
      {/* Labels */}
      <text x={220} y={340} textAnchor="middle" fill="rgba(0,212,255,0.9)" fontSize={12} fontWeight={700}>50 m</text>
      <text x={100} y={200} textAnchor="middle" fill="rgba(0,212,255,0.9)" fontSize={12} fontWeight={700}>40 m</text>
      <text x={230} y={210} textAnchor="middle" fill="rgba(0,212,255,0.9)" fontSize={12} fontWeight={700}>30 m</text>

      {/* Small similar triangle — scale model */}
      <polygon
        points={`${smallA} ${smallB} ${smallC}`}
        fill="rgba(255,107,53,0.12)"
        stroke="rgba(255,215,0,0.9)"
        strokeWidth={2}
        strokeDasharray="6,3"
      />
      {/* Ratio arrows */}
      <defs>
        <marker id="arr" markerWidth={6} markerHeight={6} refX={3} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="rgba(255,215,0,0.8)" />
        </marker>
      </defs>
      <line x1={bigA[0]} y1={bigA[1]} x2={smallA[0]} y2={smallA[1]}
            stroke="rgba(255,215,0,0.4)" strokeWidth={1} strokeDasharray="4,4" markerEnd="url(#arr)" />

      {/* Scale factor label */}
      <rect x={178} y={156} width={80} height={22} rx={4} fill="rgba(255,215,0,0.12)" stroke="rgba(255,215,0,0.35)" strokeWidth={1}/>
      <text x={218} y={171} textAnchor="middle" fill="rgba(255,215,0,1)" fontSize={11} fontWeight={800}>
        k = {scale.toFixed(2)}
      </text>

      {/* Legend */}
      <rect x={40} y={350} width={12} height={3} fill="rgba(0,212,255,0.7)" rx={1}/>
      <text x={57} y={356} fill="rgba(0,212,255,0.8)" fontSize={10}>Blueprint △</text>
      <rect x={150} y={350} width={12} height={3} fill="rgba(255,215,0,0.9)" rx={1}/>
      <text x={167} y={356} fill="rgba(255,215,0,0.8)" fontSize={10}>Scale model △</text>
    </svg>
  );
}

export default function WonderPhase({ audioEnabled, onComplete }) {
  const [narrating, setNarrating] = useState(false);

  useEffect(() => {
    if (audioEnabled) {
      setNarrating(true);
      narrate(NARRATION).finally(() => setNarrating(false));
    }
  }, [audioEnabled]);

  return (
    <div className="wonder-phase">
      {/* Left content */}
      <div className="wonder-left">
        <span className="wonder-tag">Phase 1 · Wonder</span>
        <h2 className="wonder-title">
          Two triangles.<br />Same shape?<br /><span>Same size?</span>
        </h2>
        <p className="wonder-text">
          Tyler and Madison are city planners designing a bridge. Their blueprint shows a triangle
          with sides <strong style={{color:'var(--cyan)'}}>30 m, 40 m, 50 m</strong>. The scale model
          uses <strong style={{color:'var(--gold)'}}>6 cm, 8 cm, 10 cm</strong>.
          <br /><br />
          Are these triangles <em>the same</em>? Or just <em>related</em>?
          The answer unlocks the geometry of similarity and congruence.
        </p>

        {/* Characters */}
        <div className="wonder-characters">
          <div className="character-chip">👷 Tyler</div>
          <div className="character-chip">📐 Madison</div>
        </div>

        {/* Big question */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(0,212,255,0.06) 0%, rgba(255,215,0,0.05) 100%)',
          border: '1.5px solid rgba(255,215,0,0.25)',
          borderRadius: 'var(--r-lg)',
          padding: '16px 20px',
          maxWidth: 420,
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
            🔭 The Big Question
          </div>
          <p style={{ fontSize: '1rem', color: 'var(--white)', lineHeight: 1.6, fontWeight: 600 }}>
            When can we say two triangles are <span style={{color:'var(--gold)'}}>congruent (≅)</span> or
            only <span style={{color:'var(--cyan)'}}>similar (~)</span>?
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="btn-primary" onClick={onComplete} id="btn-wonder-continue">
            Explore the Story →
          </button>
          {narrating && (
            <span style={{ fontSize: '0.75rem', color: 'var(--cyan)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>🔊</span> Narrating…
            </span>
          )}
        </div>
      </div>

      {/* Right: animated SVG */}
      <div className="wonder-right" style={{ background: 'radial-gradient(circle at center, rgba(0,212,255,0.04) 0%, transparent 70%)' }}>
        <div className="wonder-svg-stage">
          <AnimatedTriangles />
        </div>
      </div>
    </div>
  );
}
