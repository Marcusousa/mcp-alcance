import { render, h, describe, it, expect, assert } from '@stencil/vitest';

// yarn stencil-test --project spec alc-dropdown.spec.tsx

describe('components/alc-dropdown', () => {
  it('Deve capturar os eventos na ordem esperada ao abrir o dropdown', async () => {
    const { root, waitForChanges } = await render<HTMLAlcDropdownElement>(
      <alc-dropdown>
        <button slot="trigger">Dropdown</button>
        <p>Content</p>
      </alc-dropdown>
    );

    const calls: string[] = [];
    root.addEventListener('alc-show', () => calls.push('alc-show'));
    root.addEventListener('alc-after-show', () => calls.push('alc-after-show'));

    await root.show();
    await waitForChanges();

    expect(calls).toEqual(['alc-show', 'alc-after-show']);
  });

  it('Deve capturar os eventos na ordem esperada ao fechar o dropdown', async () => {
    const { root, waitForChanges } = await render<HTMLAlcDropdownElement>(
      <alc-dropdown open={true}>
        <button slot="trigger">Dropdown</button>
        <p>Content</p>
      </alc-dropdown>
    );

    const calls: string[] = [];
    root.addEventListener('alc-hide', () => calls.push('alc-hide'));
    root.addEventListener('alc-after-hide', () => calls.push('alc-after-hide'));

    await root.hide();
    await waitForChanges();

    expect(calls).toEqual(['alc-hide', 'alc-after-hide']);
  });

  it('Deve disparar apenas os eventos "alc-show" quando cancelado ao abrir o dropdown', async () => {
    const { root, waitForChanges, spyOnEvent } = await render<HTMLAlcDropdownElement>(
      <alc-dropdown>
        <button slot="trigger">Dropdown</button>
        <p>Content</p>
      </alc-dropdown>
    );

    const showSpy = spyOnEvent('alc-show');
    const afterShowSpy = spyOnEvent('alc-after-show');

    root.addEventListener('alc-show', (event) => {
      event.preventDefault();
    });

    await root.show();
    await waitForChanges();

    expect(showSpy).toHaveReceivedEvent();
    expect(afterShowSpy).not.toHaveReceivedEvent();
  });

  it('Deve disparar apenas os eventos "alc-hide" quando cancelado ao fechar o dropdown', async () => {
    const { root, waitForChanges, spyOnEvent } = await render<HTMLAlcDropdownElement>(
      <alc-dropdown open={true}>
        <button slot="trigger">Dropdown</button>
        <p>Content</p>
      </alc-dropdown>
    );

    const hideSpy = spyOnEvent('alc-hide');
    const afterHideSpy = spyOnEvent('alc-after-hide');

    root.addEventListener('alc-hide', (event) => {
      event.preventDefault();
    });

    await root.hide();
    await waitForChanges();

    expect(hideSpy).toHaveReceivedEvent();
    expect(afterHideSpy).not.toHaveReceivedEvent();
  });

  it('Deve fechar o dropdown ao ouvir eventos', async () => {
    const { root, waitForChanges, spyOnEvent } = await render<HTMLAlcDropdownElement>(
      <alc-dropdown hide-on="alc-select click" open={true}>
        <button slot="trigger">Dropdown</button>
        <alc-menu>
          <alc-menu-item>Excluir</alc-menu-item>
          <alc-menu-item>Marcar como prioritário</alc-menu-item>
          <alc-menu-item>Adiar</alc-menu-item>
        </alc-menu>
      </alc-dropdown>
    );

    const menuItens = root.querySelectorAll('alc-menu-item');

    const clickedSpy = spyOnEvent('click');
    const selectedSpy = spyOnEvent('alc-select');

    expect(root.open).toBeTruthy();

    menuItens[0].click();
    await waitForChanges();

    expect(clickedSpy).toHaveReceivedEvent();
    expect(selectedSpy).toHaveReceivedEvent();
    expect(root.open).toBeFalsy();
  });

  it('Não deve fechar o dropdown ao ouvir evento preventDefault', async () => {
    const { root, waitForChanges } = await render<HTMLAlcDropdownElement>(
      <alc-dropdown hide-on="alc-select" open={true}>
        <button slot="trigger">Dropdown</button>
        <alc-menu>
          <alc-menu-item>Excluir</alc-menu-item>
          <alc-menu-item>Marcar como prioritário</alc-menu-item>
          <alc-menu-item>Adiar</alc-menu-item>
        </alc-menu>
      </alc-dropdown>
    );

    const menu = root.querySelector('alc-menu');
    assert.exists(menu, 'Menu não encontrado');

    const menuItens = root.querySelectorAll('alc-menu-item');
    assert.exists(menuItens, 'Itens do menu não encontrados');

    // preventDefault precisa ser chamado antes do listener de handleCloseOn no conteúdo
    menu.addEventListener('alc-select', (e) => {
      e.preventDefault();
    });

    expect(root.open).toBeTruthy();

    menuItens[0].click();
    await waitForChanges();

    expect(root.open).toBeTruthy();
  });

  it('Deve fechar o dropdown ao ouvir evento informado adicionado dinamicamente na propriedade hide-on', async () => {
    const { root, waitForChanges, spyOnEvent, setProps } = await render<HTMLAlcDropdownElement>(
      <alc-dropdown open={true}>
        <button slot="trigger">Dropdown</button>
        <alc-menu>
          <alc-menu-item>Excluir</alc-menu-item>
          <alc-menu-item>Marcar como prioritário</alc-menu-item>
          <alc-menu-item>Adiar</alc-menu-item>
        </alc-menu>
      </alc-dropdown>
    );

    const menuItens = root.querySelectorAll('alc-menu-item');
    assert.exists(menuItens, 'Itens do menu não encontrados');

    // Adiciona hide-on dinamicamente
    await setProps({ hideOn: 'alc-select' });

    const selectedSpy = spyOnEvent('alc-select');
    const clickedSpy = spyOnEvent('click');

    expect(root.open).toBeTruthy();
    menuItens[0].click();
    await waitForChanges();

    expect(selectedSpy).toHaveReceivedEvent();
    expect(root.open).toBeFalsy();

    // Adiciona mais eventos dinamicamente no hide-on
    await setProps({ hideOn: 'alc-select click' });

    await root.show();
    await waitForChanges();
    expect(root.open).toBeTruthy();

    menuItens[0].click();
    await waitForChanges();

    expect(selectedSpy.length).toBe(2);
    expect(clickedSpy).toHaveReceivedEvent();
    expect(root.open).toBeFalsy();
  });

  it('Não deve fechar o dropdown ao remover evento do hide-on dinamicamente', async () => {
    const { root, waitForChanges, spyOnEvent, setProps } = await render<HTMLAlcDropdownElement>(
      <alc-dropdown hide-on="alc-select" open={true}>
        <button slot="trigger">Dropdown</button>
        <alc-menu>
          <alc-menu-item>Excluir</alc-menu-item>
          <alc-menu-item>Marcar como prioritário</alc-menu-item>
          <alc-menu-item>Adiar</alc-menu-item>
        </alc-menu>
      </alc-dropdown>
    );

    const menuItens = root.querySelectorAll('alc-menu-item');
    assert.exists(menuItens, 'Itens do menu não encontrados');
    
    const selectedSpy = spyOnEvent('alc-select');

    expect(root.open).toBeTruthy();
    menuItens[0].click();
    await waitForChanges();

    expect(selectedSpy).toHaveReceivedEvent();
    expect(root.open).toBeFalsy();

    // Remove dinamicamente os eventos no hide-on
    await setProps({ hideOn: '' });

    await root.show();
    await waitForChanges();
    expect(root.open).toBeTruthy();

    menuItens[0].click();
    await waitForChanges();

    expect(root.open).toBeTruthy();
  });
})