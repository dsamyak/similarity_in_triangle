// utils/audio.js — Core audio playback engine with local fallback
import { audioMap } from './audioMap.js';

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

let currentAudio = null;

export function stopAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

export async function getAudioUrl(text, style = 'statement') {
  // Only use offline static map
  if (audioMap[text]) {
    return audioMap[text];
  }
  
  console.warn(`No pre-generated audio found for: "${text}"`);
  return null;
}

async function playAudio(url) {
  return new Promise((resolve) => {
    const audio = new Audio(url);
    currentAudio = audio;
    audio.onended = resolve;
    audio.onerror = resolve;
    audio.play().catch(resolve);
  });
}

export async function narrate(segments, onSegmentStart) {
  stopAudio();
  for (let i = 0; i < segments.length; i++) {
    const { text, style } = segments[i];
    
    // Eagerly preload next segment if not in static map
    if (i + 1 < segments.length) {
      getAudioUrl(segments[i + 1].text, segments[i + 1].style);
    }
    
    const url = await getAudioUrl(text, style);
    if (!url) continue;
    
    if (onSegmentStart) onSegmentStart(i);
    await playAudio(url);
  }
}
