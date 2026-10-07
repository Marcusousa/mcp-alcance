import { render, h, describe, it, expect, assert, vi } from '@stencil/vitest';
import { userEvent, page } from 'vitest/browser';

// yarn stencil-test --project browser alc-nav.visual.e2e.tsx
// yarn stencil-test --project dark alc-nav.visual.e2e.tsx

/**
 * Escopo do teste: um nível principal com label, um item simples, um item com subpainel
 * (para cobrir chevron/seta e o botão "voltar" ao abrir) e um item selecionável. Não cobre
 * slots header/footer nem o modo "isNavbar" (usado só internamente pelo alc-navbar, já coberto
 * no teste desse componente).
 */
const contentNav = (selecionado = false) => (
  <div>
    <a data-test-before href="#" class="alc-link">Foco anterior</a>
    <alc-nav data-test-nav>
      <span data-alc-label>Menu</span>
      <ul>
        <li><a href="#">Notícias</a></li>
        <li data-test-submenu>
          <span>Serviços</span>
          <div data-alc-panel>
            <ul>
              <li><a href="#">Serviço 1</a></li>
              <li><a href="#">Serviço 2</a></li>
            </ul>
          </div>
        </li>
        <li data-test-item {...(selecionado ? { 'data-alc-selected': 'true' } : {})}>
          <a href="#">Contato</a>
        </li>
      </ul>
    </alc-nav>
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

describe('alc-nav', () => {

  // Deve capturar screenshot do painel principal, com o item de subpainel fechado
  it('padrão', async () => {
    await page.viewport(400, 500);

    const { root, waitForChanges } = await render(contentNav());

    const nav = root.querySelector<HTMLAlcNavElement>('[data-test-nav]');
    assert.exists(nav, 'O alc-nav não foi encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria.
    // O componente move o subpainel de dentro do item para ".alc-nav__panels" durante
    // componentDidRender, então não dá pra mirar via seletor descendente do item original —
    // usa a classe ".alc-nav__panel--subpanel" (aplicada só a subpainéis, não ao painel raiz).
    const subpanel = nav.querySelector('.alc-nav__panel--subpanel');
    assert.exists(subpanel, 'O subpainel não foi encontrado');
    expect(subpanel).not.toBeVisible();

    await aguardaIcones(nav);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(nav).toMatchScreenshot();
  });

  // Deve capturar screenshot com um item marcado como selecionado (borda + fundo)
  it('com item selecionado', async () => {
    await page.viewport(400, 500);

    const { root, waitForChanges } = await render(contentNav(true));

    const nav = root.querySelector<HTMLAlcNavElement>('[data-test-nav]');
    assert.exists(nav, 'O alc-nav não foi encontrado');

    await waitForChanges();

    const item = nav.querySelector<HTMLElement>('[data-test-item]');
    assert.exists(item, 'O item não foi encontrado');
    assert.isTrue(item.classList.contains('is-selected'), 'O item deveria estar selecionado');

    await aguardaIcones(nav);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(nav).toMatchScreenshot();
  });

  // Deve capturar screenshot de um item em estado de hover
  it('com hover no item', async () => {
    await page.viewport(400, 500);

    const { root, waitForChanges } = await render(contentNav());

    const nav = root.querySelector<HTMLAlcNavElement>('[data-test-nav]');
    assert.exists(nav, 'O alc-nav não foi encontrado');

    await waitForChanges();

    const item = nav.querySelector<HTMLElement>('[data-test-item] .alc-nav__text');
    assert.exists(item, 'O item não foi encontrado');

    await aguardaIcones(nav);
    await userEvent.hover(item);
    await aguardaFontes();

    await expect(nav).toMatchScreenshot();
  });

  // Deve capturar screenshot de um item em estado de foco por teclado
  it('com foco no item', async () => {
    await page.viewport(400, 500);

    const { root, waitForChanges } = await render(contentNav());

    const nav = root.querySelector<HTMLAlcNavElement>('[data-test-nav]');
    assert.exists(nav, 'O alc-nav não foi encontrado');

    const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
    assert.exists(before, 'Link anterior não encontrado');

    await waitForChanges();

    await aguardaIcones(nav);
    // Afasta o ponteiro antes de focar: o teste anterior ("com hover no item") pode deixar
    // o cursor sobre a mesma posição de tela, e sem mover, ele ficaria com hover residual
    // nesta captura (o item cai na mesma linha em ambos os renders).
    await afastaPonteiro(root);
    // Foca o elemento anterior e tabula: só assim o navegador entra em modalidade de
    // teclado e aplica o :focus-visible — um focus() direto não garante isso.
    before.focus();
    await userEvent.keyboard('{Tab}');
    await waitForChanges();

    const primeiroLink = nav.querySelector<HTMLElement>('.alc-nav__listview a');
    assert.exists(primeiroLink, 'O primeiro link não foi encontrado');
    assert.strictEqual(document.activeElement, primeiroLink, 'O primeiro link não recebeu o foco');

    await aguardaFontes();

    await expect(nav).toMatchScreenshot();
  });

  // Deve capturar screenshot com o subpainel aberto (navbar interno com botão "voltar")
  it('com subpainel aberto', async () => {
    await page.viewport(400, 500);

    const { root, waitForChanges } = await render(contentNav());

    const nav = root.querySelector<HTMLAlcNavElement>('[data-test-nav]');
    assert.exists(nav, 'O alc-nav não foi encontrado');

    await waitForChanges();

    const itemSubmenu = nav.querySelector<HTMLElement>('[data-test-submenu]');
    assert.exists(itemSubmenu, 'Item de submenu não encontrado');

    const linkSubmenu = itemSubmenu.querySelector<HTMLElement>('a');
    assert.exists(linkSubmenu, 'Link do submenu não encontrado');

    await aguardaIcones(nav);
    await userEvent.click(linkSubmenu);
    await waitForChanges();

    const subpanel = nav.querySelector('.alc-nav__panel--subpanel');
    assert.exists(subpanel, 'O subpainel não foi encontrado');
    expect(subpanel).toBeVisible();

    await afastaPonteiro(root);
    await aguardaIcones(nav);
    await aguardaFontes();

    await expect(nav).toMatchScreenshot();
  });

});
