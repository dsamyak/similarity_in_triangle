// utils/narration.js — Semantic helpers and dictionary for narration

export const say = (text) => ({ text, style: 'statement' });
export const ask = (text) => ({ text, style: 'question' });
export const encourage = (text) => ({ text, style: 'encouragement' });
export const celebrate = (text) => ({ text, style: 'celebration' });
export const emphasize = (text) => ({ text, style: 'emphasis' });
export const think = (text) => ({ text, style: 'thinking' });

// Pre-defined static narration sequences used across the app
export const NARRATION = {
  WONDER_PHASE: [
    say("A city planner has a blueprint triangle with sides thirty, forty, and fifty metres."),
    ask("A scale model shows six, eight, and ten centimetres. Are these triangles related?"),
    encourage("Let's uncover what makes two triangles similar, or exactly the same!")
  ],
  STATION_COMPLETE: [celebrate('Station complete! Moving to the next challenge.')],
  ALL_STATIONS_COMPLETE: [celebrate('Outstanding! You have completed all four simulation stations!')],
  TRANSFORM_CORRECT: [celebrate('Exactly right! The triangles match!')],
  RATIO_INCORRECT_1: [encourage('Not quite. Check the ratio of corresponding sides.')],
  RATIO_CORRECT: [celebrate('Correct! Well done!')],
  RATIO_INCORRECT_2: [encourage('Not quite. Multiply the known side by the scale factor.')],
  PROOF_CORRECT: [celebrate('Excellent! A perfectly structured proof!')],
  PROOF_INCORRECT: [encourage('Some steps are out of place. Check the highlighted rows.')],
  CONGRUENCE_CORRECT: [celebrate('Perfect! All criteria identified correctly!')],
  CONGRUENCE_INCORRECT: [encourage('Check the highlighted cards — some are incorrect.')],
  PLAY_CORRECT: [celebrate('Correct!')],
  PLAY_INCORRECT: [encourage('Not quite.')],
  REFLECT_COMPLETE: [celebrate('Lesson complete! You are a Proof Champion!')]
};
