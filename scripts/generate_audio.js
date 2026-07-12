import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const API_KEY = process.env.VITE_ELEVENLABS_API_KEY;

const STYLE_SETTINGS = {
  statement:    { stability: 0.75, similarity_boost: 0.75, style: 0.0 },
  instruction:  { stability: 0.80, similarity_boost: 0.75, style: 0.0 },
  question:     { stability: 0.60, similarity_boost: 0.80, style: 0.3 },
  encouragement:{ stability: 0.55, similarity_boost: 0.85, style: 0.6 },
  emphasis:     { stability: 0.85, similarity_boost: 0.70, style: 0.1 },
  thinking:     { stability: 0.65, similarity_boost: 0.80, style: 0.2 },
  celebration:  { stability: 0.45, similarity_boost: 0.90, style: 0.8 },
};

const phrases = [
  // Wonder Phase
  { text: "A city planner has a blueprint triangle with sides thirty, forty, and fifty metres.", style: 'statement' },
  { text: "A scale model shows six, eight, and ten centimetres. Are these triangles related?", style: 'question' },
  { text: "Let's uncover what makes two triangles similar, or exactly the same!", style: 'encouragement' },
  
  // Story Phase
  { text: "Tyler slides one triangle brace across the blueprint. It lands exactly on the second brace. Every point moved the same distance in the same direction — that's a Translation!", style: 'statement' },
  { text: "Madison notices the two braces are mirror images. She reflects one triangle across the centre beam. Same shape, flipped side! That's a Reflection.", style: 'statement' },
  { text: "Brandon rotates a brace 90 degrees around a pivot bolt — and it matches perfectly! The shape turned but didn't stretch. That's a Rotation.", style: 'statement' },
  { text: "Because a sequence of rigid motions maps one triangle exactly onto the other, the engineering team confirms: the triangles are Congruent!", style: 'emphasis' },
  { text: "Jordan compares the full-size bridge brace to a scale model brace half the size. A Dilation stretched one triangle to match the other!", style: 'statement' },
  { text: "A dilation plus rigid motions maps one triangle onto the other, so they are Similar! Same angles, proportional sides — Riley can calculate real distances from the scale model.", style: 'emphasis' },
  
  // Simulate Phase
  { text: "Station complete! Moving to the next challenge.", style: 'celebration' },
  { text: "Outstanding! You have completed all four simulation stations!", style: 'celebration' },
  
  // Transform Playground
  { text: "Exactly right! The triangles match!", style: 'celebration' },
  
  // Similarity Ratio Lab
  { text: "Not quite. Check the ratio of corresponding sides.", style: 'encouragement' },
  { text: "Correct! Well done!", style: 'celebration' },
  { text: "Not quite. Multiply the known side by the scale factor.", style: 'encouragement' },
  
  // Proof Builder
  { text: "Excellent! A perfectly structured proof!", style: 'celebration' },
  { text: "Some steps are out of place. Check the highlighted rows.", style: 'encouragement' },
  
  // Congruence Detective
  { text: "Perfect! All criteria identified correctly!", style: 'celebration' },
  { text: "Check the highlighted cards — some are incorrect.", style: 'encouragement' },
  
  // Play Phase
  { text: "Correct!", style: 'celebration' },
  { text: "Not quite.", style: 'encouragement' },
  
  // Reflect Phase
  { text: "Lesson complete! You are a Proof Champion!", style: 'celebration' }
];

const OUTPUT_DIR = path.join(__dirname, '../public/assets/audio');
const MAP_FILE = path.join(__dirname, '../src/utils/audioMap.js');

async function generateAudio() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const audioMap = {};

  console.log(`Starting generation for ${phrases.length} phrases...`);

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const safeName = text.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
    const filename = `audio_${safeName}_${i}.mp3`;
    const filepath = path.join(OUTPUT_DIR, filename);
    const relativePath = `/assets/audio/${filename}`;

    audioMap[text] = relativePath;

    if (fs.existsSync(filepath)) {
      console.log(`[Skipping] Already exists: ${filename}`);
      continue;
    }

    console.log(`[Fetching] ${text.substring(0, 50)}...`);
    try {
      const styleSettings = STYLE_SETTINGS[style] || STYLE_SETTINGS.statement;
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
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
      });

      if (!response.ok) {
        console.error(`Failed to generate audio for "${text}". Status: ${response.status}`);
        const textResponse = await response.text();
        console.error(textResponse);
        continue;
      }

      const buffer = await response.arrayBuffer();
      fs.writeFileSync(filepath, Buffer.from(buffer));
      console.log(`Saved ${filename}`);
    } catch (error) {
      console.error(`Error fetching audio for "${text}":`, error.message);
    }
  }

  const mapContent = `// Auto-generated by scripts/generate_audio.js\n\nexport const audioMap = ${JSON.stringify(audioMap, null, 2)};\n`;
  fs.writeFileSync(MAP_FILE, mapContent);
  console.log('Successfully generated src/utils/audioMap.js!');
}

generateAudio();
