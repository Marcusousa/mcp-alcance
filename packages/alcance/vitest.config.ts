// vitest.config.ts
import { defineVitestConfig } from '@stencil/vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { createReadStream, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { TestProjectConfiguration } from 'vitest/config';

/**
 * Plugin que serve os assets dos ícones no caminho esperado pelo bundle do Stencil.
 * O loader `dist/alcance/alcance.esm.js` define `resourcesUrl` como o diretório do
 * próprio arquivo, então o `alc-icon` busca os SVGs em `/dist/alcance/assets/icons/...`,
 * porém eles estão em `/dist/assets/icons/...`. Esse middleware faz o redirecionamento.
 */
const serveStencilAssets = () => ({
  name: 'serve-stencil-assets',
  configureServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      const match = req.url?.match(/^\/dist\/alcance\/assets\/(.*)$/);
      if (!match) return next();
      const filePath = resolve(__dirname, 'dist/assets', match[1].split('?')[0]);
      if (!existsSync(filePath)) return next();
      if (filePath.endsWith('.svg')) res.setHeader('Content-Type', 'image/svg+xml');
      createReadStream(filePath).pipe(res);
    });
  },
});

/**
 * Cria uma configuração de projeto para testes E2E no navegador, usando Playwright como provedor.
 * Permite configurar o nome do projeto, os arquivos de teste a serem incluídos e o esquema de cores do navegador.
 * @returns Configuração do projeto de teste E2E.
 */
function createE2EProject(params: {
  name: string;
  include: string[];
  exclude?: string[];
  colorScheme?: 'light' | 'dark'
}): TestProjectConfiguration {

  return {
    plugins: [serveStencilAssets()],
    optimizeDeps: {
      exclude: ['jest-pnp-resolver', 'jest-haste-map'],
    },
    test: {
      // name é obrigatório e sempre será informado. Deve ser único para cada projeto.
      name: params.name,
      // include é obrigatório e sempre será informado. É a principal característica do projeto.
      include: params.include,
      // exclude é opcional. Se não for informado, o Vitest usará o padrão.
      exclude: params?.exclude ?? undefined,
      setupFiles: ['./vitest-setup.ts'],
      fileParallelism: false,
      browser: {
        enabled: true,
        // Se colorScheme for informado, o Playwright criará um contexto de navegador com esse esquema de cores.
        // Se não for informado, o Playwright funcionará com o esquema de cores padrão do navegador.
        provider: playwright(params?.colorScheme ? { contextOptions: { colorScheme: params.colorScheme } } : undefined),
        headless: true,
        screenshotFailures: false,
        // Limitando wiewport para tamanho fixo
        instances: [{ browser: 'chromium', viewport: { width: 1280, height: 720 } }],
        expect: {
          toMatchScreenshot: {
            // Comparação exata: qualquer diferença reprova.
            // includeAA fica no padrão (false): com ele ligado, o arredondamento de
            // rasterização de bordas (±1 em um canal) reprova capturas idênticas.
            comparatorOptions: {
              threshold: 0.1
            },
            // colorScheme entra no nome do arquivo para que um mesmo arquivo de teste
            // visual possa ser executado nos projetos de tema claro e escuro sem que uma
            // baseline sobrescreva a outra. A plataforma também entra no nome porque a
            // renderização de fonte varia entre sistemas operacionais.
            // O padrão do Vitest ainda agrupa as imagens em uma subpasta com o nome do
            // arquivo de teste, que aqui é omitida por ser redundante.
            resolveScreenshotPath: ({ arg, ext, root, screenshotDirectory, testFileDirectory, browserName, platform }) =>
              // Exemplo de nome de arquivo gerado: `alc-alert-teste-1_dark_chromium_win32.png`
              resolve(root, testFileDirectory, screenshotDirectory, `${arg}_${params.colorScheme}_${browserName}_${platform}${ext}`),
            // Mesma razão para os artefatos de falha: sem o colorScheme, a captura e o
            // diff do tema escuro sobrescrevem os do tema claro quando os dois reprovam.
            resolveDiffPath: ({ arg, ext, root, attachmentsDir, browserName, platform, testFileDirectory, testFileName }) =>
              resolve(root, attachmentsDir, testFileDirectory, testFileName, `${arg}_${params.colorScheme}_${browserName}_${platform}${ext}`),
          },
        },
      },

      // Caso queira ver o teste rodando:
      // browser: {
      //   enabled: true,
      //   provider: playwright({
      //     launchOptions: {
      //       slowMo: 1000,
      //     },
      //   }),
      //   headless: false,
      //   ui: true,
      //   instances: [{ browser: 'chromium' }],
      // },
    },
  };
}

// Spec: Testes de comportamento dos componentes que não dependem de renderização ou interação no navegador.
const SPEC_PROJECT: TestProjectConfiguration = {
  plugins: [serveStencilAssets()],
  test: {
    name: 'spec',
    include: ['src/**/*.spec.{ts,tsx}'],
    environment: 'stencil',
    setupFiles: ['./vitest-setup.ts'],
  },

};

// Testes de comportamento dos componentes que dependem de renderização ou interação no navegador, usando Playwright como provedor.
const E2E_BEHAVIOR_PROJECT: TestProjectConfiguration = createE2EProject({
  name: 'e2e.behavior',
  include: ['src/**/*.e2e.{ts,tsx}'],
  exclude: ['src/**/*.visual.e2e.{ts,tsx}'],
});

// Uma especialização para testes que dependem do esquema "dark" do navegador como padrão.
const E2E_BEHAVIOR_DARK_PROJECT: TestProjectConfiguration = createE2EProject({
  name: 'e2e.behavior-dark',
  include: ['src/**/*.e2e-dark.{ts,tsx}'],
  colorScheme: 'dark',
});

// Testes de regressão visual (*.visual.e2e), que são declarados uma única vez
// e executados nos dois esquemas de cor, gerando uma baseline para cada um.
const E2E_VISUAL_LIGHT_PROJECT: TestProjectConfiguration = createE2EProject({
  name: 'e2e.visual-light',
  include: ['src/**/*.visual.e2e.{ts,tsx}'],
  colorScheme: 'light',
});

const E2E_VISUAL_DARK_PROJECT: TestProjectConfiguration = createE2EProject({
  name: 'e2e.visual-dark',
  include: ['src/**/*.visual.e2e.{ts,tsx}'],
  colorScheme: 'dark',
});

export default defineVitestConfig({
  stencilConfig: './stencil.config.ts',
  test: {
    projects: [
      SPEC_PROJECT,
      E2E_BEHAVIOR_PROJECT,
      E2E_BEHAVIOR_DARK_PROJECT,
      E2E_VISUAL_LIGHT_PROJECT,
      E2E_VISUAL_DARK_PROJECT
    ],
  },
});
