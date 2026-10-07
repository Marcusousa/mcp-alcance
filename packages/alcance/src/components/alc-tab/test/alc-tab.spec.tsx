import { render, h, describe, it, expect, assert } from '@stencil/vitest';

// yarn stencil-test --project spec alc-tab.spec.tsx

describe('alc-tab', () => {
    it('Deve ter atributo tabindex quando não especificar content-focus', async () => {
      const { root } = await render(
        <alc-tab tab="tab-1">
            Conteudo do tab 1
        </alc-tab>
      );

      const tab = root.querySelector('[data-test-tab]');
      assert.exists(tab, 'O elemento com data-test-tab não foi encontrado');

      expect(tab.getAttribute('tabindex')).toBe('0');
    });

    it('Não deve ter atributo tabindex quando especificar content-focus', async () => {
      const { root } = await render(
        <alc-tab tab="tab-1" contentFocus={true}>
            Conteudo do tab 1
        </alc-tab>
      );

      const tab = root.querySelector('[data-test-tab]');
      assert.exists(tab, 'O elemento com data-test-tab não foi encontrado');
      
      expect(tab.getAttribute('tabindex')).toBeNull();
    });
  });
  