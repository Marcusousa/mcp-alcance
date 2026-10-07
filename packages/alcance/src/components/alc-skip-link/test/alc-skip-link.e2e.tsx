import { render, h, describe, it, expect } from '@stencil/vitest';

describe('alc-skip-link', () => {
  it('Deve renderizar corretamente', async () => {
    const { root } = await render(
      <alc-skip-link anchor="main-content">
        conteúdo
      </alc-skip-link>
    );
    expect(root).toHaveClass('hydrated');

    // Uma forma encontrada de verificar se está sr-only
    const sizeBefore = window.getComputedStyle(root);
    expect(sizeBefore.width).toEqual('1px');
    expect(sizeBefore.height).toEqual('1px');
  });

  it('Deve aparecer ao receber foco', async () => {
    const { root, waitForChanges } = await render(
      <alc-skip-link anchor="main-content">
        conteúdo
      </alc-skip-link>
    );

    const link = root.querySelector('[data-test-link]') as HTMLElement | null;
    link?.focus();

    await waitForChanges();

    // Uma forma encontrada de verificar se não está mais com sr-only
    // Pega width e height computados e remove a unidade (px) para transformar em número
    const sizeAfter = window.getComputedStyle(root);
    const width = Number.parseInt(sizeAfter.width.slice(0, -2));
    const height = Number.parseInt(sizeAfter.height.slice(0, -2));
    expect(width > 1).toBeTruthy();
    expect(height > 1).toBeTruthy();

  });
});

