import { assert, describe, expect, h, it, render, vi } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-breadcrumb.visual.e2e.tsx
// yarn stencil-test --project dark alc-breadcrumb.visual.e2e.tsx

/**
 * A captura é feita no contêiner, não no alc-breadcrumb: o host não tem regra de display,
 * então é inline e seu box abrange a linha do elemento anterior.
 * A altura fixa do bloco do link mantém o componente em um offset inteiro — em offset
 * fracionário as bordas mudam a cada execução.
 * O link também serve para estacionar o ponteiro do mouse fora da área capturada.
 */
const contentBreadcrumb = (itens: unknown) => (
  <div>
    <div style={{ height: '32px' }}><a data-test-before href="#" class="alc-link">Foco anterior</a></div>
    <div data-test-container>
      <alc-breadcrumb data-test-breadcrumb>
        {itens}
      </alc-breadcrumb>
    </div>
  </div>
);

const itensComUrl = [
  <alc-breadcrumb-item label="Thundercats" url="#"></alc-breadcrumb-item>,
  <alc-breadcrumb-item label="Personagens" url="#"></alc-breadcrumb-item>,
  <alc-breadcrumb-item label="Lion-O" url="#"></alc-breadcrumb-item>,
];

const itensComIcone = [
  <alc-breadcrumb-item label="Thundercats" url="#" iconName="house"></alc-breadcrumb-item>,
  <alc-breadcrumb-item label="Personagens" url="#"></alc-breadcrumb-item>,
  <alc-breadcrumb-item label="Lion-O" url="#"></alc-breadcrumb-item>,
];

const itensComSlot = [
  <alc-breadcrumb-item><a href="#">Thundercats</a></alc-breadcrumb-item>,
  <alc-breadcrumb-item><a href="#">Personagens</a></alc-breadcrumb-item>,
  <alc-breadcrumb-item><a href="#">Lion-O</a></alc-breadcrumb-item>,
];

const itemUnico = [
  <alc-breadcrumb-item label="Thundercats" url="#"></alc-breadcrumb-item>,
];

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
 * O cursor permanece onde o último teste o largou, e um link sob o ponteiro
 * seria capturado em estado de hover.
 */
const afastaPonteiro = (root: HTMLElement) => {
  const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
  assert.exists(before, 'Link anterior não encontrado');

  return userEvent.hover(before);
};

describe('alc-breadcrumb', () => {

  const testArray = [
    { name: 'com url', itens: itensComUrl, total: 3 },
    { name: 'com slot', itens: itensComSlot, total: 3 },
    { name: 'item unico', itens: itemUnico, total: 1 },
  ];

  // Deve capturar screenshot do breadcrumb em cada forma de montar os itens
  it.each(testArray)('modelo $name', async ({ itens, total }) => {
    const { root, waitForChanges } = await render(contentBreadcrumb(itens));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const items = container.querySelectorAll('alc-breadcrumb-item');
    expect(items).toHaveLength(total);
    // O separador não é renderizado no último item, que é a página atual
    expect(container.querySelectorAll('.alc-breadcrumb-item__separator')).toHaveLength(total - 1);

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do breadcrumb com ícone no primeiro item
  it('com icone', async () => {
    const { root, waitForChanges } = await render(contentBreadcrumb(itensComIcone));

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

  // Deve capturar screenshot do breadcrumb com o primeiro link em foco
  it('com foco', async () => {
    const { root, waitForChanges } = await render(contentBreadcrumb(itensComUrl));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
    assert.exists(before, 'Link anterior não encontrado');

    await waitForChanges();

    // Seta o foco no elemento anterior
    before.focus();
    // Pressiona tab para o foco ir para o primeiro link do breadcrumb
    await userEvent.keyboard('{Tab}');
    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const primeiroLink = container.querySelector('[data-test-link]');
    assert.exists(primeiroLink, 'O primeiro link não foi encontrado');
    expect(document.activeElement).toBe(primeiroLink);

    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

});
