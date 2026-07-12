// utils/scoring.js
import { shuffleArray } from './shuffle.js';

export function calcXP(attemptNumber, hintsUsed, streak) {
  const base = attemptNumber === 1 ? 10 : hintsUsed > 0 ? 5 : 7;
  const streakBonus = streak >= 5 ? 5 : 0;
  return base + streakBonus;
}

export function calcStars(correct, total = 10) {
  if (correct >= 9) return 3;
  if (correct >= 7) return 2;
  if (correct >= 5) return 1;
  return 0;
}

export function canUnlockWorld(worldScore) {
  return worldScore !== null && worldScore >= 5;
}

export function calcTotalStars(worldScores) {
  return worldScores.reduce((sum, ws) => sum + (ws !== null ? calcStars(ws) : 0), 0);
}

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

export function generateCriterionDistractors(correctCriterion, pool = ['SSS', 'SAS', 'ASA', 'AAS', 'RHS', 'Not Enough Info']) {
  const distractors = shuffleArray(pool.filter(c => c !== correctCriterion)).slice(0, 3);
  return shuffleArray([correctCriterion, ...distractors]);
}
