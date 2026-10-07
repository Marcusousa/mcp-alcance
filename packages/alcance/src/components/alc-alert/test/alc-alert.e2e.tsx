import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-alert.e2e.tsx

describe('alc-alert', () => {
  it('renderiza', async () => {
    const { root } = await render<HTMLAlcAlertElement>(
      <alc-alert></alc-alert>
    );

    expect(root).toHaveClass('hydrated');
    // expect(root).toMatchScreenshot();
  });

  it('fica invisível ao ser dispensado (clicando)', async () => {
    const { root, waitForChanges } = await render<HTMLAlcAlertElement>(
      <alc-alert>Mensagem</alc-alert>
    );

    const dismiss = root.querySelector<HTMLElement>('[data-test-dismiss]');
    assert.exists(dismiss, 'Botão de dispensar não encontrado');

    // Simula o click no botão
    await userEvent.click(dismiss);
    await waitForChanges();

    // Espera que não esteja visível
    expect(root.checkVisibility()).toBeFalsy();
  });

  it('fica invisível ao ser dispensado (método hide)', async () => {
    const { root, waitForChanges } = await render<HTMLAlcAlertElement>(
      <alc-alert>Mensagem</alc-alert>
    );

    const hide = root.hide();
    await waitForChanges();

    expect(hide).toBeTruthy();
    expect(root.checkVisibility()).toBeFalsy();
  });

  it('volta a ficar visível ao ser solicitado (método show)', async () => {
    const { root, waitForChanges } = await render<HTMLAlcAlertElement>(
      <alc-alert>Mensagem</alc-alert>
    );

    await root.hide(); // Esconde
    await waitForChanges();

    const shown = await root.show(); // Pede para mostrar de novo
    await waitForChanges();

    expect(shown).toBeTruthy();
    expect(root.checkVisibility()).toBeTruthy();
  });
});
