import { render, h, describe, it, expect, assert } from '@stencil/vitest';

// yarn stencil-test --project browser alc-skip-link.visual.e2e.tsx
// yarn stencil-test --project dark alc-skip-link.visual.e2e.tsx

/**
 * Mesmo padrão do alc-skip-to-nav: sr-only por padrão (clipado a 1x1px), só aparece com
 * :focus-within — o único caso que vale capturar é "com foco". Sem :hover útil enquanto
 * clipado.
 * O contêiner com position:relative é necessário porque o link vira position:absolute
 * (top-0, w-full) ao focar — sem um ancestral posicionado, escapa pro topo de toda a
 * página de teste (mesmo problema já mapeado no alc-skip-to-nav).
 */
const contentSkipLink = () => (
  <div style={{ position: 'relative', height: '80px' }}>
    <alc-skip-link data-test-skip anchor="conteudo-principal">Conteúdo</alc-skip-link>
    <div id="conteudo-principal"></div>
  </div>
);

/**
 * As fontes do design system são carregadas de forma assíncrona.
 * Capturar antes de estarem prontas gera imagens com a fonte de fallback.
 */
const aguardaFontes = () => document.fonts.ready;

describe('alc-skip-link', () => {

  // Deve capturar screenshot do link revelado ao focar (:focus-within, um focus() direto
  // já é suficiente — não depende de modalidade de teclado como :focus-visible)
  it('com foco', async () => {
    const { root, waitForChanges } = await render(contentSkipLink());

    const link = root.querySelector<HTMLAnchorElement>('[data-test-link]');
    assert.exists(link, 'O link não foi encontrado');

    link.focus();
    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const skip = root.querySelector<HTMLAlcSkipLinkElement>('[data-test-skip]');
    assert.exists(skip, 'O alc-skip-link não foi encontrado');
    const largura = Number.parseInt(getComputedStyle(skip).width);
    assert.isAbove(largura, 1, 'O componente ainda está com sr-only (clipado)');

    await aguardaFontes();

    await expect(root).toMatchScreenshot();
  });

});
