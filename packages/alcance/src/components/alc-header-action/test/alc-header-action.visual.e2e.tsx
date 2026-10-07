import { assert, describe, expect, h, it, render, vi } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-header-action.visual.e2e.tsx
// yarn stencil-test --project dark alc-header-action.visual.e2e.tsx

/**
 * A captura é feita no contêiner, não no alc-header-action: o host é inline e seu box
 * abrange a linha do elemento anterior.
 * A altura fixa do bloco do link mantém o componente em um offset inteiro — em offset
 * fracionário as bordas mudam a cada execução.
 * O link também serve para estacionar o ponteiro do mouse fora da área capturada: as
 * variantes têm estado de hover.
 */
const contentAction = (action: unknown) => (
  <div>
    <div style={{ height: '32px' }}><a data-test-before href="#" class="alc-link">Foco anterior</a></div>
    <div data-test-container style={{ padding: '4px' }}>
      {action}
    </div>
  </div>
);

/**
 * As fontes do design system são carregadas de forma assíncrona.
 * Capturar antes de estarem prontas gera imagens com a fonte de fallback.
 */
const aguardaFontes = () => document.fonts.ready;

/**
 * O alc-icon busca o SVG por HTTP e o injeta depois da renderização, sem segurar o load.
 * Sem esperar, a captura pode sair sem o ícone da ação.
 */
const aguardaIcones = (container: HTMLElement) => vi.waitFor(() => {
  const icones = Array.from(container.querySelectorAll('alc-icon'));
  assert.isNotEmpty(icones, 'Nenhum ícone encontrado');

  icones.forEach(icone => assert.exists(icone.querySelector('svg'), 'Ícone ainda não carregado'));
});

/**
 * Afasta o ponteiro do componente, deixando-o sobre o link anterior.
 * O cursor permanece onde o último teste o largou, e a ação sob o ponteiro
 * seria capturada em estado de hover.
 */
const afastaPonteiro = (root: HTMLElement) => {
  const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
  assert.exists(before, 'Link anterior não encontrado');

  return userEvent.hover(before);
};

describe('alc-header-action', () => {

  const tipoVariacao = [
    { name: 'button', variant: 'button', seletor: '[data-test-button]' },
    { name: 'link', variant: 'link', seletor: '[data-test-link]' },
    { name: 'menu-item', variant: 'menu-item', seletor: '[data-test-menu-item]' },
    { name: 'menu-link', variant: 'menu-link', seletor: '[data-test-menu-link]' },
  ];

  // Deve capturar screenshot da ação em cada variante
  it.each(tipoVariacao)('modelo $name', async ({ variant, seletor }) => {
    const { root, waitForChanges } = await render(
      contentAction(
        <alc-header-action iconName="question-circle" variant={variant as 'button'} url="#ajuda" data-test-action>
          Ajuda
        </alc-header-action>
      )
    );

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    assert.exists(container.querySelector(seletor), `O elemento da variante ${variant} não foi renderizado`);
    // O conteúdo do slot é movido para o container da variante no componentDidRender
    expect(container.textContent.includes('Ajuda')).toBe(true);

    await aguardaIcones(container);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot da ação em botão com foco
  it('button com foco', async () => {
    const { root, waitForChanges } = await render(
      contentAction(
        <alc-header-action iconName="question-circle" variant="button" data-test-action>
          Ajuda
        </alc-header-action>
      )
    );

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
    assert.exists(before, 'Link anterior não encontrado');

    await waitForChanges();

    // Seta o foco no elemento anterior
    before.focus();
    // Pressiona tab para o foco ir para o botão da ação
    await userEvent.keyboard('{Tab}');
    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const botao = container.querySelector('[data-test-button]');
    assert.exists(botao, 'O botão não foi encontrado');
    expect(document.activeElement).toBe(botao);

    await aguardaIcones(container);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

});
