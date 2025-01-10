import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import autoprefixer from 'autoprefixer';

const packageJson = require('./package.json');

export default [
  // UMD build
  {
    input: 'src/BitPlayer.ts',
    output: [
      {
        file: 'dist/bitplayer.js',
        format: 'umd',
        name: 'BitPlayer',
        sourcemap: true,
      },
      {
        file: 'dist/bitplayer.min.js',
        format: 'umd',
        name: 'BitPlayer',
        plugins: [terser()],
        sourcemap: true,
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      postcss({
        plugins: [autoprefixer()],
        extract: 'bitplayer.css',
        minimize: true,
      }),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
      }),
    ],
  },
  // ESM build
  {
    input: 'src/ReactBitPlayer.tsx',
    output: [
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    external: ['react', 'react-dom'],
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      postcss({
        plugins: [autoprefixer()],
        extract: 'bitplayer.css',
        minimize: true,
      }),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
      }),
    ],
  },
];
