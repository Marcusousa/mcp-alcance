import { render, h, describe, it, expect, assert } from '@stencil/vitest';

// yarn stencil-test --project browser alc-tab.e2e.tsx

describe('alc-tab', () => {
  it('Deve estar visível o tab com o atributo "selected"', async () => {
    const { root } = await render(
      <alc-tab tab="tab-1" selected={true}>
        Conteudo do tab 1
      </alc-tab>
    );

    const tab = root.querySelector<HTMLElement>('[data-test-tab]');
    assert.exists(tab, 'O elemento com data-test-tab não foi encontrado');

    expect(tab.checkVisibility()).toBeTruthy();
    expect(tab).not.toHaveAttribute('hidden');
    expect(getComputedStyle(tab).display).toBe('block');
  });

  it('Deve estar escondido o tab sem o atributo "selected"', async () => {
    const { root } = await render(
      <alc-tab tab="tab-1">
        Conteudo do tab 1
      </alc-tab>
    );

    const tab = root.querySelector<HTMLElement>('[data-test-tab]');
    assert.exists(tab, 'O elemento com data-test-tab não foi encontrado');
    
    expect(tab.checkVisibility()).toBeFalsy();
    expect(tab).toHaveAttribute('hidden');
    expect(getComputedStyle(tab).display).toBe('none');
  });
});