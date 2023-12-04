import path from 'path';
import fsPromise from 'fs/promises';
import chokidar from 'chokidar';

export function copy({watch, transformFn = v => v}) {
  return new Promise(resolve => {
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
      const src = await fsPromise.readFile(srcFilename);
      const dst = transformFn(src, srcFilename, dstFilename);
      await fsPromise.writeFile(dstFilename, dst);
    }

    chokidar.watch('.', {
      ignored: [
        '.git',
        'node_modules',
        'build',
        'out',
        'src',
        'dist',
        '**/.*',
      ],
    }).on('all', (event, path) => {
      switch (event) {
        case 'add':
        case 'change':
          copyFile(path);
          break;
        case 'ready':
          if (!watch) {
            resolve();
          }
          break;
      }
    });
  });
}