import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-header-notifications.e2e.tsx

describe('alc-header-notifications', () => {

  describe('Renderização', () => {

    it('renderiza corretamente', async () => {
      const { root } = await render(
        <alc-header-notifications></alc-header-notifications>
      );

      expect(root).toBeTruthy();
      expect(root).toHaveClass('hydrated');
      // expect(root).toMatchSnapshot();
    });

  });

  describe('Interações do usuário', () => {

    it('dispara evento alc-click ao clicar no button', async () => {
      const { root, spyOnEvent, waitForChanges } = await render(
        <alc-header-notifications variant="button"></alc-header-notifications>
      );

      const alcClickSpy = spyOnEvent('alc-click');

      const button = root.querySelector('[data-test-button]');
      assert.exists(button, 'O button não foi encontrado');

      await userEvent.click(button);
      await waitForChanges();

      expect(alcClickSpy).toHaveReceivedEvent();
    });

    it('dispara evento alc-click ao clicar no link', async () => {
      const { root, spyOnEvent, waitForChanges } = await render(
        <alc-header-notifications variant="link" url="#notificacoes-link-test"></alc-header-notifications>
      );

      const alcClickSpy = spyOnEvent('alc-click');

      const link = root.querySelector('[data-test-link]');
      assert.exists(link, 'O link não foi encontrado');

      await userEvent.click(link);
      await waitForChanges();

      expect(alcClickSpy).toHaveReceivedEvent();
      expect(window.location.href).toContain('#notificacoes-link-test');
    });

    it('permite cancelar o comportamento padrão do evento', async () => {
      const { root, spyOnEvent, waitForChanges } = await render(
        <alc-header-notifications variant="link" url="#cancelar-evento-test"></alc-header-notifications>
      );

      root.addEventListener('alc-click', (event) => {
        event.preventDefault();
      });

      const alcClickSpy = spyOnEvent('alc-click');

      const link = root.querySelector('[data-test-link]');
      assert.exists(link, 'O link não foi encontrado');

      await userEvent.click(link);
      await waitForChanges();

      expect(alcClickSpy).toHaveReceivedEvent();
      expect(alcClickSpy.lastEvent?.defaultPrevented).toBeTruthy();
      expect(window.location.href).not.toContain('#cancelar-evento-test');
    });

  });

  // describe('Screenshot Tests', () => {

  //   it('screenshot - sem notificações', async () => {
  //     const { root } = await render(
  //       <alc-header-notifications notifications={0}></alc-header-notifications>
  //     );

  //     expect(root).toMatchScreenshot();
  //   });

  //   it('screenshot - com poucas notificações', async () => {
  //     const { root } = await render(
  //       <alc-header-notifications notifications={5}></alc-header-notifications>
  //     );

  //     expect(root).toMatchScreenshot();
  //   });

  //   it('screenshot - com overflow de notificações', async () => {
  //     const { root } = await render(
  //       <alc-header-notifications notifications={150}></alc-header-notifications>
  //     );

  //     expect(root).toMatchScreenshot();
  //   });

  //   it('screenshot - variante link', async () => {
  //     const { root } = await render(
  //       <alc-header-notifications variant="link" url="/notificacoes" notifications={10}></alc-header-notifications>
  //     );

  //     expect(root).toMatchScreenshot();
  //   });

  // });

});