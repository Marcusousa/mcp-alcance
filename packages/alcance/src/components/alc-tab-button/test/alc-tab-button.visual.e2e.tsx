import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-tab-button.visual.e2e.tsx
// yarn stencil-test --project dark alc-tab-button.visual.e2e.tsx

/**
 * alc-tab-button consome custom properties (--bg-color, --border-color, --outline-color etc.)
 * definidas em alc-tabs — precisa desse ancestral pra renderizar corretamente, mesmo testando
 * o botão isoladamente. alc-tabs seleciona a primeira aba (tab-1) automaticamente, então o
 * primeiro botão já nasce "ativo" e o segundo "inativo" — cobre os dois estados sem precisar
 * de interação extra.
 */
const contentTabButton = () => (
  <div>
    <a data-test-before href="#" class="alc-link">Foco anterior</a>
    <alc-tabs>
      <alc-tab-button slot="button" tab="tab-1" data-test-ativo>Ativo</alc-tab-button>
      <alc-tab-button slot="button" tab="tab-2" data-test-inativo>Inativo</alc-tab-button>
      <alc-tab tab="tab-1"><p>Conteúdo 1</p></alc-tab>
      <alc-tab tab="tab-2"><p>Conteúdo 2</p></alc-tab>
    </alc-tabs>
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

describe('alc-tab-button', () => {

  // Deve capturar screenshot do botão ativo (padding menor, borda superior)
  it('ativo', async () => {
    const { root, waitForChanges } = await render(contentTabButton());

    const botao = root.querySelector<HTMLAlcTabButtonElement>('[data-test-ativo]');
    assert.exists(botao, 'O botão ativo não foi encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    expect(botao.selected).toBe(true);

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(botao).toMatchScreenshot();
  });

  // Deve capturar screenshot do botão inativo (padding maior, sem borda superior)
  it('inativo', async () => {
    const { root, waitForChanges } = await render(contentTabButton());

    const botao = root.querySelector<HTMLAlcTabButtonElement>('[data-test-inativo]');
    assert.exists(botao, 'O botão inativo não foi encontrado');

    await waitForChanges();

    expect(botao.selected).toBeFalsy();

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(botao).toMatchScreenshot();
  });

  // Deve capturar screenshot do botão inativo em estado de hover (muda a cor de fundo)
  it('inativo com hover', async () => {
    const { root, waitForChanges } = await render(contentTabButton());

    const botao = root.querySelector<HTMLAlcTabButtonElement>('[data-test-inativo]');
    assert.exists(botao, 'O botão inativo não foi encontrado');

    await waitForChanges();

    await userEvent.hover(botao);
    await aguardaFontes();

    await expect(botao).toMatchScreenshot();
  });

  // Deve capturar screenshot do botão ativo em estado de foco por teclado (outline-offset
  // negativo). Só o botão ativo é alcançável por Tab (tabindex em roving, padrão ARIA tabs) —
  // o inativo só é alcançável via setas depois que o foco já está na lista, não testado aqui.
  it('ativo com foco', async () => {
    const { root, waitForChanges } = await render(contentTabButton());

    const botao = root.querySelector<HTMLAlcTabButtonElement>('[data-test-ativo]');
    assert.exists(botao, 'O botão ativo não foi encontrado');

    const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
    assert.exists(before, 'Link anterior não encontrado');

    await waitForChanges();

    // Foca o elemento anterior e tabula: só assim o navegador entra em modalidade de
    // teclado e aplica o :focus-visible — um focus() direto não garante isso.
    before.focus();
    await userEvent.keyboard('{Tab}');
    await waitForChanges();

    await aguardaFontes();

    await expect(botao).toMatchScreenshot();
  });

});
