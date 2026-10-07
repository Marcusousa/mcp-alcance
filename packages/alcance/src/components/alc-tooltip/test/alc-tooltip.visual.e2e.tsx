import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-tooltip.visual.e2e.tsx
// yarn stencil-test --project dark alc-tooltip.visual.e2e.tsx

/**
 * trigger="manual" e active fixo por prop deixam o estado 100% determinístico — sem depender
 * de hover/foco simulado, que poderiam abrir/fechar o tooltip de forma imprevisível no teste.
 * O padding no contêiner dá espaço pro tooltip (posicionado ao redor do botão) não ser cortado.
 */
const contentTooltip = (props: Record<string, unknown> = {}, children?: unknown) => (
  <div>
    <a data-test-before href="#" class="alc-link">Foco anterior</a>
    <div data-test-container style={{ padding: '56px' }}>
      <alc-tooltip data-test-tooltip active trigger="manual" content="Isto é um tooltip" {...props}>
        <button slot="trigger" class="alc-button alc-button--secondary">Botão</button>
        {children}
      </alc-tooltip>
    </div>
  </div>
);

/**
 * As fontes do design system são carregadas de forma assíncrona.
 * Capturar antes de estarem prontas gera imagens com a fonte de fallback.
 */
const aguardaFontes = () => document.fonts.ready;

/**
 * Afasta o ponteiro do componente, deixando-o sobre o link anterior.
 * O cursor permanece onde o último teste o largou, e o botão sob o ponteiro
 * seria capturado em estado de hover.
 */
const afastaPonteiro = (root: HTMLElement) => {
  const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
  assert.exists(before, 'Link anterior não encontrado');

  return userEvent.hover(before);
};

describe('alc-tooltip', () => {

  // Deve capturar screenshot do tooltip ativo, na posição padrão (top)
  it('ativo', async () => {
    const { root, waitForChanges } = await render(contentTooltip());

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do botão gatilho em estado de hover — trigger="manual" garante que
  // o hover não altera o estado aberto/fechado do tooltip, só o :hover do próprio botão.
  it('ativo com hover no gatilho', async () => {
    const { root, waitForChanges } = await render(contentTooltip());

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    const trigger = root.querySelector<HTMLElement>('[slot="trigger"]');
    assert.exists(trigger, 'O botão gatilho não foi encontrado');

    await waitForChanges();

    await userEvent.hover(trigger);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do botão gatilho em estado de foco por teclado — trigger="manual"
  // garante que o foco não altera o estado aberto/fechado do tooltip, só o :focus-visible do botão.
  it('ativo com foco no gatilho', async () => {
    const { root, waitForChanges } = await render(contentTooltip());

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
    assert.exists(before, 'Link anterior não encontrado');

    await waitForChanges();

    // Foca o elemento anterior e tabula: só assim o navegador entra em modalidade de
    // teclado e aplica o :focus-visible — um focus() direto não garante isso.
    before.focus();
    await userEvent.keyboard('{Tab}');
    await waitForChanges();

    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  const posicoes = [
    { name: 'a direita', props: { placement: 'right' } },
    { name: 'embaixo', props: { placement: 'bottom' } },
  ];

  // Deve capturar screenshot do tooltip em cada posicionamento
  it.each(posicoes)('posicionamento $name', async ({ props }) => {
    const { root, waitForChanges } = await render(contentTooltip(props));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do tooltip com conteúdo rico via slot, em vez da prop "content"
  it('com html', async () => {
    const { root, waitForChanges } = await render(contentTooltip({ content: undefined }, (
      <p>Conteúdo <strong>rico</strong></p>
    )));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

});
