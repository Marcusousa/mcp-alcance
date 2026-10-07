import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-breadcrumb-item.e2e.tsx

// Hash URL (navega sem sair da página): Usar #exemplo-url como URL. A hash muda window.location.href sem causar navegação real
const data = {
  url: '#exemplo-url',
  label: 'exemplo-label',
};

describe('alc-breadcrumb-item', () => {
  it('Deve navegar ao clicar no link', async () => {
    const { root, waitForChanges } = await render(
      <alc-breadcrumb-item url={data.url} label={data.label}></alc-breadcrumb-item>
    );

    const link = root.querySelector<HTMLAnchorElement>('[data-test-link]');
    assert.exists(link, 'O link não foi encontrado');

    expect(link.getAttribute('href')).toBe(data.url);
    expect(window.location.href).not.toContain(data.url);

    await userEvent.click(link);
    await waitForChanges();

    expect(window.location.href).toContain(data.url);
  });
});
