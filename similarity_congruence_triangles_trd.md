# Technical Requirements Document (TRD)

## Similarity and Congruence in Triangles (Geometric Transformations) — Grade 10 Math
### Intellia 360 | Global Grade 10 Mathematics Curriculum

---

## 1. Technical Overview

This document specifies the architecture, component design, state management,
data models, simulation logic, gamification implementation, audio pipeline, and
quality standards for the **"Similarity and Congruence in Triangles —
Geometric Transformations"** interactive lesson module within Intellia 360's
Grade 10 Math program.

The module is a **React 18 application (Vite + JSX)**, structured identically
to the reference repository **https://github.com/dsamyak/equal**, and styled to
match **https://equal-tau.vercel.app/** — same phase shell, same reducer-driven
state machine, same audio-hook pattern — re-themed for Grade 10 and re-populated
with transformation/triangle simulation logic instead of equal-groups logic. It
will be embedded at:

`https://intelliasg.com/courses/grade-10-math/lessons/similarity-congruence-triangles/`

Audio narration uses ElevenLabs exclusively (no browser Web Speech API
fallback), mirroring the pipeline in the reference repo, adapted for this
lesson's scripts and global-name pronunciation range.

---

## 2. Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| UI Framework | React 18 (JSX, Vite) | Matches `dsamyak/equal` repo structure |
| State Management | `useState` + `useReducer` | Sufficient for single-module complexity |
| Styling | CSS Modules + Tailwind | Matches existing repo CSS approach |
| Icons | Lucide React | Available in artifact environment |
| Animation | CSS keyframes + transitions | No external dependency needed |
| SVG/Canvas Diagrams | Inline SVG (React) | For coordinate-plane triangle diagrams |
| Drag Interaction | Custom pointer-event hooks | Vertex-drag and card-drag, no heavy DnD library needed |
| Persistence | `localStorage` | Session state, no backend needed |
| Audio (Primary) | ElevenLabs API | Premium, consistent voice |
| Audio (Playback) | HTML5 Audio API (`new Audio()`) | Browser-native, no library needed |
| Math | Vanilla JS (matrix-free 2D transform formulas) | No library required |
| Build Tool | Vite | Matches repo (`vite.config.js` present) |

---

## 3. Project Structure (mirrors `dsamyak/equal` repo)

```
similarity-congruence-triangles/
├── public/
│   ├── assets/
│   │   ├── audio/                       # Pre-generated .mp3 files (ElevenLabs)
│   │   │   ├── audio_wonder_hook_0.mp3
│   │   │   ├── audio_story_panel1_0.mp3
│   │   │   ├── ... audio_story_panel6_0.mp3
│   │   │   ├── audio_station_a_instruction_0.mp3
│   │   │   ├── audio_station_b_instruction_0.mp3
│   │   │   ├── audio_station_c_instruction_0.mp3
│   │   │   ├── audio_station_d_instruction_0.mp3
│   │   │   ├── audio_correct_0.mp3
│   │   │   ├── audio_reflect_prompt_0.mp3
│   │   │   └── ... (all phase phrases pre-generated)
│   │   └── images/
│   │       ├── mentor-idle.svg
│   │       ├── mentor-focused.svg
│   │       ├── mentor-explaining.svg
│   │       ├── mentor-celebrate.svg
│   │       └── world-map-bg.svg
├── src/
│   ├── main.jsx                         # React entry point
│   ├── App.jsx                          # Root component, global state (useReducer)
│   ├── App.css                          # Global styles (mirrors equal repo CSS)
│   ├── components/
│   │   ├── IntroScreen.jsx              # Welcome + lesson overview + phase dot tracker
│   │   ├── ProgressMap.jsx              # 6-phase dot tracker (top bar)
│   │   ├── phases/
│   │   │   ├── WonderPhase.jsx          # Phase 1: Hook animation + ElevenLabs narration
│   │   │   ├── StoryPhase.jsx           # Phase 2: Illustrated narrative panels
│   │   │   ├── SimulatePhase.jsx        # Phase 3: Simulation station wrapper
│   │   │   ├── PlayPhase.jsx            # Phase 4: IntelliPlay™ quiz engine
│   │   │   └── ReflectPhase.jsx         # Phase 5: Journal + completion badge
│   │   ├── simulations/
│   │   │   ├── TransformPlayground.jsx  # Station A: drag/slider translate-rotate-reflect-dilate
│   │   │   ├── CongruenceDetective.jsx  # Station B: criterion-selection from marked diagrams
│   │   │   ├── SimilarityRatioLab.jsx   # Station C: scale factor + missing side/area solve
│   │   │   └── ProofBuilder.jsx         # Station D: drag-order statement/reason proof cards
│   │   ├── quiz/
│   │   │   ├── QuestionRenderer.jsx     # Polymorphic dispatcher → type-specific component
│   │   │   ├── IdentifyTransformQ.jsx   # Q1
│   │   │   ├── CoordTransformQ.jsx      # Q2
│   │   │   ├── CongruenceCriterionQ.jsx # Q3
│   │   │   ├── SimilarityCriterionQ.jsx # Q4
│   │   │   ├── SolveCongruentSideQ.jsx  # Q5
│   │   │   ├── SolveSimilarSideQ.jsx    # Q6
│   │   │   ├── MapScaleWordProbQ.jsx    # Q7
│   │   │   ├── ShadowHeightWordProbQ.jsx# Q8
│   │   │   ├── TrueFalseCriterionQ.jsx  # Q9
│   │   │   ├── AreaRatioQ.jsx           # Q10
│   │   │   ├── CorrespondenceQ.jsx      # Q11
│   │   │   ├── ProofCompletionQ.jsx     # Q12
│   │   │   └── HintOverlay.jsx          # Hint 1 & 2 + animated explanation after 3 fails
│   │   ├── gamification/
│   │   │   ├── XPTracker.jsx            # XP bar + floating XP animation
│   │   │   ├── StarRating.jsx           # 1–3 star rating per world
│   │   │   ├── BadgePanel.jsx           # Badge unlock toast + panel
│   │   │   ├── StreakCounter.jsx        # Fire streak counter
│   │   │   └── WorldMap.jsx             # 12-world progress map (horizontal scroll)
│   │   └── shared/
│   │       ├── Mentor.jsx               # LearnFlow AI mentor with mood states
│   │       ├── TriangleCanvas.jsx       # Reusable SVG: coordinate-plane triangle w/ marks
│   │       ├── TransformControls.jsx    # Translate/rotate/reflect/dilate control panel
│   │       ├── ProofCardTray.jsx        # Draggable statement/reason card tray
│   │       ├── ProofSlot.jsx            # Drop target slot for a proof step
│   │       ├── NumberPad.jsx            # Large tap-friendly numeric input (incl. decimals)
│   │       └── FeedbackOverlay.jsx      # Correct/incorrect overlay with animation
│   ├── data/
│   │   ├── questionBank.js              # 120 question objects (all 12 types)
│   │   └── storyContent.js              # Story phase panel data (text + visuals)
│   ├── hooks/
│   │   ├── useAudio.js                  # ElevenLabs + HTML5 Audio playback hook
│   │   ├── useGameState.js              # Gamification state hook
│   │   ├── useTransformEngine.js        # Applies/tracks translate/rotate/reflect/dilate ops
│   │   └── useLocalStorage.js           # Session persistence hook (24hr resume)
│   └── utils/
│       ├── audioMap.js                  # AUTO-GENERATED: text → .mp3 path map
│       ├── shuffle.js                   # Fisher-Yates randomisation
│       ├── scoring.js                   # XP + star calculation + distractor gen
│       ├── geometry.js                  # 2D transform math (translate/rotate/reflect/dilate)
│       └── badgeEngine.js               # Badge unlock condition logic
├── scripts/
│   ├── generate_audio.js                # Offline ElevenLabs audio pre-generation
│   └── clean_audio.js                   # Remove orphaned .mp3 files
├── api/
│   └── elevenlabs.js                    # ElevenLabs proxy (if server-side key needed)
├── index.html
├── package.json
├── vite.config.js
└── .gitignore
```

---

## 4. Application State Architecture

### 4.1 Global State (`App.jsx` — `useReducer`)

```js
const initialState = {
  // Navigation
  phase: 'intro', // 'intro'|'wonder'|'story'|'simulate'|'play'|'reflect'|'results'
  storyPanel: 0,             // 0–5 (6 story panels)
  currentSimStation: 0,      // 0=TransformPlayground,1=CongruenceDetective,2=SimilarityRatioLab,3=ProofBuilder
  simStationsComplete: [false, false, false, false],
  simRound: 0,               // Round index within current station (0–3)

  // Play / Challenge phase
  questionSet: [],           // 120 shuffled Question objects
  currentQuestion: 0,        // 0–119
  currentWorld: 0,           // 0–11 (12 worlds)
  worldScores: Array(12).fill(null),
  hintsUsed: 0,
  attemptCount: 0,           // Attempts on current question (max 3)

  // Gamification
  xp: 0,
  totalStars: 0,
  streak: 0,
  maxStreak: 0,
  badges: [],                // Array of unlocked badge IDs
  stationBPerfect: false,
  ratioQuestionsCorrect: 0,
  proofBuilderPerfect: false,

  // Session metadata
  phaseComplete: {
    wonder: false, story: false, simulate: false,
    play: false, reflect: false,
  },
  sessionId: crypto.randomUUID(),

  // Settings
  audioEnabled: true,        // ElevenLabs narration on/off
  musicEnabled: false,       // Background ambient music (off by default)
};
```

### 4.2 Reducer Action Types

```js
const ACTIONS = {
  SET_PHASE: 'SET_PHASE',
  NEXT_STORY_PANEL: 'NEXT_STORY_PANEL',
  ADVANCE_SIM_STATION: 'ADVANCE_SIM_STATION',
  COMPLETE_SIM_STATION: 'COMPLETE_SIM_STATION',
  NEXT_SIM_ROUND: 'NEXT_SIM_ROUND',
  APPLY_TRANSFORM: 'APPLY_TRANSFORM',
  LOAD_QUESTIONS: 'LOAD_QUESTIONS',
  ANSWER_CORRECT: 'ANSWER_CORRECT',
  ANSWER_INCORRECT: 'ANSWER_INCORRECT',
  USE_HINT: 'USE_HINT',
  NEXT_QUESTION: 'NEXT_QUESTION',
  UNLOCK_BADGE: 'UNLOCK_BADGE',
  COMPLETE_PHASE: 'COMPLETE_PHASE',
  TOGGLE_AUDIO: 'TOGGLE_AUDIO',
  TOGGLE_MUSIC: 'TOGGLE_MUSIC',
  RESTORE_SESSION: 'RESTORE_SESSION',
  RESET_SESSION: 'RESET_SESSION',
};
```

### 4.3 Key Reducer Logic

```js
// ANSWER_CORRECT dispatch
case ACTIONS.ANSWER_CORRECT: {
  const xpEarned = calcXP(state.attemptCount + 1, state.hintsUsed, state.streak);
  const newStreak = state.streak + 1;
  const worldIndex = Math.floor(state.currentQuestion / 10);
  const newWorldScore = (state.worldScores[worldIndex] || 0) + 1;
  const updatedWorldScores = [...state.worldScores];
  updatedWorldScores[worldIndex] = newWorldScore;

  return {
    ...state,
    xp: state.xp + xpEarned,
    streak: newStreak,
    maxStreak: Math.max(state.maxStreak, newStreak),
    worldScores: updatedWorldScores,
    totalStars: calcTotalStars(updatedWorldScores),
    hintsUsed: 0,
    attemptCount: 0,
  };
}

// ANSWER_INCORRECT dispatch
case ACTIONS.ANSWER_INCORRECT: {
  return {
    ...state,
    streak: 0,
    attemptCount: state.attemptCount + 1,
  };
}

// APPLY_TRANSFORM dispatch (Station A)
case ACTIONS.APPLY_TRANSFORM: {
  return {
    ...state,
    transformLog: [...(state.transformLog || []), action.payload],
  };
}
```

---

## 5. Question Data Model

### 5.1 Question Schema

```ts
interface Question {
  id: string;                 // e.g. "Q3_007", "Q8_004"
  type: QuestionType;         // One of 12 enum values (see below)
  world: number;               // 0–11 (which world this belongs to)
  difficulty: 1 | 2 | 3;       // 1=easy, 2=medium, 3=hard

  // Core geometric values
  triangleA: TrianglePoints;    // {A:[x,y], B:[x,y], C:[x,y]}
  triangleB?: TrianglePoints;   // Corresponding/target triangle, if applicable
  transformType?: 'translation'|'rotation'|'reflection'|'dilation'|'composite';
  transformParams?: object;     // e.g. { dx: 3, dy: -2 } | { angle: 90, center: [2,3] }
                                 //      | { axis: 'y' } | { scaleFactor: 2, center: [0,0] }
  congruenceCriterion?: 'SSS'|'SAS'|'ASA'|'AAS'|'RHS'|'NOT_ENOUGH_INFO';
  similarityCriterion?: 'AA'|'SSS~'|'SAS~';
  scaleFactor?: number;
  sideLabels?: { [key: string]: number };
  missingSide?: string;         // e.g. "DE"

  // Rendering
  questionText: string;         // Full narrated question text (ElevenLabs reads this)
  visual: VisualType;           // 'coordinatePlane' | 'markedDiagram' | 'proofFrame' | 'wordProblem'

  // MCQ
  options?: (number|string)[];  // 4 MCQ options (always includes correctAnswer)

  // Hints
  hint1: string;                 // Shown after 1 wrong attempt
  hint2: string;                 // Shown after 2 wrong attempts (animation trigger)
  explanation: string;           // Full text explanation after 3 fails (read aloud)

  // Word problems only
  characterName?: string;
  contextObject?: string;        // 'tree', 'flagpole', 'map', 'bridge truss'

  // True/False only
  isTrue?: boolean;

  // Answer
  correctAnswer: number | string;
}

type QuestionType =
  | 'identify_transform'        // Q1
  | 'coord_transform'           // Q2
  | 'congruence_criterion'      // Q3
  | 'similarity_criterion'      // Q4
  | 'solve_congruent_side'      // Q5
  | 'solve_similar_side'        // Q6
  | 'map_scale_word_problem'    // Q7
  | 'shadow_height_word_problem'// Q8
  | 'true_false_criterion'      // Q9
  | 'area_ratio'                // Q10
  | 'correspondence_notation'   // Q11
  | 'proof_completion';         // Q12

type VisualType =
  | 'coordinatePlane'  // SVG grid with draggable/plotted triangle(s)
  | 'markedDiagram'    // Static diagram with tick/arc/right-angle marks
  | 'proofFrame'       // Statement/reason table with one blank cell
  | 'wordProblem';     // Illustrative icon + narrative text, no diagram required

interface TrianglePoints {
  A: [number, number];
  B: [number, number];
  C: [number, number];
}
```

### 5.2 Sample Question Objects

```js
// Q3 — Congruence Criterion Identification
{
  id: "Q3_004",
  type: "congruence_criterion",
  world: 2,
  difficulty: 1,
  triangleA: { A: [0,0], B: [4,0], C: [0,3] },
  triangleB: { A: [8,0], B: [12,0], C: [8,3] },
  congruenceCriterion: "SAS",
  questionText: "Two sides and the included angle of △ABC match two sides and the included angle of △DEF. Which criterion proves the triangles are congruent?",
  visual: "markedDiagram",
  hint1: "Check whether the marked angle is between the two marked sides.",
  hint2: "Included angle + two sides = SAS.",
  explanation: "Since the angle marked lies between the two marked sides in both triangles, SAS proves congruence.",
  options: ["SSS", "SAS", "ASA", "Not Enough Information"],
  correctAnswer: "SAS",
}

// Q6 — Solve for Missing Side Using Similarity
{
  id: "Q6_009",
  type: "solve_similar_side",
  world: 4,
  difficulty: 2,
  triangleA: { A: [0,0], B: [6,0], C: [0,8] },
  triangleB: { A: [0,0], B: [9,0], C: [0,12] },
  scaleFactor: 1.5,
  sideLabels: { AB: 6, "A'B'": 9, AC: 8 },
  missingSide: "A'C'",
  questionText: "△ABC ~ △A'B'C' with a scale factor of 1.5. If AC = 8 cm, find A'C'.",
  visual: "coordinatePlane",
  hint1: "Multiply the known side by the scale factor.",
  hint2: "8 × 1.5 = 12.",
  explanation: "A'C' = AC × scale factor = 8 × 1.5 = 12 cm.",
  options: [9.5, 10, 12, 13.5],
  correctAnswer: 12,
}

// Q8 — Shadow/Height Word Problem
{
  id: "Q8_002",
  type: "shadow_height_word_problem",
  world: 6,
  difficulty: 2,
  characterName: "Amara",
  contextObject: "flagpole",
  questionText: "Amara, who is 1.6 m tall, casts a shadow of 2 m. At the same time, a flagpole casts a shadow of 15 m. Find the height of the flagpole.",
  visual: "wordProblem",
  hint1: "Set up a proportion: height ÷ shadow = height ÷ shadow.",
  hint2: "1.6 / 2 = x / 15 → x = 1.6 × 15 / 2.",
  explanation: "1.6/2 = x/15, so x = 12 m. The flagpole is 12 m tall.",
  options: [10, 11, 12, 13.5],
  correctAnswer: 12,
}

// Q10 — Area Ratio from Scale Factor
{
  id: "Q10_006",
  type: "area_ratio",
  world: 7,
  difficulty: 3,
  scaleFactor: 3,
  questionText: "Two similar triangles have a scale factor of 3. What is the ratio of their areas?",
  visual: "markedDiagram",
  hint1: "Area ratio = (scale factor)².",
  hint2: "3² = 9.",
  explanation: "Since area scales with the square of the linear scale factor, the area ratio is 9:1.",
  options: ["3:1", "6:1", "9:1", "12:1"],
  correctAnswer: "9:1",
}

// Q2 — Coordinate Transformation
{
  id: "Q2_005",
  type: "coord_transform",
  world: 1,
  difficulty: 2,
  transformType: "translation",
  transformParams: { dx: 3, dy: -2 },
  questionText: "Apply the transformation (x, y) → (x + 3, y − 2) to point A(1, 4). Find A'.",
  visual: "coordinatePlane",
  hint1: "Add 3 to the x-coordinate and subtract 2 from the y-coordinate.",
  hint2: "1 + 3 = 4, 4 − 2 = 2.",
  explanation: "A' = (1+3, 4-2) = (4, 2).",
  options: ["(4, 2)", "(4, 6)", "(-2, 2)", "(1, -2)"],
  correctAnswer: "(4, 2)",
}
```

---

## 6. Triangle / Transformation SVG Component

```jsx
// TriangleCanvas.jsx — reusable SVG for coordinate-plane triangle(s) with marks

const TriangleCanvas = ({
  triangleA,
  triangleB = null,
  showGrid = true,
  showMarks = false,          // tick/arc congruence marks
  interactiveVertices = false,
  onVertexDrag,
  scaleFactorLabel = null,
  size = 'medium',            // 'small' | 'medium' | 'large'
}) => {
  const dims = size === 'large' ? 480 : size === 'medium' ? 360 : 260;
  const scale = dims / 16; // world units → px, assuming a 16x16 unit viewport

  const toPx = ([x, y]) => [x * scale + dims / 2, dims - (y * scale + dims / 2)];

  return (
    <svg viewBox={`0 0 ${dims} ${dims}`} xmlns="http://www.w3.org/2000/svg"
         style={{ maxWidth: '100%', height: 'auto', background: 'var(--canvas-bg)' }}>
      {showGrid && <GridLines size={dims} unit={scale} />}

      <TrianglePath points={triangleA} toPx={toPx} stroke="var(--tri-a-color)" fillOpacity={0.15}
                    interactive={interactiveVertices} onVertexDrag={onVertexDrag} />

      {triangleB && (
        <TrianglePath points={triangleB} toPx={toPx} stroke="var(--tri-b-color)"
                      dashed fillOpacity={0.08} />
      )}

      {showMarks && <CongruenceMarks triangleA={triangleA} triangleB={triangleB} toPx={toPx} />}

      {scaleFactorLabel && (
        <text x={dims / 2} y={dims - 8} textAnchor="middle" fontSize="14" fontWeight="600">
          {scaleFactorLabel}
        </text>
      )}
    </svg>
  );
};
```

**Animation variants:**
- `transformStep` → CSS/JS-driven interpolation (300–500ms ease) between pre- and post-transform vertex coordinates
- `shake` variant → CSS `shake` keyframe applied to the `<svg>` wrapper on wrong answer
- `bounceIn`/`snapMatch` variant → CSS `bounceIn` keyframe applied on exact vertex match in Station A

**Transform math (`utils/geometry.js`):**

```js
export function translate(points, dx, dy) {
  return mapPoints(points, ([x, y]) => [x + dx, y + dy]);
}

export function rotate(points, angleDeg, center = [0, 0]) {
  const rad = (angleDeg * Math.PI) / 180;
  const [cx, cy] = center;
  return mapPoints(points, ([x, y]) => {
    const dx = x - cx, dy = y - cy;
    return [
      cx + dx * Math.cos(rad) - dy * Math.sin(rad),
      cy + dx * Math.sin(rad) + dy * Math.cos(rad),
    ];
  });
}

export function reflect(points, axis = 'y', customLine = null) {
  return mapPoints(points, ([x, y]) => {
    if (axis === 'x') return [x, -y];
    if (axis === 'y') return [-x, y];
    // customLine: { a, b, c } representing ax+by+c=0
    const { a, b, c } = customLine;
    const d = (a * x + b * y + c) / (a * a + b * b);
    return [x - 2 * a * d, y - 2 * b * d];
  });
}

export function dilate(points, scaleFactor, center = [0, 0]) {
  const [cx, cy] = center;
  return mapPoints(points, ([x, y]) => [
    cx + (x - cx) * scaleFactor,
    cy + (y - cy) * scaleFactor,
  ]);
}

function mapPoints(points, fn) {
  return Object.fromEntries(Object.entries(points).map(([k, v]) => [k, fn(v)]));
}

export function isMatch(pointsA, pointsB, tolerance = 0.25) {
  return Object.keys(pointsA).every((key) => {
    const [ax, ay] = pointsA[key];
    const [bx, by] = pointsB[key];
    return Math.hypot(ax - bx, ay - by) <= tolerance;
  });
}
```

---

## 7. Simulation Station Component Specs

### 7.1 `TransformPlayground.jsx` — Station A (Concrete)

**State:**
```js
const [roundConfig, setRoundConfig] = useState(getStationARound(state.simRound));
// roundConfig: { startTriangle, targetTriangle, requiredOps: ['reflect','translate'] }
const [liveTriangle, setLiveTriangle] = useState(roundConfig.startTriangle);
const [transformLog, setTransformLog] = useState([]);
```

**Interaction:**
- Control panel exposes 4 operation types; each application updates `liveTriangle`
  via the pure functions in `geometry.js` and appends a human-readable log entry
- "Check Match" button enabled once `isMatch(liveTriangle, targetTriangle)` is
  checked live after every operation
- Keyboard/tap equivalents provided for all slider/drag controls (arrow-key
  nudges for rotation angle and dilation factor)

**Completion Check:**
- `isMatch(...)` true → mentor celebrates; ElevenLabs plays celebration audio
  referencing the specific transformation sequence used
- Not matched after 3 operations → hint: "Try a different transformation type."

**Station A Rounds (4 rounds, randomised order):**
```js
{ requiredOps: ['translation'] }
{ requiredOps: ['rotation'] }
{ requiredOps: ['reflection', 'translation'] }
{ requiredOps: ['dilation', 'rotation'] } // introduces similarity, not congruence
```

### 7.2 `CongruenceDetective.jsx` — Station B (Pictorial → Criterion)

**State:**
```js
const [cards, setCards] = useState(generateCriterionCards(round));
const [answers, setAnswers] = useState({});   // cardIndex → selected criterion
const [submitted, setSubmitted] = useState(false);
```

**Card Generation (`generateCriterionCards`):**
- Produces 4 marked-diagram cards per round
- Deliberately includes one card with a non-included marked angle (SSA trap)
  and, in Round 3, one genuine "Not Enough Information" case
- Diagrams rendered via `TriangleCanvas` with `showMarks=true`

**Interaction:**
- Student selects one criterion per card from a dropdown/segmented control
- "Check" button submits all four at once; correct cards glow green, incorrect
  glow red and highlight the specific marking that invalidates the chosen
  criterion

**Rounds (3 rounds per station):**
```js
Round 1: SSS / SAS clearly marked
Round 2: ASA / AAS, included vs non-included angle
Round 3: RHS special case + Not Enough Information trap
```

### 7.3 `SimilarityRatioLab.jsx` — Station C (Proportional reasoning)

**State:**
```js
const [problem, setProblem] = useState(getRatioProblem(state.simRound));
// problem: { triangleA, triangleB, knownSides, missingSide, askFor: 'side'|'area'|'perimeter' }
const [scaleFactorInput, setScaleFactorInput] = useState('');
const [answerInput, setAnswerInput] = useState('');
```

**Layout:**
```jsx
<TriangleCanvas triangleA={problem.triangleA} triangleB={problem.triangleB}
                scaleFactorLabel={`Scale factor = ${scaleFactorInput || '?'}`} />
<NumberPad allowDecimal value={scaleFactorInput} onChange={setScaleFactorInput} />
<NumberPad allowDecimal value={answerInput} onChange={setAnswerInput} onSubmit={handleSubmit} />
```

**Variants (rotated across 4 rounds):**
```js
Round 1: whole-number scale factor, find missing side
Round 2: fractional/decimal scale factor, find missing side
Round 3: real-world context (shadow/map), find real-world distance/height
Round 4: area or perimeter ratio, given the linear scale factor
```

ElevenLabs reads the full problem statement aloud when displayed.

### 7.4 `ProofBuilder.jsx` — Station D (Formal reasoning)

**State:**
```js
const [proofTemplate, setProofTemplate] = useState(getProofTemplate(state.simRound));
// proofTemplate: { steps: [{statement, reason}], shuffledCards: [...] }
const [filledSlots, setFilledSlots] = useState(Array(proofTemplate.steps.length).fill(null));
const [showDiagram, setShowDiagram] = useState(true);
```

**Interaction:**
- `ProofCardTray` renders shuffled statement + reason cards (drag source)
- `ProofSlot` renders each step's two drop targets (statement slot, reason slot)
- On drop: validates the card belongs in that slot; incorrect drop bounces
  back with a shake
- Submit checks full sequence correctness (order matters for flow-proofs)

**Variants (rotated per round):**
```js
Round 1: 3-step SSS/SAS congruence proof
Round 2: 4-step ASA/AAS proof with a shared/reflexive side
Round 3: 5-step AA similarity proof (parallel lines, alternate angles)
```

---

## 8. Audio Pipeline (ElevenLabs — Matching Reference Architecture)

### 8.1 Voice Configuration

```
Voice: TBD — pending reference audio sample (see PRD §9.7)
Model: eleven_multilingual_v2
API Key Var: VITE_ELEVENLABS_API_KEY (in .env.local)
```

### 8.2 Speech Style Settings (per style type)

| Style | stability | similarity_boost | style_exaggeration |
|-------|-----------|--------------------|----------------------|
| statement | 0.75 | 0.75 | 0.0 |
| instruction | 0.80 | 0.75 | 0.0 |
| question | 0.60 | 0.80 | 0.3 |
| encouragement | 0.55 | 0.85 | 0.6 |
| emphasis | 0.85 | 0.70 | 0.1 |
| explaining | 0.65 | 0.80 | 0.2 |
| celebration | 0.45 | 0.90 | 0.8 |

### 8.3 Offline Pre-generation Script (`scripts/generate_audio.js`)

```js
const phrases = [
  // Phase 1 — Wonder
  { text: "A city planner has a blueprint triangle with sides thirty, forty, and fifty metres.", style: 'statement' },
  { text: "A scale model shows six, eight, and ten centimetres. Are these triangles related?", style: 'question' },
  { text: "Let's uncover what makes two triangles similar, or exactly the same!", style: 'encouragement' },

  // Phase 2 — Story Panels
  { text: "John slides one triangle brace across the blueprint. It lands exactly on the second brace.", style: 'statement' },
  { text: "Sarah notices the two braces are mirror images. She reflects one across the centre beam.", style: 'statement' },
  { text: "Mike spins a brace ninety degrees around a bolt, and it matches too!", style: 'statement' },
  { text: "Because a sequence of rigid motions maps one triangle exactly onto the other, the triangles are congruent.", style: 'emphasis' },
  { text: "Sofia compares the bridge brace to a scale model brace that is half the size.", style: 'statement' },
  { text: "A dilation plus rigid motions maps one triangle onto the other, so the triangles are similar.", style: 'emphasis' },

  // Phase 3 — Simulation Instructions
  { text: "Drag or slide the controls to transform the triangle until it matches the target.", style: 'instruction' },
  { text: "Look closely at the tick marks and arcs. Which congruence criterion applies here?", style: 'instruction' },
  { text: "Find the scale factor first, then solve for the missing side.", style: 'instruction' },
  { text: "Drag the statement and reason cards into the correct order to complete the proof.", style: 'instruction' },

  // Phase 4 — Feedback
  { text: "Exactly right, that is a solid, well-justified proof!", style: 'celebration' },
  { text: "Not quite, look closely at which angle is included.", style: 'encouragement' },
  { text: "Let's break this down together, step by step.", style: 'explaining' },

  // Phase 5 — Reflect
  { text: "In your own words, what's the difference between congruent and similar triangles?", style: 'explaining' },
  { text: "Lesson complete! You are a Proof Champion!", style: 'celebration' },

  // Badge unlocks
  { text: "Badge unlocked! Transformation Rookie!", style: 'celebration' },
  { text: "Badge unlocked! Motion Master! You completed all four stations!", style: 'celebration' },
  { text: "Badge unlocked! Proof Champion! You scored over eighty percent!", style: 'celebration' },
];

// Script hits ElevenLabs API for each phrase, saves to public/assets/audio/
// Auto-generates src/utils/audioMap.js mapping text → .mp3 path
```

### 8.4 Frontend Audio Engine (`src/hooks/useAudio.js`)

```js
// Step 1: Check audioMap for pre-generated static asset
// Step 2: If not found + API key present → fetch from ElevenLabs dynamically
// Step 3: Cache dynamic result in elevenLabsCache (in-memory Map)
// Step 4: Play via HTML5 Audio API (new Audio(url))
// Step 5: While segment i plays → preload segment i+1 (eager preload)

const elevenLabsCache = new Map(); // In-memory; cleared on page refresh

export async function getAudioUrl(text, style = 'statement', apiKey) {
  if (audioMap[text]) return audioMap[text];

  const cacheKey = `${text}::${style}`;
  if (elevenLabsCache.has(cacheKey)) return elevenLabsCache.get(cacheKey);

  if (!apiKey) return null; // Silent skip — no fallback

  const styleSettings = STYLE_SETTINGS[style] ?? STYLE_SETTINGS.statement;
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: 'POST',
      headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: styleSettings,
      }),
    }
  );
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  elevenLabsCache.set(cacheKey, url);
  return url;
}

export async function narrate(segments, apiKey, onSegmentStart) {
  for (let i = 0; i < segments.length; i++) {
    const { text, style } = segments[i];
    const url = await getAudioUrl(text, style, apiKey);
    if (!url) continue;
    if (i + 1 < segments.length) {
      getAudioUrl(segments[i + 1].text, segments[i + 1].style, apiKey);
    }
    if (onSegmentStart) onSegmentStart(i);
    await playAudio(url);
  }
}

async function playAudio(url) {
  return new Promise((resolve) => {
    const audio = new Audio(url);
    audio.onended = resolve;
    audio.onerror = resolve;
    audio.play().catch(resolve);
  });
}
```

### 8.5 Audio Cleanup (`scripts/clean_audio.js`)

- Imports `audioMap.js` to determine all valid referenced `.mp3` paths
- Scans `public/assets/audio/` for all `.mp3` files
- Deletes any `.mp3` not present in `audioMap` (orphaned files)
- Run after any phrase deletion or text edit in `generate_audio.js`

### 8.6 Narration Synchronisation Rules (1:1 Parity)

**CRITICAL:** Every on-screen text string that is narrated must match
`narration.js` **exactly** (same words, same punctuation, same notation: ≅, ~,
°). Any UI text change requires:
1. Update `generate_audio.js` phrases array
2. Re-run: `node scripts/generate_audio.js`
3. Update corresponding text in the React UI component
4. Optionally run: `node scripts/clean_audio.js`

### 8.7 Pending: Voice Match to Reference Sample

No audio sample file was provided in this conversation. Once supplied, update
`VOICE_ID` in `useAudio.js` and the style-settings table (§8.2) to the closest
ElevenLabs voice/parameter match, and note the analysis (pitch, pacing,
tone) in this section for traceability.

---

## 9. Randomisation Engine

### 9.1 Fisher-Yates Shuffle (`utils/shuffle.js`)

```js
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateSessionQuestions(bank) {
  const byType = {};
  bank.forEach(q => {
    if (!byType[q.type]) byType[q.type] = [];
    byType[q.type].push(q);
  });
  // Pick 10 from each of the 12 types (shuffled), then shuffle the combined 120
  const selected = Object.values(byType)
    .flatMap(qs => shuffleArray(qs).slice(0, 10));
  return shuffleArray(selected);
}
```

### 9.2 MCQ Distractor Generation (`utils/scoring.js`)

```js
export function generateNumericDistractors(correct, { min = 0, max = 100, count = 3, allowDecimal = false } = {}) {
  const distractors = new Set();
  const offsets = allowDecimal ? [-1.5, -1, -0.5, 0.5, 1, 1.5] : [-3, -2, -1, 1, 2, 3];
  shuffleArray(offsets).forEach(offset => {
    const d = Math.round((correct + offset) * 100) / 100;
    if (d >= min && d <= max && d !== correct && distractors.size < count) distractors.add(d);
  });
  while (distractors.size < count) {
    const d = correct + (distractors.size + 1);
    if (d <= max && d !== correct) distractors.add(d);
  }
  return shuffleArray([correct, ...distractors]);
}

export function generateCriterionDistractors(correctCriterion, pool = ['SSS','SAS','ASA','AAS','RHS','Not Enough Information']) {
  const distractors = shuffleArray(pool.filter(c => c !== correctCriterion)).slice(0, 3);
  return shuffleArray([correctCriterion, ...distractors]);
}
```

### 9.3 Session Persistence (24-hour resume)

```js
const SESSION_KEY = 'intellia_sct_v1';

// On app mount: restore if within 24 hours
const saved = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
if (saved && Date.now() - saved.timestamp < 86400000) {
  dispatch({ type: ACTIONS.RESTORE_SESSION, payload: saved });
}

// On every state change: persist progress
useEffect(() => {
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    phase: state.phase,
    storyPanel: state.storyPanel,
    simStationsComplete: state.simStationsComplete,
    currentQuestion: state.currentQuestion,
    xp: state.xp,
    streak: state.streak,
    maxStreak: state.maxStreak,
    badges: state.badges,
    worldScores: state.worldScores,
    phaseComplete: state.phaseComplete,
    timestamp: Date.now(),
  }));
}, [state]);
```

---

## 10. Gamification Implementation

### 10.1 XP Calculation (`utils/scoring.js`)

```js
export function calcXP(attemptNumber, hintsUsed, streak) {
  const base = attemptNumber === 1 ? 10 : hintsUsed > 0 ? 5 : 7;
  const streakBonus = streak >= 5 ? 5 : 0;
  return base + streakBonus;
}
```

### 10.2 Star Rating (per world of 10 questions)

```js
export function calcStars(correct, total = 10) {
  if (correct >= 9) return 3; // Gold: ≥90%
  if (correct >= 7) return 2; // Silver: ≥70%
  if (correct >= 5) return 1; // Bronze: ≥50% (world unlock gate)
  return 0;
}

export function canUnlockWorld(worldScore) {
  return worldScore !== null && worldScore >= 5;
}

export function calcTotalStars(worldScores) {
  return worldScores.reduce((sum, ws) => sum + (ws !== null ? calcStars(ws) : 0), 0);
}
```

### 10.3 Badge Engine (`utils/badgeEngine.js`)

```js
export const BADGES = [
  {
    id: 'transformation_rookie',
    label: '🏅 Transformation Rookie',
    description: 'Complete Wonder and Story phases',
    condition: (s) => s.phaseComplete.wonder && s.phaseComplete.story,
  },
  {
    id: 'motion_master',
    label: '🥈 Motion Master',
    description: 'Complete all 4 Simulation stations',
    condition: (s) => s.simStationsComplete.every(Boolean),
  },
  {
    id: 'proof_champion',
    label: '🥇 Proof Champion',
    description: 'Score 80%+ in Play phase',
    condition: (s) => {
      const totalCorrect = s.worldScores.reduce((sum, ws) => sum + (ws || 0), 0);
      return totalCorrect >= 96; // 80% of 120
    },
  },
  {
    id: 'perfect_match',
    label: '💎 Perfect Match',
    description: 'Score 10/10 in any world',
    condition: (s) => s.worldScores.some(ws => ws === 10),
  },
  {
    id: 'streak_star',
    label: '🔥 Streak Star',
    description: 'Achieve a streak of 10 consecutive correct answers',
    condition: (s) => s.maxStreak >= 10,
  },
  {
    id: 'full_journey',
    label: '🌟 Full Journey',
    description: 'Complete all 6 phases',
    condition: (s) => Object.values(s.phaseComplete).every(Boolean),
  },
  {
    id: 'sharp_eye',
    label: '🎯 Sharp Eye',
    description: 'Complete Station B without any wrong selection',
    condition: (s) => s.stationBPerfect === true,
  },
  {
    id: 'ratio_ranger',
    label: '📐 Ratio Ranger',
    description: 'Answer 5 similarity/scale-factor questions correctly',
    condition: (s) => (s.ratioQuestionsCorrect || 0) >= 5,
  },
  {
    id: 'logic_builder',
    label: '🧩 Logic Builder',
    description: 'Complete a Station D proof with zero misplaced cards',
    condition: (s) => s.proofBuilderPerfect === true,
  },
];

export function checkBadges(state) {
  return BADGES
    .filter(b => !state.badges.includes(b.id) && b.condition(state))
    .map(b => b.id);
}

// Call after every state update that could unlock a badge:
const newBadges = checkBadges(newState);
if (newBadges.length > 0) {
  dispatch({ type: ACTIONS.UNLOCK_BADGE, payload: newBadges });
  newBadges.forEach(id => {
    const badge = BADGES.find(b => b.id === id);
    narrate([{ text: badge.description, style: 'celebration' }], apiKey);
  });
}
```

---

## 11. CSS Animation Keyframes (matching equal-tau.vercel.app style)

```css
@keyframes bounceIn {
  0%   { transform: scale(0.3); opacity: 0; }
  50%  { transform: scale(1.05); opacity: 1; }
  70%  { transform: scale(0.9); }
  100% { transform: scale(1); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(6px); }
}

@keyframes floatUp {
  0%   { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(-60px) scale(1.5); opacity: 0; }
}

@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(74, 144, 217, 0.4); }
  50%      { box-shadow: 0 0 0 12px rgba(74, 144, 217, 0); }
}

@keyframes celebrate {
  0%   { transform: rotate(-5deg) scale(1); }
  25%  { transform: rotate(5deg) scale(1.1); }
  50%  { transform: rotate(-3deg) scale(1.05); }
  75%  { transform: rotate(3deg) scale(1.1); }
  100% { transform: rotate(0deg) scale(1); }
}

@keyframes slideInUp {
  from { transform: translateY(30px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}

@keyframes transformGlide {
  /* Applied to triangle <g> wrapper — interpolates via requestAnimationFrame
     rather than a fixed CSS transform, since vertex coordinates are computed
     dynamically per round */
  from { opacity: 0.6; }
  to   { opacity: 1; }
}

@keyframes snapMatch {
  0%   { transform: scale(1.05); filter: drop-shadow(0 0 0 rgba(74,144,217,0)); }
  60%  { transform: scale(1); filter: drop-shadow(0 0 12px rgba(74,144,217,0.6)); }
  100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(74,144,217,0)); }
}

@keyframes cardSlotFill {
  0%   { transform: translateY(-12px) scale(0.9); opacity: 0; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}

/* Stagger: each proof card / world-map node gets animation-delay: (index * 100ms) */
```

---

## 12. Component Prop Contracts

```
TriangleCanvas
  Props: { triangleA, triangleB?, showGrid?, showMarks?, interactiveVertices?, onVertexDrag?, scaleFactorLabel?, size? }
  Returns: SVG element (inline, responsive)

TransformControls
  Props: { onApply: (op) => void, availableOps: string[] }
  Returns: Segmented control + sliders/dials for translate/rotate/reflect/dilate

ProofCardTray
  Props: { cards: ProofCard[], onDragStart }
  Returns: Flex-wrap row of draggable statement/reason cards

ProofSlot
  Props: { index, expected, filled, onDrop }
  Returns: Droppable slot with validation highlight

NumberPad
  Props: { max?, allowDecimal?, value, onChange, onSubmit }
  Returns: Grid of digit buttons (min 44×44px), decimal point, backspace, submit

Mentor
  Props: { mood: 'idle'|'curious'|'focused'|'celebrating'|'encouraging'|'explaining' }
  Returns: SVG/image + CSS animation class mapped to mood

QuestionRenderer
  Props: { question: Question, onAnswer: (answer: any) => void, hints: number }
  Returns: Type-specific question component

FeedbackOverlay
  Props: { isCorrect: boolean, explanation?: string, xpEarned: number, onContinue: () => void }
  Returns: Animated modal overlay (bounceIn correct / shake wrong)

WorldMap
  Props: { worldScores: (number|null)[], currentWorld: number, onSelectWorld: (i) => void }
  Returns: Horizontal scrollable world list with star ratings and lock icons

BadgePanel
  Props: { badges: string[], newBadgeId?: string }
  Returns: Badge grid with unlock toast animation for newBadgeId
```

---

## 13. Performance Requirements

| Metric | Target |
|--------|--------|
| Initial load time | < 3 seconds (Vite production build) |
| Time to first meaningful paint | < 1.2 seconds |
| SVG/transform animation frame rate | 60 fps |
| Memory usage | < 80 MB |
| Bundle size (gzipped) | < 700 KB |
| Lighthouse Performance score | ≥ 90 |
| Lighthouse Accessibility score | ≥ 90 |
| ElevenLabs pre-gen audio TTFB | 0 ms (static .mp3 assets) |
| ElevenLabs dynamic audio TTFB | < 2 seconds (API latency) |

---

## 14. Browser & Device Support

| Environment | Support Level |
|--------------|----------------|
| Chrome 110+ (desktop) | Full |
| Safari 15+ (desktop/iPad) | Full |
| Firefox 110+ | Full |
| Edge 110+ | Full |
| Android Chrome | Full |
| iOS Safari 15+ | Full (drag interactions fall back to tap-tap below 480px) |
| IE 11 | Not supported |

Primary test device: Desktop Chrome (1280px+) — most Grade 10 study context.
Secondary: iPad (768px, touch) — classroom use context.
Tertiary: Mobile (375px+) — simulation stations switch to tap-based controls.

---

**Document Version:** 1.0 | July 2026
**Product:** Intellia 360 — Grade 10 Math
**Lesson Title:** Similarity and Congruence in Triangles (Geometric Transformations)
**Reference UI:** https://equal-tau.vercel.app/
**Reference Repo:** https://github.com/dsamyak/equal
**Audio Pipeline:** ElevenLabs (voice TBD — pending reference sample, see §8.7)
**Parent Course Page:** https://intelliasg.com/courses/grade-10-math/
**Lesson URL:** https://intelliasg.com/courses/grade-10-math/lessons/similarity-congruence-triangles/
