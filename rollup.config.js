import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('package.json', {encoding: 'utf8'}));
const banner = `/* muigui@${pkg.version}, license MIT */`;

const plugins = [
    typescript({ tsconfig: './tsconfig.json' }),
    resolve({
      modulesOnly: true,
    }),
];

export default [
  {
    input: 'src/esm.ts',
    treeshake: false,
    plugins,
    output: [
      {
        format: 'es',
        file: 'dist/0.x/muigui.module.js',
        indent: '  ',
        banner,
        sourcemap: true,
      },
    ],
  },
  {
    input: 'src/umd.js',
    treeshake: false,
    plugins,
    output: [
      {
        format: 'umd',
        file: 'dist/0.x/muigui.js',
        indent: '  ',
        banner,
        name: 'GUI',
        sourcemap: true,
      },
    ],
  },
  {
    input: 'src/esm.ts',
    treeshake: false,
    plugins: [
      ...plugins,
      terser(),
    ],
    output: [
      {
        format: 'es',
        file: 'dist/0.x/muigui.module.min.js',
        indent: '  ',
        banner,
        sourcemap: true,
      },
    ],
  },
  {
    input: 'src/umd.js',
    treeshake: false,
    plugins: [
      ...plugins,
      terser(),
    ],
    output: [
      {
        format: 'umd',
        file: 'dist/0.x/muigui.min.js',
        indent: '  ',
        banner,
        name: 'GUI',
        sourcemap: true,
      },
    ],
  },
];
