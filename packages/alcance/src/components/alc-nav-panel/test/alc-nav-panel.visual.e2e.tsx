import { render, h, describe, it, expect, assert, vi } from '@stencil/vitest';
import { userEvent, page } from 'vitest/browser';

// yarn stencil-test --project browser alc-nav-panel.visual.e2e.tsx
// yarn stencil-test --project dark alc-nav-panel.visual.e2e.tsx

/**
 * "open" começa true só no breakpoint desktop (>= 992px, escala "lg" própria do projeto);
 * abaixo disso começa sempre false — por isso o viewport é fixado explicitamente em cada caso.
 *
 * O host não tem "display: block" de fato aplicado: a regra ":host { display: block; }" no CSS
 * não tem efeito porque o componente não usa Shadow DOM real (shadow: false) — ":host" só
 * funciona dentro de shadow root. Isso deixa o host com caixa degenerada (inline, 0x0), e o
 * conteúdo visível de verdade fica em ".alc-nav-panel__container" (position: fixed). Capturar
 * o host direto (caixa 0x0 competindo com um elemento fixed de até 100vh de altura) fazia a
 * ferramenta nunca achar um frame estável ("Could not capture a stable screenshot") — não era
 * o MutationObserver do componente nem o filter: drop-shadow do botão (as duas hipóteses
 * inicialmente investigadas; confirmado descartando cada uma isoladamente). A captura mira o
 * container real, com viewport baixo (150px) pra manter o screenshot num tamanho razoável, já
 * que a altura do container é sempre 100vh menos o offset, independente do estado aberto/fechado.
 */
const contentNavPanel = () => (
  <div>
    <a data-test-before href="#" class="alc-link">Foco anterior</a>
    <alc-nav-panel data-test-nav-panel>
      <p>Conteúdo do painel.</p>
    </alc-nav-panel>
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

describe('alc-nav-panel', () => {

  // Deve capturar screenshot fechado (abaixo do breakpoint desktop, estado inicial padrão)
  it('fechado', async () => {
    await page.viewport(700, 150);

    const { root, waitForChanges } = await render(contentNavPanel());

    const navPanel = root.querySelector<HTMLAlcNavPanelElement>('[data-test-nav-panel]');
    assert.exists(navPanel, 'O alc-nav-panel não foi encontrado');

    const container = navPanel.querySelector<HTMLElement>('.alc-nav-panel__container');
    assert.exists(container, 'O container não foi encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    expect(navPanel.open).toBeFalsy();

    await aguardaIcones(navPanel);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot aberto (breakpoint desktop, estado inicial padrão)
  it('aberto', async () => {
    await page.viewport(1100, 150);

    const { root, waitForChanges } = await render(contentNavPanel());

    const navPanel = root.querySelector<HTMLAlcNavPanelElement>('[data-test-nav-panel]');
    assert.exists(navPanel, 'O alc-nav-panel não foi encontrado');

    const container = navPanel.querySelector<HTMLElement>('.alc-nav-panel__container');
    assert.exists(container, 'O container não foi encontrado');

    await waitForChanges();

    expect(navPanel.open).toBe(true);

    await aguardaIcones(navPanel);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do botão em estado de hover (muda a cor do svg e da borda)
  it('fechado com hover no botão', async () => {
    await page.viewport(700, 150);

    const { root, waitForChanges } = await render(contentNavPanel());

    const navPanel = root.querySelector<HTMLAlcNavPanelElement>('[data-test-nav-panel]');
    assert.exists(navPanel, 'O alc-nav-panel não foi encontrado');

    const container = navPanel.querySelector<HTMLElement>('.alc-nav-panel__container');
    assert.exists(container, 'O container não foi encontrado');

    await waitForChanges();

    const button = navPanel.querySelector<HTMLButtonElement>('[data-test-button]');
    assert.exists(button, 'O botão não foi encontrado');

    await aguardaIcones(navPanel);
    await userEvent.hover(button);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do botão em estado de foco por teclado (outline no ícone)
  it('fechado com foco no botão', async () => {
    await page.viewport(700, 150);

    const { root, waitForChanges } = await render(contentNavPanel());

    const navPanel = root.querySelector<HTMLAlcNavPanelElement>('[data-test-nav-panel]');
    assert.exists(navPanel, 'O alc-nav-panel não foi encontrado');

    const container = navPanel.querySelector<HTMLElement>('.alc-nav-panel__container');
    assert.exists(container, 'O container não foi encontrado');

    const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
    assert.exists(before, 'Link anterior não encontrado');

    await waitForChanges();

    await aguardaIcones(navPanel);
    // Foca o elemento anterior e tabula: só assim o navegador entra em modalidade de
    // teclado e aplica o :focus-visible — um focus() direto não garante isso.
    before.focus();
    await userEvent.keyboard('{Tab}');
    await waitForChanges();

    const button = navPanel.querySelector<HTMLButtonElement>('[data-test-button]');
    assert.exists(button, 'O botão não foi encontrado');
    assert.strictEqual(document.activeElement, button, 'O botão não recebeu o foco');

    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

});
