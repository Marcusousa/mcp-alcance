import { render, h, describe, it, expect } from '@stencil/vitest';

describe('alc-skip-link', () => {
  it('Deve renderizar corretamente', async () => {
    const to = 'destino';
    const { root } = await render(
      <alc-skip-link anchor={to}>{to}</alc-skip-link>
    );

    const link = root.querySelector('[data-test-link]');
    expect(link).toEqualAttribute('href', `#${to}`);
    expect(link).toEqualText(`Ir para ${to}`);
  });
});