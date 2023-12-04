import {spawn} from 'child_process';
import {copy} from './copy.js';

spawn('./node_modules/.bin/tsc', [
  '--watch',
  '--project', 'build/tsconfig-serve.json',
], {
  stdio: 'inherit',
});

spawn('./node_modules/.bin/servez', [
  'out',
], {
  shell: true,
  stdio: 'inherit',
});

copy({watch: true});
