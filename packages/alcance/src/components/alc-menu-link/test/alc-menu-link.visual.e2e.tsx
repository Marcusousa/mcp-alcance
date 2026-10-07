import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { userEvent, page } from 'vitest/browser';

// yarn stencil-test --project browser alc-menu-link.visual.e2e.tsx
// yarn stencil-test --project dark alc-menu-link.visual.e2e.tsx

/**
 * O host não tem "display: block" definido no CSS (só variáveis customizadas no seletor
 * "alc-menu-link") — mesma classe de bug já vista em outros componentes (ver lição #7 do
 * roteiro). A captura mira o <a> interno, que é o elemento com o estilo de bloco real.
 */
const contentMenuLink = (props: Record<string, unknown> = {}) => (
  <div>
    <a data-test-before href="#" class="alc-link">Foco anterior</a>
    <alc-menu-link data-test-menu-link {...props}>
      <a href="#">Link do menu</a>
    </alc-menu-link>
  </div>
);

/**
 * As fontes do design system são carregadas de forma assíncrona.
 * Capturar antes de estarem prontas gera imagens com a fonte de fallback.
 */
const aguardaFontes = () => document.fonts.ready;

/**
 * Afasta o ponteiro do componente, deixando-o sobre o link anterior.
 */
const afastaPonteiro = (root: HTMLElement) => {
  const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
  assert.exists(before, 'Link anterior não encontrado');

  return userEvent.hover(before);
};

describe('alc-menu-link', () => {

  // Deve capturar screenshot do link habilitado, estado padrão
  it('padrão', async () => {
    await page.viewport(300, 150);

    const { root, waitForChanges } = await render(contentMenuLink());

    const menuLink = root.querySelector<HTMLAlcMenuLinkElement>('[data-test-menu-link]');
    assert.exists(menuLink, 'O alc-menu-link não foi encontrado');

    const link = menuLink.querySelector<HTMLAnchorElement>('a');
    assert.exists(link, 'O link interno não foi encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    expect(link).not.toHaveAttribute('aria-disabled');

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(link).toMatchScreenshot();
  });

  // Deve capturar screenshot do link desabilitado (cor de texto + cursor)
  it('desabilitado', async () => {
    await page.viewport(300, 150);

    const { root, waitForChanges } = await render(contentMenuLink({ disabled: true }));

    const menuLink = root.querySelector<HTMLAlcMenuLinkElement>('[data-test-menu-link]');
    assert.exists(menuLink, 'O alc-menu-link não foi encontrado');

    const link = menuLink.querySelector<HTMLAnchorElement>('a');
    assert.exists(link, 'O link interno não foi encontrado');

    await waitForChanges();

    expect(link).toHaveAttribute('aria-disabled');
    assert.strictEqual(link.getAttribute('tabindex'), '-1', 'O tabindex deveria ser -1');

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(link).toMatchScreenshot();
  });

  // Deve capturar screenshot do link em estado de hover
  it('com hover', async () => {
    await page.viewport(300, 150);

    const { root, waitForChanges } = await render(contentMenuLink());

    const menuLink = root.querySelector<HTMLAlcMenuLinkElement>('[data-test-menu-link]');
    assert.exists(menuLink, 'O alc-menu-link não foi encontrado');

    const link = menuLink.querySelector<HTMLAnchorElement>('a');
    assert.exists(link, 'O link interno não foi encontrado');

    await waitForChanges();

    await userEvent.hover(link);
    await aguardaFontes();

    await expect(link).toMatchScreenshot();
  });

  // Deve capturar screenshot do link em estado de foco por teclado (outline com offset negativo)
  it('com foco', async () => {
    await page.viewport(300, 150);

    const { root, waitForChanges } = await render(contentMenuLink());

    const menuLink = root.querySelector<HTMLAlcMenuLinkElement>('[data-test-menu-link]');
    assert.exists(menuLink, 'O alc-menu-link não foi encontrado');

    const link = menuLink.querySelector<HTMLAnchorElement>('a');
    assert.exists(link, 'O link interno não foi encontrado');

    const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
    assert.exists(before, 'Link anterior não encontrado');

    await waitForChanges();

    // Foca o elemento anterior e tabula: só assim o navegador entra em modalidade de
    // teclado e aplica o :focus-visible — um focus() direto não garante isso.
    before.focus();
    await userEvent.keyboard('{Tab}');
    await waitForChanges();

    assert.strictEqual(document.activeElement, link, 'O link não recebeu o foco');

    await aguardaFontes();

    await expect(link).toMatchScreenshot();
  });

});
