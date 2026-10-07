import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default [{
  // Gera o bundle com todos os componentes do Alcance
  input: 'getbundle.js',
  output: [
    {
      file: 'dist/bundle.js',
      format: 'es'
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
  ],
}, {
  // Gera o bundle com elementos selecionados do Alcance
  input: 'getbundle-selected.js',
  output: [
    {
      file: 'dist/bundle-selected.js',
      format: 'es'
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
  ],
}];