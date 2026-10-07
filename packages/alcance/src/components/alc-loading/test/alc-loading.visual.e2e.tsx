import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-loading.visual.e2e.tsx
// yarn stencil-test --project dark alc-loading.visual.e2e.tsx

/**
 * As fontes do design system são carregadas de forma assíncrona.
 * Capturar antes de estarem prontas gera imagens com a fonte de fallback.
 */
const aguardaFontes = () => document.fonts.ready;

/**
 * Afasta o ponteiro do componente, deixando-o sobre o link anterior.
 * O cursor permanece onde o último teste o largou, e o conteúdo sob o ponteiro
 * seria capturado em estado de hover.
 */
const afastaPonteiro = (root: HTMLElement) => {
  const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
  assert.exists(before, 'Link anterior não encontrado');

  return userEvent.hover(before);
};

describe('alc-loading', () => {

  const rotulos = [
    { name: 'full-screen', label: 'Carregando...' },
    { name: 'full-screen com rotulo personalizado', label: 'Atualizando os dados do processo...' },
  ];

  // Deve capturar screenshot do modo full-screen
  it.each(rotulos)('$name', async ({ label }) => {
    const { root } = await render(
      <div>
        <div style={{ height: '32px' }}><a data-test-before href="#" class="alc-link">Foco anterior</a></div>
        <alc-loading active label={label} data-test-loading></alc-loading>
      </div>
    );

    /**
     * O overlay é fixed e cobre a viewport inteira, ficando fora do box do alc-loading:
     * uma captura do componente não pegaria nada. Por isso a captura é feita nele mesmo,
     * que também é a única posição garantidamente inteira aqui (top e left zerados).
     */
    const overlay = root.querySelector<HTMLElement>('.alc-loading__overlay');
    assert.exists(overlay, 'O overlay não foi renderizado');

    /**
     * O ponteiro fica sobre o próprio overlay. Ele está acima de todo o resto da página,
     * então qualquer elemento estacionado embaixo apareceria em hover através do fundo
     * translúcido — e o link anterior está fora de alcance, coberto pelo overlay.
     */
    await userEvent.hover(overlay);
    await aguardaFontes();

    await expect(overlay).toMatchScreenshot();
  });

  // Deve capturar screenshot do modo container, preenchendo o elemento pai
  it('container', async () => {
    const { root } = await render(
      <div>
        <div style={{ height: '32px' }}><a data-test-before href="#" class="alc-link">Foco anterior</a></div>
        {/* O overlay do modo container é absolute: o pai precisa ser posicionado e ter
            dimensões próprias, fixas em valores inteiros para manter as bordas do cartão
            sempre no mesmo pixel. */}
        <div data-test-container style={{ position: 'relative', width: '320px', height: '200px' }}>
          <p>Conteúdo do container</p>
          <alc-loading active variant="container" label="Processando..." data-test-loading></alc-loading>
        </div>
      </div>
    );

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    assert.exists(container.querySelector('.alc-loading__overlay-container'), 'O overlay do container não foi renderizado');

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do modo inline, no meio de um texto
  it('inline', async () => {
    const { root } = await render(
      <div>
        <div style={{ height: '32px' }}><a data-test-before href="#" class="alc-link">Foco anterior</a></div>
        <div data-test-container style={{ width: '320px' }}>
          <alc-loading active variant="inline" label="Analisando..." data-test-loading></alc-loading>
        </div>
      </div>
    );

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    assert.exists(container.querySelector('.alc-loading__spinner-inline'), 'O spinner inline não foi renderizado');

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do modo button, dentro de um botão
  it('button', async () => {
    const { root } = await render(
      <div>
        <div style={{ height: '32px' }}><a data-test-before href="#" class="alc-link">Foco anterior</a></div>
        {/* A largura do botão é fixa: derivada do texto ela cai em valor fracionário e a
            borda arredondada é rasterizada de forma diferente a cada execução. */}
        <button class="alc-button" style={{ width: '160px' }} data-test-button>
          <alc-loading active variant="button" label="Enviando..." data-test-loading></alc-loading>
          Enviar
        </button>
      </div>
    );

    const button = root.querySelector<HTMLButtonElement>('[data-test-button]');
    assert.exists(button, 'Botão não encontrado');

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    assert.exists(button.querySelector('.alc-loading__spinner-button'), 'O spinner do botão não foi renderizado');

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(button).toMatchScreenshot();
  });

});

// Não há caso para active=false: sem ele o componente não renderiza nada além da região
// aria-live, que é invisível, e a captura de uma área vazia acaba pegando pixels
// remanescentes do teste anterior. O comportamento já é coberto por alc-loading.e2e.tsx.
