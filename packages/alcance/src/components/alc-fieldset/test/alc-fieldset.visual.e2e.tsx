import { assert, describe, expect, h, it, render } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-fieldset.visual.e2e.tsx
// yarn stencil-test --project dark alc-fieldset.visual.e2e.tsx

/**
 * A altura fixa do bloco do link mantém o componente em um offset inteiro — em offset
 * fracionário a borda do fieldset muda a cada execução.
 * O link também serve para estacionar o ponteiro do mouse fora da área capturada.
 */
const contentFieldset = (fieldset: unknown) => (
  <div>
    <div style={{ height: '32px' }}><a data-test-before href="#" class="alc-link">Foco anterior</a></div>
    <div data-test-container style={{ padding: '4px' }}>
      {fieldset}
    </div>
  </div>
);

const fieldset = (props: Record<string, unknown> = {}) => (
  <alc-fieldset legend="Personagens" data-test-fieldset-host {...props}>
    <alc-checkbox label="Lion-O">
      <input type="checkbox" />
    </alc-checkbox>
    <alc-checkbox label="Panthro">
      <input type="checkbox" />
    </alc-checkbox>
  </alc-fieldset>
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

describe('alc-fieldset', () => {

  const tipoVariacao = [
    { name: 'padrao', props: {}, erro: false, dica: false, obrigatorio: false },
    { name: 'obrigatorio', props: { required: true }, erro: false, dica: false, obrigatorio: true },
    { name: 'com dica', props: { hint: 'Selecione ao menos um personagem.' }, erro: false, dica: true, obrigatorio: false },
    { name: 'com erro', props: { errorMsg: 'Selecione ao menos um personagem.' }, erro: true, dica: false, obrigatorio: false },
    {
      name: 'com erro e dica',
      props: { errorMsg: 'Selecione ao menos um personagem.', hint: 'A escolha pode ser alterada depois.' },
      erro: true,
      dica: true,
      obrigatorio: false,
    },
  ];

  // Deve capturar screenshot do fieldset em cada variação
  it.each(tipoVariacao)('modelo $name', async ({ props, erro, dica, obrigatorio }) => {
    const { root, waitForChanges } = await render(contentFieldset(fieldset(props)));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const host = container.querySelector('[data-test-fieldset-host]');
    assert.exists(host, 'O fieldset não foi encontrado');
    expect(!!container.querySelector('[data-test-error]')).toBe(erro);
    expect(!!container.querySelector('[data-test-hint]')).toBe(dica);
    // Com erro o host recebe a classe de erro
    expect(host.classList.contains('alc-form__input--error')).toBe(erro);
    // Com required a legenda ganha o sufixo
    expect(container.querySelector('[data-test-legend]').textContent.includes('(obrigatório)')).toBe(obrigatorio);

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

});
