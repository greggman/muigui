import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('package.json', {encoding: 'utf8'}));
const banner = `/* muigui@${pkg.version}, license MIT */`;

export default [
  {
    input: 'src/esm.js',
    treeshake: false,
    plugins: [
      resolve({
        modulesOnly: true,
      }),
    ],
    output: [
      {
        format: 'es',
        file: 'dist/0.x/muigui.module.js',
        indent: '  ',
        banner,
      },
    ],
  },
  {
    input: 'src/umd.js',
    treeshake: false,
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
    ],
  },
  {
    input: 'src/esm.js',
    treeshake: false,
    plugins: [
      resolve({
        modulesOnly: true,
      }),
      terser(),
    ],
    output: [
      {
        format: 'es',
        file: 'dist/0.x/muigui.module.min.js',
        indent: '  ',
        banner,
      },
    ],
  },
  {
    input: 'src/umd.js',
    treeshake: false,
    plugins: [
      resolve({
        modulesOnly: true,
      }),
      terser(),
    ],
    output: [
      {
        format: 'umd',
        file: 'dist/0.x/muigui.min.js',
        indent: '  ',
        banner,
        name: 'GUI',
      },
    ],
  },
];
