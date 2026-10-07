export default {
  /** Globs to analyze */
  globs: ['src/**/*.tsx'],
  /** Globs to exclude */
  exclude: ['src/**/*.spec.tsx'],
  /** Directory to output CEM to */
  outdir: 'utils',
  /** Run in dev mode, provides extra logging */
  dev: true,
  /** Run in watch mode, runs on file changes */
  watch: true,
  /** Include third party custom elements manifests */
  dependencies: true,
  /** Output CEM path to `package.json`, defaults to true */
  packagejson: false,
  /** Enable special handling for litelement */
  litelement: false,
  /** Enable special handling for catalyst */
  catalyst: false,
  /** Enable special handling for fast */
  fast: false,
  /** Enable special handling for stencil */
  stencil: true,
  /** Provide custom plugins */
  plugins: [],
};
