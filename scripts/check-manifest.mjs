// Required build gate: absence, stale source, or invalid exports fail the build.

import { fileURLToPath } from 'node:url';
import { checkScene } from './scene-manifest.mjs';

try {
  console.log('check:manifest ok', JSON.stringify(checkScene(fileURLToPath(new URL('..',import.meta.url)))));
} catch (error) {
  console.error('check:manifest failed:', error.message);
  process.exitCode=1;
}
