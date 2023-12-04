import fs from 'fs';
import path from 'path';
import * as url from 'url';
const dirname = url.fileURLToPath(new URL('.', import.meta.url));


const ignoreFilename = path.join(dirname, '..', '.gitignore');
const ignore = fs.readFileSync(ignoreFilename, {encoding: 'utf8'});
const newIgnore = ignore.replace(/# -- clip-for-deploy-start --[\s\S]*?# -- clip-for-deploy-end --/, '');
fs.writeFileSync(ignoreFilename, newIgnore);

const version = parseInt(JSON.parse(fs.readFileSync('package.json', {encoding: 'utf8'})).version);

function transformJS(src) {
  return src.replace(/'.*?'\s+\/*\s+muigui-include\s+*\//g, `dist/${version}.x/muigui.module.js`);
}

[
  'examples/js/index.js',
].forEach(filename => {
  const src = fs.readFileSync(filename, {encoding: 'utf8'});
  const dst = transformJS(src);
  if (src !== dst) {
    fs.writeFileSync(filename, dst);
  }
});

