import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-menu.e2e.tsx

const contentMenuItem = (
  <div>
    <a data-test-before href="#" class="alc-link">Foco anterior</a>
    <alc-menu>
      <alc-menu-item data-test-item data-test-item-1>Item 1</alc-menu-item>
      <alc-menu-item data-test-item data-test-item-disabled disabled>Item 2</alc-menu-item>
      <alc-menu-item data-test-item>Item 3</alc-menu-item>
    </alc-menu>
    <a data-test-after href="#" class="alc-link">Foco posterior</a>
  </div>
);

const contentMenuLink = (
  <div>
    <a data-test-before href="#" class="alc-link">Foco anterior</a>
    <alc-menu>
      <alc-menu-link>
        <a href="#item1" data-test-item data-test-item-1>Item 1</a>
      </alc-menu-link>
      <alc-menu-link disabled>
        <a href="#item2" data-test-item>Item 2</a>
      </alc-menu-link>
      <alc-menu-link>
        <a href="#item3" data-test-item>Item 3</a>
      </alc-menu-link>
    </alc-menu>
    <a data-test-after href="#" class="alc-link">Foco posterior</a>
  </div>
);

describe('alc-menu', () => {

  const testArray = [
    { name: 'menu-item', content: contentMenuItem },
    { name: 'menu-link', content: contentMenuLink },
  ];

  it.each(testArray)('Coloca foco inicial no primeiro item (com Tab) - $name', async ({ content }) => {
    const { root, waitForChanges } = await render(content);

    const before = root.querySelector<HTMLAnchorElement>('[data-test-before]')!;
    const item1 = root.querySelector<HTMLElement>('[data-test-item-1]')!;

    // Seta o foco no elemento anterior
    before.focus();
    expect(document.activeElement).toBe(before);
    // Pressiona tab para o foco ir para o menu (item 1)
    await userEvent.keyboard('{Tab}');
    await waitForChanges();
    expect(document.activeElement).toBe(item1);
  });

  it.each(testArray)('Coloca foco inicial no primeiro item (com Shift+Tab) - $name', async ({ content }) => {
    const { root, waitForChanges } = await render(content);

    const after = root.querySelector<HTMLAnchorElement>('[data-test-after]')!;
    const item1 = root.querySelector<HTMLElement>('[data-test-item-1]')!;

    // Seta o foco no elemento posterior
    after.focus();
    expect(document.activeElement).toBe(after);
    // Pressiona shift+tab para o foco ir para o menu (item 1)
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
    await waitForChanges();
    expect(document.activeElement).toBe(item1);
  });

  it.each(testArray)('Navega entre itens com seta para baixo - $name', async ({ content }) => {
    const { root, waitForChanges } = await render(content);

    const items = root.querySelectorAll<HTMLElement>('[data-test-item]');

    // Seta o foco no primeiro item
    items[0].focus();
    // Passa para item seguinte
    await userEvent.keyboard('{ArrowDown}');
    await waitForChanges();
    expect(document.activeElement).toBe(items[1]);
    // Passa para item seguinte
    await userEvent.keyboard('{ArrowDown}');
    await waitForChanges();
    expect(document.activeElement).toBe(items[2]);
    // Retorna ao início
    await userEvent.keyboard('{ArrowDown}');
    await waitForChanges();
    expect(document.activeElement).toBe(items[0]);
  });

  it.each(testArray)('Navega entre itens com seta para cima - $name', async ({ content }) => {
    const { root, waitForChanges } = await render(content);

    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-test-item]'));

    // Seta o foco no último item
    items[2].focus();
    // Passa para item anterior
    await userEvent.keyboard('{ArrowUp}');
    await waitForChanges();
    expect(document.activeElement).toBe(items[1]);
    // Passa para item anterior
    await userEvent.keyboard('{ArrowUp}');
    await waitForChanges();
    expect(document.activeElement).toBe(items[0]);
    // Retorna ao final
    await userEvent.keyboard('{ArrowUp}');
    await waitForChanges();
    expect(document.activeElement).toBe(items[2]);
  });

  it.each(testArray)('Coloca foco fora do menu após navegar pelos itens e utilizar Tab - $name', async ({ content }) => {
    const { root, waitForChanges } = await render(content);

    const after = root.querySelector<HTMLAnchorElement>('[data-test-after]')!;
    const item = root.querySelector<HTMLElement>('[data-test-item-1]')!;

    // Seta o foco no primeiro item
    item.focus();
    // Passa para item seguinte
    await userEvent.keyboard('{ArrowDown}');
    await waitForChanges();

    // Pressiona tab para o foco ir para o elemento após o menu
    await userEvent.keyboard('{Tab}');
    await waitForChanges();
    expect(document.activeElement).toBe(after);
  });

  it.each(testArray)('Coloca foco fora do menu após navegar pelos itens e utilizar Shift + Tab - $name', async ({ content }) => {
    const { root, waitForChanges } = await render(content);

    const before = root.querySelector<HTMLAnchorElement>('[data-test-before]')!;
    const item = root.querySelector<HTMLElement>('[data-test-item-1]')!;

    // Seta o foco no primeiro item
    item.focus();
    // Passa para item seguinte
    await userEvent.keyboard('{ArrowDown}');
    await waitForChanges();

    // Pressiona shift + tab para o foco ir para o elemento antes do menu
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
    await waitForChanges();
    expect(document.activeElement).toBe(before);
  });

  it.each(testArray)('Deve focar no menu-item desabilitado ao navegar pelo teclado - $name', async ({ content }) => {
    const { root, waitForChanges } = await render(content);

    const items = root.querySelectorAll<HTMLElement>('[data-test-item]');

    // SETA PARA BAIXO
    // Seta o foco no primeiro item
    items[0].focus();
    // Passa para item seguinte (desabilitado)
    await userEvent.keyboard('{ArrowDown}');
    await waitForChanges();
    expect(document.activeElement).toBe(items[1]);
    // Passa para item seguinte (último)
    await userEvent.keyboard('{ArrowDown}');
    await waitForChanges();
    expect(document.activeElement).toBe(items[2]);

    // SETA PARA CIMA
    // Passa para item anterior (desabilitado)
    await userEvent.keyboard('{ArrowUp}');
    await waitForChanges();
    expect(document.activeElement).toBe(items[1]);
    // Passa para item anterior (primeiro)
    await userEvent.keyboard('{ArrowUp}');
    await waitForChanges();
    expect(document.activeElement).toBe(items[0]);
  });

  it.each(testArray)('Deve focar sempre no primeiro menu-item ao focar o menu - $name', async ({ content }) => {
    const { root, waitForChanges } = await render(content);

    const items = root.querySelectorAll<HTMLElement>('[data-test-item]');
    const before = root.querySelector<HTMLAnchorElement>('[data-test-before]')!;
    const after = root.querySelector<HTMLAnchorElement>('[data-test-after]')!;

    // Seta o foco no elemento anterior
    before.focus();
    expect(document.activeElement).toBe(before);

    // Pressiona tab para o foco ir para o primeiro item (item 1)
    await userEvent.keyboard('{Tab}');
    await waitForChanges();
    expect(document.activeElement).toBe(items[0]);

    // Passa para item seguinte (item 2)
    await userEvent.keyboard('{ArrowDown}');
    await waitForChanges();
    expect(document.activeElement).toBe(items[1]);

    // Pressiona tab para o foco ir a um elemento posterior
    await userEvent.keyboard('{Tab}');
    await waitForChanges();
    expect(document.activeElement).toBe(after);

    // Pressiona shift + tab para o foco ir ao menu novamente
    // Espera-se que o foco esteja no primeiro menu-item.
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
    await waitForChanges();
    expect(document.activeElement).toBe(items[0]);
  });

  it('Deve disparar o evento alc-select ao clicar em um menu-item', async () => {
      const { root, spyOnEvent, waitForChanges } = await render(contentMenuItem);

      const firstItem = root.querySelector('[data-test-item-1]');
      assert.exists(firstItem, 'Primeiro item não encontrado');

      const alcSelectSpy = spyOnEvent('alc-select');

      await userEvent.click(firstItem);
      await waitForChanges();

      expect(alcSelectSpy).toHaveReceivedEvent();
      expect(alcSelectSpy.lastEvent?.target).toBe(firstItem);
  });

  it('Deve disparar o evento alc-select ao clicar em um menu-link', async () => {
      const { root, spyOnEvent, waitForChanges } = await render(
          <alc-menu>
            <alc-menu-link data-test-menu-link>
              <a href="#item1">Item 1</a>
            </alc-menu-link>
          </alc-menu>
      );

      const alcSelectSpy = spyOnEvent('alc-select');

      const item = root.querySelector('[data-test-menu-link]');
      assert.exists(item, 'Primeiro item não encontrado');

      await userEvent.click(item);
      await waitForChanges();

      expect(alcSelectSpy).toHaveReceivedEvent();
      expect(alcSelectSpy.lastEvent?.target).toBe(item);
  });

  it('Não deve disparar o evento alc-select ao clicar em um menu-item desabilitado', async () => {
      const { root, spyOnEvent, waitForChanges } = await render(contentMenuItem);

      const disabledItem = root.querySelector<HTMLAlcMenuItemElement>('[data-test-item-disabled]');
      assert.exists(disabledItem, 'Item desabilitado não encontrado');

      const alcSelectSpy = spyOnEvent('alc-select');

      disabledItem.click();

      // Quando usa o userEvent, esta dizendo "element is not enabled"
      // await userEvent.click(disabledItem);
      await waitForChanges();

      expect(alcSelectSpy).not.toHaveReceivedEvent();
  });

  it('Não deve disparar o evento alc-select ao clicar em um menu-link desabilitado', async () => {
      const { root, spyOnEvent, waitForChanges } = await render(
        <alc-menu>
          <alc-menu-link data-test-item-disabled disabled>
            <a href="#item1">Item 1</a>
          </alc-menu-link>
        </alc-menu>
      );

      const disabledItem = root.querySelector('[data-test-item-disabled]');
      assert.exists(disabledItem, 'Item desabilitado não encontrado');

      const alcSelectSpy = spyOnEvent('alc-select');

      await userEvent.click(disabledItem);
      await waitForChanges();

      expect(alcSelectSpy).not.toHaveReceivedEvent();
  });

  it('Deve disparar o evento alc-select ao selecionar um menu-item pelo teclado', async () => {
      const { root, spyOnEvent, waitForChanges } = await render(contentMenuItem);

      const firstItem = root.querySelector<HTMLAlcMenuItemElement>('[data-test-item-1]');
      assert.exists(firstItem, 'Item não encontrado');

      const alcSelectSpy = spyOnEvent('alc-select');

      firstItem.focus();
      await waitForChanges();

      await userEvent.keyboard('{Space}');
      await waitForChanges();

      expect(alcSelectSpy).toHaveReceivedEvent();
      expect(alcSelectSpy.lastEvent?.target).toBe(firstItem);
  });

  it('Deve disparar o evento alc-select ao selecionar um menu-link pelo teclado', async () => {
      const { root, spyOnEvent, waitForChanges } = await render(
        <alc-menu>
          <alc-menu-link data-test-menu-link>
            <a href="#item1" data-test-link>Item 1</a>
          </alc-menu-link>
        </alc-menu>
      );

      const firstItem = root.querySelector<HTMLAlcMenuLinkElement>('[data-test-menu-link]');
      assert.exists(firstItem, 'Item não encontrado');

      const link = root.querySelector<HTMLAnchorElement>('[data-test-link]');
      assert.exists(link, 'Link não encontrado');

      const alcSelectSpy = spyOnEvent('alc-select');

      link.focus();
      await waitForChanges();

      await userEvent.keyboard('{Space}');
      await waitForChanges();

      expect(alcSelectSpy).toHaveReceivedEvent();
      expect(alcSelectSpy.lastEvent?.target).toBe(firstItem);
  });

  it('Não deve disparar o evento alc-select ao selecionar um menu-item desabilitado pelo teclado', async () => {
      const { root, spyOnEvent, waitForChanges } = await render(contentMenuItem);

      const disabledItem = root.querySelector<HTMLAlcMenuItemElement>('[data-test-item-disabled]');
      assert.exists(disabledItem, 'Item não encontrado');

      const alcSelectSpy = spyOnEvent('alc-select');

      disabledItem.focus();
      await waitForChanges();

      await userEvent.keyboard('{Enter}');
      await waitForChanges();

      expect(alcSelectSpy).not.toHaveReceivedEvent();
  });

  it('Não deve disparar o evento alc-select ao selecionar um menu-link desabilitado pelo teclado', async () => {
      const { root, spyOnEvent, waitForChanges } = await render(
        <alc-menu>
          <alc-menu-link data-test-item-disabled disabled>
            <a href="#item1">Item 1</a>
          </alc-menu-link>
        </alc-menu>
      );

      const disabledItem = root.querySelector<HTMLAlcMenuLinkElement>('[data-test-item-disabled]');
      assert.exists(disabledItem, 'Item não encontrado');

      const alcSelectSpy = spyOnEvent('alc-select');

      disabledItem.focus();
      await waitForChanges();

      await userEvent.keyboard('{Enter}');
      await waitForChanges();

      expect(alcSelectSpy).not.toHaveReceivedEvent();
  });

  it('Evento alc-select deve conter o evento original ao selecionar um menu-link pressionando espaço', async () => {
      const { root, spyOnEvent, waitForChanges } = await render(contentMenuLink);

      const firstItem = root.querySelector<HTMLAlcMenuLinkElement>('[data-test-item-1]');
      assert.exists(firstItem, 'Item não encontrado');

      const alcSelectSpy = spyOnEvent('alc-select');

      firstItem.focus();
      await waitForChanges();

      await userEvent.keyboard('{Space}');
      await waitForChanges();

      // Não transforma o evento original (ação do usuário) em outro tipo de evento.
      expect(alcSelectSpy.lastEvent!.detail.originalEvent.type).toBe('keydown');
  });

  describe('itens dinâmicos', () => {

    /**
     * Cria um item compatível com o menu (role="menuitem") sem depender
     * da renderização de outro componente, para que a lista de itens do menu
     * possa ser conferida imediatamente após o retorno dos métodos.
     */
    const createItem = (label: string) => {
      const item = document.createElement('div');
      item.setAttribute('role', 'menuitem');
      item.setAttribute('data-test-dynamic', label);
      item.textContent = label;
      return item;
    };

    const renderMenu = async () => {
      const { root, waitForChanges } = await render(contentMenuItem);
      const menu = root.querySelector<HTMLAlcMenuElement>('alc-menu');
      assert.exists(menu, 'Menu não encontrado');
      await menu.componentOnReady();
      return { root, menu, waitForChanges };
    };

    it('addMenuItem deve retornar true somente após a lista de itens ser atualizada', async () => {
      const { menu } = await renderMenu();
      const item = createItem('dinâmico');

      const added = await menu.addMenuItem(item, 'start');

      expect(added).toBe(true);
      expect(menu.contains(item)).toBe(true);
      // O tabindex é definido pelo refresh agendado em renderDynamicItems > writeTask > readTask.
      // Como o item foi inserido no início, ele passa a ser o primeiro item navegável por tabulação.
      expect(item.getAttribute('tabindex')).toBe('0');
    });

    it('addMenuItem deve inserir no fim do menu por padrão', async () => {
      const { menu } = await renderMenu();
      const item = createItem('dinâmico');

      const added = await menu.addMenuItem(item);

      expect(added).toBe(true);
      expect(menu.contains(item)).toBe(true);
      // Não é o primeiro item do menu, portanto fica fora da navegação por tabulação.
      expect(item.getAttribute('tabindex')).toBe('-1');
    });

    it('addMenuItem deve retornar false quando o item não for um elemento', async () => {
      const { menu } = await renderMenu();

      expect(await menu.addMenuItem(null as unknown as Element)).toBe(false);
      expect(await menu.addMenuItem('item' as unknown as Element)).toBe(false);
    });

    it('addMenuItem deve retornar false quando a posição for inválida', async () => {
      const { menu } = await renderMenu();
      const item = createItem('dinâmico');

      const added = await menu.addMenuItem(item, 'meio' as 'start' | 'end');

      expect(added).toBe(false);
      expect(menu.contains(item)).toBe(false);
    });

    it('addMenuItem não deve duplicar um item já presente no menu', async () => {
      const { menu } = await renderMenu();
      const item = createItem('dinâmico');

      expect(await menu.addMenuItem(item)).toBe(true);
      expect(await menu.addMenuItem(item)).toBe(true);
      expect(menu.querySelectorAll('[data-test-dynamic]')).toHaveLength(1);

      // Como o item não foi duplicado, uma única remoção é suficiente.
      expect(await menu.removeMenuItem(item)).toBe(true);
      expect(menu.contains(item)).toBe(false);
    });

    it('removeMenuItem deve retornar true ao remover pelo elemento', async () => {
      const { menu } = await renderMenu();
      const item = createItem('dinâmico');

      await menu.addMenuItem(item, 'start');

      const removed = await menu.removeMenuItem(item);

      expect(removed).toBe(true);
      expect(menu.contains(item)).toBe(false);
      // O refresh já foi executado: o primeiro item do slot voltou a ser o primeiro navegável.
      expect(menu.querySelector('[data-test-item-1]')?.getAttribute('tabindex')).toBe('0');
    });

    it('removeMenuItem deve retornar true ao remover pelo índice', async () => {
      const { menu } = await renderMenu();
      const primeiro = createItem('primeiro');
      const segundo = createItem('segundo');

      await menu.addMenuItem(primeiro);
      await menu.addMenuItem(segundo);

      const removed = await menu.removeMenuItem(0);

      expect(removed).toBe(true);
      expect(menu.contains(primeiro)).toBe(false);
      expect(menu.contains(segundo)).toBe(true);
    });

    it('removeMenuItem deve retornar false quando o elemento não fizer parte dos itens do menu', async () => {
      const { menu } = await renderMenu();
      const item = createItem('dinâmico');
      const foraDoMenu = createItem('fora');

      await menu.addMenuItem(item);

      expect(await menu.removeMenuItem(foraDoMenu)).toBe(false);
      // Um item declarado no slot também não pode ser removido por esse método.
      expect(await menu.removeMenuItem(menu.querySelector('[data-test-item-1]')!)).toBe(false);
      expect(menu.contains(item)).toBe(true);
    });

    it('removeMenuItem deve retornar false quando o índice estiver fora do tamanho da lista', async () => {
      const { menu } = await renderMenu();
      const item = createItem('dinâmico');

      await menu.addMenuItem(item);

      expect(await menu.removeMenuItem(1)).toBe(false);
      expect(await menu.removeMenuItem(-1)).toBe(false);
      expect(await menu.removeMenuItem(0.5)).toBe(false);
      expect(menu.contains(item)).toBe(true);
    });

    it('removeMenuItem deve retornar false quando não houver itens dinâmicos', async () => {
      const { menu } = await renderMenu();

      expect(await menu.removeMenuItem(0)).toBe(false);
    });

  });

});
