import { render, h, describe, it, expect } from '@stencil/vitest';
import { setAppliedTheme, loadUserPreference, saveUserPreference, removeUserPreference, getAppliedTheme  } from '../theme';

// yarn stencil-test --project browser src/components/utils/test/theme.e2e.tsx

const
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system';


describe('components/utils/theme', () => {

  it('Deve aplicar o modo correto no HTML', async () => {
    setAppliedTheme(LIGHT);
    expect(document.documentElement.dataset['alcTheme']).toBe(LIGHT);

    setAppliedTheme(DARK);
    expect(document.documentElement.dataset['alcTheme']).toBe(DARK);
  });

  it('Deve salvar a preferência do usuário', async () => {
    removeUserPreference();
    saveUserPreference(LIGHT);
    expect(loadUserPreference()).toBe(LIGHT);
  });

  it('Deve remover a preferência do usuário', async () => {
    saveUserPreference(LIGHT);
    removeUserPreference();
    expect(loadUserPreference()).toBe(SYSTEM);
  });

  it('Deve obter o modo correto a ser aplicado', async () => {
    expect(getAppliedTheme(LIGHT)).toBe(LIGHT);
    expect(getAppliedTheme(DARK)).toBe(DARK);
    expect(getAppliedTheme(SYSTEM)).toMatch(new RegExp(`${LIGHT}|${DARK}`));
  });
});