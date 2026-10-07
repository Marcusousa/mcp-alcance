import { render, h, describe, it, expect, assert } from '@stencil/vitest';

describe('components/alc-modal', () => {
  describe('Renderização', () => {

    it('Deve obter os valores das propriedades do componente corretamente', async () => {
      const { root } = await render<HTMLAlcModalElement>(
        <alc-modal></alc-modal>
      );

      expect(root.open).toBeFalsy();
      expect(root.headerText).toBe('');
    });

    it('Deve obter o valor da propriedade open correto ao abrir e fechar', async () => {
      const { root, waitForChanges } = await render<HTMLAlcModalElement>(
        <alc-modal header-text="Exemplo de modal"></alc-modal>
      );

      expect(root.open).toBeFalsy();

      await root.show();
      await waitForChanges();
      expect(root.open).toBeTruthy();

      await root.hide();
      await waitForChanges();
      expect(root.open).toBeFalsy();
    });

    it('Deve ser possível fechar somente uma vez', async () => {
      const { root } = await render<HTMLAlcModalElement>(
        <alc-modal header-text="Exemplo de modal" open={true}></alc-modal>
      );

      let hide: boolean;

      hide = await root.hide();
      expect(hide).toBeTruthy();

      hide = await root.hide();
      expect(hide).toBeFalsy();
    });

    it('Deve ser possível abrir somente uma vez', async () => {
      const { root } = await render<HTMLAlcModalElement>(
        <alc-modal header-text="Exemplo de modal"></alc-modal>
      );

      let show: boolean;

      show = await root.show();
      expect(show).toBeTruthy();

      show = await root.show();
      expect(show).toBeFalsy();
    });
  });

  describe('Eventos', () => {
    it('Deve capturar o evento alc-after-show ao abrir a modal pelo método show()', async () => {
      const { root, spyOnEvent, waitForChanges } = await render<HTMLAlcModalElement>(
        <alc-modal header-text="Exemplo de modal"></alc-modal>
      );

      const afterShowEvent = spyOnEvent('alc-after-show');

      await root.show();
      await waitForChanges();

      expect(afterShowEvent).toHaveReceivedEvent();
    });

    it('Deve capturar o evento alc-after-show ao abrir a modal pela propriedade open', async () => {
      const { root, waitForChanges, spyOnEvent } = await render<HTMLAlcModalElement>(
        <alc-modal header-text="Exemplo de modal"></alc-modal>
      );

      const afterShowEvent = spyOnEvent('alc-after-show');

      root.setAttribute('open', 'true');
      await waitForChanges();

      expect(afterShowEvent).toHaveReceivedEvent();
    });

    it('Deve capturar os eventos na ordem esperada ao fechar a modal pelo método hide()', async () => {
      const { root, waitForChanges } = await render<HTMLAlcModalElement>(
        <alc-modal header-text="Exemplo de modal" open={true}></alc-modal>
      );

      const calls: string[] = [];
      root.addEventListener('alc-after-hide', () => calls.push('alc-after-hide'));
      root.addEventListener('alc-focus-after-hide', () => calls.push('alc-focus-after-hide'));

      await root.hide();
      await waitForChanges();

      expect(calls).toEqual(['alc-after-hide', 'alc-focus-after-hide']);
    });

    it('Deve capturar os eventos na ordem esperada ao fechar a modal pela propriedade open', async () => {
      const { root, waitForChanges } = await render<HTMLAlcModalElement>(
        <alc-modal header-text="Exemplo de modal" open={true}></alc-modal>
      );

      const calls: string[] = [];
      root.addEventListener('alc-after-hide', () => calls.push('alc-after-hide'));
      root.addEventListener('alc-focus-after-hide', () => calls.push('alc-focus-after-hide'));

      root.setAttribute('open', 'false');
      await waitForChanges();

      expect(calls).toEqual(['alc-after-hide', 'alc-focus-after-hide']);
    });

    it('Deve capturar os eventos na ordem esperada ao fechar a modal pela ação do usuário', async () => {
      const { root, waitForChanges } = await render<HTMLAlcModalElement>(
        <alc-modal header-text="Exemplo de modal" open={true}></alc-modal>
      );

      let calls: string[] = [];
      root.addEventListener('alc-hide', () => calls.push('alc-hide'));
      root.addEventListener('alc-after-hide', () => calls.push('alc-after-hide'));
      root.addEventListener('alc-focus-after-hide', () => calls.push('alc-focus-after-hide'));

      // Click fora (overlay)
      const overlay = root.querySelector<HTMLElement>('[data-test-overlay]');
      assert.exists(overlay, 'Overlay não encontrado');

      overlay.click();
      await waitForChanges();
      
      expect(calls).toEqual(['alc-hide', 'alc-after-hide', 'alc-focus-after-hide']);

      // Reseta e abre modal
      calls = [];
      await root.show();
      await waitForChanges();

      // Click no botão "x"
      const closeButton = root.querySelector<HTMLButtonElement>('[data-test-close-button]');
      assert.exists(closeButton, 'Botão de fechar não encontrado');

      closeButton.click();
      await waitForChanges();

      expect(calls).toEqual(['alc-hide', 'alc-after-hide', 'alc-focus-after-hide']);

      // Reseta e abre modal
      calls = [];
      await root.show();
      await waitForChanges();

      // Click no botão "fechar"
      const footerCloseButton = root.querySelector<HTMLButtonElement>('[data-test-footer-close-button]');
      assert.exists(footerCloseButton, 'Botão de fechar no footer não encontrado');

      footerCloseButton.click();
      await waitForChanges();

      expect(calls).toEqual(['alc-hide', 'alc-after-hide', 'alc-focus-after-hide']);

      // Reseta e abre modal
      calls = [];
      await root.show();
      await waitForChanges();
      
      // // Pressiona tecla ESC
      // document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      // await waitForChanges();
      // expect(calls).toEqual(['alc-hide', 'alc-after-hide', 'alc-focus-after-hide']);
    });

    it('Deve disparar apenas o evento "alc-hide" quando cancelado ao fechar a modal', async () => {
      const { root, waitForChanges, spyOnEvent } = await render<HTMLAlcModalElement>(
        <alc-modal header-text="Exemplo de modal" open={true}></alc-modal>
      );

      await root.show();
      await waitForChanges();

      const hideEvent = spyOnEvent('alc-hide');
      const afterHideEvent = spyOnEvent('alc-after-hide');
      const focusAfterHideEvent = spyOnEvent('alc-focus-after-hide');

      root.addEventListener('alc-hide', (event) => {
        event.preventDefault();
      });

      // Click no botão "x"
      (root.querySelector('[data-test-close-button]') as HTMLButtonElement).click();
      await waitForChanges();

      expect(hideEvent).toHaveReceivedEvent();
      expect(afterHideEvent).not.toHaveReceivedEvent();
      expect(focusAfterHideEvent).not.toHaveReceivedEvent();
    });

    it('Deve disparar os eventos com valor do detail correto ao fechar a modal pela ação do usuário', async () => {
      const { root, waitForChanges, spyOnEvent } = await render<HTMLAlcModalElement>(
        <alc-modal header-text="Exemplo de modal" open={true}></alc-modal>
      );

      const hideEvent = spyOnEvent('alc-hide');

      // Click fora (overlay)
      const overlay = root.querySelector<HTMLElement>('[data-test-overlay]');
      assert.exists(overlay, 'Overlay não encontrado');

      overlay.click();
      await waitForChanges();

      expect(hideEvent.lastEvent?.detail.from).toBe('overlay');

      // Reseta e abre modal
      await root.show();
      await waitForChanges();

      // Click no botão "x"
      const headerCloseButton = root.querySelector<HTMLButtonElement>('[data-test-close-button]');
      assert.exists(headerCloseButton, 'Botão de fechar no header não encontrado');

      headerCloseButton.click();
      await waitForChanges();
      expect(hideEvent.lastEvent?.detail.from).toBe('header-button');

      // Reseta e abre modal
      await root.show();
      await waitForChanges();

      // Click no botão "fechar"
      const footerCloseButton = root.querySelector<HTMLButtonElement>('[data-test-footer-close-button]');
      assert.exists(footerCloseButton, 'Botão de fechar no footer não encontrado');

      footerCloseButton.click();
      await waitForChanges();
      expect(hideEvent.lastEvent?.detail.from).toBe('footer-button');

      // Reseta e abre modal
      await root.show();
      await waitForChanges();
      
      // O teste de fechar com a tecla ESC foi movido para e2e
    });

    it('Deve impedir o foco automatico e focar no elemento especificado após fechar a modal', async () => {
      const { root, waitForChanges } = await render(
        <div>
          <button data-test-initial>Foco antes de abrir</button>
          <button data-test-final>Foco após fechar</button>
          <alc-modal header-text="Exemplo de modal"></alc-modal>
        </div>
      );

      const modal = root.querySelector<HTMLAlcModalElement>('alc-modal');
      assert.exists(modal, 'Modal não encontrada');

      const buttonInitial = root.querySelector<HTMLButtonElement>('[data-test-initial]');
      assert.exists(buttonInitial, 'Botão inicial não encontrado');

      const buttonFinal = root.querySelector<HTMLButtonElement>('[data-test-final]');
      assert.exists(buttonFinal, 'Botão final não encontrado');

      let activeElement = null;

      // Escuta o evento focus para verificar em qual elemento foi focado
      document.addEventListener('focus', event => activeElement = event.target, true);

      document.addEventListener('alc-focus-after-hide', event => {
        event.preventDefault();
        buttonFinal.focus();
      });

      // Foco vai no botão data-test-initial
      buttonInitial.focus();
      expect(activeElement).toBe(buttonInitial);

      // Abre modal
      await modal.show();
      await waitForChanges();

      // Fecha modal
      await modal.hide();
      await waitForChanges();

      // Foco vai no botão data-test-final
      expect(activeElement).toBe(buttonFinal);
    });
  });
});
