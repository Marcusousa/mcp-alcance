import path from 'path';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: [{ dir: path.resolve('dist/'), format: 'es' }],
  plugins: [
    resolve(),
    commonjs(),
    postcss({
      extensions: ['.css'],
    }),
    copy({
      targets: [
        {
          src: 'node_modules/@seuso/alcance/dist/alcance/icons',
          dest: 'dist',
        },
        {
          src: 'src/index.html',
          dest: 'dist/'
        }
      ],
    }),
  ],
};