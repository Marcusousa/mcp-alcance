import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-radio.visual.e2e.tsx
// yarn stencil-test --project dark alc-radio.visual.e2e.tsx

/**
 * alc-radio não renderiza o <input> internamente — espera receber um via slot padrão
 * (componentWillLoad busca input[type="radio"] no light DOM e quebra se não achar).
 */
const contentRadio = (props: Record<string, unknown> = {}) => (
  <div>
    <a data-test-before href="#" class="alc-link">Foco anterior</a>
    <alc-radio data-test-radio label="Opção 1" {...props}>
      <input type="radio" name="grupo-teste" value="1" />
    </alc-radio>
  </div>
);

/**
 * As fontes do design system são carregadas de forma assíncrona.
 * Capturar antes de estarem prontas gera imagens com a fonte de fallback.
 */
const aguardaFontes = () => document.fonts.ready;

/**
 * Afasta o ponteiro do componente, deixando-o sobre o link anterior.
 */
const afastaPonteiro = (root: HTMLElement) => {
  const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
  assert.exists(before, 'Link anterior não encontrado');

  return userEvent.hover(before);
};

describe('alc-radio', () => {

  // Deve capturar screenshot do padrão, desmarcado
  it('padrão', async () => {
    const { root, waitForChanges } = await render(contentRadio());

    const radio = root.querySelector<HTMLAlcRadioElement>('[data-test-radio]');
    assert.exists(radio, 'O alc-radio não foi encontrado');

    await waitForChanges();

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(radio).toMatchScreenshot();
  });

  // Deve capturar screenshot com texto de dica
  it('com dica', async () => {
    const { root, waitForChanges } = await render(contentRadio({ hint: 'Escolha uma opção.' }));

    const radio = root.querySelector<HTMLAlcRadioElement>('[data-test-radio]');
    assert.exists(radio, 'O alc-radio não foi encontrado');

    await waitForChanges();

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(radio).toMatchScreenshot();
  });

  // Deve capturar screenshot com mensagem de erro
  it('com erro', async () => {
    const { root, waitForChanges } = await render(contentRadio({ errorMsg: 'Selecione uma opção.' }));

    const radio = root.querySelector<HTMLAlcRadioElement>('[data-test-radio]');
    assert.exists(radio, 'O alc-radio não foi encontrado');

    await waitForChanges();

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(radio).toMatchScreenshot();
  });

  // Deve capturar screenshot marcado (accent-color diferente do desmarcado)
  it('marcado', async () => {
    const { root, waitForChanges } = await render(contentRadio());

    const radio = root.querySelector<HTMLAlcRadioElement>('[data-test-radio]');
    assert.exists(radio, 'O alc-radio não foi encontrado');

    const input = radio.querySelector<HTMLInputElement>('input[type="radio"]');
    assert.exists(input, 'O input não foi encontrado');
    input.checked = true;
    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    expect(input.checked).toBe(true);

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(radio).toMatchScreenshot();
  });

  // Deve capturar screenshot do input em estado de hover
  it('com hover', async () => {
    const { root, waitForChanges } = await render(contentRadio());

    const radio = root.querySelector<HTMLAlcRadioElement>('[data-test-radio]');
    assert.exists(radio, 'O alc-radio não foi encontrado');

    const input = radio.querySelector<HTMLInputElement>('input[type="radio"]');
    assert.exists(input, 'O input não foi encontrado');

    await waitForChanges();

    await userEvent.hover(input);
    await aguardaFontes();

    await expect(radio).toMatchScreenshot();
  });

  // Deve capturar screenshot do input em estado de foco por teclado (outline com offset)
  it('com foco', async () => {
    const { root, waitForChanges } = await render(contentRadio());

    const radio = root.querySelector<HTMLAlcRadioElement>('[data-test-radio]');
    assert.exists(radio, 'O alc-radio não foi encontrado');

    const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
    assert.exists(before, 'Link anterior não encontrado');

    await waitForChanges();

    // Foca o elemento anterior e tabula: só assim o navegador entra em modalidade de
    // teclado e aplica o :focus-visible — um focus() direto não garante isso.
    before.focus();
    await userEvent.keyboard('{Tab}');
    await waitForChanges();

    const input = radio.querySelector<HTMLInputElement>('input[type="radio"]');
    assert.exists(input, 'O input não foi encontrado');
    assert.strictEqual(document.activeElement, input, 'O input não recebeu o foco');

    await aguardaFontes();

    await expect(radio).toMatchScreenshot();
  });

});
