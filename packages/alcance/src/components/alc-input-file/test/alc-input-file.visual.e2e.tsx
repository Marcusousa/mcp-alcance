import { assert, describe, expect, h, it, render, vi } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-input-file.visual.e2e.tsx
// yarn stencil-test --project dark alc-input-file.visual.e2e.tsx

/**
 * A captura é feita no contêiner porque o botão e a área de arrastar têm borda e sombra
 * que extrapolam o box do host.
 * A altura fixa do bloco do link mantém o componente em um offset inteiro — em offset
 * fracionário as bordas mudam a cada execução. A largura também é fixa: no modo input o
 * campo ocupa a largura disponível e, sem isso, as bordas laterais caem em meio pixel.
 * O link também serve para estacionar o ponteiro do mouse fora da área capturada: o
 * botão e a dropzone têm estado de hover.
 */
const contentInputFile = (inputFile: unknown) => (
  <div>
    <div style={{ height: '32px' }}><a data-test-before href="#" class="alc-link">Foco anterior</a></div>
    <div data-test-container style={{ padding: '8px', width: '300px' }}>
      {inputFile}
    </div>
  </div>
);

const inputFile = (props: Record<string, unknown> = {}) => (
  <alc-input-file idInput="arquivo" data-test-input-file {...props}>
    <label slot="label" htmlFor="arquivo">Anexo</label>
  </alc-input-file>
);

/**
 * As fontes do design system são carregadas de forma assíncrona.
 * Capturar antes de estarem prontas gera imagens com a fonte de fallback.
 */
const aguardaFontes = () => document.fonts.ready;

/**
 * O alc-icon busca o SVG por HTTP e o injeta depois da renderização, sem segurar o load.
 * Sem esperar, a captura pode sair sem o ícone.
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

describe('alc-input-file', () => {

  const testArray = [
    { name: 'button', props: {}, seletor: '[data-test-button]', icone: false },
    { name: 'button desabilitado', props: { disabled: true }, seletor: '[data-test-button]', icone: false },
    { name: 'button secundario', props: { buttonType: 'secondary' }, seletor: '[data-test-button]', icone: false },
    { name: 'button multiplo', props: { multiple: true }, seletor: '[data-test-button]', icone: false },
    { name: 'button com icone', props: { iconName: 'paperclip' }, seletor: '[data-test-button]', icone: true },
    { name: 'input', props: { mode: 'input' }, seletor: '[data-test-input]', icone: false },
    { name: 'input desabilitado', props: { mode: 'input', disabled: true }, seletor: '[data-test-input]', icone: false },
    { name: 'input com icone', props: { mode: 'input', iconName: 'paperclip' }, seletor: '[data-test-input]', icone: true },
    { name: 'dropzone', props: { mode: 'dropzone' }, seletor: '[data-test-dropzone]', icone: false },
    { name: 'dropzone desabilitado', props: { mode: 'dropzone', disabled: true }, seletor: '[data-test-dropzone]', icone: false },
    { name: 'dropzone com icone', props: { mode: 'dropzone', iconName: 'paperclip' }, seletor: '[data-test-dropzone]', icone: true },
  ];

  // Deve capturar screenshot de cada modo e variação
  it.each(testArray)('estado $name', async ({ props, seletor, icone }) => {
    const { root, waitForChanges } = await render(contentInputFile(inputFile(props)));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    assert.exists(container.querySelector(seletor), `O elemento do modo não foi renderizado: ${seletor}`);

    if (icone) {
      await aguardaIcones(container);
    }
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot da lista de arquivos após a seleção
  it('com arquivo selecionado', async () => {
    const { root, waitForChanges } = await render(contentInputFile(inputFile()));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    const fileInput = container.querySelector<HTMLInputElement>('[data-test-file-input]');
    assert.exists(fileInput, 'O input de arquivo não foi encontrado');

    await userEvent.upload(fileInput, new File(['conteudo'], 'documento.txt', { type: 'text/plain' }));
    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const conteudo = container.querySelector('[data-test-file-content]');
    assert.exists(conteudo, 'A área de conteúdo não foi encontrada');
    expect(conteudo.textContent.includes('documento.txt')).toBe(true);

    await aguardaIcones(container);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

});
