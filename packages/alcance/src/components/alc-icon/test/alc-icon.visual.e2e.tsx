import { assert, describe, expect, h, it, render, vi } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-icon.visual.e2e.tsx
// yarn stencil-test --project dark alc-icon.visual.e2e.tsx

/**
 * A captura é feita no contêiner, não no alc-icon: o host é inline-block e o SVG usa
 * medidas em em com deslocamento negativo, extrapolando o box.
 * A altura fixa do bloco do link mantém o componente em um offset inteiro — em offset
 * fracionário as bordas mudam a cada execução.
 * O link também serve para estacionar o ponteiro do mouse fora da área capturada.
 */
const contentIcon = (icon: unknown) => (
  <div>
    <div style={{ height: '32px' }}><a data-test-before href="#" class="alc-link">Foco anterior</a></div>
    <div data-test-container style={{ padding: '8px' }}>
      {icon}
    </div>
  </div>
);

/**
 * As fontes do design system são carregadas de forma assíncrona.
 * Capturar antes de estarem prontas gera imagens com a fonte de fallback.
 */
const aguardaFontes = () => document.fonts.ready;

/**
 * O SVG é buscado por HTTP e injetado depois da renderização, sem segurar o load.
 * Sem esperar, a captura sai sem o ícone.
 */
const aguardaSvg = (container: HTMLElement) => vi.waitFor(() => {
  const icones = Array.from(container.querySelectorAll('alc-icon'));
  assert.isNotEmpty(icones, 'Nenhum ícone encontrado');

  icones.forEach(icone => assert.exists(icone.querySelector('svg'), 'Ícone ainda não carregado'));
});

/**
 * Afasta o ponteiro do componente, deixando-o sobre o link anterior.
 * O cursor permanece onde o último teste o largou, e o conteúdo sob o ponteiro
 * seria capturado em estado de hover.
 */
const afastaPonteiro = (root: HTMLElement) => {
  const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
  assert.exists(before, 'Link anterior não encontrado');

  return userEvent.hover(before);
};

describe('alc-icon', () => {

  const tamanhos = [
    { name: 'size-x-small' },
    { name: 'size-small' },
    { name: 'size-medium' },
    { name: 'size-large' },
    { name: 'size-x-large' },
    { name: 'size-xx-large' },
  ];

  // Deve capturar screenshot do ícone em cada classe de tamanho
  it.each(tamanhos)('tamanhos $name', async ({ name }) => {
    const { root, waitForChanges } = await render(
      contentIcon(<alc-icon name="house" label="Início" class={name} data-test-icon></alc-icon>)
    );

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const icone = container.querySelector('[data-test-icon]');
    assert.exists(icone, 'O ícone não foi encontrado');
    expect(icone).toHaveClass(name);

    await aguardaSvg(container);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do ícone definido pela propriedade name
  it('por name', async () => {
    const { root, waitForChanges } = await render(
      contentIcon(<alc-icon name="bell" label="Notificações" data-test-icon></alc-icon>)
    );

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    await aguardaSvg(container);

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const icone = container.querySelector<HTMLAlcIconElement>('[data-test-icon]');
    assert.exists(icone, 'O ícone não foi encontrado');
    expect(icone.name).toBe('bell');

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do ícone definido pela propriedade icon
  it('por icon', async () => {
    const { root, waitForChanges } = await render(
      contentIcon(<alc-icon icon="envelope" label="Contato" data-test-icon></alc-icon>)
    );

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    await aguardaSvg(container);

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const icone = container.querySelector<HTMLAlcIconElement>('[data-test-icon]');
    assert.exists(icone, 'O ícone não foi encontrado');
    expect(icone.icon).toBe('envelope');

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do ícone dentro de um texto, herdando o tamanho da fonte
  it('herdando tamanho do texto', async () => {
    const { root, waitForChanges } = await render(
      contentIcon(
        <p style={{ fontSize: '32px', margin: '0' }}>
          <alc-icon name="house" label="Início" data-test-icon></alc-icon> Início
        </p>
      )
    );

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    await aguardaSvg(container);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

});

// Não há caso para flipRtl: o espelhamento só é aplicado quando o document tem dir="rtl",
// e alterar o dir do documento vaza para os outros arquivos de teste, que rodam na mesma
// página. O comportamento é coberto por alc-icon.spec.tsx.
