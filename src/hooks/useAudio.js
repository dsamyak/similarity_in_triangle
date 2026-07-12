// hooks/useAudio.js — ElevenLabs + HTML5 Audio playback hook

const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Rachel
const API_KEY = 'sk_7ef27dccb32144843f8ee5068dfd4223a85326c56c14b00a';

const STYLE_SETTINGS = {
  statement:    { stability: 0.75, similarity_boost: 0.75, style: 0.0 },
  instruction:  { stability: 0.80, similarity_boost: 0.75, style: 0.0 },
  question:     { stability: 0.60, similarity_boost: 0.80, style: 0.3 },
  encouragement:{ stability: 0.55, similarity_boost: 0.85, style: 0.6 },
  emphasis:     { stability: 0.85, similarity_boost: 0.70, style: 0.1 },
  explaining:   { stability: 0.65, similarity_boost: 0.80, style: 0.2 },
  celebration:  { stability: 0.45, similarity_boost: 0.90, style: 0.8 },
};

const elevenLabsCache = new Map();
let currentAudio = null;

export function stopAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

export async function getAudioUrl(text, style = 'statement') {
  const cacheKey = `${text}::${style}`;
  if (elevenLabsCache.has(cacheKey)) return elevenLabsCache.get(cacheKey);

  try {
    const styleSettings = STYLE_SETTINGS[style] ?? STYLE_SETTINGS.statement;
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: styleSettings,
        }),
      }
    );
    if (!response.ok) return null;
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    elevenLabsCache.set(cacheKey, url);
    return url;
  } catch {
    return null;
  }
}

export async function narrate(segments, onSegmentStart) {
  stopAudio();
  for (let i = 0; i < segments.length; i++) {
    const { text, style } = segments[i];
    const url = await getAudioUrl(text, style);
    if (!url) continue;
    // Preload next segment
    if (i + 1 < segments.length) {
      getAudioUrl(segments[i + 1].text, segments[i + 1].style);
    }
    if (onSegmentStart) onSegmentStart(i);
    await playAudio(url);
  }
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

export function useNarrate() {
  return { narrate, stopAudio, getAudioUrl };
}
