import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-menu.visual.e2e.tsx
// yarn stencil-test --project dark alc-menu.visual.e2e.tsx

// O link antes do menu serve para dar entrada de foco por tabulação: os estilos de foco
// do menu-item e do menu-link usam :focus-visible, que não é aplicado por focus().
// Como a captura é feita no menu, o link não aparece na imagem.
const contentMenuItem = (
  <div>
    <a data-test-before href="#" class="alc-link">Foco anterior</a>
    <alc-menu data-test-menu>
      <alc-menu-item>Item 1</alc-menu-item>
      <alc-menu-item disabled>Item 2</alc-menu-item>
      <alc-menu-item>Item 3</alc-menu-item>
    </alc-menu>
  </div>
);

const contentMenuLink = (
  <div>
    <a data-test-before href="#" class="alc-link">Foco anterior</a>
    <alc-menu data-test-menu>
      <alc-menu-link>
        <a href="#item1">Item 1</a>
      </alc-menu-link>
      <alc-menu-link disabled>
        <a href="#item2">Item 2</a>
      </alc-menu-link>
      <alc-menu-link>
        <a href="#item3">Item 3</a>
      </alc-menu-link>
    </alc-menu>
  </div>
);

/**
 * As fontes do design system são carregadas de forma assíncrona.
 * Capturar antes de estarem prontas gera imagens com a fonte de fallback.
 */
const aguardaFontes = () => document.fonts.ready;

/**
 * Afasta o ponteiro do menu, deixando-o sobre o link anterior.
 * O cursor permanece onde o último teste o largou, e um item sob o ponteiro
 * seria capturado em estado de hover.
 */
const afastaPonteiro = (root: HTMLElement) => {
  const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
  assert.exists(before, 'Link anterior não encontrado');

  return userEvent.hover(before);
};

describe('alc-menu', () => {

  const testArray = [
    { name: 'menu-item', content: contentMenuItem },
    { name: 'menu-link', content: contentMenuLink },
  ];

  // Deve capturar screenshot do menu
  it.each(testArray)('modelo $name', async ({ content }) => {
    const { root } = await render(content);

    const menu = root.querySelector<HTMLAlcMenuElement>('[data-test-menu]');
    assert.exists(menu, 'Menu não encontrado');

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(menu).toMatchScreenshot();
  });

  // Deve capturar screenshot do menu com o primeiro item em foco
  it.each(testArray)('$name com foco', async ({ content }) => {
    const { root, waitForChanges } = await render(content);

    const menu = root.querySelector<HTMLAlcMenuElement>('[data-test-menu]');
    assert.exists(menu, 'Menu não encontrado');

    const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
    assert.exists(before, 'Link anterior não encontrado');

    // Seta o foco no elemento anterior
    before.focus();
    // Pressiona tab para o foco ir para o menu (primeiro item)
    await userEvent.keyboard('{Tab}');
    await waitForChanges();

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(menu).toMatchScreenshot();
  });

  // Deve capturar screenshot do menu com itens adicionados dinamicamente
  it('itens dinamicos', async () => {
    const { root, waitForChanges } = await render(contentMenuItem);

    const menu = root.querySelector<HTMLAlcMenuElement>('[data-test-menu]');
    assert.exists(menu, 'Menu não encontrado');

    const inicio = document.createElement('alc-menu-item');
    inicio.textContent = 'Item dinâmico no início';

    const fim = document.createElement('alc-menu-item');
    fim.textContent = 'Item dinâmico no fim';

    await menu.addMenuItem(inicio, 'start');
    await menu.addMenuItem(fim, 'end');

    // Os itens são criados fora do DOM, então só são hidratados depois de inseridos
    await inicio.componentOnReady();
    await fim.componentOnReady();
    await waitForChanges();

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(menu).toMatchScreenshot();
  });

});
