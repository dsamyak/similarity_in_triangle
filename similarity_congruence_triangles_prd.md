# Product Requirements Document (PRD)

## Similarity and Congruence in Triangles (Geometric Transformations) — Grade 10 Math
### Intellia 360 | Global Grade 10 Mathematics Curriculum

---

## 1. Executive Summary

This document defines the product requirements for the **"Similarity and Congruence in
Triangles — Geometric Transformations"** interactive lesson module, delivered as a
core Geometry lesson within Intellia 360's **Grade 10 Math** program. The module
targets Grade 10 students (ages 15–16) worldwide and teaches how translations,
rotations, reflections, and dilations formally define **congruence** and
**similarity** — connecting the transformational definition to the classical
triangle criteria (SSS, SAS, ASA, AAS, RHS for congruence; AA, SSS~, SAS~ for
similarity), fully aligned to a synthesized **global Grade 10 syllabus** drawing on:

- U.S. Common Core State Standards — High School Geometry, Similarity, Right
  Triangles & Trigonometry (**HSG-SRT.A.1–3, HSG-SRT.B.4–5**)
- Cambridge IGCSE Mathematics (0580) — Geometry: Similarity & Congruence, Symmetry
- International Baccalaureate MYP/DP Mathematics — Geometry & Trigonometry strand
- Australian Curriculum (ACMMG) — Geometric Reasoning, Year 10
- Ontario Grade 10 Academic Mathematics (MPM2D) — Similar Triangles, Transformations

The product is a standalone web application to be hosted at:

`https://intelliasg.com/courses/grade-10-math/lessons/similarity-congruence-triangles/`

...matching the parent course pattern already live at
`https://intelliasg.com/courses/grade-3-math` (course → sections → lessons → quiz,
gamified IntelliPlay™ practice, Student Dashboard, ThinkTales storytelling).

It is built using **React (Vite + JSX, JavaScript/CSS)** and is designed to
**strictly mirror** the visual and UX structure established at
**https://equal-tau.vercel.app/** and its repository
**https://github.com/dsamyak/equal** — same phase shell, same component
architecture, same state machine, same audio-pipeline pattern — re-themed for a
Grade 10 (teen) audience instead of Grade 1, and re-populated with
transformation/triangle simulations instead of equal-groups simulations.

Audio narration uses **ElevenLabs exclusively** (no browser Web Speech API
fallback), with pre-generated static `.mp3` files for all phase narration and
dynamic generation for practice questions — the same pipeline documented in the
reference repo's Audio & Narration Pipeline. *(Voice selection to be finalized
once the reference audio sample is supplied — see §9.7.)*

The module follows Intellia's phase-based learner journey, extended to six phases
appropriate for secondary-level, proof-based content:

```
Phase 1 — INTRO      → Welcome screen + 6-phase progress map
Phase 2 — WONDER      → Curiosity hook (real-world scaling/congruence puzzle)
Phase 3 — STORY       → Narrative-based concept introduction (global cast)
Phase 4 — SIMULATE    → Interactive transformation & proof-building sandbox (4 stations)
Phase 5 — PLAY        → IntelliPlay™ gamified practice (120 randomised questions)
Phase 6 — REFLECT     → Journal / LearnFlow AI prompt + completion badge
```

---

## 2. Product Vision & Goals

### Vision
To make **similarity and congruence of triangles** — and the transformational
reasoning (translation, rotation, reflection, dilation) that underlies them —
tangible, visual, and rigorous for 15–16 year old learners everywhere, bridging
intuitive drag-and-drop transformation play with formal proof-writing, so students
leave able to both *see* why two triangles match and *prove* it.

### Goals

| Goal                              | Metric                                              |
|------------------------------------|------------------------------------------------------|
| Learning Completion                | ≥85% of students complete all 6 phases               |
| Practice Engagement                | ≥90% attempt at least 20 practice questions           |
| Score Achievement                  | Average challenge score ≥75% on first attempt         |
| Session Duration                   | Average engagement ≥20 minutes per session            |
| Curriculum Alignment               | 100% aligned to the global Grade 10 syllabus map (§4) |
| Phase Progression                  | ≥80% reach Play phase in a single session             |
| Simulation Interaction Rate        | ≥95% attempt all 4 simulation stations                |
| Proof Literacy                     | ≥70% correctly justify at least 1 proof using a named criterion (SSS/SAS/ASA/AAS/RHS/AA) unaided |

---

## 3. Target Users

### Primary: Grade 10 Students (Age 15–16), Global

- Already fluent with coordinate geometry, basic algebra, and ratios
- Motivated by real-world framing (architecture, engineering, art, drone mapping,
  photography, map-scaling) rather than cartoon reward loops alone
- Benefit from **manipulable, draggable diagrams** before formal proof notation
- Respond well to streaks, leaderboards, and light social/competitive framing
  (age-appropriate — no childish mascot-only feedback)
- Global classroom contexts: names, foods, cities, and currencies should read as
  international, not tied to a single country

### Secondary: Parents & Teachers

- Assign as classwork, homework, or exam-revision module
- Expect alignment across multiple exam boards (not one national syllabus)
- Monitor via phase-completion indicators embedded in the lesson page
- Want a printable/exportable proof-summary at Reflect stage for grading

---

## 4. Curriculum Alignment — Global Grade 10 Mathematics Syllabus

**Topic:** Similarity and Congruence in Triangles (Geometric Transformations)
**Programme:** Intellia 360 Grade 10 Math — Section: Geometry — Transformations,
Similarity & Congruence
**Lesson URL:**
`https://intelliasg.com/courses/grade-10-math/lessons/similarity-congruence-triangles/`

### Source References (synthesized, not exclusive to one nation)

- Common Core State Standards, High School Geometry
  → **HSG-CO.B.6–7** — Rigid motions and the definition of congruence
  → **HSG-SRT.A.1–3** — Dilations, similarity transformations, AA criterion
  → **HSG-SRT.B.4–5** — Proving theorems about triangles; using congruence/similarity criteria to solve problems
- Cambridge IGCSE Mathematics (0580) — Unit: Similarity & Congruence, Symmetry
  → Congruence conditions SSS, SAS, ASA, RHS; similarity ratio and area/volume scale factors
- IB MYP/DP Mathematics — Geometry & Trigonometry: transformations, similarity, congruency criteria
- Ontario MPM2D (Grade 10 Academic) — Congruence in triangles, Introduction to similarity, Transformations and congruence/similarity
- Australian Curriculum ACMMG243/ACMMG244 — Geometric reasoning, congruence and similarity tests

### Global Learning Objectives Covered

| Code | Objective |
|------|-----------|
| LO1 | Define and perform the four geometric transformations: translation, rotation, reflection, dilation |
| LO2 | Explain congruence as the existence of a sequence of rigid motions mapping one figure onto another |
| LO3 | Explain similarity as the existence of a sequence of rigid motions **and** a dilation mapping one figure onto another |
| LO4 | Apply and select the correct congruence criterion: **SSS, SAS, ASA, AAS, RHS** |
| LO5 | Apply and select the correct similarity criterion: **AA, SSS~, SAS~** |
| LO6 | Compute and apply a scale factor to find missing side lengths, perimeters, and areas of similar figures |
| LO7 | Identify corresponding sides and angles correctly using proper correspondence notation (△ABC ≅ △DEF) |
| LO8 | Construct a two-column or flow proof for triangle congruence or similarity |
| LO9 | Solve real-world scale, shadow-height, and map-distance problems using similar triangles |
| LO10 | Perform transformations on the coordinate plane and describe the transformation algebraically (e.g., (x, y) → (x+3, y−2)) |

### CPA-Equivalent Progression for Grade 10 (Concrete → Visual → Formal)

| Stage | Grade 10 Equivalent |
|-------|----------------------|
| Concrete | Drag-and-transform triangle manipulatives on a canvas (translate/rotate/reflect/dilate) |
| Pictorial | Side-by-side diagrams with tick/arc congruence marks, coordinate grids, ratio labels |
| Formal | Two-column/flow proofs using named criteria and correspondence notation |

### Difficulty Bands

- **Easy** — Single transformation identification; SSS/SAS/AA with all values given; scale factor as a whole number
- **Medium** — Combined transformations (e.g., reflect then translate); missing-side problems; ASA/AAS/RHS; scale factor as a simple fraction/decimal
- **Hard** — Multi-step coordinate transformations; proof construction (choose + justify criterion); area/perimeter ratio problems (k vs. k²); indirect/real-world scale problems (shadows, maps, similar right triangles)

### Vocabulary Focus

"congruent (≅)", "similar (~)", "corresponding sides/angles", "rigid motion",
"translation", "rotation", "reflection", "dilation", "scale factor",
"center of dilation", "included angle/side", "SSS", "SAS", "ASA", "AAS", "RHS",
"AA similarity", "proportional", "orientation-preserving/reversing"

---

## 5. The 6-Phase Learner Journey (Intellia Model, Grade 10 Adaptation)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ INTRO SCREEN → Progress Map (6-step visual tracker, top bar)               │
│ Welcome: "Ready to prove it? Let's explore Similarity & Congruence!"       │
│ Lesson badge shown (locked). 6 glowing phase dots visible.                 │
└────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 1 — WONDER (≈ 2 min)                                                 │
│                                                                             │
│ Hook: "A city planner has a blueprint of a park triangle with sides       │
│ 30 m, 40 m, 50 m. A scale model shows sides 6 cm, 8 cm, 10 cm. Are these  │
│ two triangles related — and if so, how do we prove it mathematically?"    │
│                                                                             │
│ Visual: Blueprint triangle morphs/shrinks into the scale model triangle,  │
│ ratio arrows animate between corresponding sides                          │
│ Narration (ElevenLabs): confident, curious tone reads the hook            │
│ → LearnFlow AI mentor appears, posing the guiding question                │
│ → "Let's uncover what makes two triangles SIMILAR — or exactly the SAME." │
└────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 2 — STORY (≈ 3–4 min)                                                │
│                                                                             │
│ Narrative: "The Bridge Challenge" — an international engineering team     │
│ (John, Sarah, Mike, Sofia, Arjun, Wei Chen) must verify two truss         │
│ triangles on a bridge design are congruent before construction begins.    │
│                                                                             │
│ Panel 1: "John slides one triangle brace across the blueprint — a         │
│ TRANSLATION. It lands exactly on the second brace. Interesting!"          │
│ Panel 2: "Sarah notices the two braces are mirror images — she reflects  │
│ one across the centre beam. A REFLECTION."                                │
│ Panel 3: "Mike spins a brace 90° around a bolt — a ROTATION — and it      │
│ matches too!"                                                             │
│ Panel 4: "Because a sequence of RIGID MOTIONS maps one triangle exactly   │
│ onto the other, the team confirms: the triangles are CONGRUENT (≅)."     │
│ Panel 5: "Later, Sofia compares the bridge brace to a scale-model brace   │
│ that's half the size. She DILATES it by a scale factor of 2 — now it     │
│ matches exactly!"                                                         │
│ Panel 6: "A dilation plus rigid motions maps one triangle onto the       │
│ other — so the triangles are SIMILAR (~), sharing the same shape but a   │
│ different size."                                                          │
│                                                                             │
│ → Illustrated story panels (animated slide-in), ElevenLabs narration      │
│ → Key vocabulary highlighted: "rigid motion", "congruent", "dilation",   │
│   "similar", "scale factor"                                               │
│ → Transformation diagram updates live on each panel                       │
└────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 3 — SIMULATE (≈ 8–10 min)                                            │
│                                                                             │
│ 4 Interactive Stations — student must complete all 4 to advance           │
│                                                                             │
│ Station A — "Transformation Playground" (Concrete manipulation)          │
│ Drag sliders/handles to translate, rotate, reflect, or dilate a triangle  │
│ on a coordinate canvas until it lands exactly on a ghost target triangle. │
│                                                                             │
│ Station B — "Congruence Detective" (Criterion selection)                 │
│ Given marked-up diagrams (tick marks, arcs, right-angle marks), identify  │
│ which congruence criterion (SSS/SAS/ASA/AAS/RHS) applies — or "Not       │
│ enough information."                                                     │
│                                                                             │
│ Station C — "Similarity Ratio Lab" (Proportional reasoning)              │
│ Given two similar triangles with some sides/angles labelled, drag the     │
│ correct scale factor onto the diagram, then solve for a missing side.    │
│                                                                             │
│ Station D — "Proof Builder" (Formal reasoning, flow-proof)               │
│ Drag-and-drop statement/reason cards into the correct order to complete  │
│ a 3–5 step congruence or similarity proof.                                │
│                                                                             │
│ → LearnFlow AI mentor reacts to each completed station                    │
│ → ElevenLabs narrates each station's instructions and feedback            │
└────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 4 — PLAY (≈ 10–12 min)                                               │
│                                                                             │
│ IntelliPlay™ Level: 120 randomised questions across 12 worlds             │
│ 10 questions per world, world unlocks at ≥6/10 correct                   │
│ Stars (1–3), XP, badges, and streak-fire counter active                  │
│ → Mastery gates the world map; encouragement-first feedback              │
└────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 5 — REFLECT (≈ 2–3 min)                                              │
│                                                                             │
│ Journal prompt: "Explain, in your own words, the difference between      │
│ congruent and similar triangles — and give one real-world example."      │
│ Or: LearnFlow AI chat — type/speak your understanding                    │
│ Lesson-complete badge unlocks here. Summary of XP + badges shown.         │
│ → "Export proof summary / Share with your teacher" button                │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Phase 3 — Simulation Design (Detailed)

### 6.1 Station A — Transformation Playground (Concrete)

**Visual:**
- Coordinate-plane canvas (grid, axes labelled)
- A draggable "live" triangle (solid fill) and a fixed "ghost" target triangle (dashed outline)
- Transformation control panel: Translate (x, y arrows), Rotate (angle dial + center-point picker), Reflect (choose axis or custom line), Dilate (scale-factor slider + center-point picker)

**Interaction:**
- Student selects a transformation type, applies it (drag or slider), and repeats until the live triangle overlaps the ghost triangle
- Each applied transformation is logged as a readable step ("Reflected across the y-axis", "Rotated 90° about (2, 3)")
- "Check Match" button becomes active once vertices are within a snapping tolerance

**Feedback:**
- Exact match → mentor celebrates: "Perfect mapping! You just proved congruence using rigid motions."
- Partial/near match → gentle nudge: "Close! Try adjusting the rotation angle."
- If a dilation was required and skipped → hint: "These triangles are different sizes — will rigid motions alone be enough?"

**Variants per round (randomised):**
- Round 1: Single transformation (translation only)
- Round 2: Single transformation (rotation or reflection)
- Round 3: Two-step combination (reflect + translate)
- Round 4: Rigid motion(s) + dilation (introduces similarity, not congruence)

### 6.2 Station B — Congruence Detective (Pictorial → Criterion)

**Visual:**
- 4 diagram cards, each showing two triangles with tick marks (equal sides), arc marks (equal angles), and right-angle boxes where relevant
- Multiple-choice criterion options: SSS, SAS, ASA, AAS, RHS, "Not Enough Information"

**Interaction:**
- Student studies markings and selects the single correct criterion per card
- On submit: correct glows green with the matched markings highlighted; incorrect flashes red and highlights the missing/extra marking that breaks the criterion

**Distractor design:**
- Cards deliberately include a marked angle that is **not the included angle** (invalidates SAS, tests ASA vs. SSA confusion)
- One card always reads "Not Enough Information" correctly (guards against pattern-guessing)

**3 rounds, increasing difficulty:**
- Round 1: Clearly marked SSS/SAS cases
- Round 2: ASA/AAS distinction, included vs. non-included angle
- Round 3: RHS special case + a genuine "Not Enough Information" trap

### 6.3 Station C — Similarity Ratio Lab (Proportional reasoning)

**Visual:**
- Two similar triangles (one larger, one smaller) with 2 corresponding sides labelled with numbers and 1 side unknown ("x")
- A scale-factor slot: "Scale factor = ___"

**Interaction:**
- Student first computes and enters the scale factor (ratio of corresponding sides)
- Then solves for the unknown side using that ratio
- A secondary sub-task (30% of rounds) asks for **area ratio** (k²) instead of length ratio

**Variants:**
- Round 1: Whole-number scale factor, find missing side
- Round 2: Fractional/decimal scale factor, find missing side
- Round 3: Real-world context (shadow height, map distance) using similar right triangles
- Round 4: Area or perimeter ratio given the length scale factor

### 6.4 Station D — Proof Builder (Formal reasoning)

**Visual:**
- A partially-completed flow/two-column proof with 3–5 statement-reason card slots
- A shuffled tray of statement cards ("∠A ≅ ∠D", "AB ≅ DE", "△ABC ≅ △DEF") and reason cards ("Given", "Reflexive Property", "SAS", "Definition of Midpoint")

**Interaction:**
- Drag cards into the correct statement/reason slots in the correct logical order
- "Show Diagram" toggle always available for reference
- Submit checks both content correctness and sequencing

**Variants (rotated per round):**
- Round 1: 3-step SSS or SAS congruence proof
- Round 2: 4-step ASA/AAS proof with a shared/reflexive side
- Round 3: 5-step AA similarity proof involving parallel lines and alternate angles

ElevenLabs narrates each proof prompt and the final justification aloud.

---

## 7. Phase 4 — Question Bank (120 Randomised Questions)

### 7.1 Question Types (12 types × 10 questions = 120 total)

| Type | Description | Example |
|------|--------------|---------|
| Q1  | Identify the transformation | Which transformation maps △ABC onto △A'B'C'? |
| Q2  | Coordinate transformation — apply rule | Apply (x, y) → (x+3, y−2) to point A(1, 4). Find A'. |
| Q3  | Identify congruence criterion from marked diagram | Which criterion proves △PQR ≅ △XYZ? |
| Q4  | Identify similarity criterion from marked diagram | Which criterion proves △DEF ~ △GHI? |
| Q5  | Solve for missing side using congruence | Given △ABC ≅ △DEF, AB = 7 cm, find DE. |
| Q6  | Solve for missing side using similarity/scale factor | △ABC ~ △XYZ with scale factor 1.5. AB = 8 cm. Find XY. |
| Q7  | Global real-world word problem (map/scale) | A map has a scale of 1 : 50,000. Two towns are 4 cm apart on the map — find the real distance. |
| Q8  | Global real-world word problem (shadow/height, similar right triangles) | A 1.8 m tall student casts a 2.4 m shadow; a tree casts an 18 m shadow. Find the tree's height. |
| Q9  | True/False — is the criterion valid? | "Two triangles with two equal sides and a non-included equal angle are congruent by SAS." True or False? |
| Q10 | Area/perimeter ratio from scale factor | Two similar triangles have a scale factor of 3. Find the ratio of their areas. |
| Q11 | Correspondence notation | Given △ABC ≅ △RST, which side corresponds to BC? |
| Q12 | Multi-step proof-completion (drag or MCQ) | Fill in the missing reason: Step 3, "△ABC ≅ △DEF" — Reason: ___ |

### 7.2 Question Distribution by Difficulty

| Type | Count | Easy | Medium | Hard |
|------|-------|------|--------|------|
| Q1  | 10 | 5 | 3 | 2 |
| Q2  | 10 | 4 | 4 | 2 |
| Q3  | 10 | 4 | 4 | 2 |
| Q4  | 10 | 4 | 4 | 2 |
| Q5  | 10 | 4 | 4 | 2 |
| Q6  | 10 | 3 | 4 | 3 |
| Q7  | 10 | 3 | 4 | 3 |
| Q8  | 10 | 2 | 4 | 4 |
| Q9  | 10 | 4 | 4 | 2 |
| Q10 | 10 | 3 | 4 | 3 |
| Q11 | 10 | 5 | 3 | 2 |
| Q12 | 10 | 2 | 4 | 4 |
| **TOT** | **120** | **43** | **46** | **31** |

### 7.3 Number & Context Ranges

- Easy: whole-number scale factors (2, 3, 4); single transformation; clearly marked SSS/SAS/AA
- Medium: fractional/decimal scale factors; two-step transformations; ASA/AAS/SSS~/SAS~
- Hard: multi-step coordinate transformations; area/perimeter ratio (k²); proof construction; indirect measurement contexts

### 7.4 Global Names, Objects & Contexts Used in Word Problems

**Names (deliberately international, no single-country bias):**
John, Mike, Sarah, Emma, Liam, Sofia, Arjun, Priya, Wei Chen, Fatima, Diego, Yuki,
Aisha, Carlos, Nina, Noah, Amara, Lucas, Mei, Omar

**Objects/contexts:** blueprints, drone maps, bridge trusses, kites, ramps,
flagpoles, city skylines, satellite photos, scale models, road signs, ladders
against walls, sailboats, pyramids, football pitches, architecture plans

**Settings:** international engineering studio, city planning office, school
rooftop (shadow experiments), national park trail map, architecture competition,
robotics workshop

### 7.5 Language Requirements

All questions use internationally-recognized geometric vocabulary and symbol
notation (≅, ~, ∠, △, °) so the module is portable across curricula:
"congruent", "similar", "corresponding", "scale factor", "rigid motion",
"transformation", "criterion", "proportional".

---

## 8. Gamification Design

### 8.1 Reward System

- **Stars (⭐):** Earned per 10-question world (1–3 stars based on score)
- **XP Points:** 10 XP correct first try | 7 XP second try | 5 XP with hint used
- **Streak 🔥:** Fire counter for consecutive correct answers
- **Streak Bonus:** +5 XP per correct answer when streak ≥ 5

### 8.2 Badges (Unlockable)

- 🏅 **"Transformation Rookie"** — Complete Wonder + Story phases
- 🥈 **"Motion Master"** — Complete all 4 Simulation stations
- 🥇 **"Proof Champion"** — Score ≥80% on Play phase
- 💎 **"Perfect Match"** — Score 10/10 in any world
- 🔥 **"Streak Star"** — Achieve a streak of 10 consecutive correct answers
- 🌟 **"Full Journey"** — Complete all 6 phases (lesson complete badge)
- 🎯 **"Sharp Eye"** — Get 5 correct in Station B without any wrong pick
- 📐 **"Ratio Ranger"** — Answer 5 similarity/scale-factor questions correctly (Q6/Q10)
- 🧩 **"Logic Builder"** — Complete a Station D proof with zero misplaced cards

### 8.3 Feedback Mechanics

✅ **Correct:**
- Bounce animation on answer card + mentor "confident nod" mood
- ElevenLabs celebration audio: "Exactly right — that's a solid proof!"
- XP floats up from answer card (+10 / +7 / +5); streak fire increments

❌ **Incorrect (Attempt 1):**
- Gentle shake animation; hint 1 activates: relevant diagram markings highlighted
- ElevenLabs: "Not quite — look closely at which angle is included."

❌ **Incorrect (Attempt 2):**
- Stronger shake + hint 2: step-by-step reasoning overlay appears
- ElevenLabs: "Let's break this down together, step by step."

❌ **Incorrect (Attempt 3):**
- Answer revealed with full worked explanation (read aloud)
- No score penalty — encouragement-first approach always

### 8.4 World Map (IntelliPlay™ Level Progression)

| World | Theme | Focus | Difficulty |
|-------|-------|-------|------------|
| 1 | "Blueprint City" | Q1–10, single transformations | Easy |
| 2 | "Grid Lab" | Q11–20, coordinate transformation rules | Easy |
| 3 | "Bridge Yard" | Q21–30, SSS/SAS congruence | Easy–Med |
| 4 | "Mirror Studio" | Q31–40, ASA/AAS congruence | Medium |
| 5 | "Skyline Scale" | Q41–50, AA/SSS~ similarity | Medium |
| 6 | "Map Room" | Q51–60, scale-factor word problems | Medium |
| 7 | "Shadow Valley" | Q61–70, real-world similar-triangle problems | Med–Hard |
| 8 | "Ratio Reactor" | Q71–80, area/perimeter ratio (k²) | Hard |
| 9 | "Proof Forge" | Q81–90, drag-order proof completion | Hard |
| 10 | "Vector Vault" | Q91–100, multi-step coordinate transformations | Hard |
| 11 | "Summit Trials" | Q101–110, mixed criteria + correspondence notation | Hard |
| 12 | "Grand Constructor" | Q111–120, mixed hardest, full proofs + real-world | Hardest |

Unlock gate: ≥6/10 correct (1-star minimum) required to advance to next world.
3 stars unlocks a hidden "Bonus Challenge" (3 extra questions).

### 8.5 Mentor (LearnFlow AI Companion)

- Character: **LearnFlow** — a sleek AI-mentor avatar (not a childish mascot), matching Intellia branding but re-skinned for teen audience (holographic geometry-lab aesthetic)
- Mood states: idle | curious | focused | celebrating | encouraging | explaining
- Appearances: Wonder hook, Story narration, Simulation feedback, Reflect phase
- Audio: All mentor speech via ElevenLabs (pre-generated `.mp3`)

---

## 9. Audio & Narration Design

### 9.1 ElevenLabs Pipeline

- Voice Provider: **ElevenLabs (ONLY** — no browser Web Speech API fallback)
- Voice: a clear, confident, teen-appropriate educator voice (final voice ID to
  be confirmed against the reference audio sample once supplied)
- Model: `eleven_multilingual_v2` (supports the global-name pronunciation range in §7.4)
- API Key Env Var: `VITE_ELEVENLABS_API_KEY`

### 9.2 Speech Styles Mapped to ElevenLabs Settings

| Style | stability | similarity_boost | style | Use case |
|-------|-----------|-------------------|-------|----------|
| statement | 0.75 | 0.75 | 0.0 | Story narration, instructions |
| instruction | 0.80 | 0.75 | 0.0 | Simulation station prompts |
| question | 0.60 | 0.80 | 0.3 | Practice question read-aloud |
| encouragement | 0.55 | 0.85 | 0.6 | Correct answer feedback |
| emphasis | 0.85 | 0.70 | 0.1 | Key vocabulary / criterion names |
| explaining | 0.65 | 0.80 | 0.2 | Hint / worked-explanation narration |
| celebration | 0.45 | 0.90 | 0.8 | Badge unlock, world complete |

### 9.3 Pre-generated Audio Files

All phase narration lines (Wonder, Story panels, Simulate instructions, Reflect
prompt, badge unlock messages, world completion) are pre-generated offline and
stored as static `.mp3` in `public/assets/audio/`. `audioMap.js` is
auto-generated and maps exact text strings → file paths.

### 9.4 Dynamic Generation

Practice questions (Phase 4, 120 items) are generated dynamically if not
pre-cached, using `VITE_ELEVENLABS_API_KEY`. If absent, narration is silently
skipped (no browser TTS fallback). An in-memory cache prevents re-fetching the
same text.

### 9.5 Segment Synchronisation

Narration is parsed as an array of sentence-level segments; while segment *i*
plays, segment *i+1* is eagerly preloaded — guaranteeing seamless, gap-free
narration across multi-sentence scripts, using the HTML5 Audio API.

### 9.6 Narration Script Examples

**Phase 1 (Wonder) — style: question**
> "A city planner has a blueprint triangle with sides thirty, forty, and fifty
> metres. A scale model shows six, eight, and ten centimetres. Are these
> triangles related — and how could we prove it?"

**Phase 2 (Story, Panel 4) — style: emphasis**
> "Because a sequence of rigid motions maps one triangle exactly onto the
> other, the team confirms: the triangles are congruent."

**Phase 3 (Station B) — style: instruction**
> "Look closely at the tick marks and arcs. Which congruence criterion applies
> here — or is there not enough information?"

**Phase 4 (Correct feedback) — style: celebration**
> "Exactly right — that is a solid, well-justified proof!"

**Phase 5 (Reflect) — style: explaining**
> "In your own words, what's the difference between congruent and similar
> triangles? Give one real-world example."

### 9.7 Reference Audio Sample — Pending

The prompt references "the provided file" for audio style, but no audio file
was attached to this conversation. Once supplied, this section will be updated
with: the matched ElevenLabs voice ID (or closest available voice), pacing/WPM
target, and any style adjustments (e.g., more energetic vs. calm delivery) to
match the sample exactly.

---

## 10. UX & Visual Design Requirements

### 10.1 Visual Theme

- Brand: Intellia 360 — *Think. Explore. Become.*
- **Reference UI (mirror exactly):** https://equal-tau.vercel.app/
- **Reference Repo:** https://github.com/dsamyak/equal
- Re-themed for Grade 10: same layout skeleton, phase-band structure, and
  component shapes as the reference, but with a more mature "geometry lab /
  blueprint" palette instead of a nursery palette:
  - Primary blue (structural, consistent with Intellia brand)
  - Accent gold/amber for rewards, stars, XP
  - Soft coral/red for incorrect-state shake feedback
  - Deep slate/graphite backgrounds for the Simulation canvas (contrast for grid lines)
  - White card backgrounds elsewhere, soft drop shadows
- Typography: clean, geometric sans-serif (e.g., Inter or Poppins) — no
  rounded "kid" fonts
- Illustrations: flat, modern line-art (blueprints, trusses, drones, skyline),
  globally-neutral character art for the story cast

### 10.2 Layout Structure (mirrors equal-tau.vercel.app)

- **Top Bar:** Intellia logo | Lesson title "Similarity & Congruence in Triangles" | 6-phase dot tracker
- **Main Area:** Phase content (fills screen, responsive, smooth phase transitions)
- **Bottom Bar:** XP counter | Star count | Streak fire | Phase navigation arrows
- **Sidebar:** Hidden on mobile; shown on tablet+ as vertical phase map

### 10.3 Transformation/Triangle Diagram Component (Primary Visual)

Used throughout all phases:
- Coordinate grid with labelled axes
- Triangle vertices draggable (with vertex labels A, B, C / A', B', C')
- Tick marks (─, ══) for equal sides; arc marks (⌒, ⌒⌒) for equal angles;
  right-angle box for 90°
- Scale-factor / ratio label rendered beneath when relevant
- Transformation animates smoothly (300–500ms ease) between states; missing
  value shown as a dashed "?" placeholder where applicable

### 10.4 Accessibility

- Minimum 44×44px tap targets on all interactive elements
- WCAG AA colour contrast on all text
- All narration via ElevenLabs (consistent voice)
- Keyboard navigable (Tab + Enter/Arrow keys for all interactions, including
  drag-based transformation controls, which must have a keyboard/tap
  equivalent)
- No mandatory time pressure (optional timer toggle in challenge mode only)

### 10.5 Responsive Design

- Primary: Desktop/laptop browser (1024px+) — most Grade 10 usage context
- Secondary: iPad/tablet (768px+) — classroom context
- Tertiary: Mobile (375px+) — stacked single-column layout, simulation stations
  switch to tap-based (not drag-based) controls below 480px

---

## 11. Content Requirements

### 11.1 Simulation Visuals

- Coordinate-plane SVG canvas with grid, labelled axes, draggable triangle vertices
- Transformation control panel (translate/rotate/reflect/dilate) with live readouts
- Proof-builder card tray (statement/reason cards, drag targets)

### 11.2 Question Bank Coverage

- All 12 question types × 10 questions = **120 unique question objects** in `questionBank.js`
- Questions randomised per session using Fisher-Yates shuffle
- No two sessions present the same question order
- MCQ distractors always plausible (off-by-one criterion confusion, adjacent
  scale factor, common sign/rotation-direction errors)

### 11.3 Word Problem Format

**Real-world scale/map sense:**
> "[Name] measures a map scale of 1 : [ratio]. Two landmarks are [distance] cm
> apart on the map. Find the actual distance between them."

**Shadow/height (similar right triangles) sense:**
> "[Name], who is [height] m tall, casts a shadow of [shadow length] m. At the
> same time, a [object] casts a shadow of [shadow length2] m. Find the height
> of the [object]."

**Proof-completion sense:**
> "Given: [conditions]. Prove: △[X] ≅ △[Y] (or ~). Fill in the missing
> statement/reason for step [n]."

### 11.4 Audio Script Parity (1:1 Strict Parity Rule)

Every on-screen text string that is narrated must match the narration script
exactly — same words, same punctuation, same notation (≅, ~, °). Any UI text
change requires updating both the audio-generation script and the narration
data file together.

---

## 12. Success Criteria (v1.0)

| Criterion | Target |
|-----------|--------|
| All 120 questions randomised correctly | ✅ Required |
| All 4 simulation stations functional | ✅ Required |
| All 6 phases navigable end-to-end | ✅ Required |
| Gamification (XP, stars, 9 badges) working | ✅ Required |
| World map 12-world progression logic correct | ✅ Required |
| ElevenLabs audio plays for all phase narration | ✅ Required |
| Audio pipeline (pre-gen + dynamic) functional | ✅ Required |
| Mobile/tablet/desktop responsive layout | ✅ Required |
| Global Grade 10 syllabus map 100% covered | ✅ Required |
| Loads in < 3 seconds (Vite production build) | ✅ Required |
| WCAG AA accessible | ✅ Required |
| UI strictly matches equal-tau.vercel.app structure | ✅ Required |
| Hosted correctly at intelliasg.com lesson URL | ✅ Required |

---

## 13. Out of Scope (v1.0)

- Teacher dashboard / backend analytics
- Student login / account persistence across devices
- Multiplayer or class competition features
- Parent progress report emails
- Print worksheet generation (beyond the single proof-summary export in Reflect)
- Coverage of non-triangle similarity/congruence (quadrilaterals, circles) — separate module
- Trigonometric ratios in similar right triangles (sine/cosine/tangent) — separate lesson
- Full formal axiomatic transformation-geometry course — this module covers
  application-level use of transformations to justify congruence/similarity only

---

**Document Version:** 1.0 | July 2026
**Product:** Intellia 360 — Grade 10 Math
**Lesson Title:** Similarity and Congruence in Triangles (Geometric Transformations)
**Curriculum:** Global Grade 10 Mathematics Syllabus (Common Core, Cambridge IGCSE, IB, Australian, Ontario — synthesized)
**Reference UI:** https://equal-tau.vercel.app/
**Reference Repo:** https://github.com/dsamyak/equal
**Reference Course Pattern:** https://intelliasg.com/courses/grade-3-math
**Audio Pipeline:** ElevenLabs (voice TBD pending reference sample — see §9.7)
**Parent Course Page:** https://intelliasg.com/courses/grade-10-math/
**Lesson URL:** https://intelliasg.com/courses/grade-10-math/lessons/similarity-congruence-triangles/
