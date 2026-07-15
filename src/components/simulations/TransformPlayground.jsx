// components/simulations/TransformPlayground.jsx — Station A
import { useState, useCallback, useRef } from 'react';
import { translate, rotate, reflect, dilate, isMatch, centroid } from '../../utils/geometry.js';
import { narrate } from '../../hooks/useAudio.js';

const ROUNDS = [
  { label: 'Round 1: Translate the triangle to match the target.',
    startTriangle: { A:[0,0], B:[3,0], C:[0,4] },
    targetTriangle: { A:[3,0], B:[6,0], C:[3,4] },
    hint: 'Try translating right by 3 units (x: +3, y: 0).',
    requiredOps: ['translation'] },
  { label: 'Round 2: Rotate the triangle 90° anticlockwise to match.',
    startTriangle: { A:[3,0], B:[6,0], C:[3,4] },
    targetTriangle: { A:[0,3], B:[0,6], C:[-4,3] },
    hint: 'Apply a 90° rotation around the centroid of the triangle.',
    requiredOps: ['rotation'] },
  { label: 'Round 3: Reflect the triangle over the y-axis to match.',
    startTriangle: { A:[1,1], B:[4,1], C:[1,4] },
    targetTriangle: { A:[-1,1], B:[-4,1], C:[-1,4] },
    hint: 'Reflect over the y-axis (click "over y" button).',
    requiredOps: ['reflection'] },
  { label: 'Round 4: Dilate the triangle by scale factor 2 from the origin.',
    startTriangle: { A:[0,0], B:[2,0], C:[0,3] },
    targetTriangle: { A:[0,0], B:[4,0], C:[0,6] },
    hint: 'Apply dilation with k=2 from the origin.',
    requiredOps: ['dilation'] },
];

const SVG_SIZE = 280;
const WORLD_RANGE = 14;

function toSvgPt(pt, size=SVG_SIZE, worldRange=WORLD_RANGE) {
  const s = size / worldRange;
  return [pt[0]*s + size/2, size/2 - pt[1]*s];
}

function fromSvgPt(svgX, svgY, size=SVG_SIZE, worldRange=WORLD_RANGE) {
  const s = size / worldRange;
  return [(svgX - size/2) / s, (size/2 - svgY) / s];
}

function TriSVG({ tri, color, dashed=false, size=SVG_SIZE }) {
  const pts = ['A','B','C'].map(k => toSvgPt(tri[k], size));
  const d = pts.map((p,i) => (i===0?'M':'L')+p.join(',')).join(' ')+'Z';
  return (
    <>
      <path d={d} fill={`${color}22`} stroke={color} strokeWidth={2.5}
            strokeDasharray={dashed?'8,4':'none'}/>
      {['A','B','C'].map((k,i) => (
        <circle key={k} cx={pts[i][0]} cy={pts[i][1]} r={5} fill={color} opacity={0.85}/>
      ))}
      {['A','B','C'].map((k,i) => (
        <text key={`l${k}`} x={pts[i][0]+7} y={pts[i][1]-4} fill={color} fontSize={11} fontWeight={700}>{k}</text>
      ))}
    </>
  );
}

function Grid({ size=SVG_SIZE, worldRange=WORLD_RANGE }) {
  const s = size / worldRange;
  const lines = [];
  for(let i=-7;i<=7;i++) {
    const x = i*s+size/2, y = i*s+size/2;
    lines.push(<line key={`v${i}`} x1={x} y1={0} x2={x} y2={size} stroke="rgba(255,255,255,0.06)" strokeWidth={i===0?1.5:0.8}/>);
    lines.push(<line key={`h${i}`} x1={0} y1={y} x2={size} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={i===0?1.5:0.8}/>);
    if(i!==0){
      lines.push(<text key={`xl${i}`} x={i*s+size/2} y={size/2+14} textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize={8}>{i}</text>);
      lines.push(<text key={`yl${i}`} x={size/2+5} y={size/2-i*s+4} fill="rgba(255,255,255,0.2)" fontSize={8}>{i}</text>);
    }
  }
  return <>{lines}</>;
}

function CoordSummary({ tri, color, label, matched }) {
  const fmt = v => (v % 1 === 0 ? v : v.toFixed(2));
  return (
    <div className="coord-summary" style={{ borderColor: matched ? 'var(--green)' : color }}>
      <div className="coord-summary__title" style={{ color: matched ? 'var(--green)' : color }}>
        {matched ? '✓ ' : ''}{label}
      </div>
      <div className="coord-summary__grid">
        {['A','B','C'].map(k => (
          <div key={k} className="coord-summary__row">
            <span className="coord-vertex" style={{ color }}>{k}</span>
            <span className="coord-val">({fmt(tri[k][0])}, {fmt(tri[k][1])})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TransformPlayground({ round, audioEnabled, onRoundComplete }) {
  const cfg = ROUNDS[Math.min(round, ROUNDS.length-1)];
  const [live, setLive] = useState(() => ({ ...cfg.startTriangle }));
  const [log, setLog] = useState([]);
  const [dx, setDx] = useState(0), [dy, setDy] = useState(0);
  const [angle, setAngle] = useState(90);
  const [scale, setScale] = useState(2);
  const [matched, setMatched] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [dragVertex, setDragVertex] = useState(null);

  const svgRef = useRef(null);

  const addLog = (msg) => setLog(l => [...l, msg]);

  const check = useCallback((pts) => {
    if (isMatch(pts, cfg.targetTriangle, 0.5)) {
      setMatched(true);
      if (audioEnabled) narrate([{text:'Exactly right! The triangles match!', style:'celebration'}]);
      setTimeout(() => onRoundComplete(), 1400);
    }
  }, [cfg.targetTriangle, audioEnabled, onRoundComplete]);

  /* ─── Pointer-based drag logic ─── */
  const getWorldCoords = (e) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const svgX = ((clientX - rect.left) / rect.width) * SVG_SIZE;
    const svgY = ((clientY - rect.top) / rect.height) * SVG_SIZE;
    return fromSvgPt(svgX, svgY);
  };

  const handleSvgPointerDown = (e) => {
    if (matched) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const svgX = ((clientX - rect.left) / rect.width) * SVG_SIZE;
    const svgY = ((clientY - rect.top) / rect.height) * SVG_SIZE;

    for (const k of ['A','B','C']) {
      const [vx, vy] = toSvgPt(live[k]);
      if (Math.hypot(svgX - vx, svgY - vy) <= 14) {
        setDragVertex(k);
        e.preventDefault();
        return;
      }
    }
  };

  const handleSvgPointerMove = (e) => {
    if (!dragVertex || matched) return;
    e.preventDefault();
    const w = getWorldCoords(e);
    if (!w) return;
    const snapped = [Math.round(w[0]), Math.round(w[1])];
    setLive(prev => ({ ...prev, [dragVertex]: snapped }));
  };

  const handleSvgPointerUp = (e) => {
    if (!dragVertex) return;
    const w = getWorldCoords(e) || live[dragVertex];
    const snapped = w ? [Math.round(w[0]), Math.round(w[1])] : live[dragVertex];
    setLive(prev => {
      const next = { ...prev, [dragVertex]: snapped };
      addLog(`Drag ${dragVertex} → (${snapped[0]}, ${snapped[1]})`);
      check(next);
      return next;
    });
    setDragVertex(null);
  };

  const applyTranslate = () => {
    if (matched) return;
    const next = translate(live, dx, dy);
    setLive(next);
    addLog(`Translate (${dx>0?'+':''}${dx}, ${dy>0?'+':''}${dy})`);
    check(next);
  };

  const applyRotate = () => {
    if (matched) return;
    const c = centroid(live);
    const next = rotate(live, angle, c);
    setLive(next);
    addLog(`Rotate ${angle}° around centroid`);
    check(next);
  };

  const applyReflect = (axis) => {
    if (matched) return;
    const next = reflect(live, axis);
    setLive(next);
    addLog(`Reflect over ${axis}-axis`);
    check(next);
  };

  const applyDilate = () => {
    if (matched) return;
    const next = dilate(live, scale, [0,0]);
    setLive(next);
    addLog(`Dilate k=${scale} from origin`);
    check(next);
  };

  const reset = () => { setLive({ ...cfg.startTriangle }); setLog([]); setMatched(false); setDragVertex(null); };

  const liveColor = matched ? '#4ADE80' : (dragVertex ? '#FFD700' : '#00D4FF');

  return (
    <div className="station-layout">
      <div className="station-canvas" style={{ flexDirection:'column', gap:10 }}>
        {/* Drag hint */}
        {!matched && (
          <div className="drag-hint-badge">
            ✦ Drag the glowing vertices on the canvas — or use the controls →
          </div>
        )}

        <svg
          ref={svgRef}
          width={SVG_SIZE} height={SVG_SIZE}
          style={{
            background:'rgba(11,20,55,0.7)', borderRadius:12,
            border:`1px solid ${dragVertex ? 'rgba(255,215,0,0.4)' : 'rgba(0,212,255,0.15)'}`,
            cursor: dragVertex ? 'grabbing' : 'crosshair',
            touchAction:'none', userSelect:'none',
            transition:'border-color 0.2s',
          }}
          onMouseDown={handleSvgPointerDown}
          onMouseMove={handleSvgPointerMove}
          onMouseUp={handleSvgPointerUp}
          onMouseLeave={handleSvgPointerUp}
          onTouchStart={handleSvgPointerDown}
          onTouchMove={handleSvgPointerMove}
          onTouchEnd={handleSvgPointerUp}
        >
          <Grid size={SVG_SIZE}/>
          <TriSVG tri={cfg.targetTriangle} color="rgba(255,215,0,0.8)" dashed size={SVG_SIZE}/>
          <TriSVG tri={live} color={liveColor} size={SVG_SIZE}/>

          {/* Drag handles */}
          {!matched && ['A','B','C'].map(k => {
            const [vx, vy] = toSvgPt(live[k]);
            const isActive = dragVertex === k;
            return (
              <g key={`dh-${k}`}>
                {isActive && <circle cx={vx} cy={vy} r={20} fill="rgba(255,215,0,0.1)" stroke="rgba(255,215,0,0.3)" strokeWidth={1}/>}
                <circle
                  cx={vx} cy={vy} r={isActive ? 13 : 10}
                  fill={isActive ? '#FFD700' : '#00D4FF'}
                  fillOpacity={isActive ? 0.9 : 0.55}
                  stroke={isActive ? '#FFF' : '#00D4FF'}
                  strokeWidth={2}
                  style={{
                    cursor: 'grab',
                    filter: isActive
                      ? 'drop-shadow(0 0 8px #FFD700)'
                      : 'drop-shadow(0 0 5px #00D4FF)',
                    transition:'r 0.15s, fill-opacity 0.15s',
                  }}
                />
                <text x={vx} y={vy+4} textAnchor="middle" fill="#fff" fontSize={9} fontWeight={800} style={{pointerEvents:'none'}}>{k}</text>
              </g>
            );
          })}

          {matched && (
            <text x={SVG_SIZE/2} y={24} textAnchor="middle" fill="#4ADE80" fontSize={18} fontWeight={900}>✓ Matched!</text>
          )}
        </svg>

        {/* Legend */}
        <div style={{display:'flex',gap:14}}>
          <div style={{display:'flex',alignItems:'center',gap:5,fontSize:'0.72rem',color:'rgba(0,212,255,0.8)'}}>
            <div style={{width:14,height:3,background:'rgba(0,212,255,0.8)',borderRadius:2}}/> Your triangle
          </div>
          <div style={{display:'flex',alignItems:'center',gap:5,fontSize:'0.72rem',color:'rgba(255,215,0,0.8)'}}>
            <div style={{width:14,height:3,background:'rgba(255,215,0,0.8)',borderRadius:2}}/> Target
          </div>
        </div>

        {/* Coordinate Summary */}
        <div className="coord-summary-row">
          <CoordSummary tri={live} color="#00D4FF" label="Your Triangle" matched={matched} />
          <CoordSummary tri={cfg.targetTriangle} color="rgba(255,215,0,0.85)" label="Target" matched={false} />
        </div>
      </div>

      <div className="station-controls">
        <div className="station-instruction">{cfg.label}</div>

        {/* Translate */}
        <div>
          <div className="control-label">Translate</div>
          <div className="slider-row">
            <span style={{fontSize:'0.75rem',color:'var(--gray-400)',minWidth:16}}>x:</span>
            <input type="range" min={-7} max={7} step={1} value={dx}
              style={{'--pct': `${((dx+7)/14)*100}%`}}
              onChange={e=>setDx(Number(e.target.value))}/>
            <span className="slider-val">{dx>0?'+':''}{dx}</span>
          </div>
          <div className="slider-row">
            <span style={{fontSize:'0.75rem',color:'var(--gray-400)',minWidth:16}}>y:</span>
            <input type="range" min={-7} max={7} step={1} value={dy}
              style={{'--pct': `${((dy+7)/14)*100}%`}}
              onChange={e=>setDy(Number(e.target.value))}/>
            <span className="slider-val">{dy>0?'+':''}{dy}</span>
          </div>
          <button className="check-btn" style={{width:'100%',fontSize:'0.82rem',padding:'8px'}} onClick={applyTranslate} disabled={matched}>Apply Translation</button>
        </div>

        {/* Rotate */}
        <div>
          <div className="control-label">Rotate</div>
          <div className="slider-row">
            <input type="range" min={-180} max={180} step={15} value={angle}
              style={{'--pct': `${((angle+180)/360)*100}%`}}
              onChange={e=>setAngle(Number(e.target.value))}/>
            <span className="slider-val">{angle}°</span>
          </div>
          <button className="check-btn" style={{width:'100%',fontSize:'0.82rem',padding:'8px',background:'linear-gradient(135deg,#FFB347,#FF8C00)'}} onClick={applyRotate} disabled={matched}>Apply Rotation</button>
        </div>

        {/* Reflect */}
        <div>
          <div className="control-label">Reflect</div>
          <div className="axis-btns">
            {['x','y','y=x','y=-x'].map(ax => (
              <button key={ax} className="axis-btn" onClick={()=>applyReflect(ax)} disabled={matched}>over {ax}</button>
            ))}
          </div>
        </div>

        {/* Dilate */}
        <div>
          <div className="control-label">Dilate (from origin)</div>
          <div className="slider-row">
            <input type="range" min={0.25} max={3} step={0.25} value={scale}
              style={{'--pct': `${((scale-0.25)/2.75)*100}%`}}
              onChange={e=>setScale(Number(e.target.value))}/>
            <span className="slider-val">k={scale}</span>
          </div>
          <button className="check-btn" style={{width:'100%',fontSize:'0.82rem',padding:'8px',background:'linear-gradient(135deg,#C77DFF,#7B2FBE)'}} onClick={applyDilate} disabled={matched}>Apply Dilation</button>
        </div>

        {/* Transform log */}
        <div>
          <div className="control-label">Steps taken</div>
          <div className="transform-log">
            {log.length === 0 ? <span style={{color:'var(--gray-600)'}}>none yet</span> : log.map((l,i)=><div key={i}>→ {l}</div>)}
          </div>
        </div>

        {/* Hint & Reset */}
        <div style={{display:'flex',gap:8}}>
          <button className="hint-btn" onClick={()=>setShowHint(h=>!h)}>💡 Hint</button>
          <button className="btn-secondary" style={{flex:1,fontSize:'0.8rem',padding:'6px'}} onClick={reset}>↺ Reset</button>
        </div>
        {showHint && <div className="hint-area">{cfg.hint}</div>}
      </div>
    </div>
  );
}
