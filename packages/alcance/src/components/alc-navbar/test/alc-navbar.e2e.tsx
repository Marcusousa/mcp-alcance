import { render, h, describe, it, expect, assert, beforeEach } from '@stencil/vitest';
import { userEvent, page } from 'vitest/browser';

// yarn stencil-test --project browser alc-navbar.e2e.tsx

const DESKTOP_WIDTH = 992;

const URL = {
  item2: "#item2",
  item3: "#item3",
  subitem1: "#item1.1",
  subitem2: "#item1.2",
  subitem3: "#item1.3"
}

const buildContent = () => (
  <alc-navbar>
    <ul>
      <li data-test-item-1>
        <span>Item 1</span>
        <alc-nav>
          <ul>
            <li><a href={URL.subitem1} data-test-subitem-1>Item 1.1</a></li>
            <li><a href={URL.subitem2} data-test-subitem-2>Item 1.2</a></li>
            <li><a href={URL.subitem3} data-test-subitem-3>Item 1.3</a></li>
          </ul>
        </alc-nav>
      </li>
      <li><a href={URL.item2} data-test-item-2>Item 2</a></li>
      <li><a href={URL.item3} data-test-item-3>Item 3</a></li>
    </ul>
  </alc-navbar>
);

describe('alc-navbar', () => {

  beforeEach(async () => {
    await page.viewport(DESKTOP_WIDTH, 800);
  });

  it('Deve abrir a página correta ao clicar no botão sem subitem', async () => {
    const { root, waitForChanges } = await render(buildContent());

    const link = root.querySelector<HTMLAnchorElement>('[data-test-item-2]');
    assert.exists(link, 'O link não foi encontrado');
    expect(link).toHaveTextContent('Item 2');
    expect(link.getAttribute('href')).toBe(URL.item2);
    expect(window.location.href).not.toContain(URL.item2);


    await userEvent.click(link);
    await waitForChanges();
    expect(window.location.href).toContain(URL.item2);
  });

  it('Deve abrir a página correta ao clicar em um subitem', async () => {
    const { root, waitForChanges } = await render(buildContent());

    const button = root.querySelector<HTMLElement>('[data-test-item-1] button[slot="trigger"]');
    assert.exists(button, 'O botão do trigger não foi encontrado');

    await userEvent.click(button);
    await waitForChanges();

    const link = root.querySelector<HTMLAnchorElement>('[data-test-subitem-1]');
    assert.exists(link, 'O subitem não foi encontrado');
    expect(link).toHaveTextContent('Item 1.1');
    expect(link.getAttribute('href')).toBe(URL.subitem1);

    await userEvent.click(link);
    await waitForChanges();
    expect(window.location.href).toContain(URL.subitem1);
  });

  it('Deve abrir o dropdown ao clicar no botão', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(buildContent());

    const showEvent = spyOnEvent('alc-show');

    const dropdown = root.querySelector<HTMLAlcDropdownElement>('[data-test-item-1] alc-dropdown');
    assert.exists(dropdown, 'O dropdown não foi encontrado');
    expect(dropdown.open).toBeFalsy();

    const button = dropdown.querySelector<HTMLElement>('button[slot="trigger"]');
    assert.exists(button, 'O botão do trigger não foi encontrado');

    await userEvent.click(button);
    await waitForChanges();

    expect(showEvent).toHaveReceivedEvent();
    expect(dropdown.open).toBeTruthy();
  });

  it('Deve fechar o dropdown ao clicar fora do menu', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(buildContent());

    const hideEvent = spyOnEvent('alc-hide');

    const dropdown = root.querySelector<HTMLAlcDropdownElement>('[data-test-item-1] alc-dropdown');
    assert.exists(dropdown, 'O dropdown não foi encontrado');
    expect(dropdown.open).toBeFalsy();

    const button = dropdown.querySelector<HTMLElement>('button[slot="trigger"]');
    assert.exists(button, 'O botão do trigger não foi encontrado');

    // Abre o dropdown
    await userEvent.click(button);
    await waitForChanges();
    expect(dropdown.open).toBeTruthy();

    // Clica fora do dropdown
    await userEvent.click(document.body);
    await waitForChanges();

    expect(hideEvent).toHaveReceivedEvent();
    expect(dropdown.open).toBeFalsy();
  });

  it('Deve abrir o dropdown ao pressionar Enter', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(buildContent());

    const showEvent = spyOnEvent('alc-show');

    const dropdown = root.querySelector<HTMLAlcDropdownElement>('[data-test-item-1] alc-dropdown');
    assert.exists(dropdown, 'O dropdown não foi encontrado');
    expect(dropdown.open).toBeFalsy();

    const button = dropdown.querySelector<HTMLElement>('button[slot="trigger"]');
    assert.exists(button, 'O botão do trigger não foi encontrado');

    button.focus();
    await userEvent.keyboard('{Enter}');
    await waitForChanges();

    expect(showEvent).toHaveReceivedEvent();
    expect(dropdown.open).toBeTruthy();

    // Foco deve ter ido para o primeiro item do dropdown
    const subItem = root.querySelector<HTMLElement>('[data-test-subitem-1]');
    assert.exists(subItem, 'O subitem 1 não foi encontrado');
    expect(document.activeElement).toBe(subItem);
  });

  it('Deve abrir o dropdown ao pressionar Space', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(buildContent());

    const showEvent = spyOnEvent('alc-show');

    const dropdown = root.querySelector<HTMLAlcDropdownElement>('[data-test-item-1] alc-dropdown');
    assert.exists(dropdown, 'O dropdown não foi encontrado');
    expect(dropdown.open).toBeFalsy();

    const button = dropdown.querySelector<HTMLElement>('button[slot="trigger"]');
    assert.exists(button, 'O botão do trigger não foi encontrado');

    button.focus();
    await userEvent.keyboard('{Space}');
    await waitForChanges();

    expect(showEvent).toHaveReceivedEvent();
    expect(dropdown.open).toBeTruthy();

    // Foco deve ter ido para o primeiro item do dropdown
    const subItem = root.querySelector<HTMLElement>('[data-test-subitem-1]');
    assert.exists(subItem, 'O subitem 1 não foi encontrado');
    expect(document.activeElement).toBe(subItem);
  });

  it('Deve fechar o dropdown ao pressionar Esc', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(buildContent());

    const hideEvent = spyOnEvent('alc-hide');

    const dropdown = root.querySelector<HTMLAlcDropdownElement>('[data-test-item-1] alc-dropdown');
    assert.exists(dropdown, 'O dropdown não foi encontrado');

    const button = dropdown.querySelector<HTMLElement>('button[slot="trigger"]');
    assert.exists(button, 'O botão do trigger não foi encontrado');

    button.focus();
    await userEvent.keyboard('{Enter}');
    await waitForChanges();
    expect(dropdown.open).toBeTruthy();

    await userEvent.keyboard('{Escape}');
    await waitForChanges();

    expect(dropdown.open).toBeFalsy();
    expect(hideEvent).toHaveReceivedEvent();
  });

  it('Deve navegar pelo teclado corretamente entre os itens de navegação nivel 1', async () => {
    const { root, waitForChanges } = await render(buildContent());

    const item1 = root.querySelector<HTMLElement>('[data-test-item-1] button[slot="trigger"]');
    const item2 = root.querySelector<HTMLElement>('[data-test-item-2]');
    const item3 = root.querySelector<HTMLElement>('[data-test-item-3]');

    assert.exists(item1, 'Item 1 não encontrado');
    assert.exists(item2, 'Item 2 não encontrado');
    assert.exists(item3, 'Item 3 não encontrado');

    await userEvent.keyboard('{Tab}'); // Foca no primeiro item
    await waitForChanges();
    expect(document.activeElement).toBe(item1);

    await userEvent.keyboard('{Tab}'); // Foca no segundo item
    await waitForChanges();
    expect(document.activeElement).toBe(item2);

    await userEvent.keyboard('{Tab}'); // Foca no terceiro item
    await waitForChanges();
    expect(document.activeElement).toBe(item3);

    // Pressiona Shift + Tab, o foco deve voltar para o segundo item
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
    await waitForChanges();
    expect(document.activeElement).toBe(item2);

    // Pressiona Shift + Tab, o foco deve voltar para o primeiro item
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
    await waitForChanges();
    expect(document.activeElement).toBe(item1);
  });

  it('Deve abrir a página correta ao pressionar Enter em um item sem subitem', async () => {
    const { root, waitForChanges } = await render(buildContent());

    const item = root.querySelector<HTMLAnchorElement>('[data-test-item-2]');
    assert.exists(item, 'O item não foi encontrado');

    await item.focus();
    await userEvent.keyboard('{Enter}');
    await waitForChanges();
    expect(item.getAttribute('href')).toBe(URL.item2);
    expect(window.location.href).toContain(URL.item2);
  });

  it('Deve abrir a página correta ao pressionar Enter em um subitem', async () => {
    const { root, waitForChanges } = await render(buildContent());

    const button = root.querySelector<HTMLElement>('[data-test-item-1] button[slot="trigger"]');
    assert.exists(button, 'O botão do trigger não foi encontrado');

    button.focus();
    await userEvent.keyboard('{Enter}');
    await waitForChanges();

    const subItem = root.querySelector<HTMLAnchorElement>('[data-test-subitem-1]');
    assert.exists(subItem, 'O subitem não foi encontrado');
    expect(document.activeElement).toBe(subItem);
    await userEvent.keyboard('{Enter}');
    await waitForChanges();
    expect(subItem.getAttribute('href')).toBe(URL.subitem1);
    expect(window.location.href).toContain(URL.subitem1);
  });

  it('Deve navegar pelo teclado corretamente entre os subitens no dropdown', async () => {
    const { root, waitForChanges } = await render(buildContent());

    const item1 = root.querySelector<HTMLElement>('[data-test-item-1] button[slot="trigger"]');
    const item2 = root.querySelector<HTMLElement>('[data-test-item-2]');

    assert.exists(item1, 'Item 1 não encontrado');
    assert.exists(item2, 'Item 2 não encontrado');

    // Abre o dropdown
    item1.focus();
    await userEvent.keyboard('{Enter}');
    await waitForChanges();

    const dropdown = root.querySelector<HTMLAlcDropdownElement>('[data-test-item-1] alc-dropdown');
    assert.exists(dropdown, 'O dropdown não foi encontrado');
    expect(dropdown.open).toBeTruthy();

    const subItem1 = root.querySelector<HTMLElement>('[data-test-subitem-1]');
    const subItem2 = root.querySelector<HTMLElement>('[data-test-subitem-2]');
    const subItem3 = root.querySelector<HTMLElement>('[data-test-subitem-3]');

    assert.exists(subItem1, 'Subitem 1 não encontrado');
    assert.exists(subItem2, 'Subitem 2 não encontrado');
    assert.exists(subItem3, 'Subitem 3 não encontrado');

    // Espera que o foco esteja no primeiro subitem ao abrir o dropdown
    expect(document.activeElement).toBe(subItem1);

    await userEvent.keyboard('{Tab}'); // Foca no segundo subitem
    await waitForChanges();
    expect(document.activeElement).toBe(subItem2);

    await userEvent.keyboard('{Tab}'); // Foca no terceiro e último subitem
    await waitForChanges();
    expect(document.activeElement).toBe(subItem3);

    // O foco deve ir para o segundo item (pai) e fechar o dropdown
    await userEvent.keyboard('{Tab}');
    await waitForChanges();
    expect(document.activeElement).toBe(item2);
    expect(dropdown.open).toBeFalsy();

    // Pressiona Shift + Tab, o foco deve voltar para o primeiro item
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
    await waitForChanges();
    expect(document.activeElement).toBe(item1);

    // Abre o dropdown do item 1 e verifica se o foco foi para o subitem 1
    await userEvent.keyboard('{Enter}');
    await waitForChanges();
    expect(document.activeElement).toBe(subItem1);
    expect(dropdown.open).toBeTruthy();

    // Pressiona Shift + Tab, o foco deve voltar para o primeiro item e fechar o dropdown
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
    await waitForChanges();
    expect(document.activeElement).toBe(item1);
    expect(dropdown.open).toBeFalsy();
  });

});
