// components/simulations/TransformPlayground.jsx — Station A
import { useState, useCallback } from 'react';
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

function toSvgPt(pt, size=300, worldRange=14) {
  const s = size / worldRange;
  return [pt[0]*s + size/2, size/2 - pt[1]*s];
}

function TriSVG({ tri, color, dashed=false, size=300 }) {
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

function Grid({ size=300, worldRange=14 }) {
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

export default function TransformPlayground({ round, audioEnabled, onRoundComplete }) {
  // cfg is always derived from the current round prop (component re-mounts on round change via key prop)
  const cfg = ROUNDS[Math.min(round, ROUNDS.length-1)];
  const [live, setLive] = useState(() => ({ ...cfg.startTriangle }));
  const [log, setLog] = useState([]);
  const [dx, setDx] = useState(0), [dy, setDy] = useState(0);
  const [angle, setAngle] = useState(90);
  const [scale, setScale] = useState(2);
  const [matched, setMatched] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const addLog = (msg) => setLog(l => [...l, msg]);

  // Check is defined with useCallback but cfg is stable (component remounts each round)
  const check = useCallback((pts) => {
    if (isMatch(pts, cfg.targetTriangle, 0.5)) {
      setMatched(true);
      if (audioEnabled) narrate([{text:'Exactly right! The triangles match!', style:'celebration'}]);
      setTimeout(() => onRoundComplete(), 1400);
    }
  }, [cfg.targetTriangle, audioEnabled, onRoundComplete]);

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

  const reset = () => { setLive({ ...cfg.startTriangle }); setLog([]); setMatched(false); };

  const SVG_SIZE = 280;

  return (
    <div className="station-layout">
      <div className="station-canvas">
        <svg width={SVG_SIZE} height={SVG_SIZE} style={{background:'rgba(11,20,55,0.7)', borderRadius:12, border:'1px solid rgba(0,212,255,0.15)'}}>
          <Grid size={SVG_SIZE}/>
          {/* Target (dashed, gold) */}
          <TriSVG tri={cfg.targetTriangle} color="rgba(255,215,0,0.8)" dashed size={SVG_SIZE}/>
          {/* Live triangle (cyan / green when matched) */}
          <TriSVG tri={live} color={matched ? '#4ADE80' : '#00D4FF'} size={SVG_SIZE}/>
          {matched && (
            <text x={SVG_SIZE/2} y={24} textAnchor="middle" fill="#4ADE80" fontSize={18} fontWeight={900}>✓ Matched!</text>
          )}
        </svg>
        {/* Legend */}
        <div style={{display:'flex',gap:14,marginTop:8}}>
          <div style={{display:'flex',alignItems:'center',gap:5,fontSize:'0.72rem',color:'rgba(0,212,255,0.8)'}}>
            <div style={{width:14,height:3,background:'rgba(0,212,255,0.8)',borderRadius:2}}/> Your triangle
          </div>
          <div style={{display:'flex',alignItems:'center',gap:5,fontSize:'0.72rem',color:'rgba(255,215,0,0.8)'}}>
            <div style={{width:14,height:3,background:'rgba(255,215,0,0.8)',borderRadius:2,borderTop:'2px dashed'}}/> Target
          </div>
        </div>
      </div>

      <div className="station-controls">
        {/* Round info */}
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
