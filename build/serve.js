import * as path from 'node:path';
import {spawn} from 'child_process';
import {copy} from './copy.js';

const f = p => p.replace(/\//g, path.sep);

spawn(f('./node_modules/.bin/tsc'), [
  '--watch',
  '--project', 'build/tsconfig-serve.json',
], {
  stdio: 'inherit',
  shell: true,
});

spawn(f('./node_modules/.bin/servez'), [
  'out',
], {
  shell: true,
  stdio: 'inherit',
});

copy({watch: true});
