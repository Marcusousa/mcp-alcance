import { assert, describe, expect, h, it, render, vi } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-expander.visual.e2e.tsx
// yarn stencil-test --project dark alc-expander.visual.e2e.tsx

/**
 * A captura é feita no contêiner porque o summary e o conteúdo têm sombra, que extrapola
 * o box do host.
 * A altura fixa do bloco do link mantém o componente em um offset inteiro — em offset
 * fracionário as bordas mudam a cada execução.
 * O link também serve para estacionar o ponteiro do mouse fora da área capturada: o
 * summary é clicável.
 */
const contentExpander = (expander: unknown) => (
  <div>
    <div style={{ height: '32px' }}><a data-test-before href="#" class="alc-link">Foco anterior</a></div>
    <div data-test-container style={{ padding: '8px' }}>
      {expander}
    </div>
  </div>
);

const expander = (props: Record<string, unknown> = {}) => (
  <alc-expander label="Thundercats" data-test-expander {...props}>
    Lion-O é o líder dos Thundercats.
  </alc-expander>
);

/**
 * As fontes do design system são carregadas de forma assíncrona.
 * Capturar antes de estarem prontas gera imagens com a fonte de fallback.
 */
const aguardaFontes = () => document.fonts.ready;

/**
 * O alc-icon busca o SVG por HTTP e o injeta depois da renderização, sem segurar o load.
 * Sem esperar, a captura pode sair sem o chevron.
 */
const aguardaIcones = (container: HTMLElement) => vi.waitFor(() => {
  const icones = Array.from(container.querySelectorAll('alc-icon'));
  assert.isNotEmpty(icones, 'Nenhum ícone encontrado');

  icones.forEach(icone => assert.exists(icone.querySelector('svg'), 'Ícone ainda não carregado'));
});

/**
 * Afasta o ponteiro do componente, deixando-o sobre o link anterior.
 * O cursor permanece onde o último teste o largou, e o summary sob o ponteiro
 * seria capturado em estado de hover.
 */
const afastaPonteiro = (root: HTMLElement) => {
  const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
  assert.exists(before, 'Link anterior não encontrado');

  return userEvent.hover(before);
};

describe('alc-expander', () => {

  const testArray = [
    { name: 'fechado', props: {}, aberto: false, chevron: 'chevron-down', rotuloOculto: false },
    { name: 'aberto', props: { open: true }, aberto: true, chevron: 'chevron-up', rotuloOculto: false },
    { name: 'rotulo oculto', props: { hideLabel: true }, aberto: false, chevron: 'chevron-down', rotuloOculto: true },
    { name: 'rotulo oculto aberto', props: { hideLabel: true, open: true }, aberto: true, chevron: 'chevron-up', rotuloOculto: true },
  ];

  // Deve capturar screenshot do expander em cada estado
  it.each(testArray)('estado $name', async ({ props, aberto, chevron, rotuloOculto }) => {
    const { root, waitForChanges } = await render(contentExpander(expander(props)));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const elemento = container.querySelector('details');
    assert.exists(elemento, 'O details não foi encontrado');
    expect(elemento.open).toBe(aberto);
    // O chevron troca de ícone conforme o estado
    expect(container.querySelector('.alc-expander__chevron').getAttribute('name')).toBe(chevron);
    // Com hideLabel o rótulo fica acessível mas invisível, e o chevron é centralizado
    expect(container.querySelector('.alc-expander__label-container').classList.contains('sr-only')).toBe(rotuloOculto);
    expect(!!container.querySelector('.alc-expander__summary--center')).toBe(rotuloOculto);

    await aguardaIcones(container);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do expander aberto por clique no summary
  it('aberto por clique', async () => {
    const { root, waitForChanges } = await render(contentExpander(expander()));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    const summary = container.querySelector<HTMLElement>('.alc-expander__summary');
    assert.exists(summary, 'O summary não foi encontrado');

    await userEvent.click(summary);
    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const elemento = container.querySelector<HTMLAlcExpanderElement>('[data-test-expander]');
    assert.exists(elemento, 'O expander não foi encontrado');
    expect(elemento.open).toBe(true);

    await aguardaIcones(container);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do expander com rótulo vindo do slot
  it('rotulo pelo slot', async () => {
    const { root, waitForChanges } = await render(
      contentExpander(
        <alc-expander label="Ignorado" data-test-expander>
          <span slot="label">Rótulo <strong>personalizado</strong></span>
          Lion-O é o líder dos Thundercats.
        </alc-expander>
      )
    );

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const rotulo = container.querySelector('.alc-expander__label-container');
    assert.exists(rotulo, 'O rótulo não foi encontrado');
    assert.exists(rotulo.querySelector('strong'), 'O conteúdo do slot de rótulo não foi renderizado');

    await aguardaIcones(container);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

});
