import { render, h, describe, it, expect, assert, afterEach } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-menu-item-theme.e2e.tsx

const THEME = {
  DARK: 'dark',
  LIGHT: 'light',
};

describe('alc-menu-item-theme', () => {
  afterEach(() => {
    localStorage.removeItem('alc-theme');
  });

  it('Deve renderizar corretamente', async () => {
    const { root } = await render(
      <alc-menu-item-theme></alc-menu-item-theme>
    );

    const menuItem = root.querySelector('alc-menu-item');
    assert.exists(menuItem, 'O alc-menu-item não foi encontrado');

    expect(menuItem.getAttribute('type')).toBe('checkbox');
    expect(menuItem.getAttribute('role')).toBe('menuitemcheckbox');
    expect(menuItem).toHaveAttribute('aria-checked');
    expect(menuItem.textContent.trim()).toContain('Ver no tema escuro');
  });

  it('Deve alternar os temas corretamente e atualizar o localStorage', async () => {
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

    // Estado inicial: sistema claro por padrão → checked = false
    expect(menuItem.getAttribute('aria-checked')).toBe('false');
    expect(localStorage.getItem('alc-theme')).toBeNull();

    // Clique: claro → escuro
    await userEvent.click(menuItem);
    await waitForChanges();

    expect(menuItem.getAttribute('aria-checked')).toBe('true');
    expect(localStorage.getItem('alc-theme')).toBe(THEME.DARK);
    expect(selectSpy).toHaveReceivedEvent();
    expect(selectSpy.lastEvent?.detail.theme).toBe(THEME.DARK);

    // Clique: escuro → claro
    await userEvent.click(menuItem);
    await waitForChanges();

    expect(menuItem.getAttribute('aria-checked')).toBe('false');
    expect(localStorage.getItem('alc-theme')).toBe(THEME.LIGHT);
    expect(selectSpy).toHaveReceivedEvent();
    expect(selectSpy.lastEvent?.detail.theme).toBe(THEME.LIGHT);
  });
});
