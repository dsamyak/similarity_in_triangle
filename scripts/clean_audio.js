import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// We'll read audioMap dynamically or just hardcode the check since it's a script
import { audioMap } from '../src/utils/audioMap.js';

const OUTPUT_DIR = path.join(__dirname, '../public/assets/audio');

function cleanAudio() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    console.log('Audio directory does not exist. Nothing to clean.');
    return;
  }

  const validFiles = new Set(Object.values(audioMap).map(p => path.basename(p)));
  const existingFiles = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.mp3'));

  let deletedCount = 0;

  for (const file of existingFiles) {
    if (!validFiles.has(file)) {
      const filepath = path.join(OUTPUT_DIR, file);
      fs.unlinkSync(filepath);
      console.log(`Deleted orphaned audio: ${file}`);
      deletedCount++;
    }
  }

  if (deletedCount === 0) {
    console.log('No orphaned audio files found.');
  } else {
    console.log(`Cleaned up ${deletedCount} files.`);
  }
}

cleanAudio();
