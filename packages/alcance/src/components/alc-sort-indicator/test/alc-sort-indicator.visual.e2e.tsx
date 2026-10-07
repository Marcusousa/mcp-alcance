import { assert, describe, expect, h, it, render, vi } from '@stencil/vitest';

// yarn stencil-test --project browser alc-sort-indicator.visual.e2e.tsx
// yarn stencil-test --project dark alc-sort-indicator.visual.e2e.tsx

/**
 * alc-sort-indicator não tem CSS próprio nem classe do grupo Espaçamento (ver roteiro/log) —
 * só troca o ícone (alc-icon) conforme a prop "sorting". Sem interação própria (sem click,
 * sem foco), então não há caso de hover/foco a cobrir aqui.
 */
const contentSortIndicator = (sorting: 'asc' | 'desc' | 'none') => (
  <div>
    <alc-sort-indicator data-test-indicator sorting={sorting}></alc-sort-indicator>
  </div>
);

/**
 * As fontes do design system são carregadas de forma assíncrona.
 * Capturar antes de estarem prontas gera imagens com a fonte de fallback.
 */
const aguardaFontes = () => document.fonts.ready;

/**
 * O alc-icon busca o SVG por HTTP e o injeta depois da renderização, sem segurar o load.
 */
const aguardaIcones = (container: HTMLElement) => vi.waitFor(() => {
  const icones = Array.from(container.querySelectorAll('alc-icon'));
  assert.isNotEmpty(icones, 'Nenhum ícone encontrado');

  icones.forEach(icone => assert.exists(icone.querySelector('svg'), 'Ícone ainda não carregado'));
});

describe('alc-sort-indicator', () => {

  const casos: Array<{ name: string; sorting: 'asc' | 'desc' | 'none' }> = [
    { name: 'sem ordenacao', sorting: 'none' },
    { name: 'ascendente', sorting: 'asc' },
    { name: 'descendente', sorting: 'desc' },
  ];

  // Deve capturar screenshot do ícone correspondente a cada estado de ordenação
  it.each(casos)('ordem $name', async ({ sorting }) => {
    const { root } = await render(contentSortIndicator(sorting));

    const indicator = root.querySelector<HTMLAlcSortIndicatorElement>('[data-test-indicator]');
    assert.exists(indicator, 'O alc-sort-indicator não foi encontrado');

    // A captura mira o span interno, não o host: o componente não tem CSS/display próprio.
    const box = indicator.querySelector<HTMLElement>('.alc-sort-indicator');
    assert.exists(box, 'A caixa interna do alc-sort-indicator não foi encontrada');

    await aguardaIcones(indicator);
    await aguardaFontes();

    await expect(box).toMatchScreenshot();
  });

});
