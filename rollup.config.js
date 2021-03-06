import resolve from 'rollup-plugin-node-resolve';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('package.json', {encoding: 'utf8'}));
const banner = `/* muigui@${pkg.version}, license MIT */`;

export default [
  {
    input: 'src/umd.js',
    plugins: [
      resolve({
        modulesOnly: true,
      }),
    ],
    output: [
      {
        format: 'umd',
        file: 'dist/0.x/muigui.js',
        indent: '  ',
        banner,
        name: 'GUI',
      },
      {
        format: 'es',
        file: 'dist/0.x/muigui.module.js',
        indent: '  ',
        banner,
      },
    ],
  },
];
