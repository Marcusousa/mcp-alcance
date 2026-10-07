// .storybook/YourTheme.js

import { create } from 'storybook/theming/create';
import './global.css';


export default create({
  base: 'light',
  // Typography
  fontBase: 'Roboto, system-ui, sans-serif',
  fontCode: 'monospace',

  brandTitle: 'Alcance',
  brandUrl: 'https://ux.camara.leg.br/alcance-storybook',
  brandTarget: '_self',

  //
  //colorPrimary: '--alc-color-surface-primary',
  colorSecondary: '#2A648A', // blue-60

  // UI
  // appBg: '--alc-color-surface-primary',
  // appContentBg: '--alc-color-surface-primary',
  // appBorderColor: '#585C6D',
  // appBorderRadius: 4,

  // Text colors
  //textColor: '--alc-color-text-0',
  //textInverseColor: '--alc-color-text-0',

  // Toolbar default and active colors
  // barTextColor: '--alc-color-text-0',
  // barSelectedColor: '#585C6D',
  // barBg: '#ffffff',

  // Form colors
  // inputBg: '--alc-color-surface-primary',
  // inputBorder: '#10162F',
  // inputTextColor: '--alc-color-text-0',
  // inputBorderRadius: 2,
});