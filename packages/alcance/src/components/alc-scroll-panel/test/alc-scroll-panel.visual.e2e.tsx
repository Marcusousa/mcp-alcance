import { render, h, describe, it, expect, assert, vi } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-scroll-panel.visual.e2e.tsx
// yarn stencil-test --project dark alc-scroll-panel.visual.e2e.tsx

/**
 * Os botões só existem no DOM quando o conteúdo realmente ultrapassa a largura do contêiner
 * (hasScroll). O contêiner estreito (220px) com um texto longo força esse overflow.
 */
const contentComOverflow = (
  <span>Item bem longo, o suficiente pra forçar overflow horizontal no contêiner estreito.</span>
);
const contentSemOverflow = <span>Curto</span>;

const contentScrollPanel = (content: unknown, props: Record<string, unknown> = {}) => (
  <div>
    <a data-test-before href="#" class="alc-link">Foco anterior</a>
    <div style={{ width: '220px' }}>
      <alc-scroll-panel data-test-scroll-panel {...props}>
        {content}
      </alc-scroll-panel>
    </div>
  </div>
);

/**
 * As fontes do design system são carregadas de forma assíncrona.
 * Capturar antes de estarem prontas gera imagens com a fonte de fallback.
 */
const aguardaFontes = () => document.fonts.ready;

/**
 * O alc-icon busca o SVG por HTTP e o injeta depois da renderização, sem segurar o load.
 */
const aguardaIcones = (container: HTMLElement) => vi.waitFor(() => {
  const icones = Array.from(container.querySelectorAll('alc-icon'));
  assert.isNotEmpty(icones, 'Nenhum ícone encontrado');

  icones.forEach(icone => assert.exists(icone.querySelector('svg'), 'Ícone ainda não carregado'));
});

/**
 * Afasta o ponteiro do componente, deixando-o sobre o link anterior.
 */
const afastaPonteiro = (root: HTMLElement) => {
  const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
  assert.exists(before, 'Link anterior não encontrado');

  return userEvent.hover(before);
};

describe('alc-scroll-panel', () => {

  // Deve capturar screenshot sem os botões quando o conteúdo não ultrapassa o contêiner
  it('sem scroll', async () => {
    const { root, waitForChanges } = await render(contentScrollPanel(contentSemOverflow));

    const panel = root.querySelector<HTMLAlcScrollPanelElement>('[data-test-scroll-panel]');
    assert.exists(panel, 'O alc-scroll-panel não foi encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    assert.notExists(panel.querySelector('.alc-scroll-panel__button'), 'Botão não deveria existir sem overflow');

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(panel).toMatchScreenshot();
  });

  // Deve capturar screenshot com scroll no início: botão esquerdo desabilitado, direito habilitado
  it('com scroll no início', async () => {
    const { root, waitForChanges } = await render(contentScrollPanel(contentComOverflow));

    const panel = root.querySelector<HTMLAlcScrollPanelElement>('[data-test-scroll-panel]');
    assert.exists(panel, 'O alc-scroll-panel não foi encontrado');

    await waitForChanges();

    const botoes = panel.querySelectorAll<HTMLButtonElement>('.alc-scroll-panel__button');
    assert.lengthOf(botoes, 2, 'Deveriam existir os dois botões de scroll');
    expect(botoes[0]).toBeDisabled();
    expect(botoes[1]).not.toBeDisabled();

    await aguardaIcones(panel);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(panel).toMatchScreenshot();
  });

  // Deve capturar screenshot depois de rolar: os dois botões ficam habilitados
  it('com scroll no meio', async () => {
    const { root, waitForChanges } = await render(contentScrollPanel(contentComOverflow));

    const panel = root.querySelector<HTMLAlcScrollPanelElement>('[data-test-scroll-panel]');
    assert.exists(panel, 'O alc-scroll-panel não foi encontrado');

    await waitForChanges();

    const content = panel.querySelector<HTMLElement>('[data-test-content]');
    assert.exists(content, 'O conteúdo com scroll não foi encontrado');
    content.scrollLeft = 40;
    content.dispatchEvent(new Event('scroll'));
    await waitForChanges();

    const botoes = panel.querySelectorAll<HTMLButtonElement>('.alc-scroll-panel__button');
    assert.lengthOf(botoes, 2, 'Deveriam existir os dois botões de scroll');
    expect(botoes[0]).not.toBeDisabled();
    expect(botoes[1]).not.toBeDisabled();

    await aguardaIcones(panel);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(panel).toMatchScreenshot();
  });

  // Deve capturar screenshot do botão direito (habilitado) em estado de hover
  it('com hover no botão', async () => {
    const { root, waitForChanges } = await render(contentScrollPanel(contentComOverflow));

    const panel = root.querySelector<HTMLAlcScrollPanelElement>('[data-test-scroll-panel]');
    assert.exists(panel, 'O alc-scroll-panel não foi encontrado');

    await waitForChanges();

    const botoes = panel.querySelectorAll<HTMLButtonElement>('.alc-scroll-panel__button');
    const botaoDireito = botoes[1];

    await aguardaIcones(panel);
    await userEvent.hover(botaoDireito);
    await aguardaFontes();

    await expect(panel).toMatchScreenshot();
  });

  // Deve capturar screenshot do botão direito em estado de foco por teclado. O esquerdo
  // (desabilitado) é pulado pela navegação por Tab, mas o navegador insere automaticamente
  // o próprio contêiner com scroll na sequência de foco (acessibilidade nativa de scroll,
  // sem tabindex explícito no código) — por isso são duas tabulações, não uma.
  it('com foco no botão', async () => {
    const { root, waitForChanges } = await render(contentScrollPanel(contentComOverflow));

    const panel = root.querySelector<HTMLAlcScrollPanelElement>('[data-test-scroll-panel]');
    assert.exists(panel, 'O alc-scroll-panel não foi encontrado');

    const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
    assert.exists(before, 'Link anterior não encontrado');

    await waitForChanges();

    await aguardaIcones(panel);
    // Foca o elemento anterior e tabula: só assim o navegador entra em modalidade de
    // teclado e aplica o :focus-visible — um focus() direto não garante isso.
    before.focus();
    await userEvent.keyboard('{Tab}{Tab}');
    await waitForChanges();

    const botoes = panel.querySelectorAll<HTMLButtonElement>('.alc-scroll-panel__button');
    assert.strictEqual(document.activeElement, botoes[1], 'O botão direito não recebeu o foco');

    await aguardaFontes();

    await expect(panel).toMatchScreenshot();
  });

});
