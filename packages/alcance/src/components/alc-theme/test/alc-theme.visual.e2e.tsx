import { assert, describe, expect, h, it, render } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-theme.visual.e2e.tsx
// yarn stencil-test --project dark alc-theme.visual.e2e.tsx

/**
 * Não faz parte da migração do grupo Espaçamento (sem classes de margin/padding — ver roteiro),
 * mas vale como regressão visual geral do componente.
 */

/**
 * Altura fixa e inteira no bloco do link: sem ela o componente cai num offset fracionário,
 * e o texto (inclusive o "✔" da opção selecionada) é rasterizado de forma diferente a cada
 * execução, quebrando a comparação pixel-exata.
 * O padding no contêiner dá espaço pro anel de :focus-visible (outline-offset, que se
 * estende além da caixa do select) não cair bem na borda do recorte automático da captura.
 */
const contentTheme = () => (
  <div>
    <div style={{ height: '32px' }}><a data-test-before href="#" class="alc-link">Foco anterior</a></div>
    <div data-test-container style={{ padding: '16px' }}>
      <alc-theme data-test-theme></alc-theme>
    </div>
  </div>
);

/**
 * As fontes do design system são carregadas de forma assíncrona.
 * Capturar antes de estarem prontas gera imagens com a fonte de fallback.
 */
const aguardaFontes = () => document.fonts.ready;

/**
 * Afasta o ponteiro do componente, deixando-o sobre o link anterior.
 * O cursor permanece onde o último teste o largou, e o select sob o ponteiro
 * seria capturado em estado de hover.
 */
const afastaPonteiro = (root: HTMLElement) => {
  const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
  assert.exists(before, 'Link anterior não encontrado');

  return userEvent.hover(before);
};

describe('alc-theme', () => {

  // A seleção lida de localStorage no componentWillLoad, então precisa estar
  // no estado certo antes do render — sem isso, um teste vaza preferência pro outro.
  const casos = [
    { name: 'do sistema padrao', preference: null, texto: 'Do Sistema' },
    { name: 'claro selecionado', preference: 'light', texto: 'Claro' },
    { name: 'escuro selecionado', preference: 'dark', texto: 'Escuro' },
  ];

  // Deve capturar screenshot do seletor em cada preferência salva
  it.each(casos)('tema $name', async ({ preference, texto }) => {
    localStorage.clear();
    if (preference) localStorage.setItem('alc-theme', preference);

    const { root, waitForChanges } = await render(contentTheme());

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    const theme = root.querySelector<HTMLAlcThemeElement>('[data-test-theme]');
    assert.exists(theme, 'O alc-theme não foi encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const select = theme.querySelector<HTMLSelectElement>('[data-test-select]');
    assert.exists(select, 'O select não foi encontrado');
    expect(select.selectedOptions[0].textContent).toContain(texto);

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do select em estado de hover (muda a cor da borda)
  it('com hover no select', async () => {
    localStorage.clear();

    const { root, waitForChanges } = await render(contentTheme());

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    const theme = root.querySelector<HTMLAlcThemeElement>('[data-test-theme]');
    assert.exists(theme, 'O alc-theme não foi encontrado');

    const select = theme.querySelector<HTMLSelectElement>('[data-test-select]');
    assert.exists(select, 'O select não foi encontrado');

    await waitForChanges();

    await userEvent.hover(select);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do select em estado de foco por teclado (outline-offset customizado)
  it('com foco no select', async () => {
    localStorage.clear();

    const { root, waitForChanges } = await render(contentTheme());

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    const theme = root.querySelector<HTMLAlcThemeElement>('[data-test-theme]');
    assert.exists(theme, 'O alc-theme não foi encontrado');

    const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
    assert.exists(before, 'Link anterior não encontrado');

    await waitForChanges();

    // Foca o elemento anterior e tabula: só assim o navegador entra em modalidade de
    // teclado e aplica o :focus-visible — um focus() direto não garante isso.
    before.focus();
    await userEvent.keyboard('{Tab}');
    await waitForChanges();

    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

});
