import { render, h, describe, it, expect, assert, vi } from '@stencil/vitest';

// yarn stencil-test --project spec alc-scroll-panel.spec.tsx

global.MutationObserver = class {
  observe = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn();
  constructor(_callback: MutationCallback) {}
};

describe('alc-scroll-panel', () => {

  it('mostra o texto do conteúdo no lugar certo', async () => {
    const CONTENT = 'Texto do conteúdo';

    const { root } = await render<HTMLAlcScrollPanelElement>(
      <alc-scroll-panel>
        {CONTENT}
      </alc-scroll-panel>
    );

    const content = root.querySelector('[data-test-content]');
    assert.exists(content, 'Conteúdo não encontrado')

    expect(content).toEqualText(CONTENT);
  });
});