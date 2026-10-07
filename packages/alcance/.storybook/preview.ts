/** @type { import('@storybook/html-vite').Preview } */
import { Preview } from '@storybook/html';
import './tailwind.css';
import '../dist/alcance/alcance.css';
import './storybook.css';
import { /* @vite-ignore */ defineCustomElements } from '../loader';
//import i18n from './i18next';

/*
  Cria um flag global para identificar que o Storybook do Alcance está sendo executado.
  Isso pode ser usado pelos componentes em situações bem específicas, para definir
  comportamentos diferentes quando estão sendo renderizados dentro do Storybook.
  Deve ser usado com muita moderação.

  Ele foi criado para resolver o problema dos exemplos de modal, que quando
  abertos bloqueiam o scroll da página. Como isso não é desejável nos exemplos,
  o modal pode verificar a existência dessa flag para evitar esse comportamento.
*/
declare global {
  interface Window {
    __ALC_STORYBOOK__?: boolean;
  }
}

window.__ALC_STORYBOOK__ = true;

const resourcesUrl: string = `${new URL(window.location.toString()).origin}${import.meta.env.VITE_ASSETS_URL}`;
defineCustomElements(window, {
  resourcesUrl: resourcesUrl,
});

const preview: Preview = {
  parameters: {
    //i18n,
    docs: {
      // Table of Contents
      toc: {
        // Vai indexar a área padrão de conteúdo da página do storybook
        contentsSelector: '.sbdocs-content',
        title: 'Nesta página',
        // Níveis de cabeçalho que entrarão na TOC
        headingSelector: 'h2, h3',
        // Ignorar tudo o que fizer parte de stories
        ignoreSelector: '.sb-story *, .sb-unstyled *',
      },
    },
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    viewMode: 'docs',
    viewport: {
      viewports: {
        smallMobile: {
          name: 'Mobile (Small)',
          styles: {
            width: '320px',
            height: '100%',
          },
        },
        mobile: {
          name: 'Mobile',
          styles: {
            width: '440px',
            height: '100%',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '600px',
            height: '100%',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '900px',
            height: '100%',
          },
        },
        desktopXL: {
          name: 'DesktopXL',
          styles: {
            width: '1200px',
            height: '100%',
          },
        },
      },
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          'Alcance',
          'Instalação',
          [
            'Instalação',
            'Configuração básica',
            'Configuração no Angular',
            'Configuração no React',
            'Configuração no Vue 2 (Vue CLI)',
            'Configuração no Vue 3 (Vue CLI)',
            'Configuração no Vue 3 (Vite)',
            'Histórico de Versões',
          ],
          'Componentes',
          [
            'Componentes',
          ],
          'Componentes Alfa',
          'Estilos',
          [
            'Estilos',
            'Tokens',
            'Link',
            'Botões',
          ]
        ],
      },
    },
    // html: {
    //   prettier: {
    //     tabWidth: 4,
    //     useTabs: false,
    //     htmlWhitespaceSensitivity: 'strict',
    //   },
    // },
  },
  // decorators: [
  //   withThemeByDataAttribute<Renderer>({
  //     themes: {
  //       light: 'light',
  //       dark: 'dark',
  //     },
  //     defaultTheme: 'light',
  //     attributeName: 'data-alc-theme',
  //   }), // Adds theme switching support.
  // ],
  globalTypes: {
    darkMode: {
      defaultValue: false, // Enable dark mode by default on all stories
    },
  },
};

export default preview;
