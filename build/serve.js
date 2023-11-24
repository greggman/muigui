import path from 'path';
import fsPromise from 'fs/promises';
import {spawn} from 'child_process';
import chokidar from 'chokidar';

spawn('./node_modules/.bin/tsc', [
  '--watch',
], {
  stdio: 'inherit',
});

spawn('./node_modules/.bin/servez', [
  'out',
], {
  shell: true,
  stdio: 'inherit',
});

const ignoreFns = [
  fn => fn.startsWith('.git'),
  fn => fn.startsWith('node_modules'),
  fn => fn.startsWith('build'),
  fn => fn.startsWith('out'),
  fn => fn.startsWith('src'),
  fn => fn.startsWith('dist'),
  fn => fn.startsWith('.'),
];

function ignore(fn) {
  for (const ignoreFn of ignoreFns) {
    if (ignoreFn(fn)) {
      return true;
    }
  }
  return false;
}

const outDir = 'out';

async function copyFile(srcFilename) {
  const dstFilename = path.join(outDir, srcFilename);
  const dirname = path.dirname(dstFilename);
  try {
    await fsPromise.stat(dirname);
  } catch {
    await fsPromise.mkdir(dirname, { recursive: true });
  }
  console.log('copy', srcFilename, '->', dstFilename);
  await fsPromise.copyFile(srcFilename, dstFilename);
}

chokidar.watch('.').on('all', (event, path) => {
  switch (event) {
    case 'add':
    case 'change':
      if (ignore(path)) {
        return;
      }
      copyFile(path);
      break;
  }
});
