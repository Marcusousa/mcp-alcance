import { assert, describe, expect, h, it, render, vi } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-header-id.visual.e2e.tsx
// yarn stencil-test --project dark alc-header-id.visual.e2e.tsx

const data = {
  nome: 'Thundercats',
  descricao: 'Tecnologia thundercats',
  url: '#home',
};

/**
 * O contêiner tem fundo escuro porque o componente usa a cor de texto neutra clara,
 * pensada para viver dentro do alc-header. Sem esse fundo o texto sairia ilegível na
 * baseline e ela deixaria de proteger a cor.
 * A altura fixa do bloco do link mantém o componente em um offset inteiro — em offset
 * fracionário as bordas mudam a cada execução.
 * O link acima também serve para estacionar o ponteiro do mouse fora da área capturada:
 * o link do componente é sublinhado no hover.
 */
const contentHeaderId = (headerId: unknown) => (
  <div>
    <div style={{ height: '32px' }}><a data-test-before href="#" class="alc-link">Foco anterior</a></div>
    <div data-test-container style={{ padding: '8px', backgroundColor: '#123f52' }}>
      {headerId}
    </div>
  </div>
);

/**
 * As fontes do design system são carregadas de forma assíncrona.
 * Capturar antes de estarem prontas gera imagens com a fonte de fallback.
 */
const aguardaFontes = () => document.fonts.ready;

/**
 * O logo é um SVG buscado por HTTP. Sem esperar, a captura pode sair sem a imagem.
 */
const aguardaLogo = (container: HTMLElement) => vi.waitFor(() => {
  const logo = container.querySelector<HTMLImageElement>('[data-test-image]');
  assert.exists(logo, 'O logo não foi encontrado');
  assert.isTrue(logo.complete && logo.naturalWidth > 0, 'O logo ainda não foi carregado');
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

describe('alc-header-id', () => {

  const testArray = [
    { name: 'com descricao', descricao: data.descricao, temDescricao: true },
    { name: 'sem descricao', descricao: undefined, temDescricao: false },
  ];

  // Deve capturar screenshot da identificação com e sem descrição
  it.each(testArray)('modelo $name', async ({ descricao, temDescricao }) => {
    const { root, waitForChanges } = await render(
      contentHeaderId(
        <alc-header-id name={data.nome} description={descricao} homeUrl={data.url} data-test-header-id></alc-header-id>
      )
    );

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    expect(container.querySelector('[data-test-name]').textContent).toBe(data.nome);
    expect(!!container.querySelector('[data-test-description]')).toBe(temDescricao);

    await aguardaLogo(container);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot da identificação com o link em foco
  it('com foco', async () => {
    const { root, waitForChanges } = await render(
      contentHeaderId(
        <alc-header-id name={data.nome} description={data.descricao} homeUrl={data.url} data-test-header-id></alc-header-id>
      )
    );

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
    assert.exists(before, 'Link anterior não encontrado');

    await waitForChanges();

    // Seta o foco no elemento anterior
    before.focus();
    // Pressiona tab para o foco ir para o link da identificação
    await userEvent.keyboard('{Tab}');
    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const link = container.querySelector('[data-test-link]');
    assert.exists(link, 'O link não foi encontrado');
    expect(document.activeElement).toBe(link);

    await aguardaLogo(container);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

});
