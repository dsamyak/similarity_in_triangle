// components/phases/StoryPhase.jsx
import { useEffect, useState } from 'react';
import { narrate, stopAudio } from '../../hooks/useAudio.js';
import { STORY_PANELS } from '../../data/storyContent.js';

// Inline SVG illustrations for each transformation type
function PanelSVG({ type, color }) {
  const c = color || '#00D4FF';

  if (type === 'translation') return (
    <svg viewBox="0 0 300 260" width="100%" height="100%">
      <rect x={20} y={20} width={260} height={220} rx={12} fill={`rgba(${hexToRgb(c)},0.06)`} stroke={`${c}33`} strokeWidth={1}/>
      {/* Grid */}
      {[60,100,140,180,220].map(y=><line key={y} x1={20} y1={y} x2={280} y2={y} stroke={`${c}18`} strokeWidth={1}/>)}
      {[60,100,140,180,220,260].map(x=><line key={x} x1={x} y1={20} x2={x} y2={240} stroke={`${c}18`} strokeWidth={1}/>)}
      {/* Original triangle */}
      <polygon points="60,200 140,200 60,100" fill={`rgba(${hexToRgb(c)},0.12)`} stroke={c} strokeWidth={2.5}/>
      {/* Arrow */}
      <defs><marker id="a1" markerWidth={8} markerHeight={8} refX={4} refY={4} orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--gold)"/></marker></defs>
      <line x1={130} y1={150} x2={190} y2={150} stroke="var(--gold)" strokeWidth={2} strokeDasharray="5,3" markerEnd="url(#a1)"/>
      {/* Translated triangle */}
      <polygon points="140,200 220,200 140,100" fill="rgba(255,215,0,0.1)" stroke="var(--gold)" strokeWidth={2} strokeDasharray="7,3"/>
      {/* Labels */}
      <text x={88} y={215} textAnchor="middle" fill={c} fontSize={11} fontWeight={700}>△ ABC</text>
      <text x={168} y={215} textAnchor="middle" fill="var(--gold)" fontSize={11} fontWeight={700}>△ A'B'C'</text>
      <text x={160} y={143} textAnchor="middle" fill="var(--gold)" fontSize={10}>(+80, 0)</text>
      {/* Character emoji */}
      <text x={240} y={55} fontSize={28} textAnchor="middle">👷</text>
      <text x={240} y={78} textAnchor="middle" fill={c} fontSize={10} fontWeight={700}>Tyler</text>
    </svg>
  );

  if (type === 'reflection') return (
    <svg viewBox="0 0 300 260" width="100%" height="100%">
      <rect x={20} y={20} width={260} height={220} rx={12} fill="rgba(255,107,157,0.06)" stroke="#FF6B9D33" strokeWidth={1}/>
      {/* Mirror line */}
      <line x1={150} y1={30} x2={150} y2={250} stroke="var(--gold)" strokeWidth={2} strokeDasharray="8,4"/>
      <text x={152} y={48} fill="var(--gold)" fontSize={10} fontWeight={700}>mirror</text>
      {/* Left triangle */}
      <polygon points="60,200 130,200 60,100" fill="rgba(255,107,157,0.12)" stroke="#FF6B9D" strokeWidth={2.5}/>
      {/* Right reflected */}
      <polygon points="240,200 170,200 240,100" fill="rgba(255,107,157,0.07)" stroke="#FF6B9D" strokeWidth={2} strokeDasharray="7,3"/>
      {/* Reflection arcs */}
      <path d="M90,140 Q150,110 210,140" stroke="var(--gold)" strokeWidth={1.5} fill="none" strokeDasharray="4,3"/>
      <text x={78} y={215} textAnchor="middle" fill="#FF6B9D" fontSize={11} fontWeight={700}>△ ABC</text>
      <text x={218} y={215} textAnchor="middle" fill="#FF6B9D" fontSize={11} fontWeight={700}>△ A'B'C'</text>
      <text x={230} y={55} fontSize={28} textAnchor="middle">👩‍🔧</text>
      <text x={230} y={78} textAnchor="middle" fill="#FF6B9D" fontSize={10} fontWeight={700}>Madison</text>
    </svg>
  );

  if (type === 'rotation') return (
    <svg viewBox="0 0 300 260" width="100%" height="100%">
      <rect x={20} y={20} width={260} height={220} rx={12} fill="rgba(255,179,71,0.06)" stroke="#FFB34733" strokeWidth={1}/>
      {/* Pivot */}
      <circle cx={150} cy={150} r={5} fill="var(--gold)" opacity={0.9}/>
      <circle cx={150} cy={150} r={80} fill="none" stroke="rgba(255,215,0,0.12)" strokeWidth={1} strokeDasharray="6,4"/>
      {/* Original */}
      <polygon points="150,70 230,150 150,150" fill="rgba(255,179,71,0.12)" stroke="#FFB347" strokeWidth={2.5}/>
      {/* Rotated 90° */}
      <polygon points="230,150 150,230 150,150" fill="rgba(255,179,71,0.07)" stroke="#FFB347" strokeWidth={2} strokeDasharray="7,3"/>
      {/* Arc arrow */}
      <defs><marker id="a2" markerWidth={8} markerHeight={8} refX={4} refY={4} orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#FFB347"/></marker></defs>
      <path d="M 230 110 A 80 80 0 0 1 190 230" fill="none" stroke="#FFB347" strokeWidth={2} strokeDasharray="5,3" markerEnd="url(#a2)"/>
      <text x={245} y={105} fill="#FFB347" fontSize={11} fontWeight={700}>90°</text>
      <text x={170} y={65} textAnchor="middle" fill="#FFB347" fontSize={11} fontWeight={700}>△ ABC</text>
      <text x={240} y={55} fontSize={28} textAnchor="middle">👨‍🔧</text>
      <text x={240} y={78} textAnchor="middle" fill="#FFB347" fontSize={10} fontWeight={700}>Brandon</text>
    </svg>
  );

  if (type === 'congruence') return (
    <svg viewBox="0 0 300 260" width="100%" height="100%">
      <rect x={20} y={20} width={260} height={220} rx={12} fill="rgba(74,222,128,0.05)" stroke="#4ADE8033" strokeWidth={1}/>
      <polygon points="50,210 170,210 50,80" fill="rgba(74,222,128,0.1)" stroke="#4ADE80" strokeWidth={2.5}/>
      <polygon points="130,210 250,210 130,80" fill="rgba(74,222,128,0.07)" stroke="#4ADE80" strokeWidth={2}/>
      {/* Tick marks */}
      {[[50,210,170,210],[170,210,50,80],[50,210,50,80]].map(([x1,y1,x2,y2],i)=>{
        const mx=(x1+x2)/2, my=(y1+y2)/2;
        return <text key={i} x={mx} y={my} textAnchor="middle" fill="#4ADE80" fontSize={13} fontWeight={900}>|</text>;
      })}
      {/* Congruence symbol */}
      <text x={150} y={40} textAnchor="middle" fill="#4ADE80" fontSize={32} fontWeight={900}>≅</text>
      <text x={150} y={246} textAnchor="middle" fill="#4ADE80" fontSize={12} fontWeight={800}>△ ABC ≅ △ DEF</text>
      <text x={236} y={55} fontSize={26} textAnchor="middle">👩‍💼</text>
      <text x={236} y={75} textAnchor="middle" fill="#4ADE80" fontSize={10} fontWeight={700}>Ashley</text>
    </svg>
  );

  if (type === 'dilation') return (
    <svg viewBox="0 0 300 260" width="100%" height="100%">
      <rect x={20} y={20} width={260} height={220} rx={12} fill="rgba(199,125,255,0.06)" stroke="#C77DFF33" strokeWidth={1}/>
      {/* Center of dilation */}
      <circle cx={80} cy={220} r={4} fill="var(--gold)"/>
      {/* Small triangle */}
      <polygon points="80,220 140,220 80,160" fill="rgba(199,125,255,0.12)" stroke="#C77DFF" strokeWidth={2}/>
      {/* Large triangle */}
      <polygon points="80,220 220,220 80,100" fill="rgba(199,125,255,0.06)" stroke="#C77DFF" strokeWidth={2.5} strokeDasharray="7,3"/>
      {/* Dilation rays */}
      <line x1={80} y1={220} x2={220} y2={220} stroke="rgba(255,215,0,0.3)" strokeWidth={1} strokeDasharray="4,3"/>
      <line x1={80} y1={220} x2={80} y2={100} stroke="rgba(255,215,0,0.3)" strokeWidth={1} strokeDasharray="4,3"/>
      {/* Scale factor */}
      <text x={155} y={213} fill="var(--gold)" fontSize={11} fontWeight={800}>k = 2</text>
      <text x={60} y={250} fill="#C77DFF" fontSize={10}>Centre</text>
      <text x={230} y={55} fontSize={26} textAnchor="middle">🧑‍🔬</text>
      <text x={230} y={75} textAnchor="middle" fill="#C77DFF" fontSize={10} fontWeight={700}>Jordan</text>
    </svg>
  );

  if (type === 'similarity') return (
    <svg viewBox="0 0 300 260" width="100%" height="100%">
      <rect x={20} y={20} width={260} height={220} rx={12} fill="rgba(255,215,0,0.05)" stroke="#FFD70033" strokeWidth={1}/>
      {/* Two similar triangles side by side */}
      <polygon points="30,220 110,220 30,130" fill="rgba(255,215,0,0.1)" stroke="var(--gold)" strokeWidth={2.5}/>
      <polygon points="150,220 270,220 150,85" fill="rgba(255,215,0,0.06)" stroke="var(--gold)" strokeWidth={2}/>
      {/* Angle marks */}
      <path d="M30,200 Q45,195 45,180" fill="none" stroke="var(--gold)" strokeWidth={1.5}/>
      <path d="M150,200 Q165,195 165,180" fill="none" stroke="var(--gold)" strokeWidth={1.5}/>
      {/* Similarity symbol */}
      <text x={150} y={40} textAnchor="middle" fill="var(--gold)" fontSize={32} fontWeight={900}>~</text>
      {/* Scale factor annotations */}
      <text x={70} y={240} textAnchor="middle" fill="var(--gold)" fontSize={10}>△ ABC</text>
      <text x={210} y={240} textAnchor="middle" fill="var(--gold)" fontSize={10}>△ DEF (k = 1.5)</text>
      {/* Proportion */}
      <text x={150} y={58} textAnchor="middle" fill="rgba(255,215,0,0.7)" fontSize={9}>AB/DE = BC/EF = AC/DF</text>
      <text x={228} y={58} fontSize={24} textAnchor="middle">👨‍💻</text>
      <text x={228} y={76} textAnchor="middle" fill="var(--gold)" fontSize={10} fontWeight={700}>Riley</text>
    </svg>
  );

  return null;
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

export default function StoryPhase({ panel, audioEnabled, onNextPanel, onComplete }) {
  const p = STORY_PANELS[panel];
  const [narrating, setNarrating] = useState(false);

  useEffect(() => {
    if (audioEnabled && p) {
      setNarrating(true);
      narrate([p.narration]).finally(() => setNarrating(false));
    }
  }, [panel, audioEnabled]);

  if (!p) return null;

  const isLast = panel === STORY_PANELS.length - 1;

  return (
    <div className="story-phase">
      <div className="story-panel" key={panel}>
        {/* Visual side */}
        <div className="story-panel__visual">
          <div className="story-panel__visual-bg"
            style={{ background: `radial-gradient(ellipse at center, ${p.color}12 0%, transparent 70%)` }}
          />
          <PanelSVG type={p.svgType} color={p.color} />
        </div>

        {/* Content side */}
        <div className="story-panel__content">
          <div className="story-panel__num">Panel {panel + 1} of {STORY_PANELS.length}</div>

          <div className="story-panel__character">
            {panel === 0 && '👷'} {panel === 1 && '👩‍🔧'} {panel === 2 && '👨‍🔧'} {panel === 3 && '👩‍💼'} {panel === 4 && '🧑‍🔬'} {panel === 5 && '👨‍💻'}
            {' '}{p.character}
          </div>

          <h2 className="story-panel__title">{p.title}</h2>

          <div
            className="story-panel__text"
            dangerouslySetInnerHTML={{ __html: p.text }}
          />

          {/* Vocab card */}
          <div className="vocab-card">
            <div className="vocab-card__term">
              📚 {p.vocab}
            </div>
            <div className="vocab-card__def">{p.vocabDef}</div>
          </div>

          {/* Navigation */}
          <div className="story-nav">
            <div className="story-dots">
              {STORY_PANELS.map((_, i) => (
                <div key={i} className={`story-dot ${i < panel ? 'done' : i === panel ? 'active' : ''}`} />
              ))}
            </div>

            {narrating && (
              <span style={{ fontSize: '0.75rem', color: 'var(--cyan)', marginLeft: 4 }}>🔊</span>
            )}

            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              {isLast ? (
                <button className="btn-primary" onClick={onComplete} id="btn-story-complete">
                  Start Simulations →
                </button>
              ) : (
                <button className="btn-cyan" onClick={onNextPanel} id={`btn-story-next-${panel}`}>
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
