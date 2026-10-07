// .storybook/manager.ts

import { addons } from 'storybook/manager-api';
import alcance from './alcance';
import {
  defaultConfig,
  type TagBadgeParameters,
} from 'storybook-addon-tag-badges';

addons.setConfig({
  theme: alcance,
  tagBadges: [
    {
      tags: 'alfa',
      badge: {
        text: 'Alfa',
        style: {
          backgroundColor: '#fefce8',
          color: '#854d0e',
          borderColor: 'rgb(202 138 4 / 20%)',
        },
        tooltip: 'Esse componente está em fase de criação e pode sofrer alterações.',
      },
      display: {
        sidebar: [{
          type: 'component',
          skipInherited: true,
        }],
        toolbar: true,
      },
    },
    {
      tags: 'beta',
      badge: {
        text: 'Beta',
        style: {
          backgroundColor: 'rgb(239 246 255 / 1)',
          color: 'rgb(29 78 216 / 1)',
          borderColor: 'rgb(29 78 216 / 0.1)',
        },
        tooltip: 'Esse componente está em fase de testes e pode conter bugs.',
      },
      display: {
        sidebar: [{
          type: 'component',
          skipInherited: true,
        }],
        toolbar: true,
      },
    },
    {
      tags: 'novo',
      badge: {
        text: 'Novo',
        style: {
          backgroundColor: 'rgb(240 253 244 / 1)',
          color: 'rgb(21 128 61 / 1)',
          borderColor: 'rgb(22 163 74 / 0.2)',
        },
        tooltip: 'Esse componente é um lançamento recente e pode sofrer alterações.',
      },
      display: {
        sidebar: [{
          type: 'component',
          skipInherited: true,
        }],
        toolbar: true,
      },
    },
    {
      tags: 'descontinuado',
      badge: {
        text: 'Descontinuado',
        style: {
          backgroundColor: 'rgb(254 236 232 / 28%)',
          color: 'rgb(133 32 14)',
          borderColor: 'rgb(163 61 22 / 20%)',
        },
        tooltip: 'Esse componente foi descontinuado e não será mais atualizado.',
      },
      display: {
        sidebar: [{
          type: 'component',
          skipInherited: true,
        }],
        toolbar: true,
      },
    },
    // Place the default config after your custom matchers.
    ...defaultConfig,
  ] satisfies TagBadgeParameters,
})