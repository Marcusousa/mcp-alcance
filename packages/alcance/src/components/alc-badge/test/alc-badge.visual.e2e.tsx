import { assert, describe, expect, h, it, render } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-badge.visual.e2e.tsx
// yarn stencil-test --project dark alc-badge.visual.e2e.tsx

/**
 * A captura é feita no contêiner, não no alc-badge: nas posições default e floating o badge
 * é absoluto e deslocado por translate, ficando parcialmente fora do box do host.
 * O padding do contêiner dá a folga necessária, e a altura fixa do bloco do link mantém o
 * componente em um offset inteiro — em offset fracionário as bordas mudam a cada execução.
 * O link também serve para estacionar o ponteiro do mouse fora da área capturada.
 */
const contentBadge = (props: Record<string, unknown> = {}) => (
  <div>
    <div style={{ height: '32px' }}><a data-test-before href="#" class="alc-link">Foco anterior</a></div>
    <div data-test-container style={{ padding: '16px' }}>
      <alc-badge data-test-badge {...props}>
        <span>Atualizações</span>
      </alc-badge>
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
 * O cursor permanece onde o último teste o largou, e o conteúdo sob o ponteiro
 * seria capturado em estado de hover.
 */
const afastaPonteiro = (root: HTMLElement) => {
  const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
  assert.exists(before, 'Link anterior não encontrado');

  return userEvent.hover(before);
};

describe('alc-badge', () => {

  const cores = [
    { name: 'primary' },
    { name: 'secondary' },
    { name: 'success' },
    { name: 'warning' },
    { name: 'error' },
    { name: 'info' },
    { name: 'neutral' },
  ];

  // Deve capturar screenshot do badge com rótulo em cada cor
  it.each(cores)('cor $name', async ({ name }) => {
    const { root, waitForChanges } = await render(contentBadge({ label: 'Novo', color: name }));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const badge = container.querySelector('[data-test-badge-span]');
    assert.exists(badge, 'O badge não foi renderizado');
    expect(badge).toHaveClass(`alc-badge--${name}`);

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  const variacoes = [
    { name: 'contornado', props: { label: 'Novo', outlined: true } },
    { name: 'ponto', props: { dot: true, color: 'success' } },
    { name: 'contador', props: { label: '9', count: true } },
    { name: 'contador flutuante', props: { label: '9', count: true, position: 'floating' } },
    { name: 'contador alinhado', props: { label: '9', count: true, position: 'inline' } },
    { name: 'pulsante', props: { label: '9', count: true, pulsate: true, color: 'error' } },
  ];

  // Deve capturar screenshot de cada variação de forma e posicionamento
  it.each(variacoes)('$name', async ({ props }) => {
    const { root, waitForChanges } = await render(contentBadge(props));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    assert.exists(container.querySelector('[data-test-badge-span]'), 'O badge não foi renderizado');

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

});

// Não há caso para hidden: com ele o componente não renderiza nada, e a captura de uma área
// vazia acaba pegando pixels remanescentes do teste anterior, variando entre execuções.
// O comportamento já é coberto por alc-badge.spec.tsx.
