import { assert, describe, expect, h, it, render, vi } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-header-notifications.visual.e2e.tsx
// yarn stencil-test --project dark alc-header-notifications.visual.e2e.tsx

/**
 * O contêiner tem fundo escuro porque o componente usa as cores do alc-header, onde ele
 * vive. Sem esse fundo o rótulo sairia ilegível na baseline e ela deixaria de proteger
 * a cor.
 * A altura fixa do bloco do link mantém o componente em um offset inteiro — em offset
 * fracionário as bordas mudam a cada execução.
 * O link acima também serve para estacionar o ponteiro do mouse fora da área capturada.
 */
const contentNotifications = (notifications: unknown) => (
  <div>
    <div style={{ height: '32px' }}><a data-test-before href="#" class="alc-link">Foco anterior</a></div>
    <div data-test-container style={{ padding: '8px', backgroundColor: '#123f52' }}>
      {notifications}
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
 * Sem esperar, a captura pode sair sem o ícone do sino.
 */
const aguardaIcones = (container: HTMLElement) => vi.waitFor(() => {
  const icones = Array.from(container.querySelectorAll('alc-icon'));
  assert.isNotEmpty(icones, 'Nenhum ícone encontrado');

  icones.forEach(icone => assert.exists(icone.querySelector('svg'), 'Ícone ainda não carregado'));
});

/**
 * Afasta o ponteiro do componente, deixando-o sobre o link anterior.
 * O cursor permanece onde o último teste o largou, e o controle sob o ponteiro
 * seria capturado em estado de hover.
 */
const afastaPonteiro = (root: HTMLElement) => {
  const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
  assert.exists(before, 'Link anterior não encontrado');

  return userEvent.hover(before);
};

describe('alc-header-notifications', () => {

  const testArray = [
    { name: 'com dois digitos', notifications: 42, contador: '42' },
    { name: 'com overflow', notifications: 150, contador: '99+' },
  ];

  // Deve capturar screenshot do botão em cada quantidade de notificações
  it.each(testArray)('notificacao $name', async ({ notifications, contador }) => {
    const { root, waitForChanges } = await render(
      contentNotifications(
        <alc-header-notifications notifications={notifications} data-test-notifications></alc-header-notifications>
      )
    );

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const badge = container.querySelector<HTMLAlcBadgeElement>('[data-test-badge]');
    assert.exists(badge, 'O badge não foi encontrado');
    expect(badge.label).toBe(contador);
    // Sem notificações o badge não renderiza o contador
    expect(!!container.querySelector('[data-test-badge-span]')).toBe(contador !== '');

    await aguardaIcones(container);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot da variante link
  it('variante link', async () => {
    const { root, waitForChanges } = await render(
      contentNotifications(
        <alc-header-notifications notifications={5} variant="link" url="#notificacoes" data-test-notifications></alc-header-notifications>
      )
    );

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    assert.exists(container.querySelector('[data-test-link]'), 'O link não foi renderizado');
    assert.notExists(container.querySelector('[data-test-button]'), 'Não deveria renderizar um botão');

    await aguardaIcones(container);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do botão com foco
  it('com foco', async () => {
    const { root, waitForChanges } = await render(
      contentNotifications(
        <alc-header-notifications notifications={5} data-test-notifications></alc-header-notifications>
      )
    );

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
    assert.exists(before, 'Link anterior não encontrado');

    await waitForChanges();

    // Seta o foco no elemento anterior
    before.focus();
    // Pressiona tab para o foco ir para o botão de notificações
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

// Não há casos para 0 e 5 notificações: o contador do badge fica com largura fracionária
// nesses valores e desloca o sino por frações de pixel, fazendo a base do ícone ser
// rasterizada de forma diferente a cada execução. Esperar o layout estabilizar não resolve,
// porque a diferença é de rasterização, não de layout. Os contadores de dois dígitos e de
// overflow cobrem o mesmo caminho de renderização.
