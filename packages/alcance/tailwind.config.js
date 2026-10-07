// Padrão de sistema de módulo - CommonJS
const plugin = require('tailwindcss/plugin');
const brightnessPlugin = require('./tailwind-plugins/brightness');
const safelist = require('./tailwind-safelist');
const uswdsColors = require('./uswds-colors');
const { fontSize, screens, borderWidth, borderRadius, fontWeight } = require('./src/utils/tailwind');

// Com ES Modules
/* import { fontSize, screens, borderWidth, borderRadius, fontWeight } from './src/utils/tailwind'; */

// tailwind.config.js
module.exports = {
  // Ativa o modo escuro utilizando a classe `.dark` ou o atributo `data-alc-theme="dark"`
  darkMode: ['class', '[data-alc-theme="dark"]'],
  // Plugins nativos do Tailwind
  corePlugins: {
    // O projeto utiliza o container do Bootstrap
    // O container nativo do Tailwind é desabilitado para evitar conflitos
    container: false
  },

  /* Arquivos utilizados pelo Tailwind para gerar apenas
  as classes efetivamente utilizadas na aplicação */
  content: [
    './src/components/**/*.css',
    './src/components/**/*.js',
    './src/components/**/*.ts',
    './src/components/**/*.tsx',
    './src/pages/**/*',
    './src/index.html',
    './src/stories/**/*.mdx',
  ],

  /* Classes que devem ser preservadas mesmo quando não
  forem encontradas durante a análise do conteúdo */

  // Aproveitar shorthand do JavaScript
  // safelist: safelist,
  safelist,

  theme: {
    // Fonte padrão da aplicação
    fontFamily: {
      'sans': ['Roboto', 'system-ui', 'sans-serif'],
    },

    // Escala tipográfica compartilhada pelo Design System
    // Aproveitar shorthand do JavaScript
    // fontSize: fontSize,
    fontSize,

    // Substitui completamente a paleta padrão do Tailwind pelas cores do USWDS
    // Apenas as cores básicas (transparent, current, white e black) são preservadas para compatibilidade com utilitários nativos
    colors: Object.assign(
      {
        transparent: 'transparent',
        current: 'currentColor',
        white: '#ffffff',
        black: '#000000',
      },
      uswdsColors
    ),

    // Breakpoints da aplicação
    // Aproveitar shorthand do JavaScript
    // screens: screens,
    screens,

    // Escala utilizada pelo brightnessPlugin
    brightness: {
      '25': 'brightness(0.25)',
      '50': 'brightness(0.5)',
      '75': 'brightness(0.75)',
      '100': 'brightness(1)'
    },

    extend: {
      // Larguras de borda adicionais utilizadas pelo projeto
      borderWidth,

      // Escala de radius do Design System (--alc-radius-*)
      borderRadius,

      // Escala de peso de fonte do Design System (--font-weight-*)
      fontWeight,

      backgroundColor: {
        /* Backgrounds semânticos baseados em CSS Custom Properties.
        O namespace "skin" foi definido para agrupar tokens
        visuais consumidos pelos componentes da aplicação. */

        skin: {
          'surface-primary': 'var(--alc-color-surface-primary)',
          'surface-secondary': 'var(--alc-color-surface-secondary)',
          'surface-tertiary': 'var(--alc-color-surface-tertiary)'
        }
      },

      // Extensões da paleta USWDS
      /* Alguns componentes necessitam de tons intermediários que
      não existem na distribuição oficial do USWDS */
      colors: {
        "mint-cool": {
          /* Tom intermediário entre mint- cool - 80 e mint- cool - 90.
          Obtido utilizando interpolação de cores.
          https://colors.dopely.top/color-blender/111818-203131-9 */
          "86": "#172222",
        },
        "gray-cool": {
          "86": "#232425"
        },
        "gray": {
          "95": "#0F1113",
        }
      },
    }
  },

  variants: {
    extend: {},
    // Variantes habilitadas para o brightnessPlugin
    brightness: ['hover', 'focus']
  },

  plugins: [
    brightnessPlugin,
    // Utilitário adicional para permitir a borda inferior transparente
    plugin(function ({ addUtilities, theme }) {
      addUtilities({
        '.border-b-transparent': {
          borderBottomColor: theme('colors.transparent')
        }
      })
    })
  ],
}
