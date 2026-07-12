// hooks/useAudio.js — Re-exports from the new core audio engine
import { narrate, stopAudio, getAudioUrl } from '../utils/audio.js';

export { narrate, stopAudio, getAudioUrl };

export function useNarrate() {
  return { narrate, stopAudio, getAudioUrl };
}
