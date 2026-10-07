import { render, h, describe, it, expect, assert } from '@stencil/vitest';

// yarn stencil-test --project spec alc-theme.spec.tsx

describe('alc-theme', () => {
  it('Possui label associado ao select', async() => {

    const { root } = await render<HTMLAlcThemeElement>(
      <alc-theme></alc-theme>
    );

    const label = root.querySelector('[data-test-label]');
    assert.exists(label, "Label não encontrado");

    const select = root.querySelector('[data-test-select]');
    assert.exists(select, "Select não encontrado");

    // Label não pode ser vazio
    expect(label.textContent.trim()).not.toEqual('');
    // Label deve estar associado ao select
    expect(label.getAttribute('for')?.trim()).toBeTruthy();
    expect(select.getAttribute('id')?.trim()).toBeTruthy();
    expect(label.getAttribute('for')).toBe(select.getAttribute('id'));
  });
});
