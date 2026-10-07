import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-header-action.e2e.tsx

const data = {
  iconName: 'search',
  label: 'Buscar',
  url: '#test',
};

describe('alc-header-action', () => {

  describe('Renderização', () => {

    it('Deve renderizar corretamente como button', async () => {
      const { root, waitForChanges } = await render(
        <alc-header-action 
          variant="button" 
          icon-name={data.iconName}
        >
          {data.label}
        </alc-header-action>
      );
      await waitForChanges();

      const element = root.querySelector('[data-test-button]');
      assert.exists(element, 'O botão não foi encontrado');
      expect(element.tagName).toBe('BUTTON');

      const icon = root.querySelector('[data-test-icon]');
      assert.exists(icon, 'O ícone não foi encontrado');
      expect(icon.getAttribute('icon')).toBe(data.iconName);

      const label = root.querySelector('[data-test-label]');
      assert.exists(label, 'O label não foi encontrado');
      expect(label.textContent).toBe(data.label);
    });

    it('Deve renderizar corretamente como link', async () => {
      const { root, waitForChanges } = await render(
        <alc-header-action 
          variant="link" 
          url={data.url} 
          icon-name={data.iconName}
        >
          {data.label}
        </alc-header-action>
      );
      await waitForChanges();

      const element = root.querySelector('[data-test-link]');
      assert.exists(element, 'O link não foi encontrado');
      expect(element.tagName).toBe('A');
      expect(element.getAttribute('href')).toBe(data.url);

      const icon = root.querySelector('[data-test-icon]');
      assert.exists(icon, 'O ícone não foi encontrado');
      expect(icon.getAttribute('icon')).toBe(data.iconName);

      const label = root.querySelector('[data-test-label]');
      assert.exists(label, 'O label não foi encontrado');
      expect(label.textContent).toBe(data.label);
    });

    it('Deve renderizar corretamente como menu-item', async () => {
      const { root, waitForChanges } = await render(
        <alc-header-action variant="menu-item" icon-name={data.iconName}>{data.label}</alc-header-action>
      );
      await waitForChanges();

      const element = root.querySelector('[data-test-menu-item]');
      assert.exists(element, 'O menu-item não foi encontrado');
      expect(element.tagName).toBe('ALC-MENU-ITEM');

      const icon = root.querySelector('[data-test-icon]');
      assert.exists(icon, 'O ícone não foi encontrado');
      expect(icon.getAttribute('icon')).toBe(data.iconName);

      const label = root.querySelector('[data-test-label]');
      assert.exists(label, 'O label não foi encontrado');
      expect(label.textContent).toBe(data.label);
    });

    it('Deve renderizar corretamente como menu-link', async () => {
      const { root, waitForChanges } = await render(
        <alc-header-action 
          variant="menu-link" 
          url={data.url} 
          icon-name={data.iconName}
        >
          {data.label}
          </alc-header-action>
      );
      await waitForChanges();

      const element = root.querySelector('[data-test-menu-link]');
      assert.exists(element, 'O menu-link não foi encontrado');
      expect(element.tagName).toBe('ALC-MENU-LINK');

      const link = root.querySelector('[data-test-link]');
      assert.exists(link, 'O link não foi encontrado');
      expect(link.getAttribute('href')).toBe(data.url);

      const icon = root.querySelector('[data-test-icon]');
      assert.exists(icon, 'O ícone não foi encontrado');
      expect(icon.getAttribute('icon')).toBe(data.iconName);
    });

  });

  describe('Disparo do evento alc-select ao clicar', () => {

    it('Deve disparar o evento alc-select ao clicar (button)', async () => {
      const { root, spyOnEvent, waitForChanges } = await render(
        <alc-header-action 
          variant="button" 
          icon-name={data.iconName}
        >
          {data.label}
        </alc-header-action>
      );

      const alcSelectEvent = spyOnEvent('alc-select');

      const button = root.querySelector<HTMLButtonElement>('[data-test-button]');
      assert.exists(button, 'O botão não foi encontrado');

      button.click();
      await waitForChanges();

      expect(alcSelectEvent).toHaveReceivedEvent();
    });

    it('Deve disparar o evento alc-select ao clicar (link)', async () => {
      const { root, spyOnEvent, waitForChanges } = await render(
        <alc-header-action 
          variant="link" 
          url={data.url} 
          icon-name={data.iconName}
        >
          {data.label}
        </alc-header-action>
      );

      root.addEventListener('alc-select', (event) => {
        event.preventDefault();
      });    

      const alcSelectEvent = spyOnEvent('alc-select');

      const link = root.querySelector<HTMLAnchorElement>('[data-test-link]');
      assert.exists(link, 'O link não foi encontrado');

      link.click();
      await waitForChanges();

      expect(alcSelectEvent).toHaveReceivedEvent();
    });

    it('Deve disparar o evento alc-select ao clicar (menu-item)', async () => {
      const { root, spyOnEvent, waitForChanges } = await render(
        <alc-header-action 
          id="event-target" 
          variant="menu-item" 
          icon-name={data.iconName}
        >
          {data.label}
        </alc-header-action>
      );

      const alcSelectEvent = spyOnEvent('alc-select');


      const menuItem = root.querySelector<HTMLAlcMenuItemElement>('[data-test-menu-item]');
      assert.exists(menuItem, 'O menu-item não foi encontrado');

      menuItem.click();
      await waitForChanges();

      expect(alcSelectEvent).toHaveReceivedEvent();

      // O evento deve ser disparado pelo alc-header-action, não pelo alc-menu-item interno.
      const eventTarget = alcSelectEvent.lastEvent?.target;

      if(eventTarget instanceof HTMLElement) {
        expect(eventTarget.id).toBe('event-target');
      } else {
        expect.fail('O target do evento não é um HTMLElement');
      }
    });

    it('Deve disparar o evento alc-select ao clicar (menu-link)', async () => {
      const { root, spyOnEvent, waitForChanges } = await render(
        <alc-header-action 
          id="event-target" 
          variant="menu-link" 
          url={data.url} 
          icon-name={data.iconName}
        >
          {data.label}
        </alc-header-action>
      );

      const alcSelectEvent = spyOnEvent('alc-select');

      const menuLink = root.querySelector<HTMLAlcMenuLinkElement>('[data-test-menu-link]');
      assert.exists(menuLink, 'O menu-link não foi encontrado');

      menuLink.click();
      await waitForChanges();

      expect(alcSelectEvent).toHaveReceivedEvent();

      // O evento deve ser disparado pelo alc-header-action, não pelo alc-menu-link interno.
      const eventTarget = alcSelectEvent.lastEvent?.target;

      if(eventTarget instanceof HTMLElement) {
        expect(eventTarget.id).toBe('event-target');
      } else {
        expect.fail('O target do evento não é um HTMLElement');
      }
    });

  });

  describe('Disparo do evento alc-select ao pressionar teclado', () => {

    it('Deve disparar o evento alc-select ao pressionar "Enter" e "Space" (button)', async () => {
      const { root, spyOnEvent, waitForChanges } = await render(
        <alc-header-action 
          variant="button" 
          icon-name={data.iconName}
        >
          {data.label}
        </alc-header-action>
      );

      const alcSelectEvent = spyOnEvent('alc-select');

      const button = root.querySelector<HTMLButtonElement>('[data-test-button]');
      assert.exists(button, 'O botão não foi encontrado');
      
      await userEvent.keyboard('{Tab}');
      expect(document.activeElement).toBe(button);

      await userEvent.keyboard('{Enter}');
      await waitForChanges();
      expect(alcSelectEvent).toHaveReceivedEventTimes(1);

      await userEvent.keyboard('{Space}');
      await waitForChanges();
      expect(alcSelectEvent).toHaveReceivedEventTimes(2);
    });

    it('Deve disparar o evento alc-select ao pressionar "Enter" e "Space" (link)', async () => {
      const { root, spyOnEvent, waitForChanges } = await render(
        <alc-header-action 
          variant="link" 
          url={data.url} 
          icon-name={data.iconName}
        >
          {data.label}
        </alc-header-action>
      );

      const alcSelectEvent = spyOnEvent('alc-select');

      const link = root.querySelector<HTMLAnchorElement>('[data-test-link]');
      assert.exists(link, 'O link não foi encontrado');
      
      await userEvent.keyboard('{Tab}');
      expect(document.activeElement).toBe(link);

      await userEvent.keyboard('{Enter}');
      await waitForChanges();
      expect(alcSelectEvent).toHaveReceivedEventTimes(1);

      await userEvent.keyboard('{Space}');
      await waitForChanges();
      expect(alcSelectEvent).toHaveReceivedEventTimes(2);
    });

    it('Deve disparar o evento alc-select ao pressionar "Enter" e "Space" (menu-item)', async () => {
      const { root, spyOnEvent, waitForChanges } = await render(
        <alc-header-action 
          variant="menu-item" 
          icon-name={data.iconName}
        >
          {data.label}
        </alc-header-action>
      );

      const alcSelectEvent = spyOnEvent('alc-select');

      const menuItem = root.querySelector<HTMLAlcMenuItemElement>('[data-test-menu-item]');
      assert.exists(menuItem, 'O menu-item não foi encontrado');

      // @TODO: Verificar o porque o userEvent.keyboard('{Tab}') não está focando o menu-item. Por enquanto, vamos focar manualmente.
      menuItem.focus();
      expect(document.activeElement).toBe(menuItem);

      await userEvent.keyboard('{Enter}');
      await waitForChanges();
      expect(alcSelectEvent).toHaveReceivedEventTimes(1);

      await userEvent.keyboard('{Space}');
      await waitForChanges();
      expect(alcSelectEvent).toHaveReceivedEventTimes(2);
    });

    it('Deve disparar o evento alc-select ao pressionar "Enter" e "Space" (menu-link)', async () => {
      const { root, spyOnEvent, waitForChanges } = await render(
        <alc-header-action 
          variant="menu-link" 
          url={data.url} 
          icon-name={data.iconName}
        >
          {data.label}
        </alc-header-action>
      );

      const alcSelectEvent = spyOnEvent('alc-select');

      const link = root.querySelector<HTMLAnchorElement>('[data-test-link]');
      assert.exists(link, 'O link não foi encontrado');

      await userEvent.keyboard('{Tab}')
      expect(document.activeElement).toBe(link);

      await userEvent.keyboard('{Enter}');
      await waitForChanges();
      expect(alcSelectEvent).toHaveReceivedEventTimes(1);

      await userEvent.keyboard('{Space}');
      await waitForChanges();
      expect(alcSelectEvent).toHaveReceivedEventTimes(2);
    });

  });

});
