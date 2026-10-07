import { assert, describe, expect, h, it, render, vi } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-details.visual.e2e.tsx
// yarn stencil-test --project dark alc-details.visual.e2e.tsx

/**
 * A captura é feita no contêiner porque o summary tem borda arredondada e sombra que
 * extrapolam o box do host.
 * A altura fixa do bloco do link mantém o componente em um offset inteiro — em offset
 * fracionário as bordas mudam a cada execução.
 * O link também serve para estacionar o ponteiro do mouse fora da área capturada: o
 * summary tem cor de hover.
 */
const contentDetails = (details: unknown) => (
  <div>
    <div style={{ height: '32px' }}><a data-test-before href="#" class="alc-link">Foco anterior</a></div>
    <div data-test-container style={{ padding: '4px' }}>
      {details}
    </div>
  </div>
);

const details = (props: Record<string, unknown> = {}) => (
  <alc-details summary="Thundercats" data-test-details {...props}>
    Lion-O é o líder dos Thundercats.
  </alc-details>
);

/**
 * As fontes do design system são carregadas de forma assíncrona.
 * Capturar antes de estarem prontas gera imagens com a fonte de fallback.
 */
const aguardaFontes = () => document.fonts.ready;

/**
 * O alc-icon busca o SVG por HTTP e o injeta depois da renderização, sem segurar o load.
 * Sem esperar, a captura pode sair sem o ícone do summary.
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

describe('alc-details', () => {

  const testArray = [
    { name: 'fechado', props: {}, aberto: false, desabilitado: false },
    { name: 'aberto', props: { opened: true }, aberto: true, desabilitado: false },
    { name: 'desabilitado', props: { disabled: true }, aberto: false, desabilitado: true },
    { name: 'desabilitado aberto', props: { disabled: true, opened: true }, aberto: true, desabilitado: true },
  ];

  // Deve capturar screenshot do details em cada estado
  it.each(testArray)('estado $name', async ({ props, aberto, desabilitado }) => {
    const { root, waitForChanges } = await render(contentDetails(details(props)));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const elemento = container.querySelector('details');
    assert.exists(elemento, 'O details não foi encontrado');
    expect(elemento.open).toBe(aberto);
    expect(elemento.classList.contains('is-disabled')).toBe(desabilitado);
    // O ícone rotaciona quando aberto
    expect(!!container.querySelector('.alc-details__icon.is-open')).toBe(aberto);

    await aguardaIcones(container);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do details aberto por clique no summary
  it('aberto por clique', async () => {
    const { root, waitForChanges } = await render(contentDetails(details()));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    const summary = container.querySelector<HTMLElement>('.alc-details__summary');
    assert.exists(summary, 'O summary não foi encontrado');

    await userEvent.click(summary);
    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const elemento = container.querySelector('details');
    assert.exists(elemento, 'O details não foi encontrado');
    expect(elemento.open).toBe(true);

    await aguardaIcones(container);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do details com o summary em foco
  it('com foco', async () => {
    const { root, waitForChanges } = await render(contentDetails(details()));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
    assert.exists(before, 'Link anterior não encontrado');

    await waitForChanges();

    // Seta o foco no elemento anterior
    before.focus();
    // Pressiona tab para o foco ir para o summary
    await userEvent.keyboard('{Tab}');
    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const summary = container.querySelector('.alc-details__summary');
    assert.exists(summary, 'O summary não foi encontrado');
    expect(document.activeElement).toBe(summary);

    await aguardaIcones(container);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

});
