import { assert, describe, expect, h, it, render, vi } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-breadcrumb-item.visual.e2e.tsx
// yarn stencil-test --project dark alc-breadcrumb-item.visual.e2e.tsx

/**
 * A captura é feita no contêiner, não no alc-breadcrumb-item: o host não tem regra de
 * display, então é inline e seu box abrange a linha do elemento anterior.
 * A altura fixa do bloco do link mantém o componente em um offset inteiro — em offset
 * fracionário as bordas mudam a cada execução.
 * O link também serve para estacionar o ponteiro do mouse fora da área capturada.
 */
const contentItem = (item: unknown) => (
  <div>
    <div style={{ height: '32px' }}><a data-test-before href="#" class="alc-link">Foco anterior</a></div>
    <div data-test-container>
      {item}
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
 * Sem esperar, a captura pode sair sem o ícone do item.
 */
const aguardaIcones = (container: HTMLElement) => vi.waitFor(() => {
  const icones = Array.from(container.querySelectorAll('alc-icon'));
  assert.isNotEmpty(icones, 'Nenhum ícone encontrado');

  icones.forEach(icone => assert.exists(icone.querySelector('svg'), 'Ícone ainda não carregado'));
});

/**
 * Afasta o ponteiro do componente, deixando-o sobre o link anterior.
 * O cursor permanece onde o último teste o largou, e o link sob o ponteiro
 * seria capturado em estado de hover.
 */
const afastaPonteiro = (root: HTMLElement) => {
  const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
  assert.exists(before, 'Link anterior não encontrado');

  return userEvent.hover(before);
};

describe('alc-breadcrumb-item', () => {

  const testArray = [
    {
      name: 'com url',
      item: <alc-breadcrumb-item label="Thundercats" url="#"></alc-breadcrumb-item>,
    },
    {
      name: 'com slot',
      item: <alc-breadcrumb-item><a href="#">Thundercats</a></alc-breadcrumb-item>,
    },
  ];

  // Deve capturar screenshot do item em cada forma de montar o conteúdo
  it.each(testArray)('conteudo $name', async ({ item }) => {
    const { root, waitForChanges } = await render(contentItem(item));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    // Sem aria-current o item não é a página atual, então tem link e separador
    assert.exists(container.querySelector('.alc-link'), 'O item deveria ter aparência de link');
    assert.exists(container.querySelector('.alc-breadcrumb-item__separator'), 'O separador não foi renderizado');

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do item com ícone
  it('com icone', async () => {
    const { root, waitForChanges } = await render(
      contentItem(<alc-breadcrumb-item label="Thundercats" url="#" iconName="house"></alc-breadcrumb-item>)
    );

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    assert.exists(container.querySelector('[data-test-icon]'), 'O ícone não foi renderizado');

    await aguardaIcones(container);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do item marcado como página atual
  it('pagina atual', async () => {
    const { root, waitForChanges } = await render(
      contentItem(<alc-breadcrumb-item label="Lion-O" url="#" current></alc-breadcrumb-item>)
    );

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    // Sendo a página atual, o item perde a aparência de link e não renderiza separador
    assert.notExists(container.querySelector('.alc-link'), 'O item não deveria ter aparência de link');
    assert.notExists(container.querySelector('.alc-breadcrumb-item__separator'), 'O separador não deveria ser renderizado');

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do item com o link em foco
  it('com foco', async () => {
    const { root, waitForChanges } = await render(
      contentItem(<alc-breadcrumb-item label="Thundercats" url="#"></alc-breadcrumb-item>)
    );

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
    assert.exists(before, 'Link anterior não encontrado');

    await waitForChanges();

    // Seta o foco no elemento anterior
    before.focus();
    // Pressiona tab para o foco ir para o link do item
    await userEvent.keyboard('{Tab}');
    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const link = container.querySelector('[data-test-link]');
    assert.exists(link, 'O link não foi encontrado');
    expect(document.activeElement).toBe(link);

    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

});
