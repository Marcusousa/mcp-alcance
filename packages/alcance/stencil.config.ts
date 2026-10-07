import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { postcss } from '@stencil/postcss';
import { ComponentModelConfig, vueOutputTarget } from '@stencil/vue-output-target';
import { reactOutputTarget } from '@stencil/react-output-target';
import tailwindcss from 'tailwindcss';
import tailwindcssNesting from 'tailwindcss/nesting';
import postcssImport from 'postcss-import';
import autoprefixer from 'autoprefixer';
import generate from './scripts/generate-docs';
import * as fs from 'fs-extra';
import * as path from 'path';

// Configuração de models para o Vue wrapper
// https://stenciljs.com/docs/vue#componentmodels
const componentModels: ComponentModelConfig[] = [
  {
    elements: ['alc-pagination'],
    targetAttr: 'currentPage',
    event: 'alc-change',
    eventAttr: 'detail.to',
  },
];

export const config: Config = {
  namespace: 'alcance',
  // Folha de estilo global, que é colocada tanto em "www" quanto em "dist"
  // no momento do build.
  globalStyle: 'src/global/global.scss',
  globalScript: 'src/global/global.ts',
  buildEs5: 'prod',
  outputTargets: [
    {
      /*
        [1] Faz com que o Stencil gere um arquivo com as informações dos custom elements.
        A geração do arquivo acontece no build.
        [2] O local onde o arquivo será gerado pode ser revisto. Não sei se há um
        "padrão de mercado" para isso.
        Para que o arquivo seja útil, é preciso configurar o VSCode para isso.
        Deve-se incluir a referência a esse arquivo na configuração html.customData.
        Referência: https://www.erwinsmit.com/webcomponents-intellisense/
       */
      type: 'docs-vscode', // [1]
      file: 'utils/html-custom-data.json' // [2]
    },
    {
      // Gera os componentes em forma de uma biblioteca reutilizável
      // que tem a capacidade de carregar a si mesma sob demanda (lazy-loading)
      // O desenvolvedor vai simplesmente adicionar o script à página e
      // toda a biblioteca estará disponível para uso.
      type: 'dist',
      esmLoaderPath: '../loader',
      copy: [
        { src: 'assets', dest: 'assets', warn: true },
      ],
    },
    vueOutputTarget({
      componentCorePackage: 'alcance', // i.e.: stencil-library
      proxiesFile: '../alcance-vue/src/components.ts',
      componentModels, // Configuração para gerar v-models nos componentes listados
    }),
    reactOutputTarget({
      componentCorePackage: 'alcance',
      proxiesFile: '../alcance-react/src/components.ts',
    }),
    {
      // Gera os componentes individualmente, em forma de custom elements.
      // Não há recurso de lazy loading nativo. Isso quer dizer que a o projeto,
      // ao utilizar essa saída, deve ter a configuração necessária para
      // obter os componentes utilizados e registrá-los adequadamente.
      // Algo como:
      //     import { AlcAlert } from 'alcance/dist/components/alc-alert';
      //     customElements.define('alc-alert', AlcAlert);
      // É possível também usar a função utilitária, que registra o
      // componente em si e também os componentes que dependem dele.
      // Assim:
      //     import { defineCustomElement } from 'alcance/dist/components/alc-alert';
      //     defineCustomElement();
      type: 'dist-custom-elements',
      // O StencilJS não copia os assets automaticamente para o output dist-custom-elements.
      // Por isso é necessário copiar manualmente.
      // https://stenciljs.com/docs/assets#manually-moving-assets
      copy: [
        // Copia toda a pasta assets (onde estão todos os assets da biblioteca) para a distribuição.
        { src: 'assets', dest: 'dist/assets', warn: true },
        // Copia utilitários para possível uso das aplicações.
        { src: 'utils', dest: 'utils', warn: true },
        { src: 'utils', dest: '../alcance-react/utils', warn: true },
        { src: 'utils', dest: '../alcance-vue/utils', warn: true },
      ]
    },
    {
      // Gera os arquivos readme.md para cada um dos componentes
      type: 'docs-readme',
      strict: true, // Output a warning whenever the project is built with missing documentation
      dir: 'utils/readme',
      footer: 'Desenvolvido pela Câmara dos Deputados'
    },
    {
      // Gera um arquivo json contendo a documentação de todos os componentes
      type: 'docs-json',
      file: 'utils/docs.json'
    },
    {
      type: 'docs-custom',
      strict: true,
      generator: generate
    },
    {
      // Gera um ambiente web, útil para o desenvolvimento
      type: 'www',
      serviceWorker: null, // disable service workers
      copy: [
        // Permitir múltiplas páginas html para testar componentes.
        // Solução encontrada em:
        // https://github.com/ionic-team/stencil/issues/1962
        { src: 'pages' },
        // Solução para não ter que alterar de onde os componentes buscam os assets
        { src: 'assets', dest: 'build/assets' },
        // Como a pasta fontes é acessada pelo alcance.css, seu tratamento é diferente.
        { src: 'assets/fonts', dest: 'assets/fonts' },
      ],
    },
  ],
  extras: {
    enableImportInjection: true,
  },
  plugins: [
    sass(),
    postcss({
      plugins: [
        // Descoberto que o postcss.config.js não esta funcional, apenas aqui o postcss lê seus plugins
        postcssImport,
        tailwindcssNesting,
        tailwindcss,
        autoprefixer
      ]
    }),
  ],
  devServer: {
    port: 4444,
    reloadStrategy: 'hmr'
  },
};
