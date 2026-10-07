import { render, h, describe, it, expect, assert } from '@stencil/vitest';

// yarn stencil-test --project spec alc-tab-button.spec.tsx

describe('alc-tab-button', () => {
  it('mostra o texto do botão no lugar certo', async () => {
    const CONTENT = 'Nome da aba';

    const { root } = await render<HTMLAlcTabButtonElement>(
      <alc-tab-button tab="tab-1">
        {CONTENT}
      </alc-tab-button>
    );

    const button = root.querySelector('[data-test-button]');
    assert.exists(button, 'Botão não encontrado');

    expect(button).toEqualText(CONTENT);
  });
});