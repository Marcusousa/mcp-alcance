import { render, h, describe, it, expect } from '@stencil/vitest';

describe('alc-input-file', () => {
  it('Define role="presentation" e não inclui aria-label quando label=""', async () => {
    const { root } = await render(
      <alc-icon name="heart" label=""></alc-icon>
    );

    expect(root).toEqualAttribute('role', 'presentation');
    expect(root).not.toHaveAttribute('aria-label');
  });

  it('Define role="img" e inclui aria-label quando label é preenchido', async () => {
    const { root } = await render(
      <alc-icon name="heart" label="teste"></alc-icon>
    );

    expect(root).toEqualAttribute('role', 'img');
    expect(root).toEqualAttribute('aria-label', 'teste');
  });

  it('Responde dinamicamente à alteração de label', async () => {
    const { root, waitForChanges, setProps } = await render(
      <alc-icon name="heart" label="teste"></alc-icon>
    );

    // Troca o valor de label
    setProps({ label: '' });
    await waitForChanges();
    expect(root).toEqualAttribute('role', 'presentation');
    expect(root).not.toHaveAttribute('aria-label');

    // Troca novamente o valor de label
    setProps({ label: 'teste' });
    await waitForChanges();
    expect(root).toEqualAttribute('role', 'img');
    expect(root).toEqualAttribute('aria-label', 'teste');
  });
});