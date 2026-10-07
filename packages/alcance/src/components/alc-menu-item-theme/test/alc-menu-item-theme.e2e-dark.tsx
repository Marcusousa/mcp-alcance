import { render, h, describe, it, expect, assert, afterEach } from '@stencil/vitest';
import { userEvent,  } from 'vitest/browser';

// yarn stencil-test --project dark alc-menu-item-theme.e2e-dark.tsx

const THEME = {
  DARK: 'dark',
  LIGHT: 'light',
};

describe('alc-menu-item-theme', () => {
  afterEach(() => {
    localStorage.removeItem('alc-theme');
  });

  it('Deve alternar corretamente o tema e atualizar o localStorage - Dark', async () => {
    // O wrapper div garante que spyOnEvent capture apenas o alc-select re-emitido
    // por alc-menu-item-theme (o evento original de alc-menu-item é parado com stopPropagation)
    const { root, waitForChanges, spyOnEvent } = await render(
      <div>
        <alc-menu-item-theme></alc-menu-item-theme>
      </div>
    );

    const menuItem = root.querySelector('alc-menu-item');
    assert.exists(menuItem, 'O alc-menu-item não foi encontrado');

    const selectSpy = spyOnEvent('alc-select');

    // Espera-se que o tema seja dark (checked="true") e o localStorage esteja vazio
    expect(menuItem.getAttribute('aria-checked')).toBe('true');
    expect(localStorage.getItem('alc-theme')).toBeNull();

    // Clique: escuro → claro
    await userEvent.click(menuItem);
    await waitForChanges();

    expect(menuItem.getAttribute('aria-checked')).toBe('false');
    expect(localStorage.getItem('alc-theme')).toBe(THEME.LIGHT);
    expect(selectSpy).toHaveReceivedEvent();
    expect(selectSpy.lastEvent?.detail.theme).toBe(THEME.LIGHT);

    // Clique: claro → escuro
    await userEvent.click(menuItem);
    await waitForChanges();

    expect(menuItem.getAttribute('aria-checked')).toBe('true');
    expect(localStorage.getItem('alc-theme')).toBe(THEME.DARK);
    expect(selectSpy).toHaveReceivedEvent();
    expect(selectSpy.lastEvent?.detail.theme).toBe(THEME.DARK);
  });

  it('Deve alternar o tema de escuro para claro e atualizar o localStorage', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(
      <div>
        <alc-menu-item-theme></alc-menu-item-theme>
      </div>
    );

    const menuItem = root.querySelector('alc-menu-item');
    assert.exists(menuItem, 'O alc-menu-item não foi encontrado');

    // Espiona o evento a partir deste ponto
    const selectSpy = spyOnEvent('alc-select');

    // Clique: escuro → claro
    await userEvent.click(menuItem);
    await waitForChanges();

    expect(menuItem.getAttribute('aria-checked')).toBe('false');
    expect(localStorage.getItem('alc-theme')).toBe(THEME.LIGHT);
    expect(selectSpy).toHaveReceivedEvent();
    expect(selectSpy.lastEvent?.detail.theme).toBe(THEME.LIGHT);
  });
});
