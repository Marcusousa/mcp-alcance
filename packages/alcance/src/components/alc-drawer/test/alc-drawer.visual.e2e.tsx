import { render, h, describe, it, expect, assert, vi } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-drawer.visual.e2e.tsx
// yarn stencil-test --project dark alc-drawer.visual.e2e.tsx

/**
 * A captura é feita no overlay, não no host: o overlay é fixed inset-0 e cobre a viewport,
 * de modo que o painel e o fundo escurecido só aparecem juntos a partir dele.
 * O link antes do drawer serve para estacionar o ponteiro do mouse: o botão de fechar
 * tem estado de hover.
 */
const contentDrawer = (drawer: unknown) => (
  <div>
    <div style={{ height: '32px' }}><a data-test-before href="#" class="alc-link">Foco anterior</a></div>
    {drawer}
  </div>
);

const drawer = (props: Record<string, unknown> = {}) => (
  <alc-drawer data-test-drawer {...props}>
    <div style={{ padding: '16px' }}>Conteúdo do drawer.</div>
  </alc-drawer>
);

/**
 * As fontes do design system são carregadas de forma assíncrona.
 * Capturar antes de estarem prontas gera imagens com a fonte de fallback.
 */
const aguardaFontes = () => document.fonts.ready;

/**
 * O alc-icon busca o SVG por HTTP e o injeta depois da renderização, sem segurar o load.
 * Sem esperar, a captura pode sair sem o ícone do botão de fechar.
 */
const aguardaIcones = (overlay: HTMLElement) => vi.waitFor(() => {
  const icones = Array.from(overlay.querySelectorAll('alc-icon'));
  assert.isNotEmpty(icones, 'Nenhum ícone encontrado');

  icones.forEach(icone => assert.exists(icone.querySelector('svg'), 'Ícone ainda não carregado'));
});

/**
 * Estaciona o ponteiro no corpo do painel, que não tem estilo de hover.
 * O cursor permanece onde o último teste o largou, e o botão de fechar sob o ponteiro
 * seria capturado em estado de hover. Não dá para usar o link anterior: o overlay é
 * fixed inset-0 e cobre a página, tornando o link inacionável.
 */
const estacionaPonteiro = (overlay: HTMLElement) => {
  const conteudo = overlay.querySelector<HTMLElement>('[data-test-content] > div:last-child');
  assert.exists(conteudo, 'O corpo do painel não foi encontrado');

  return userEvent.hover(conteudo);
};

describe('alc-drawer', () => {

  // Deve capturar screenshot do drawer aberto pela propriedade
  it('aberto', async () => {
    const { root, waitForChanges } = await render(contentDrawer(drawer({ isVisible: true })));

    const elemento = root.querySelector<HTMLAlcDrawerElement>('[data-test-drawer]');
    assert.exists(elemento, 'O drawer não foi encontrado');

    await waitForChanges();

    const overlay = elemento.querySelector<HTMLElement>('.alc-drawer__overlay');
    assert.exists(overlay, 'O overlay não foi encontrado');

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    expect(elemento.isVisible).toBe(true);
    assert.exists(elemento.querySelector('[data-test-content]'), 'O conteúdo do drawer não foi encontrado');

    await aguardaIcones(overlay);
    await estacionaPonteiro(overlay);
    await aguardaFontes();

    await expect(overlay).toMatchScreenshot();
  });

  // Deve capturar screenshot do drawer aberto pelo método show
  it('aberto pelo metodo', async () => {
    const { root, waitForChanges } = await render(contentDrawer(drawer()));

    const elemento = root.querySelector<HTMLAlcDrawerElement>('[data-test-drawer]');
    assert.exists(elemento, 'O drawer não foi encontrado');

    const aberto = await elemento.show();
    await waitForChanges();

    const overlay = elemento.querySelector<HTMLElement>('.alc-drawer__overlay');
    assert.exists(overlay, 'O overlay não foi encontrado');

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    expect(aberto).toBe(true);
    expect(elemento.isVisible).toBe(true);

    await aguardaIcones(overlay);
    await estacionaPonteiro(overlay);
    await aguardaFontes();

    await expect(overlay).toMatchScreenshot();
  });

});
