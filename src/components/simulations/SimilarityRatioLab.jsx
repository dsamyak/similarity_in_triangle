// components/simulations/SimilarityRatioLab.jsx — Station C
import { useState, useRef } from 'react';
import { narrate } from '../../hooks/useAudio.js';

const ROUNDS = [
  { label:'Round 1: Find the scale factor. △ABC ~ △DEF with AB=6, DE=9, BC=8. Find EF.',
    triA:{A:[0,0],B:[6,0],C:[0,8]}, triB:{A:[0,0],B:[9,0],C:[0,12]},
    sideLabels:{'AB':6,'BC':8,'DE':9},
    missingSide:'EF', correctSF:1.5, correctAnswer:12,
    context:'Both triangles are right-angled. Scale factor = DE ÷ AB. Then EF = BC × k.' },
  { label:"Round 2: Scale factor ½. PQ=10, QR=8. Find P'Q'.",
    triA:{A:[0,0],B:[10,0],C:[0,8]}, triB:{A:[0,0],B:[5,0],C:[0,4]},
    sideLabels:{'PQ':10,'QR':8},
    missingSide:"P'Q'", correctSF:0.5, correctAnswer:5,
    context:"The scale factor is 0.5. Multiply each side by ½. P'Q' = PQ × 0.5." },
  { label:"Round 3 (Real world): Tyler is 1.8 m tall, casts a 3 m shadow. A tower casts a 25 m shadow. Find the tower's height.",
    triA:{A:[0,0],B:[3,0],C:[0,1.8]}, triB:{A:[0,0],B:[25,0],C:[0,15]},
    sideLabels:{'Tyler height':'1.8 m','Tyler shadow':'3 m','Tower shadow':'25 m'},
    missingSide:'Tower height (m)', correctSF: 25/3, correctAnswer:15,
    context:'Similar triangles: person height / person shadow = tower height / tower shadow.' },
  { label:'Round 4: Scale factor k=3. Area of △ABC = 8 cm². Find area of △DEF.',
    triA:{A:[0,0],B:[2,0],C:[0,4]}, triB:{A:[0,0],B:[6,0],C:[0,12]},
    sideLabels:{'k':3,'Area △ABC':'8 cm²'},
    missingSide:'Area △DEF (cm²)', correctSF:3, correctAnswer:72,
    context:'Area scales by k². Area of △DEF = Area of △ABC × k² = 8 × 9 = 72 cm².' },
];

const SVG_W = 280, SVG_H = 220;
const SCALE_PX = 14; // px per unit

function toSvg([x,y]) { return [x * SCALE_PX + 20, SVG_H - y * SCALE_PX - 14]; }
function fromSvg(svgX, svgY) { return [(svgX - 20) / SCALE_PX, (SVG_H - 14 - svgY) / SCALE_PX]; }

function CoordSummary({ triA, triB, colorA, colorB, dragVertex }) {
  const fmt = v => (v % 1 === 0 ? v : v.toFixed(2));
  return (
    <div className="coord-summary-row" style={{ marginTop: 6 }}>
      <div className="coord-summary" style={{ borderColor: colorA }}>
        <div className="coord-summary__title" style={{ color: colorA }}>△ABC{dragVertex ? ' ✎' : ''}</div>
        <div className="coord-summary__grid">
          {['A','B','C'].map(k => (
            <div key={k} className="coord-summary__row">
              <span className="coord-vertex" style={{ color: colorA }}>{k}</span>
              <span className="coord-val">({fmt(triA[k][0])}, {fmt(triA[k][1])})</span>
            </div>
          ))}
        </div>
      </div>
      <div className="coord-summary" style={{ borderColor: colorB }}>
        <div className="coord-summary__title" style={{ color: colorB }}>△DEF</div>
        <div className="coord-summary__grid">
          {['A','B','C'].map(k => (
            <div key={k} className="coord-summary__row">
              <span className="coord-vertex" style={{ color: colorB }}>{k}</span>
              <span className="coord-val">({fmt(triB[k][0])}, {fmt(triB[k][1])})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TriSVG({ triA, triB, sf, size=250, onDragTriA }) {
  const svgRef = useRef(null);
  const dragRef = useRef(null);
  const [dragVertex, setDragVertex] = useState(null);

  const ptsA = ['A','B','C'].map(k => toSvg(triA[k]));
  const ptsB = ['A','B','C'].map(k => toSvg(triB[k]));
  const dA = ptsA.map((p,i)=>(i===0?'M':'L')+p.join(',')).join(' ')+'Z';
  const dB = ptsB.map((p,i)=>(i===0?'M':'L')+p.join(',')).join(' ')+'Z';

  const getSvgCoords = (e) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const svgX = ((clientX - rect.left) / rect.width) * SVG_W;
    const svgY = ((clientY - rect.top) / rect.height) * SVG_H;
    return fromSvg(svgX, svgY);
  };

  const handlePointerDown = (e) => {
    if (!onDragTriA) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const svgX = ((clientX - rect.left) / rect.width) * SVG_W;
    const svgY = ((clientY - rect.top) / rect.height) * SVG_H;

    for (const k of ['A','B','C']) {
      const [vx, vy] = toSvg(triA[k]);
      if (Math.hypot(svgX - vx, svgY - vy) <= 14) {
        dragRef.current = k;
        setDragVertex(k);
        e.preventDefault();
        return;
      }
    }
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current) return;
    e.preventDefault();
    const w = getSvgCoords(e);
    if (!w) return;
    const snapped = [Math.max(0, Math.round(w[0])), Math.max(0, Math.round(w[1]))];
    onDragTriA(dragRef.current, snapped, false);
  };

  const handlePointerUp = (e) => {
    if (!dragRef.current) return;
    const w = getSvgCoords(e);
    if (w) {
      const snapped = [Math.max(0, Math.round(w[0])), Math.max(0, Math.round(w[1]))];
      onDragTriA(dragRef.current, snapped, true);
    }
    dragRef.current = null;
    setDragVertex(null);
  };

  return (
    <svg
      ref={svgRef}
      width={SVG_W} height={SVG_H}
      style={{
        maxWidth:'100%', background:'rgba(11,20,55,0.5)', borderRadius:10,
        border: dragVertex ? '1px solid rgba(255,215,0,0.4)' : '1px solid rgba(0,212,255,0.1)',
        touchAction:'none', userSelect:'none',
        cursor: dragVertex ? 'grabbing' : (onDragTriA ? 'crosshair' : 'default'),
        transition:'border-color 0.2s',
      }}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
    >
      {/* Grid lines */}
      {Array.from({length:Math.floor(SVG_W/SCALE_PX)+1},(_,i)=>i).map(i => (
        <line key={`g${i}`} x1={20+i*SCALE_PX} y1={0} x2={20+i*SCALE_PX} y2={SVG_H} stroke="rgba(255,255,255,0.04)" strokeWidth={0.7}/>
      ))}
      {Array.from({length:Math.floor((SVG_H)/SCALE_PX)},(_,i)=>i).map(i => (
        <line key={`gh${i}`} x1={0} y1={SVG_H-14-i*SCALE_PX} x2={SVG_W} y2={SVG_H-14-i*SCALE_PX} stroke="rgba(255,255,255,0.04)" strokeWidth={0.7}/>
      ))}
      {/* Axes */}
      <line x1={20} y1={0} x2={20} y2={SVG_H} stroke="rgba(255,255,255,0.15)" strokeWidth={1}/>
      <line x1={0} y1={SVG_H-14} x2={SVG_W} y2={SVG_H-14} stroke="rgba(255,255,255,0.15)" strokeWidth={1}/>

      {/* Triangle B (dashed gold) */}
      <path d={dB} fill="rgba(255,215,0,0.08)" stroke="rgba(255,215,0,0.8)" strokeWidth={2} strokeDasharray="7,3"/>
      {ptsB.map((p,i)=>(
        <text key={`lb${i}`} x={p[0]+5} y={p[1]-5} fill="rgba(255,215,0,0.9)" fontSize={10} fontWeight={700}>
          {['D','E','F'][i]}
        </text>
      ))}

      {/* Triangle A (solid cyan) */}
      <path d={dA} fill="rgba(0,212,255,0.12)" stroke="#00D4FF" strokeWidth={2.5}/>
      {ptsA.map((p,i)=>(
        <text key={`la${i}`} x={p[0]+5} y={p[1]-5} fill="#00D4FF" fontSize={10} fontWeight={700}>
          {['A','B','C'][i]}
        </text>
      ))}

      {/* Scale factor label */}
      {sf && (
        <text x={SVG_W/2} y={16} textAnchor="middle" fill="rgba(255,215,0,0.9)" fontSize={11} fontWeight={700}>
          k = {typeof sf==='number'?sf.toFixed(2):sf}
        </text>
      )}

      {/* Drag handles on TriA */}
      {onDragTriA && ['A','B','C'].map(k => {
        const [vx, vy] = toSvg(triA[k]);
        const isActive = dragVertex === k;
        return (
          <g key={`dh-${k}`}>
            {isActive && <circle cx={vx} cy={vy} r={18} fill="rgba(255,215,0,0.1)" stroke="rgba(255,215,0,0.25)" strokeWidth={1}/>}
            <circle
              cx={vx} cy={vy} r={isActive ? 11 : 8}
              fill={isActive ? '#FFD700' : '#00D4FF'}
              fillOpacity={isActive ? 0.9 : 0.55}
              stroke={isActive ? '#FFF' : '#00D4FF'}
              strokeWidth={1.5}
              style={{
                cursor:'grab',
                filter: isActive ? 'drop-shadow(0 0 6px #FFD700)' : 'drop-shadow(0 0 4px #00D4FF)',
              }}
            />
          </g>
        );
      })}
    </svg>
  );
}

export default function SimilarityRatioLab({ round, audioEnabled, onRoundComplete, onRatioCorrect }) {
  const cfg = ROUNDS[Math.min(round, ROUNDS.length-1)];
  const [sfInput, setSfInput] = useState('');
  const [ansInput, setAnsInput] = useState('');
  const [sfResult, setSfResult] = useState(null);
  const [ansResult, setAnsResult] = useState(null);
  const [hint, setHint] = useState(false);
  const [done, setDone] = useState(false);

  // Draggable triangle A state
  const [triA, setTriA] = useState({ ...cfg.triA });
  const [dragVertex, setDragVertex] = useState(null);

  const handleDragTriA = (vertex, snapped, isEnd) => {
    setTriA(prev => ({ ...prev, [vertex]: snapped }));
    if (isEnd) setDragVertex(null);
    else setDragVertex(vertex);
  };

  const checkSF = () => {
    if (!sfInput.trim()) return;
    const ok = Math.abs(parseFloat(sfInput) - cfg.correctSF) < 0.05;
    setSfResult(ok);
    if (!ok && audioEnabled) narrate([{text:'Not quite. Check the ratio of corresponding sides.', style:'encouragement'}]);
  };

  const checkAnswer = () => {
    if (!ansInput.trim() || done) return;
    const ok = Math.abs(parseFloat(ansInput) - cfg.correctAnswer) < 0.1;
    setAnsResult(ok);
    if (ok) {
      setDone(true);
      if (audioEnabled) narrate([{text:'Correct! Well done!', style:'celebration'}]);
      if (onRatioCorrect) onRatioCorrect();
      setTimeout(()=>onRoundComplete(), 1200);
    } else {
      if (audioEnabled) narrate([{text:'Not quite. Multiply the known side by the scale factor.', style:'encouragement'}]);
    }
  };

  const inputStyle = (result) => ({
    background: result === null ? 'rgba(255,255,255,0.06)' :
                result ? 'rgba(74,222,128,0.1)' : 'rgba(255,87,87,0.08)',
    border: `2px solid ${result===null?'rgba(255,255,255,0.15)':result?'var(--green)':'#FF5757'}`,
    borderRadius:'var(--r-sm)', color:'var(--white)',
    fontFamily:'var(--font-ui)', fontSize:'1rem', fontWeight:700,
    padding:'8px 12px', width:'100%', outline:'none',
  });

  return (
    <div className="station-layout">
      <div className="station-canvas" style={{flexDirection:'column',gap:10}}>
        <div className="station-instruction">{cfg.label}</div>

        {/* Drag hint */}
        <div className="drag-hint-badge">
          ✦ Drag △ABC vertices to explore proportional changes
        </div>

        <TriSVG
          triA={triA}
          triB={cfg.triB}
          sf={sfResult===true?cfg.correctSF:null}
          onDragTriA={handleDragTriA}
        />

        {/* Side labels */}
        <div style={{display:'flex',gap:8,flexWrap:'wrap',justifyContent:'center'}}>
          {Object.entries(cfg.sideLabels).map(([k,v])=>(
            <div key={k} style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',
              borderRadius:'var(--r-sm)',padding:'4px 10px',fontSize:'0.78rem',fontWeight:700,color:'var(--gray-200)'}}>
              {k} = {v}
            </div>
          ))}
          <div style={{background:'rgba(255,215,0,0.08)',border:'1px solid rgba(255,215,0,0.25)',
            borderRadius:'var(--r-sm)',padding:'4px 10px',fontSize:'0.78rem',fontWeight:700,color:'var(--gold)'}}>
            {cfg.missingSide} = ?
          </div>
        </div>

        {/* Coordinate Summary */}
        <CoordSummary triA={triA} triB={cfg.triB} colorA="#00D4FF" colorB="rgba(255,215,0,0.85)" dragVertex={dragVertex} />
      </div>

      <div className="station-controls">
        <div style={{fontSize:'0.78rem',color:'var(--gray-200)',lineHeight:1.6,marginBottom:4}}>
          {cfg.context}
        </div>

        {/* Step 1: Scale factor */}
        <div>
          <div className="control-label">Step 1 — Enter scale factor (k)</div>
          <div style={{display:'flex',gap:8}}>
            <input type="number" step="0.01" placeholder="k = ?" value={sfInput}
              onChange={e=>setSfInput(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&checkSF()}
              style={inputStyle(sfResult)}
              disabled={sfResult===true}/>
            <button className="check-btn" onClick={checkSF}
              style={{whiteSpace:'nowrap',padding:'8px 14px',fontSize:'0.8rem'}}
              disabled={sfResult===true||!sfInput.trim()}>
              Check k
            </button>
          </div>
          {sfResult === false && <div style={{fontSize:'0.72rem',color:'#FF5757',marginTop:4}}>✗ Try: larger side ÷ corresponding smaller side</div>}
          {sfResult === true  && <div style={{fontSize:'0.72rem',color:'var(--green)',marginTop:4}}>✓ k = {cfg.correctSF}</div>}
        </div>

        {/* Step 2: Missing side */}
        <div style={{opacity: sfResult===true ? 1 : 0.45, transition:'opacity 0.3s'}}>
          <div className="control-label">Step 2 — Find {cfg.missingSide}</div>
          <div style={{display:'flex',gap:8}}>
            <input type="number" step="0.1" placeholder="answer" value={ansInput}
              onChange={e=>setAnsInput(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&checkAnswer()}
              style={inputStyle(ansResult)}
              disabled={sfResult!==true||done}/>
            <button className="check-btn" onClick={checkAnswer}
              style={{whiteSpace:'nowrap',padding:'8px 14px',fontSize:'0.8rem'}}
              disabled={sfResult!==true||done||!ansInput.trim()}>
              Submit
            </button>
          </div>
          {sfResult!==true && <div style={{fontSize:'0.72rem',color:'var(--gray-400)',marginTop:4}}>Complete Step 1 first</div>}
          {ansResult === false && <div style={{fontSize:'0.72rem',color:'#FF5757',marginTop:4}}>✗ Multiply the original by k = {cfg.correctSF}</div>}
          {ansResult === true  && <div style={{fontSize:'0.72rem',color:'var(--green)',marginTop:4}}>✓ {cfg.missingSide} = {cfg.correctAnswer}</div>}
        </div>

        <button className="hint-btn" onClick={()=>setHint(h=>!h)}>💡 Hint</button>
        {hint && (
          <div className="hint-area">
            Scale factor k = (side of larger △) ÷ (corresponding side of smaller △).<br/>
            Then: missing side = known side × k.
          </div>
        )}
      </div>
    </div>
  );
}
