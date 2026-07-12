// App.jsx — Root component, global state (useReducer)
import { useReducer, useEffect, useCallback } from 'react';
import './App.css';
import { calcXP, calcStars, calcTotalStars } from './utils/scoring.js';
import { checkBadges } from './utils/badgeEngine.js';
import { generateSessionQuestions } from './utils/shuffle.js';
import { QUESTION_BANK } from './data/questionBank.js';
import { stopAudio } from './hooks/useAudio.js';

// Phase components
import IntroScreen from './components/IntroScreen.jsx';
import WonderPhase from './components/phases/WonderPhase.jsx';
import StoryPhase from './components/phases/StoryPhase.jsx';
import SimulatePhase from './components/phases/SimulatePhase.jsx';
import PlayPhase from './components/phases/PlayPhase.jsx';
import ReflectPhase from './components/phases/ReflectPhase.jsx';

// Shared
import ProgressMap from './components/ProgressMap.jsx';
import BadgeToast from './components/gamification/BadgeToast.jsx';

const SESSION_KEY = 'intellia_sct_v1';

const initialState = {
  phase: 'intro',
  storyPanel: 0,
  currentSimStation: 0,
  simStationsComplete: [false, false, false, false],
  simRound: 0,
  questionSet: [],
  currentQuestion: 0,
  currentWorld: 0,
  worldScores: Array(12).fill(null),
  hintsUsed: 0,
  attemptCount: 0,
  xp: 0,
  totalStars: 0,
  streak: 0,
  maxStreak: 0,
  badges: [],
  stationBPerfect: false,
  ratioQuestionsCorrect: 0,
  proofBuilderPerfect: false,
  phaseComplete: {
    wonder: false, story: false, simulate: false,
    play: false, reflect: false,
  },
  sessionId: crypto.randomUUID(),
  audioEnabled: true,
  newBadgeId: null,
};

export const ACTIONS = {
  SET_PHASE: 'SET_PHASE',
  NEXT_STORY_PANEL: 'NEXT_STORY_PANEL',
  ADVANCE_SIM_STATION: 'ADVANCE_SIM_STATION',
  SET_SIM_STATION: 'SET_SIM_STATION',
  COMPLETE_SIM_STATION: 'COMPLETE_SIM_STATION',
  NEXT_SIM_ROUND: 'NEXT_SIM_ROUND',
  LOAD_QUESTIONS: 'LOAD_QUESTIONS',
  ANSWER_CORRECT: 'ANSWER_CORRECT',
  ANSWER_INCORRECT: 'ANSWER_INCORRECT',
  USE_HINT: 'USE_HINT',
  NEXT_QUESTION: 'NEXT_QUESTION',
  SET_WORLD: 'SET_WORLD',
  UNLOCK_BADGE: 'UNLOCK_BADGE',
  CLEAR_BADGE_TOAST: 'CLEAR_BADGE_TOAST',
  COMPLETE_PHASE: 'COMPLETE_PHASE',
  TOGGLE_AUDIO: 'TOGGLE_AUDIO',
  RESTORE_SESSION: 'RESTORE_SESSION',
  RESET_SESSION: 'RESET_SESSION',
  SET_STATION_B_PERFECT: 'SET_STATION_B_PERFECT',
  SET_PROOF_PERFECT: 'SET_PROOF_PERFECT',
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_PHASE:
      stopAudio();
      return { ...state, phase: action.payload, hintsUsed: 0, attemptCount: 0 };

    case ACTIONS.NEXT_STORY_PANEL:
      return { ...state, storyPanel: state.storyPanel + 1 };

    case ACTIONS.ADVANCE_SIM_STATION: {
      const next = Math.min(state.currentSimStation + 1, 3);
      return { ...state, currentSimStation: next, simRound: 0 };
    }

    case ACTIONS.SET_SIM_STATION:
      return { ...state, currentSimStation: action.payload, simRound: 0 };

    case ACTIONS.COMPLETE_SIM_STATION: {
      const updated = [...state.simStationsComplete];
      updated[action.payload] = true;
      return { ...state, simStationsComplete: updated };
    }

    case ACTIONS.NEXT_SIM_ROUND:
      return { ...state, simRound: state.simRound + 1 };

    case ACTIONS.LOAD_QUESTIONS:
      return { ...state, questionSet: action.payload, currentQuestion: 0, currentWorld: 0 };

    case ACTIONS.ANSWER_CORRECT: {
      const xpEarned = calcXP(state.attemptCount + 1, state.hintsUsed, state.streak);
      const newStreak = state.streak + 1;
      const worldIndex = Math.floor(state.currentQuestion / 10);
      const updatedWorldScores = [...state.worldScores];
      updatedWorldScores[worldIndex] = (updatedWorldScores[worldIndex] || 0) + 1;
      const isRatioType = state.questionSet[state.currentQuestion]?.type === 'solve_similar_side' ||
                          state.questionSet[state.currentQuestion]?.type === 'map_scale_word_problem';
      return {
        ...state,
        xp: state.xp + xpEarned,
        streak: newStreak,
        maxStreak: Math.max(state.maxStreak, newStreak),
        worldScores: updatedWorldScores,
        totalStars: calcTotalStars(updatedWorldScores),
        hintsUsed: 0,
        attemptCount: 0,
        ratioQuestionsCorrect: isRatioType ? state.ratioQuestionsCorrect + 1 : state.ratioQuestionsCorrect,
      };
    }

    case ACTIONS.ANSWER_INCORRECT:
      return { ...state, streak: 0, attemptCount: state.attemptCount + 1 };

    case ACTIONS.USE_HINT:
      return { ...state, hintsUsed: state.hintsUsed + 1 };

    case ACTIONS.NEXT_QUESTION: {
      const nextQ = state.currentQuestion + 1;
      const nextWorld = Math.floor(nextQ / 10);
      return {
        ...state,
        currentQuestion: nextQ,
        currentWorld: nextWorld,
        hintsUsed: 0,
        attemptCount: 0,
      };
    }

    case ACTIONS.SET_WORLD:
      return { ...state, currentWorld: action.payload, currentQuestion: action.payload * 10 };

    case ACTIONS.UNLOCK_BADGE:
      return {
        ...state,
        badges: [...state.badges, ...action.payload.filter(id => !state.badges.includes(id))],
        newBadgeId: action.payload[0] || null,
      };

    case ACTIONS.CLEAR_BADGE_TOAST:
      return { ...state, newBadgeId: null };

    case ACTIONS.COMPLETE_PHASE: {
      const phaseComplete = { ...state.phaseComplete, [action.payload]: true };
      return { ...state, phaseComplete };
    }

    case ACTIONS.TOGGLE_AUDIO:
      return { ...state, audioEnabled: !state.audioEnabled };

    case ACTIONS.SET_STATION_B_PERFECT:
      return { ...state, stationBPerfect: true };

    case ACTIONS.SET_PROOF_PERFECT:
      return { ...state, proofBuilderPerfect: true };

    case ACTIONS.RESTORE_SESSION:
      return { ...initialState, ...action.payload, questionSet: [] };

    case ACTIONS.RESET_SESSION:
      return { ...initialState, sessionId: crypto.randomUUID(), questionSet: [] };

    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Restore session
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
      if (saved && Date.now() - saved.timestamp < 86400000) {
        dispatch({ type: ACTIONS.RESTORE_SESSION, payload: saved });
      }
    } catch { /* ignore */ }
  }, []);

  // Persist session
  useEffect(() => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        phase: state.phase,
        storyPanel: state.storyPanel,
        simStationsComplete: state.simStationsComplete,
        currentSimStation: state.currentSimStation,
        currentQuestion: state.currentQuestion,
        currentWorld: state.currentWorld,
        worldScores: state.worldScores,
        xp: state.xp,
        streak: state.streak,
        maxStreak: state.maxStreak,
        badges: state.badges,
        phaseComplete: state.phaseComplete,
        ratioQuestionsCorrect: state.ratioQuestionsCorrect,
        stationBPerfect: state.stationBPerfect,
        proofBuilderPerfect: state.proofBuilderPerfect,
        timestamp: Date.now(),
      }));
    } catch { /* ignore */ }
  }, [state]);

  // Badge checking
  useEffect(() => {
    const newBadges = checkBadges(state);
    if (newBadges.length > 0) {
      dispatch({ type: ACTIONS.UNLOCK_BADGE, payload: newBadges });
    }
  }, [state.phaseComplete, state.simStationsComplete, state.worldScores, state.maxStreak, state.ratioQuestionsCorrect, state.stationBPerfect, state.proofBuilderPerfect]);

  // Load questions when entering play phase
  useEffect(() => {
    if (state.phase === 'play' && state.questionSet.length === 0) {
      const questions = generateSessionQuestions(QUESTION_BANK);
      dispatch({ type: ACTIONS.LOAD_QUESTIONS, payload: questions });
    }
  }, [state.phase]);

  const goToPhase = useCallback((phase) => {
    dispatch({ type: ACTIONS.SET_PHASE, payload: phase });
  }, []);

  const PHASES = ['intro', 'wonder', 'story', 'simulate', 'play', 'reflect'];
  const phaseIndex = PHASES.indexOf(state.phase);

  return (
    <div className="app-root">
      {/* Progress Map — shown on all phases except intro */}
      {state.phase !== 'intro' && (
        <ProgressMap
          currentPhase={state.phase}
          phaseComplete={state.phaseComplete}
          xp={state.xp}
          streak={state.streak}
          audioEnabled={state.audioEnabled}
          onToggleAudio={() => dispatch({ type: ACTIONS.TOGGLE_AUDIO })}
          onReset={() => dispatch({ type: ACTIONS.RESET_SESSION })}
        />
      )}

      {/* Phase Renderer */}
      <main className="phase-container">
        {state.phase === 'intro' && (
          <IntroScreen onStart={() => goToPhase('wonder')} xp={state.xp} badges={state.badges} />
        )}
        {state.phase === 'wonder' && (
          <WonderPhase
            audioEnabled={state.audioEnabled}
            onComplete={() => {
              dispatch({ type: ACTIONS.COMPLETE_PHASE, payload: 'wonder' });
              goToPhase('story');
            }}
          />
        )}
        {state.phase === 'story' && (
          <StoryPhase
            panel={state.storyPanel}
            audioEnabled={state.audioEnabled}
            onNextPanel={() => dispatch({ type: ACTIONS.NEXT_STORY_PANEL })}
            onComplete={() => {
              dispatch({ type: ACTIONS.COMPLETE_PHASE, payload: 'story' });
              goToPhase('simulate');
            }}
          />
        )}
        {state.phase === 'simulate' && (
          <SimulatePhase
            state={state}
            dispatch={dispatch}
            audioEnabled={state.audioEnabled}
            onComplete={() => {
              dispatch({ type: ACTIONS.COMPLETE_PHASE, payload: 'simulate' });
              goToPhase('play');
            }}
          />
        )}
        {state.phase === 'play' && (
          <PlayPhase
            state={state}
            dispatch={dispatch}
            audioEnabled={state.audioEnabled}
            onComplete={() => {
              dispatch({ type: ACTIONS.COMPLETE_PHASE, payload: 'play' });
              goToPhase('reflect');
            }}
          />
        )}
        {state.phase === 'reflect' && (
          <ReflectPhase
            state={state}
            dispatch={dispatch}
            audioEnabled={state.audioEnabled}
            onRestart={() => dispatch({ type: ACTIONS.RESET_SESSION })}
          />
        )}
      </main>

      {/* Badge toast */}
      {state.newBadgeId && (
        <BadgeToast
          badgeId={state.newBadgeId}
          onDone={() => dispatch({ type: ACTIONS.CLEAR_BADGE_TOAST })}
        />
      )}
    </div>
  );
}
