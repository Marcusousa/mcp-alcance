import { render, h, describe, it, expect } from '@stencil/vitest';

// yarn stencil-test --project spec alc-loading.spec.tsx

describe('alc-loading', () => {
  it('Deve obter o valor da propriedade active corretamente', async () => {
    const { root, waitForChanges } = await render<HTMLAlcLoadingElement>(
      <alc-loading></alc-loading>
    );

    expect(root.active).toBeFalsy();

    await root.show();
    await waitForChanges();
    expect(root.active).toBeTruthy();

    await root.hide();
    await waitForChanges();
    expect(root.active).toBeFalsy();
  });

  it('Deve ser possível fechar somente uma vez', async () => {
    const { root } = await render<HTMLAlcLoadingElement>(
      <alc-loading active={true}></alc-loading>
    );

    let hide: boolean;

    hide = await root.hide();
    expect(hide).toBeTruthy();

    hide = await root.hide();
    expect(hide).toBeFalsy();
  });

  it('Deve ser possível abrir somente uma vez', async () => {
    const { root } = await render<HTMLAlcLoadingElement>(
      <alc-loading></alc-loading>
    );

    let show: boolean;

    show = await root.show();
    expect(show).toBeTruthy();

    show = await root.show();
    expect(show).toBeFalsy();
  });
});
