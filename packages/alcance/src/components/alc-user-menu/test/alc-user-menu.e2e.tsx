import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { userEvent, page } from 'vitest/browser';

const data = {
  name: 'Thundercats',
  registrationNumber: '12345',
  logoutUrl: '/logout',
};

const themes = {
  dark: 'dark',
  light: 'light',
}

// yarn stencil-test --project browser alc-user-menu.e2e.tsx

describe.skip('alc-user-menu - screenshots', () => {
  it('Deve capturar screenshot do componente alc-user-menu - desktop', async () => {
    await page.viewport(1440, 785);

    const { root } = await render(
      <alc-user-menu 
        name={data.name}
        logoutUrl={data.logoutUrl} 
        registrationNumber={data.registrationNumber} 
        variation='desktop'
      ></alc-user-menu>
    );

    await expect(root).toMatchScreenshot();
  });

  it('Deve capturar screenshot do componente alc-user-menu - desktop compacto', async () => {
    await page.viewport(1000, 785);

    const { root } = await render(
      <alc-user-menu 
        name={data.name} 
        logoutUrl={data.logoutUrl} 
        registrationNumber={data.registrationNumber} 
        variation='desktop'
      ></alc-user-menu>
    );

    await expect(root).toMatchScreenshot();
  });

  it('Deve capturar screenshot do componente alc-user-menu - mobile', async () => {
    await page.viewport(425, 785);

    const { root } = await render(
      <alc-user-menu 
        name={data.name} 
        logoutUrl={data.logoutUrl} 
        registrationNumber={data.registrationNumber} 
        variation='mobile'
      ></alc-user-menu>
    );

    await expect(root).toMatchScreenshot();
  });
});

describe('alc-user-menu', () => {

  it('Deve disparar alc-theme-change ao pressionar Enter no item de tema', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <alc-user-menu 
        name={data.name} 
        logoutUrl={data.logoutUrl}
      ></alc-user-menu>
    );

    // Limpa localStorage no contexto do browser
    globalThis.localStorage?.clear();
    // Spy do evento
    const themeChangeEvent = spyOnEvent('alc-theme-change');

    // Abre o dropdown
    const dropdownButton = root.querySelector<HTMLElement>('[data-test-dropdown-button]');
    dropdownButton?.focus();
    await waitForChanges();
    await userEvent.keyboard('{Enter}');
    await waitForChanges();

    // Busca os elementos
    const menuItemTheme = root.querySelector('[data-test-menu-item-theme]');
    assert.exists(menuItemTheme, 'O menuItemTheme não foi encontrado');

    const menuItem = menuItemTheme.querySelector<HTMLAlcMenuItemElement>('alc-menu-item');
    assert.exists(menuItem, 'O menuItem não foi encontrado');

    // Estado inicial (light)
    expect(menuItem.checked).toBe(false);

    // Pressiona Enter e deve alterar o tema
    // Ao abrir o dropdown espera-se que o foco ja esteja no primeiro item que é o tema
    await userEvent.keyboard('{Enter}');
    await waitForChanges();

    // Valida dark mode
    expect(menuItem.checked).toBe(true);
    expect(themeChangeEvent).toHaveReceivedEventTimes(1);
    expect(themeChangeEvent).toHaveReceivedEventDetail({ theme: themes.dark });

    // Pressiona ENTER novamente
    await userEvent.keyboard('{Enter}');
    await waitForChanges();

    // Valida light mode
    expect(menuItem.checked).toBe(false);
    expect(themeChangeEvent).toHaveReceivedEventTimes(2);
    expect(themeChangeEvent).toHaveReceivedEventDetail({ theme: themes.light });
  });

  it('Deve manter os itens do slot "actions" visíveis após abrir o dropdown', async () => {
    const { root, waitForChanges } = await render(
      <alc-user-menu name={data.name} logoutUrl={data.logoutUrl} variation="desktop">
        <div slot="actions" data-test-slot-actions>
          <alc-menu-item data-test-item-ajuda>Ajuda</alc-menu-item>
          <alc-menu-item>Contato</alc-menu-item>
        </div>
      </alc-user-menu>
    );

    // Abre o dropdown
    const dropdownButton = root.querySelector<HTMLElement>('[data-test-dropdown-button]');
    assert.exists(dropdownButton, 'O botão do dropdown não foi encontrado');
    dropdownButton.click();
    await waitForChanges();

    const actions = root.querySelector<HTMLElement>('[data-test-slot-actions]');
    assert.exists(actions, 'O conteúdo do slot "actions" não foi encontrado');
    expect(actions.hidden).toBe(false);

    // Visível de fato (ocupa espaço na tela)
    const item = root.querySelector<HTMLElement>('[data-test-item-ajuda]');
    assert.exists(item, 'O item "Ajuda" não foi encontrado');
    expect(item.getClientRects().length).toBeGreaterThan(0);

    // Os itens do slot "actions" devem aparecer antes dos itens padrão (tema e sair)
    const menu = root.querySelector('[data-test-menu]');
    assert.exists(menu, 'O menu não foi encontrado');
    const themeItem = menu.querySelector('[data-test-menu-item-theme]');
    assert.exists(themeItem, 'O item de tema não foi encontrado');
    expect(actions.compareDocumentPosition(themeItem) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

});
