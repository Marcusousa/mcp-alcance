import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-dropdown.visual.e2e.tsx
// yarn stencil-test --project dark alc-dropdown.visual.e2e.tsx

/**
 * A captura é feita no contêiner porque o conteúdo do dropdown fica em um alc-popup com
 * strategy="fixed", fora do box do host.
 * A altura fixa do bloco do link mantém o componente em um offset inteiro — em offset
 * fracionário as bordas mudam a cada execução.
 * O link também serve para estacionar o ponteiro do mouse fora da área capturada.
 */
const contentDropdown = (dropdown: unknown) => (
  <div>
    <div style={{ height: '32px' }}><a data-test-before href="#" class="alc-link">Foco anterior</a></div>
    <div data-test-container style={{ height: '200px' }}>
      {dropdown}
    </div>
  </div>
);

/**
 * A largura do botão é fixa e inteira de propósito: um botão dimensionado pelo texto cai
 * em largura fracionária e a borda arredondada é rasterizada de forma diferente a cada
 * execução, o que reprova a comparação exata.
 */
const dropdown = (props: Record<string, unknown> = {}) => (
  <alc-dropdown data-test-dropdown {...props}>
    <button slot="trigger" class="alc-button alc-button--secondary" style={{ width: '160px' }} data-test-trigger>
      Ações
    </button>
    <alc-menu>
      <alc-menu-item>Editar</alc-menu-item>
      <alc-menu-item>Duplicar</alc-menu-item>
      <alc-menu-item>Excluir</alc-menu-item>
    </alc-menu>
  </alc-dropdown>
);

/**
 * As fontes do design system são carregadas de forma assíncrona.
 * Capturar antes de estarem prontas gera imagens com a fonte de fallback.
 */
const aguardaFontes = () => document.fonts.ready;

/**
 * Afasta o ponteiro do componente, deixando-o sobre o link anterior.
 * O cursor permanece onde o último teste o largou, e um item sob o ponteiro
 * seria capturado em estado de hover.
 */
const afastaPonteiro = (root: HTMLElement) => {
  const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
  assert.exists(before, 'Link anterior não encontrado');

  return userEvent.hover(before);
};

describe('alc-dropdown', () => {

  // Deve capturar screenshot do dropdown fechado
  it('fechado', async () => {
    const { root, waitForChanges } = await render(contentDropdown(dropdown()));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const elemento = container.querySelector<HTMLAlcDropdownElement>('[data-test-dropdown]');
    assert.exists(elemento, 'O dropdown não foi encontrado');
    expect(elemento.open).toBe(false);

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do dropdown aberto pela propriedade
  it('aberto', async () => {
    const { root, waitForChanges } = await render(contentDropdown(dropdown({ open: true })));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const elemento = container.querySelector<HTMLAlcDropdownElement>('[data-test-dropdown]');
    assert.exists(elemento, 'O dropdown não foi encontrado');
    expect(elemento.open).toBe(true);
    expect(container.querySelectorAll('alc-menu-item')).toHaveLength(3);

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do dropdown aberto pelo clique no acionador
  it('aberto por clique', async () => {
    const { root, waitForChanges } = await render(contentDropdown(dropdown()));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    const trigger = container.querySelector<HTMLElement>('[data-test-trigger]');
    assert.exists(trigger, 'O acionador não foi encontrado');

    await userEvent.click(trigger);
    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const elemento = container.querySelector<HTMLAlcDropdownElement>('[data-test-dropdown]');
    assert.exists(elemento, 'O dropdown não foi encontrado');
    expect(elemento.open).toBe(true);

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

});
