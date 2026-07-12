// components/phases/SimulatePhase.jsx
import { useState } from 'react';
import { ACTIONS } from '../../App.jsx';
import TransformPlayground from '../simulations/TransformPlayground.jsx';
import CongruenceDetective from '../simulations/CongruenceDetective.jsx';
import SimilarityRatioLab from '../simulations/SimilarityRatioLab.jsx';
import ProofBuilder from '../simulations/ProofBuilder.jsx';
import { narrate } from '../../hooks/useAudio.js';

const STATION_ROUNDS = [4, 3, 4, 3]; // rounds per station

const STATIONS = [
  { id: 'A', label: 'Transform Playground', emoji: '🔄', desc: '4 Rounds' },
  { id: 'B', label: 'Congruence Detective', emoji: '🔍', desc: '3 Rounds' },
  { id: 'C', label: 'Ratio Lab', emoji: '📏', desc: '4 Rounds' },
  { id: 'D', label: 'Proof Builder', emoji: '🧩', desc: '3 Rounds' },
];

export default function SimulatePhase({ state, dispatch, audioEnabled, onComplete }) {
  const { currentSimStation, simStationsComplete, simRound } = state;
  const [showComplete, setShowComplete] = useState(false);

  const handleRoundComplete = () => {
    const maxRounds = STATION_ROUNDS[currentSimStation];
    const nextRound = simRound + 1;

    if (nextRound >= maxRounds) {
      // Mark this station as complete first
      dispatch({ type: ACTIONS.COMPLETE_SIM_STATION, payload: currentSimStation });

      if (currentSimStation < 3) {
        // Move to next station (also resets simRound to 0)
        dispatch({ type: ACTIONS.ADVANCE_SIM_STATION });
        if (audioEnabled) narrate([{ text: 'Station complete! Moving to the next challenge.', style: 'celebration' }]);
      } else {
        // All 4 stations done
        setShowComplete(true);
        if (audioEnabled) narrate([{ text: 'Outstanding! You have completed all four simulation stations!', style: 'celebration' }]);
      }
    } else {
      dispatch({ type: ACTIONS.NEXT_SIM_ROUND });
    }
  };

  const allDone = simStationsComplete.every(Boolean);

  // Build updated complete flags considering the action just dispatched above
  // (state is not yet updated synchronously, so we track this separately)
  const navigateToStation = (i) => {
    // Only allow navigating to completed stations or the current one
    if (simStationsComplete[i] || i === currentSimStation) {
      dispatch({ type: ACTIONS.SET_SIM_STATION, payload: i });
    }
  };

  return (
    <div className="simulate-phase">
      {/* Station tabs */}
      <div className="simulate-tabs">
        {STATIONS.map((s, i) => {
          const isAccessible = simStationsComplete[i] || i === currentSimStation;
          return (
            <button
              key={s.id}
              className={`simulate-tab ${currentSimStation === i ? 'active' : ''} ${simStationsComplete[i] ? 'complete' : ''} ${!isAccessible ? 'locked' : ''}`}
              onClick={() => isAccessible && navigateToStation(i)}
              style={{ cursor: isAccessible ? 'pointer' : 'not-allowed', opacity: isAccessible ? 1 : 0.5 }}
              title={!isAccessible ? 'Complete previous stations first' : ''}
            >
              {s.emoji} Station {s.id}: {s.label}
              <span style={{ fontSize: '0.65rem', color: 'var(--gray-400)', marginLeft: 4 }}>({s.desc})</span>
              {simStationsComplete[i] && <span style={{ marginLeft: 6, color: 'var(--green)', fontSize: '0.75rem' }}>✓</span>}
            </button>
          );
        })}
      </div>

      {/* Round indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 24px',
        background: 'rgba(13,27,75,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 700 }}>
          {STATIONS[currentSimStation].emoji} Round {simRound + 1} / {STATION_ROUNDS[currentSimStation]}
        </span>
        <div className="round-indicator">
          {Array(STATION_ROUNDS[currentSimStation]).fill(0).map((_, i) => (
            <div key={i} className={`round-dot ${i < simRound ? 'done' : i === simRound ? 'active' : ''}`} />
          ))}
        </div>
        {allDone && (
          <button className="btn-primary" style={{ marginLeft: 'auto', fontSize: '0.85rem', padding: '8px 24px' }}
            onClick={onComplete}>
            Proceed to Play →
          </button>
        )}
      </div>

      {/* Station content */}
      <div className="simulate-content">
        {showComplete ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 20, width: '100%', textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: '4rem' }}>🏆</div>
            <h2 className="font-display" style={{ fontSize: '2rem', color: 'var(--gold)' }}>
              All Stations Complete!
            </h2>
            <p style={{ color: 'var(--gray-200)', maxWidth: 400, lineHeight: 1.7 }}>
              You've mastered transformations, congruence criteria, similarity ratios, and geometric proofs.
            </p>
            <button className="btn-primary" onClick={onComplete} id="btn-sim-complete">
              🎮 Enter IntelliPlay™ →
            </button>
          </div>
        ) : (
          <>
            {currentSimStation === 0 && (
              <TransformPlayground
                key={`station-0-round-${simRound}`}
                round={simRound}
                audioEnabled={audioEnabled}
                onRoundComplete={handleRoundComplete}
              />
            )}
            {currentSimStation === 1 && (
              <CongruenceDetective
                key={`station-1-round-${simRound}`}
                round={simRound}
                audioEnabled={audioEnabled}
                onRoundComplete={handleRoundComplete}
                onStationPerfect={() => dispatch({ type: ACTIONS.SET_STATION_B_PERFECT })}
              />
            )}
            {currentSimStation === 2 && (
              <SimilarityRatioLab
                key={`station-2-round-${simRound}`}
                round={simRound}
                audioEnabled={audioEnabled}
                onRoundComplete={handleRoundComplete}
                onRatioCorrect={() => dispatch({ type: ACTIONS.ANSWER_CORRECT })}
              />
            )}
            {currentSimStation === 3 && (
              <ProofBuilder
                key={`station-3-round-${simRound}`}
                round={simRound}
                audioEnabled={audioEnabled}
                onRoundComplete={handleRoundComplete}
                onProofPerfect={() => dispatch({ type: ACTIONS.SET_PROOF_PERFECT })}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
