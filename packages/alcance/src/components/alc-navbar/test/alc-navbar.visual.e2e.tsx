import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { userEvent, page } from 'vitest/browser';

// yarn stencil-test --project browser alc-navbar.visual.e2e.tsx
// yarn stencil-test --project dark alc-navbar.visual.e2e.tsx

/**
 * O componente reconstrói seu próprio conteúdo em componentWillLoad, escolhendo entre modo
 * mobile/desktop conforme window.innerWidth (breakpoint "md", 768px) — por isso o viewport é
 * fixado explicitamente. Escopo do teste: itens de link simples, sem <alc-nav> aninhado (esse
 * caso viraria um dropdown, com bem mais complexidade de setup — fora do escopo aqui).
 */
const contentNavbar = () => (
  <div>
    <a data-test-before href="#" class="alc-link">Foco anterior</a>
    <alc-navbar data-test-navbar>
      <ul>
        <li><a href="#">Início</a></li>
        <li><a href="#">Notícias</a></li>
        <li><a href="#">Serviços</a></li>
      </ul>
    </alc-navbar>
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

describe('alc-navbar', () => {

  // Deve capturar screenshot do modo desktop, com os itens de link simples
  it('padrão', async () => {
    await page.viewport(900, 300);

    const { root, waitForChanges } = await render(contentNavbar());

    const navbar = root.querySelector<HTMLAlcNavbarElement>('[data-test-navbar]');
    assert.exists(navbar, 'O alc-navbar não foi encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const itens = navbar.querySelectorAll('.alc-navbar__item');
    assert.lengthOf(itens, 3, 'Deveriam existir 3 itens com a classe alc-navbar__item');

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(navbar).toMatchScreenshot();
  });

  // Deve capturar screenshot de um item em estado de hover
  it('com hover no item', async () => {
    await page.viewport(900, 300);

    const { root, waitForChanges } = await render(contentNavbar());

    const navbar = root.querySelector<HTMLAlcNavbarElement>('[data-test-navbar]');
    assert.exists(navbar, 'O alc-navbar não foi encontrado');

    await waitForChanges();

    const item = navbar.querySelector<HTMLElement>('.alc-navbar__item');
    assert.exists(item, 'O item não foi encontrado');

    await userEvent.hover(item);
    await aguardaFontes();

    await expect(navbar).toMatchScreenshot();
  });

  // Deve capturar screenshot de um item em estado de foco por teclado (outline com offset negativo)
  it('com foco no item', async () => {
    await page.viewport(900, 300);

    const { root, waitForChanges } = await render(contentNavbar());

    const navbar = root.querySelector<HTMLAlcNavbarElement>('[data-test-navbar]');
    assert.exists(navbar, 'O alc-navbar não foi encontrado');

    const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
    assert.exists(before, 'Link anterior não encontrado');

    await waitForChanges();

    // Foca o elemento anterior e tabula: só assim o navegador entra em modalidade de
    // teclado e aplica o :focus-visible — um focus() direto não garante isso.
    before.focus();
    await userEvent.keyboard('{Tab}');
    await waitForChanges();

    const item = navbar.querySelector<HTMLElement>('.alc-navbar__item');
    assert.exists(item, 'O item não foi encontrado');
    assert.strictEqual(document.activeElement, item, 'O item não recebeu o foco');

    await aguardaFontes();

    await expect(navbar).toMatchScreenshot();
  });

});
