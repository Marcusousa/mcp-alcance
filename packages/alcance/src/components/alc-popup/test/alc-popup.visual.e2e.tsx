import { render, h, describe, it, expect, assert } from '@stencil/vitest';

// yarn stencil-test --project browser alc-popup.visual.e2e.tsx
// yarn stencil-test --project dark alc-popup.visual.e2e.tsx

/**
 * top-0/left-0 (as únicas classes do grupo Espaçamento — ver roteiro/log) só valem como
 * posição INICIAL do conteúdo, antes do floating-ui (reposition()) sobrescrever left/top
 * via style inline assim que o popup fica ativo — na prática nunca ficam visíveis depois de
 * ativo, e são valores zero de qualquer forma (sem diferença visual possível na migração).
 * Por isso o teste captura o estado já posicionado (o que o usuário real veria), sem tentar
 * congelar o instante intermediário antes do reposicionamento.
 * O padding no contêiner dá espaço pro popup (position:absolute/fixed) não ser cortado.
 */
const contentPopup = (props: Record<string, unknown> = {}) => (
  <div style={{ padding: '56px' }}>
    <alc-popup data-test-popup active placement="bottom" {...props}>
      <button slot="anchor" class="alc-button alc-button--secondary">Âncora</button>
      <div style={{ background: 'white', border: '1px solid #ccc', padding: '8px' }}>
        Conteúdo do popup
      </div>
    </alc-popup>
  </div>
);

/**
 * As fontes do design system são carregadas de forma assíncrona.
 * Capturar antes de estarem prontas gera imagens com a fonte de fallback.
 */
const aguardaFontes = () => document.fonts.ready;

describe('alc-popup', () => {

  // Deve capturar screenshot do popup ativo, posicionado embaixo da âncora (padrão)
  it('ativo', async () => {
    const { root, waitForChanges } = await render(contentPopup());

    const popup = root.querySelector<HTMLAlcPopupElement>('[data-test-popup]');
    assert.exists(popup, 'O alc-popup não foi encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const content = popup.querySelector('[data-test-popup-content]');
    assert.exists(content, 'O conteúdo do popup não foi encontrado');
    expect(content).toHaveClass('alc-popup__content--active');

    await aguardaFontes();

    await expect(root).toMatchScreenshot();
  });

  // Deve capturar screenshot do popup com seta
  it('com seta', async () => {
    const { root, waitForChanges } = await render(contentPopup({ arrow: true }));

    const popup = root.querySelector<HTMLAlcPopupElement>('[data-test-popup]');
    assert.exists(popup, 'O alc-popup não foi encontrado');

    await waitForChanges();

    const arrowEl = popup.querySelector('[data-test-popup-arrow]');
    assert.exists(arrowEl, 'A seta não foi encontrada');
    expect(arrowEl).toHaveClass('alc-popup__arrow');

    await aguardaFontes();

    await expect(root).toMatchScreenshot();
  });

  // Deve capturar screenshot do popup com strategy="fixed"
  it('estratégia fixed', async () => {
    const { root, waitForChanges } = await render(contentPopup({ strategy: 'fixed' }));

    const popup = root.querySelector<HTMLAlcPopupElement>('[data-test-popup]');
    assert.exists(popup, 'O alc-popup não foi encontrado');

    await waitForChanges();

    const content = popup.querySelector('[data-test-popup-content]');
    assert.exists(content, 'O conteúdo do popup não foi encontrado');
    expect(content).toHaveClass('alc-popup__content--fixed');

    await aguardaFontes();

    await expect(root).toMatchScreenshot();
  });

});
