/* global require, process */
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', {encoding: 'utf8'}));
const banner = `/* unzipit@${pkg.version}, license MIT */`;

for (const filename of process.argv.slice(2)) {
  const content = fs.readFileSync(filename, 'utf8');
  fs.writeFileSync(filename, `${banner}\n${content}`);
}