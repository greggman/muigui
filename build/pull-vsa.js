import fs from 'fs';
import process from 'process';

// node build/pull-vsa.js ...url-to-vsa
const urls = process.argv.slice(2);

for (const url of urls) {
  const req = await fetch(`${url}?format=json`);
  const data = await req.json();
  const filename = `examples/js/index/effects/${data.name}.js`;
  const shader = data.settings.shader;
  data.settings.shader = '--shader--';
  const s = `\
/* eslint-disable require-trailing-comma/require-trailing-comma */
/* eslint-disable no-useless-escape */
export default ${JSON.stringify(data, null, 2)
    .replace(/"(.*?)":/g, '$1:')
    .replace('"--shader--"', `\`${shader}\``)};\n`;
  console.log('write', filename);
  fs.writeFileSync(filename, s);
}