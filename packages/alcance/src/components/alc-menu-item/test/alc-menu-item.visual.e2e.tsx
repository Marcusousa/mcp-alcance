import { render, h, describe, it, expect, assert, vi } from '@stencil/vitest';
import { userEvent, page } from 'vitest/browser';

// yarn stencil-test --project browser alc-menu-item.visual.e2e.tsx
// yarn stencil-test --project dark alc-menu-item.visual.e2e.tsx

/**
 * O Host recebe "tabindex={-1}" sempre — no uso real, é o <alc-menu> pai quem gerencia um
 * "roving tabindex" entre os itens (tabindex="0" só no item atual, foco movido via .focus()
 * nas setas) em vez de Tab simples. Isolado (sem <alc-menu>), o item nunca entraria na
 * sequência nativa de Tab. Pra testar :focus-visible de forma realista, o conteúdo do teste
 * já nasce com tabindex="0" no item (reproduzindo o estado que o <alc-menu> aplicaria no item
 * atual), permitindo o mesmo padrão de Tab real usado nos outros testes.
 */
const contentMenuItem = (props: Record<string, unknown> = {}) => (
  <div>
    <a data-test-before href="#" class="alc-link">Foco anterior</a>
    <alc-menu-item data-test-menu-item tabindex="0" {...props}>Item do menu</alc-menu-item>
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

describe('alc-menu-item', () => {

  // Deve capturar screenshot do item padrão (tipo "normal", sem marcação)
  it('padrão', async () => {
    await page.viewport(300, 100);

    const { root, waitForChanges } = await render(contentMenuItem());

    const menuItem = root.querySelector<HTMLAlcMenuItemElement>('[data-test-menu-item]');
    assert.exists(menuItem, 'O alc-menu-item não foi encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    expect(menuItem.getAttribute('role')).toBe('menuitem');

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(menuItem).toMatchScreenshot();
  });

  // Deve capturar screenshot do item tipo checkbox, marcado (com ícone de check)
  it('checkbox marcado', async () => {
    await page.viewport(300, 100);

    const { root, waitForChanges } = await render(contentMenuItem({ type: 'checkbox', checked: true }));

    const menuItem = root.querySelector<HTMLAlcMenuItemElement>('[data-test-menu-item]');
    assert.exists(menuItem, 'O alc-menu-item não foi encontrado');

    await waitForChanges();

    expect(menuItem.getAttribute('aria-checked')).toBe('true');

    await aguardaIcones(menuItem);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(menuItem).toMatchScreenshot();
  });

  // Deve capturar screenshot do item tipo radio, marcado (com ícone de círculo preenchido)
  it('radio marcado', async () => {
    await page.viewport(300, 100);

    const { root, waitForChanges } = await render(contentMenuItem({ type: 'radio', checked: true }));

    const menuItem = root.querySelector<HTMLAlcMenuItemElement>('[data-test-menu-item]');
    assert.exists(menuItem, 'O alc-menu-item não foi encontrado');

    await waitForChanges();

    expect(menuItem.getAttribute('aria-checked')).toBe('true');

    await aguardaIcones(menuItem);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(menuItem).toMatchScreenshot();
  });

  // Deve capturar screenshot do item desabilitado (cor de texto + cursor)
  it('desabilitado', async () => {
    await page.viewport(300, 100);

    const { root, waitForChanges } = await render(contentMenuItem({ disabled: true }));

    const menuItem = root.querySelector<HTMLAlcMenuItemElement>('[data-test-menu-item]');
    assert.exists(menuItem, 'O alc-menu-item não foi encontrado');

    await waitForChanges();

    expect(menuItem).toHaveAttribute('aria-disabled');

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(menuItem).toMatchScreenshot();
  });

  // Deve capturar screenshot do item em estado de hover
  it('com hover', async () => {
    await page.viewport(300, 100);

    const { root, waitForChanges } = await render(contentMenuItem());

    const menuItem = root.querySelector<HTMLAlcMenuItemElement>('[data-test-menu-item]');
    assert.exists(menuItem, 'O alc-menu-item não foi encontrado');

    await waitForChanges();

    await userEvent.hover(menuItem);
    await aguardaFontes();

    await expect(menuItem).toMatchScreenshot();
  });

  // Deve capturar screenshot do item em estado de foco por teclado (outline com offset negativo)
  it('com foco', async () => {
    await page.viewport(300, 100);

    const { root, waitForChanges } = await render(contentMenuItem());

    const menuItem = root.querySelector<HTMLAlcMenuItemElement>('[data-test-menu-item]');
    assert.exists(menuItem, 'O alc-menu-item não foi encontrado');

    const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
    assert.exists(before, 'Link anterior não encontrado');

    await waitForChanges();

    // Foca o elemento anterior e tabula: só assim o navegador entra em modalidade de
    // teclado e aplica o :focus-visible — um focus() direto não garante isso.
    before.focus();
    await userEvent.keyboard('{Tab}');
    await waitForChanges();

    assert.strictEqual(document.activeElement, menuItem, 'O item não recebeu o foco');

    await aguardaFontes();

    await expect(menuItem).toMatchScreenshot();
  });

});
