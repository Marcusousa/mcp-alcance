import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-tabs.visual.e2e.tsx
// yarn stencil-test --project dark alc-tabs.visual.e2e.tsx

/**
 * alc-tabs em si não tem nenhuma classe do grupo Espaçamento (só declara custom properties —
 * ver roteiro/log), mas vale como regressão visual geral: compõe alc-tab-button, alc-tab e
 * alc-scroll-panel, que têm classes migradas.
 * A captura mira a div interna (.alc-tabs), não o host: mesmo caso do alc-user/alc-table —
 * o host não tem "display: block" definido.
 */
const contentTabs = () => (
  <div>
    <a data-test-before href="#" class="alc-link">Foco anterior</a>
    <alc-tabs data-test-tabs>
      <alc-tab-button slot="button" tab="tab-1">Lion-O</alc-tab-button>
      <alc-tab-button slot="button" tab="tab-2">Panthro</alc-tab-button>
      <alc-tab-button slot="button" tab="tab-3">Cheetara</alc-tab-button>

      <alc-tab tab="tab-1"><p>Líder dos ThunderCats.</p></alc-tab>
      <alc-tab tab="tab-2"><p>O mais forte do grupo.</p></alc-tab>
      <alc-tab tab="tab-3"><p>Guerreira mais veloz do grupo.</p></alc-tab>
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

describe('alc-tabs', () => {

  // Deve capturar screenshot com a primeira aba selecionada por padrão
  it('padrão', async () => {
    const { root, waitForChanges } = await render(contentTabs());

    const tabs = root.querySelector<HTMLAlcTabsElement>('[data-test-tabs]');
    assert.exists(tabs, 'O alc-tabs não foi encontrado');

    const box = tabs.querySelector<HTMLElement>('.alc-tabs');
    assert.exists(box, 'A caixa interna do alc-tabs não foi encontrada');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    expect(tabs.selected).toBe('tab-1');

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(box).toMatchScreenshot();
  });

  // Deve capturar screenshot depois de clicar na segunda aba
  it('segunda aba selecionada', async () => {
    const { root, waitForChanges } = await render(contentTabs());

    const tabs = root.querySelector<HTMLAlcTabsElement>('[data-test-tabs]');
    assert.exists(tabs, 'O alc-tabs não foi encontrado');

    const box = tabs.querySelector<HTMLElement>('.alc-tabs');
    assert.exists(box, 'A caixa interna do alc-tabs não foi encontrada');

    const botoes = tabs.querySelectorAll<HTMLAlcTabButtonElement>('alc-tab-button');
    const segundoBotao = botoes[1].querySelector<HTMLButtonElement>('[data-test-button]');
    assert.exists(segundoBotao, 'O segundo botão da aba não foi encontrado');

    await userEvent.click(segundoBotao);
    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    expect(tabs.selected).toBe('tab-2');

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(box).toMatchScreenshot();
  });

  // Deve capturar screenshot do botão da aba ativa em estado de hover
  it('padrão com hover no botão', async () => {
    const { root, waitForChanges } = await render(contentTabs());

    const tabs = root.querySelector<HTMLAlcTabsElement>('[data-test-tabs]');
    assert.exists(tabs, 'O alc-tabs não foi encontrado');

    const box = tabs.querySelector<HTMLElement>('.alc-tabs');
    assert.exists(box, 'A caixa interna do alc-tabs não foi encontrada');

    const primeiroBotao = tabs.querySelector<HTMLButtonElement>('alc-tab-button [data-test-button]');
    assert.exists(primeiroBotao, 'O botão da primeira aba não foi encontrado');

    await waitForChanges();

    await userEvent.hover(primeiroBotao);
    await aguardaFontes();

    await expect(box).toMatchScreenshot();
  });

  // Deve capturar screenshot do botão da aba ativa em estado de foco por teclado
  it('padrão com foco no botão', async () => {
    const { root, waitForChanges } = await render(contentTabs());

    const tabs = root.querySelector<HTMLAlcTabsElement>('[data-test-tabs]');
    assert.exists(tabs, 'O alc-tabs não foi encontrado');

    const box = tabs.querySelector<HTMLElement>('.alc-tabs');
    assert.exists(box, 'A caixa interna do alc-tabs não foi encontrada');

    const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
    assert.exists(before, 'Link anterior não encontrado');

    await waitForChanges();

    // Foca o elemento anterior e tabula: só assim o navegador entra em modalidade de
    // teclado e aplica o :focus-visible — um focus() direto não garante isso.
    before.focus();
    await userEvent.keyboard('{Tab}');
    await waitForChanges();

    await aguardaFontes();

    await expect(box).toMatchScreenshot();
  });

});
