// utils/badgeEngine.js

export const BADGES = [
  {
    id: 'transformation_rookie',
    label: '🏅 Transformation Rookie',
    emoji: '🏅',
    description: 'Complete Wonder and Story phases',
    condition: (s) => s.phaseComplete.wonder && s.phaseComplete.story,
  },
  {
    id: 'motion_master',
    label: '🥈 Motion Master',
    emoji: '🥈',
    description: 'Complete all 4 Simulation stations',
    condition: (s) => s.simStationsComplete.every(Boolean),
  },
  {
    id: 'proof_champion',
    label: '🥇 Proof Champion',
    emoji: '🥇',
    description: 'Score 80%+ in Play phase',
    condition: (s) => {
      const totalCorrect = s.worldScores.reduce((sum, ws) => sum + (ws || 0), 0);
      return totalCorrect >= 96;
    },
  },
  {
    id: 'perfect_match',
    label: '💎 Perfect Match',
    emoji: '💎',
    description: 'Score 10/10 in any world',
    condition: (s) => s.worldScores.some(ws => ws === 10),
  },
  {
    id: 'streak_star',
    label: '🔥 Streak Star',
    emoji: '🔥',
    description: 'Achieve a streak of 10 consecutive correct answers',
    condition: (s) => s.maxStreak >= 10,
  },
  {
    id: 'full_journey',
    label: '🌟 Full Journey',
    emoji: '🌟',
    description: 'Complete all 6 phases',
    condition: (s) => Object.values(s.phaseComplete).every(Boolean),
  },
  {
    id: 'sharp_eye',
    label: '🎯 Sharp Eye',
    emoji: '🎯',
    description: 'Complete Station B without any wrong selection',
    condition: (s) => s.stationBPerfect === true,
  },
  {
    id: 'ratio_ranger',
    label: '📐 Ratio Ranger',
    emoji: '📐',
    description: 'Answer 5 similarity/scale-factor questions correctly',
    condition: (s) => (s.ratioQuestionsCorrect || 0) >= 5,
  },
  {
    id: 'logic_builder',
    label: '🧩 Logic Builder',
    emoji: '🧩',
    description: 'Complete a Station D proof with zero misplaced cards',
    condition: (s) => s.proofBuilderPerfect === true,
  },
];

export function checkBadges(state) {
  return BADGES
    .filter(b => !state.badges.includes(b.id) && b.condition(state))
    .map(b => b.id);
}
