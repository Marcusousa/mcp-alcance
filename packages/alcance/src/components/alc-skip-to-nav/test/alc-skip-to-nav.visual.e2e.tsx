import { render, h, describe, it, expect, assert } from '@stencil/vitest';

// yarn stencil-test --project browser alc-skip-to-nav.visual.e2e.tsx
// yarn stencil-test --project dark alc-skip-to-nav.visual.e2e.tsx

/**
 * Só existe um caso relevante pra capturar: o componente é "sr-only" (visualmente oculto,
 * clipado a 1x1px) por padrão, e só aparece com :focus-within. Um screenshot do estado
 * padrão não mostraria nada (não é isso que estamos validando). Não há também :hover —
 * o link não é interagível de forma útil enquanto está clipado.
 *
 * O contêiner com position:relative é necessário porque o link vira position:absolute
 * (top-0, w-full) ao focar — sem um ancestral posicionado, ele escapa pro topo de toda a
 * página de teste, capturando conteúdo de outros elementos (isso já tinha sido tentado e
 * abandonado em alc-skip-to-nav.e2e.tsx, ver comentário "TESTES DANDO PROBLEMA" lá).
 */
const contentSkipToNav = () => (
  <div style={{ position: 'relative', height: '80px' }}>
    <alc-skip-to-nav data-test-skip></alc-skip-to-nav>
  </div>
);

/**
 * As fontes do design system são carregadas de forma assíncrona.
 * Capturar antes de estarem prontas gera imagens com a fonte de fallback.
 */
const aguardaFontes = () => document.fonts.ready;

describe('alc-skip-to-nav', () => {

  // Deve capturar screenshot do link revelado ao focar (:focus-within, não precisa de
  // modalidade de teclado como :focus-visible — um focus() direto já é suficiente)
  it('com foco', async () => {
    const { root, waitForChanges } = await render(contentSkipToNav());

    // O contêiner é o próprio root: render() não envolve o conteúdo em outra camada
    // quando um único elemento é passado como raiz.
    const container = root;

    const link = root.querySelector<HTMLAnchorElement>('[data-test-skip-to-nav-link]');
    assert.exists(link, 'O link não foi encontrado');

    link.focus();
    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const skip = root.querySelector<HTMLAlcSkipToNavElement>('[data-test-skip]');
    assert.exists(skip, 'O alc-skip-to-nav não foi encontrado');
    const largura = Number.parseInt(getComputedStyle(skip).width);
    assert.isAbove(largura, 1, 'O componente ainda está com sr-only (clipado)');

    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

});
