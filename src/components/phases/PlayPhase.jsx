// components/phases/PlayPhase.jsx — IntelliPlay™ quiz engine
import { useState } from 'react';
import { ACTIONS } from '../../App.jsx';
import { narrate } from '../../hooks/useAudio.js';
import { calcXP, calcStars, canUnlockWorld } from '../../utils/scoring.js';
import { WORLD_NAMES } from '../../data/questionBank.js';

const TYPE_LABELS = {
  identify_transform: 'Identify Transform',
  coord_transform: 'Coordinate Transform',
  congruence_criterion: 'Congruence Criterion',
  similarity_criterion: 'Similarity Criterion',
  solve_congruent_side: 'Congruent Sides',
  solve_similar_side: 'Similar Sides',
  map_scale_word_problem: 'Map Scale',
  shadow_height_word_problem: 'Shadow & Height',
  true_false_criterion: 'True or False',
  area_ratio: 'Area Ratio',
  correspondence_notation: 'Correspondence',
  proof_completion: 'Proof Completion',
};

function StarDisplay({ count }) {
  return (
    <span>
      {[0, 1, 2].map(i => (
        <span key={i} style={{ color: i < count ? 'var(--gold)' : 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}>★</span>
      ))}
    </span>
  );
}

function CoordPlaneVisual({ question }) {
  const size = 180;
  const scale = size / 14;
  const toPx = ([x, y]) => [x * scale + size / 2, size / 2 - y * scale];

  const drawTri = (tri, color, dashed) => {
    if (!tri) return null;
    const pts = ['A', 'B', 'C'].map(k => toPx(tri[k]));
    const d = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p.join(',')).join(' ') + 'Z';
    return (
      <>
        <path d={d} fill={`${color}22`} stroke={color} strokeWidth={2}
              strokeDasharray={dashed ? '6,3' : 'none'} />
        {['A', 'B', 'C'].map((k, j) => (
          <text key={k} x={pts[j][0] + 5} y={pts[j][1] - 3} fill={color} fontSize={9} fontWeight={700}>{k}</text>
        ))}
      </>
    );
  };

  return (
    <svg width={size} height={size} style={{ background: 'rgba(11,20,55,0.6)', borderRadius: 8, border: '1px solid rgba(0,212,255,0.15)' }}>
      {/* Grid */}
      {[-6, -4, -2, 0, 2, 4, 6].map(i => (
        <g key={i}>
          <line x1={0} y1={i * scale + size / 2} x2={size} y2={i * scale + size / 2} stroke="rgba(255,255,255,0.05)" strokeWidth={i === 0 ? 1 : 0.5} />
          <line x1={i * scale + size / 2} y1={0} x2={i * scale + size / 2} y2={size} stroke="rgba(255,255,255,0.05)" strokeWidth={i === 0 ? 1 : 0.5} />
        </g>
      ))}
      {question.triangleA && drawTri(question.triangleA, '#00D4FF', false)}
      {question.triangleB && drawTri(question.triangleB, 'rgba(255,215,0,0.8)', true)}
    </svg>
  );
}

function QuestionView({ question, onAnswer, hintsUsed, attemptCount }) {
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleOption = (opt) => {
    if (confirmed) return;
    setSelected(opt);
  };

  const handleConfirm = () => {
    if (selected === null || confirmed) return;
    setConfirmed(true);
    const correct = String(selected) === String(question.correctAnswer);
    setTimeout(() => onAnswer(selected, correct), 600);
  };

  // Show hint1 after first wrong attempt, hint2 after second
  const hint = hintsUsed >= 2 ? question.hint2 : hintsUsed >= 1 ? question.hint1 : null;

  return (
    <>
      {/* Type tag */}
      <div className="question-type-tag">{TYPE_LABELS[question.type] || question.type}</div>

      {/* Visual */}
      {(question.visual === 'coordinatePlane' && question.triangleA) && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <CoordPlaneVisual question={question} />
        </div>
      )}

      {/* Question text */}
      <div className="question-text">{question.questionText}</div>

      {/* Hint */}
      {hint && <div className="hint-area">💡 {hint}</div>}

      {/* Attempt count feedback */}
      {attemptCount > 0 && !confirmed && (
        <div style={{ fontSize: '0.78rem', color: 'rgba(255,87,87,0.85)', marginBottom: 4 }}>
          ✗ Incorrect — try again! {attemptCount >= 2 ? 'Hint available above.' : ''}
        </div>
      )}

      {/* Options */}
      {question.options && (
        <div className="options-grid">
          {question.options.map((opt, i) => {
            let cls = 'option-btn';
            if (confirmed) {
              if (String(opt) === String(question.correctAnswer)) cls += ' correct';
              else if (opt === selected) cls += ' incorrect';
            } else if (opt === selected) {
              cls += ' selected';
            }
            return (
              <button key={i} id={`opt-${i}`} className={cls}
                onClick={() => handleOption(opt)} disabled={confirmed}>
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {/* Confirm button — only shown after selecting, before confirming */}
      {question.options && !confirmed && selected !== null && (
        <button className="btn-primary" style={{ fontSize: '0.9rem', padding: '10px 28px', marginTop: 4 }}
          onClick={handleConfirm}>
          Confirm Answer ✓
        </button>
      )}
    </>
  );
}

function FeedbackModal({ isCorrect, explanation, xpEarned, onContinue, onSkip, attemptCount }) {
  return (
    <div className="feedback-overlay">
      <div className={`feedback-card ${isCorrect ? 'correct' : 'incorrect'}`}>
        <div className="feedback-icon">{isCorrect ? '🎉' : '🤔'}</div>
        <div className="feedback-title">{isCorrect ? 'Correct!' : 'Not quite…'}</div>
        {isCorrect && <div className="feedback-xp">+{xpEarned} XP earned!</div>}
        <div className="feedback-explanation">{explanation}</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" style={{ fontSize: '0.9rem', padding: '10px 32px' }}
            onClick={onContinue}>
            {isCorrect ? 'Continue →' : 'Try Again'}
          </button>
          {!isCorrect && attemptCount >= 2 && onSkip && (
            <button className="btn-secondary" style={{ fontSize: '0.9rem', padding: '10px 20px' }}
              onClick={onSkip}>
              Skip Question →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PlayPhase({ state, dispatch, audioEnabled, onComplete }) {
  const { questionSet, currentQuestion, currentWorld, worldScores, xp, streak } = state;
  const [feedback, setFeedback] = useState(null); // {isCorrect, explanation, xpEarned}

  if (!questionSet.length) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ color: 'var(--cyan)', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>
          Loading questions…
        </div>
      </div>
    );
  }

  // If we've answered all questions, show completion screen
  if (currentQuestion >= questionSet.length) {
    return (
      <div className="play-phase" style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <div style={{ fontSize: '3rem' }}>🎓</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--gold)' }}>All Questions Done!</h2>
            <p style={{ color: 'var(--gray-200)', maxWidth: 360 }}>
              You've answered all {questionSet.length} questions. Time to reflect on your journey!
            </p>
            <button className="btn-primary" onClick={onComplete}>Proceed to Reflect →</button>
          </div>
        </div>
      </div>
    );
  }

  const q = questionSet[currentQuestion];
  const worldIndex = Math.floor(currentQuestion / 10);
  const worldQ = currentQuestion % 10;
  const worldScore = worldScores[worldIndex] || 0;
  const progress = ((worldQ + 1) / 10) * 100;

  const handleAnswer = (answer, isCorrect) => {
    const xpEarned = calcXP(state.attemptCount + 1, state.hintsUsed, streak);
    // On first wrong attempt, show hint1; on second, show hint2 as well as explanation
    const explanation = isCorrect
      ? q.explanation
      : (state.attemptCount >= 1 ? q.explanation : q.hint1);

    if (audioEnabled) {
      narrate([{ text: isCorrect ? 'Correct!' : 'Not quite.', style: isCorrect ? 'celebration' : 'encouragement' }]);
    }

    if (isCorrect) {
      dispatch({ type: ACTIONS.ANSWER_CORRECT });
    } else {
      dispatch({ type: ACTIONS.ANSWER_INCORRECT });
    }

    setFeedback({ isCorrect, explanation, xpEarned: isCorrect ? xpEarned : 0 });
  };

  const handleContinue = () => {
    if (feedback.isCorrect) {
      setFeedback(null);
      if (currentQuestion >= questionSet.length - 1) {
        onComplete();
      } else {
        dispatch({ type: ACTIONS.NEXT_QUESTION });
      }
    } else {
      // Wrong — let them try again
      setFeedback(null);
      // Reveal hint via USE_HINT if not already at max
      if (state.hintsUsed < 2) {
        dispatch({ type: ACTIONS.USE_HINT });
      }
    }
  };

  const handleSkip = () => {
    setFeedback(null);
    if (currentQuestion >= questionSet.length - 1) {
      onComplete();
    } else {
      dispatch({ type: ACTIONS.NEXT_QUESTION });
    }
  };

  return (
    <div className="play-phase" style={{ position: 'relative' }}>
      {/* World map sidebar */}
      <div className="play-sidebar">
        <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--gray-400)', marginBottom: 4 }}>
          12 Worlds
        </div>
        {WORLD_NAMES.map((name, i) => {
          const ws = worldScores[i];
          const stars = ws !== null && ws !== undefined ? calcStars(ws) : 0;
          const isPlayed = ws !== null && ws !== undefined;
          const unlocked = i === 0 || canUnlockWorld(worldScores[i - 1]);
          const isActive = worldIndex === i;
          return (
            <div key={i}
              className={`world-map-item ${isActive ? 'active' : ''} ${isPlayed ? 'complete' : ''} ${!unlocked ? 'locked' : ''}`}
              onClick={() => {
                if (unlocked && !isActive && !feedback) dispatch({ type: ACTIONS.SET_WORLD, payload: i });
              }}
              title={!unlocked ? 'Score 5+ in previous world to unlock' : name}
            >
              <span>{unlocked ? (i + 1) : '🔒'}</span>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
              {isPlayed && <StarDisplay count={stars} />}
            </div>
          );
        })}
      </div>

      {/* Main question area */}
      <div className="play-main">
        {/* Header */}
        <div className="play-header">
          <div className="play-world-title">
            🌍 {WORLD_NAMES[worldIndex]}
          </div>
          <div className="play-progress-bar">
            <div className="play-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="play-q-count">Q{worldQ + 1}/10 · World {worldIndex + 1}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="stat-chip stat-chip--xp" style={{ fontSize: '0.72rem' }}>⚡{xp}</div>
            {streak >= 2 && <div className="stat-chip stat-chip--streak" style={{ fontSize: '0.72rem' }}>🔥{streak}</div>}
          </div>
        </div>

        {/* Question */}
        <div className="play-question-area" style={{ position: 'relative' }}>
          <div className="question-panel">
            <QuestionView
              key={`q-${currentQuestion}`}
              question={q}
              onAnswer={handleAnswer}
              hintsUsed={state.hintsUsed}
              attemptCount={state.attemptCount}
            />
          </div>

          {/* Feedback modal */}
          {feedback && (
            <FeedbackModal
              isCorrect={feedback.isCorrect}
              explanation={feedback.explanation}
              xpEarned={feedback.xpEarned}
              onContinue={handleContinue}
              onSkip={handleSkip}
              attemptCount={state.attemptCount}
            />
          )}
        </div>
      </div>
    </div>
  );
}
