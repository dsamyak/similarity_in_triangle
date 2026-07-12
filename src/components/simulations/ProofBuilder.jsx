// components/simulations/ProofBuilder.jsx — Station D
import { useState } from 'react';
import { narrate } from '../../hooks/useAudio.js';
import { shuffleArray } from '../../utils/shuffle.js';

const PROOFS = [
  {
    label: 'Round 1 (SSS): Arrange the 3-step proof for △ABC ≅ △DEF by SSS.',
    steps: [
      { statement: 'AB = DE (given)', reason: 'Given' },
      { statement: 'BC = EF, AC = DF (given)', reason: 'Given' },
      { statement: '△ABC ≅ △DEF', reason: 'SSS Congruence' },
    ],
    allCards: [
      'AB = DE (given)', 'BC = EF, AC = DF (given)', '△ABC ≅ △DEF',
      'Given', 'SSS Congruence', 'SAS Congruence',
    ],
  },
  {
    label: 'Round 2 (ASA with shared side): 4-step proof for △ABC ≅ △DCA.',
    steps: [
      { statement: '∠A = ∠D (given)', reason: 'Given' },
      { statement: 'AC = AC (shared side)', reason: 'Reflexive Property' },
      { statement: '∠C = ∠C (given)', reason: 'Given' },
      { statement: '△ABC ≅ △DCA', reason: 'ASA Congruence' },
    ],
    allCards: [
      '∠A = ∠D (given)', 'AC = AC (shared side)', '∠C = ∠C (given)', '△ABC ≅ △DCA',
      'Given', 'Reflexive Property', 'ASA Congruence', 'SAS Congruence',
    ],
  },
  {
    label: 'Round 3 (AA Similarity, parallel lines): 5-step proof for △ADE ~ △ABC.',
    steps: [
      { statement: 'DE ∥ BC (given)', reason: 'Given' },
      { statement: '∠ADE = ∠ABC', reason: 'Corresponding Angles Postulate' },
      { statement: '∠A = ∠A (common)', reason: 'Reflexive Property' },
      { statement: '△ADE ~ △ABC', reason: 'AA Similarity' },
      { statement: 'AD/AB = DE/BC', reason: 'Definition of Similar Triangles' },
    ],
    allCards: [
      'DE ∥ BC (given)', '∠ADE = ∠ABC', '∠A = ∠A (common)', '△ADE ~ △ABC', 'AD/AB = DE/BC',
      'Given', 'Corresponding Angles Postulate', 'Reflexive Property',
      'AA Similarity', 'Definition of Similar Triangles', 'SSS Congruence',
    ],
  },
];

export default function ProofBuilder({ round, audioEnabled, onRoundComplete, onProofPerfect }) {
  const proof = PROOFS[Math.min(round, PROOFS.length-1)];
  const [cards] = useState(() => shuffleArray(proof.allCards));
  const [slots, setSlots] = useState(proof.steps.map(()=>({stmt:null,reason:null})));
  const [usedCards, setUsedCards] = useState(new Set());
  const [results, setResults] = useState(null);
  // Track which slot is selected for click-based assignment
  const [selectedSlot, setSelectedSlot] = useState(null); // { stepIdx, field } | null
  // Drag state
  const [dragging, setDragging] = useState(null);

  // ——— Click-based interaction ———

  const handleSlotClick = (stepIdx, field) => {
    if (results) return;
    const current = slots[stepIdx][field];

    if (current) {
      // Clicking a filled slot — return it to the tray
      setSlots(prev => {
        const next = [...prev];
        next[stepIdx] = {...next[stepIdx], [field]: null};
        return next;
      });
      setUsedCards(prev => { const s = new Set(prev); s.delete(current); return s; });
      setSelectedSlot(null);
      return;
    }

    // If a card from the tray is selected, place it here
    if (selectedSlot && selectedSlot.type === 'card') {
      const card = selectedSlot.card;
      if (usedCards.has(card)) return;
      setSlots(prev => {
        const next = [...prev];
        const oldCard = next[stepIdx][field];
        const newUsed = new Set(usedCards);
        if (oldCard) newUsed.delete(oldCard);
        next[stepIdx] = {...next[stepIdx], [field]: card};
        newUsed.add(card);
        setUsedCards(newUsed);
        return next;
      });
      setSelectedSlot(null);
      return;
    }

    // Otherwise select this slot as a destination
    setSelectedSlot({ type: 'slot', stepIdx, field });
  };

  const handleCardClick = (card) => {
    if (results || usedCards.has(card)) return;

    if (selectedSlot && selectedSlot.type === 'slot') {
      // Place the card in the previously-selected slot
      const { stepIdx, field } = selectedSlot;
      setSlots(prev => {
        const next = [...prev];
        const oldCard = next[stepIdx][field];
        const newUsed = new Set(usedCards);
        if (oldCard) newUsed.delete(oldCard);
        next[stepIdx] = {...next[stepIdx], [field]: card};
        newUsed.add(card);
        setUsedCards(newUsed);
        return next;
      });
      setSelectedSlot(null);
      return;
    }

    // Select this card as the source
    setSelectedSlot({ type: 'card', card });
  };

  // ——— Drag-based interaction (desktop) ———

  const handleDragStart = (card) => {
    setDragging(card);
    setSelectedSlot(null);
  };

  const dropOnSlot = (stepIdx, field) => {
    if (!dragging || usedCards.has(dragging)) return;
    setSlots(prev => {
      const next = [...prev];
      const oldCard = next[stepIdx][field];
      const newUsed = new Set(usedCards);
      if (oldCard) newUsed.delete(oldCard);
      next[stepIdx] = {...next[stepIdx], [field]: dragging};
      newUsed.add(dragging);
      setUsedCards(newUsed);
      return next;
    });
    setResults(null);
    setDragging(null);
  };

  const submit = () => {
    setSelectedSlot(null);
    const res = slots.map((s,i) => ({
      stmt: s.stmt === proof.steps[i].statement,
      reason: s.reason === proof.steps[i].reason,
    }));
    setResults(res);
    const allOk = res.every(r=>r.stmt && r.reason);
    if (audioEnabled) {
      narrate([{ text: allOk ? 'Excellent! A perfectly structured proof!' : 'Some steps are out of place. Check the highlighted rows.', style: allOk?'celebration':'encouragement'}]);
    }
    if (allOk) {
      if (onProofPerfect) onProofPerfect();
      setTimeout(()=>onRoundComplete(), 1400);
    }
  };

  const reset = () => {
    setSlots(proof.steps.map(()=>({stmt:null,reason:null})));
    setUsedCards(new Set());
    setResults(null);
    setSelectedSlot(null);
  };

  const allFilled = slots.every(s=>s.stmt && s.reason);

  const isCardSelected = (card) => selectedSlot?.type === 'card' && selectedSlot.card === card;
  const isSlotSelected = (stepIdx, field) =>
    selectedSlot?.type === 'slot' && selectedSlot.stepIdx === stepIdx && selectedSlot.field === field;

  return (
    <div className="station-layout">
      <div className="station-canvas" style={{flexDirection:'column',gap:14,overflowY:'auto',padding:'16px 20px'}}>
        <div className="station-instruction">{proof.label}</div>

        {/* Usage tip */}
        <div style={{fontSize:'0.72rem',color:'var(--gray-400)',background:'rgba(255,255,255,0.03)',
          borderRadius:6,padding:'6px 10px',lineHeight:1.6}}>
          💡 <strong style={{color:'var(--cyan)'}}>How to use:</strong> Click a card below to select it (highlighted), then click an empty proof slot to place it.
          Or drag cards directly into slots. Click a filled slot to remove the card.
        </div>

        {/* Proof table header */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:4}}>
          <div className="control-label" style={{padding:'4px 8px'}}>Statement</div>
          <div className="control-label" style={{padding:'4px 8px'}}>Reason</div>
        </div>

        <div className="proof-table">
          {proof.steps.map((step,i)=>{
            const res = results?.[i];
            const stmtFilled = !!slots[i].stmt;
            const rsnFilled  = !!slots[i].reason;
            const stmtCls = res ? (res.stmt?'correct':'incorrect') : (stmtFilled?'filled':'') + (isSlotSelected(i,'stmt')?' slot-selected':'');
            const rsnCls  = res ? (res.reason?'correct':'incorrect') : (rsnFilled?'filled':'') + (isSlotSelected(i,'reason')?' slot-selected':'');
            return (
              <div key={i} className="proof-row">
                <div
                  className={`proof-slot ${stmtCls}`}
                  onDragOver={e=>e.preventDefault()}
                  onDrop={()=>{ dropOnSlot(i,'stmt'); setResults(null); }}
                  onClick={()=>{ handleSlotClick(i,'stmt'); setResults(null); }}
                  style={{cursor:'pointer', outline: isSlotSelected(i,'stmt') ? '2px solid var(--gold)' : 'none'}}
                >
                  {slots[i].stmt || <span style={{color:'var(--gray-600)',fontSize:'0.75rem'}}>Click to place…</span>}
                </div>
                <div
                  className={`proof-slot ${rsnCls}`}
                  onDragOver={e=>e.preventDefault()}
                  onDrop={()=>{ dropOnSlot(i,'reason'); setResults(null); }}
                  onClick={()=>{ handleSlotClick(i,'reason'); setResults(null); }}
                  style={{cursor:'pointer', outline: isSlotSelected(i,'reason') ? '2px solid var(--gold)' : 'none'}}
                >
                  {slots[i].reason || <span style={{color:'var(--gray-600)',fontSize:'0.75rem'}}>Click to place…</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Result feedback */}
        {results && (
          <div style={{fontSize:'0.78rem',lineHeight:1.6}}>
            {results.every(r=>r.stmt&&r.reason) ? (
              <span style={{color:'var(--green)',fontWeight:700}}>✓ Perfect proof! Advancing…</span>
            ) : (
              <span style={{color:'#FF5757'}}>✗ Some steps are wrong — fix highlighted rows and try again.</span>
            )}
          </div>
        )}

        {/* Card tray */}
        <div className="control-label">Available cards — click to select, then click a slot:</div>
        <div className="proof-card-tray">
          {cards.map((card,i)=>(
            <div
              key={i}
              className={`proof-card ${usedCards.has(card)?'used':''} ${isCardSelected(card)?'card-selected':''}`}
              draggable={!usedCards.has(card)}
              onDragStart={()=>handleDragStart(card)}
              onClick={()=>handleCardClick(card)}
              style={{
                cursor: usedCards.has(card) ? 'default' : 'pointer',
                outline: isCardSelected(card) ? '2px solid var(--gold)' : 'none',
                background: isCardSelected(card) ? 'rgba(255,215,0,0.12)' : undefined,
              }}
            >
              {card}
            </div>
          ))}
        </div>
      </div>

      <div className="station-controls">
        <div style={{fontSize:'0.78rem',color:'var(--gray-200)',lineHeight:1.7}}>
          <strong style={{color:'var(--cyan)'}}>Proof structure:</strong><br/>
          • <strong style={{color:'var(--gold)'}}>Statements</strong> — what is true at each step.<br/>
          • <strong style={{color:'var(--gold)'}}>Reasons</strong> — why each statement is true.<br/>
          • Order matters for logical flow.
        </div>
        <div style={{fontSize:'0.75rem',color:'var(--gray-400)',lineHeight:1.6,marginTop:8}}>
          <strong style={{color:'var(--gold)'}}>Tip:</strong> Start with the "Given" statements, then build towards the conclusion.
        </div>
        <div style={{display:'flex',gap:8,marginTop:'auto'}}>
          <button className="check-btn" onClick={submit} disabled={!allFilled} style={{flex:1}}>
            Submit Proof
          </button>
          <button className="btn-secondary" style={{padding:'8px 14px',fontSize:'0.8rem'}} onClick={reset}>↺ Reset</button>
        </div>
        {!allFilled && (
          <div style={{fontSize:'0.7rem',color:'var(--gray-400)',textAlign:'center'}}>
            Fill all {proof.steps.length} rows to submit
          </div>
        )}
      </div>
    </div>
  );
}
