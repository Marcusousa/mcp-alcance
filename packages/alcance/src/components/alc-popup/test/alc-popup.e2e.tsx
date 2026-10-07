import { render, h, describe, it, expect, assert } from '@stencil/vitest';

describe('components/alc-popup', () => {
  describe('Renderização', () => {
    it('Deve renderizar corretamente ao abrir popup', async () => {
      const data = {
        triggerText: 'Trigger',
        contentText: 'Conteudo do popup'
      }

      const { root, setProps } = await render<HTMLAlcPopupElement>(
        <alc-popup>
          <div slot="anchor">
            <button class="alc-button">{data.triggerText}</button>
          </div>
          {data.contentText}
        </alc-popup>
      );

      const popupAnchor = root.querySelector<HTMLElement>('[data-test-popup-anchor]');
      const popupContent = root.querySelector<HTMLElement>('[data-test-popup-content]');

      assert.exists(popupAnchor, 'Âncora do popup não encontrada');
      assert.exists(popupContent, 'Conteúdo do popup não encontrado');

      expect(root.active).toBeFalsy();
      expect(popupAnchor).toEqualText(data.triggerText);
      expect(popupContent).not.toHaveClass('alc-popup__content--active');

      await setProps({ active: true });

      expect(root.active).toBeTruthy();
      expect(popupContent).toHaveClass('alc-popup__content--active');
      expect(popupContent).toEqualText(data.contentText);
    });

    it('Deve renderizar corretamente ao ativar o arrow', async () => {
      const { root } = await render<HTMLAlcPopupElement>(
        <alc-popup active={true} arrow={true}>
          <div slot="anchor">
            <button class="alc-button">Trigger</button>
          </div>
          Conteúdo do popup
        </alc-popup>
      );

      const popupArrow = root.querySelector<HTMLElement>('[data-test-popup-arrow]');
      assert.exists(popupArrow, 'Arrow do popup não encontrado');

      expect(root.active).toBeTruthy();
      expect(popupArrow).toHaveClass('alc-popup__arrow');
    });
  });
});
