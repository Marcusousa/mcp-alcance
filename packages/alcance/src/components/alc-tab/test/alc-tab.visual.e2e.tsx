import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-tab.visual.e2e.tsx
// yarn stencil-test --project dark alc-tab.visual.e2e.tsx

/**
 * alc-tab consome custom properties (--bg-color, --border-color, --border-width,
 * --outline-color) definidas em alc-tabs — precisa desse ancestral pra renderizar
 * corretamente, mesmo testando o componente isoladamente (mesmo caso do alc-tab-button).
 * Uma única aba: alc-tabs seleciona a primeira automaticamente, então já nasce visível —
 * não há um caso "inativo" que valha a pena capturar (fica hidden/display:none, nada a ver).
 */
const contentTab = () => (
  <div>
    <a data-test-before href="#" class="alc-link">Foco anterior</a>
    <alc-tabs>
      <alc-tab-button slot="button" tab="tab-1">Aba 1</alc-tab-button>
      <alc-tab tab="tab-1" data-test-tab-alvo><p>Conteúdo da aba 1.</p></alc-tab>
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

describe('alc-tab', () => {

  // Deve capturar screenshot do painel de conteúdo visível (padding, borda e fundo)
  it('padrão', async () => {
    const { root, waitForChanges } = await render(contentTab());

    const tab = root.querySelector<HTMLAlcTabElement>('[data-test-tab-alvo]');
    assert.exists(tab, 'O alc-tab não foi encontrado');

    // A captura mira a div interna (.alc-tabs__tab), não o host: o host não tem
    // "display: block" definido — mesmo caso do alc-user/alc-table/alc-tabs.
    const box = tab.querySelector<HTMLElement>('.alc-tabs__tab');
    assert.exists(box, 'A caixa interna do alc-tab não foi encontrada');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    expect(box.hidden).toBe(false);

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(box).toMatchScreenshot();
  });

  // Deve capturar screenshot do painel em estado de foco por teclado (outline-offset negativo)
  it('com foco', async () => {
    const { root, waitForChanges } = await render(contentTab());

    const tab = root.querySelector<HTMLAlcTabElement>('[data-test-tab-alvo]');
    assert.exists(tab, 'O alc-tab não foi encontrado');

    const box = tab.querySelector<HTMLElement>('.alc-tabs__tab');
    assert.exists(box, 'A caixa interna do alc-tab não foi encontrada');

    const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
    assert.exists(before, 'Link anterior não encontrado');

    await waitForChanges();

    // Foca o elemento anterior e tabula duas vezes: a primeira alcança o botão da aba
    // (única, já ativa), a segunda alcança o painel de conteúdo (tabindex="0" por padrão,
    // já que contentFocus não foi definido). Só assim o navegador entra em modalidade de
    // teclado e aplica o :focus-visible — um focus() direto não garante isso.
    before.focus();
    await userEvent.keyboard('{Tab}{Tab}');
    await waitForChanges();

    assert.strictEqual(document.activeElement, box, 'O painel de conteúdo não recebeu o foco');

    await aguardaFontes();

    await expect(box).toMatchScreenshot();
  });

});
