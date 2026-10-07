import { assert, describe, expect, h, it, render } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-field.visual.e2e.tsx
// yarn stencil-test --project dark alc-field.visual.e2e.tsx

/**
 * A captura é feita no contêiner, não no alc-field: o outline de foco do controle usa
 * outline-offset, que fica fora do box do host e seria cortado.
 * A altura fixa do bloco do link mantém o componente em um offset inteiro — em offset
 * fracionário a borda superior do controle muda a cada execução.
 * O link também serve para estacionar o ponteiro do mouse fora da área capturada: o
 * controle tem cor de borda de hover.
 */
const contentField = (field: unknown) => (
  <div>
    <div style={{ height: '32px' }}><a data-test-before href="#" class="alc-link">Foco anterior</a></div>
    <div data-test-container style={{ padding: '4px' }}>
      {field}
    </div>
  </div>
);

const campoTexto = (props: Record<string, unknown> = {}, atributosInput: Record<string, unknown> = {}) => (
  <alc-field label="Nome" data-test-field {...props}>
    <input type="text" data-test-input {...atributosInput} />
  </alc-field>
);

/**
 * As fontes do design system são carregadas de forma assíncrona.
 * Capturar antes de estarem prontas gera imagens com a fonte de fallback.
 */
const aguardaFontes = () => document.fonts.ready;

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

describe('alc-field', () => {

  const testArray = [
    {
      name: 'com label',
      field: campoTexto(),
    },
    {
      name: 'com slot label',
      field: (
        <alc-field data-test-field>
          <div slot="label"><label>Nome <em>completo</em></label></div>
          <input type="text" data-test-input />
        </alc-field>
      ),
    },
    {
      name: 'obrigatorio',
      field: campoTexto({ required: true }),
    },
    {
      name: 'com dica',
      field: campoTexto({ hint: 'Informe o nome como consta no documento.' }),
    },
    {
      name: 'com erro',
      field: campoTexto({ errorMsg: 'Informe um nome válido.' }),
    },
    {
      name: 'com erro e dica',
      field: campoTexto({ errorMsg: 'Informe um nome válido.', hint: 'Informe o nome como consta no documento.' }),
    },
    {
      name: 'desabilitado',
      field: campoTexto({}, { disabled: true }),
    },
    {
      name: 'com select',
      field: (
        <alc-field label="Personagem" data-test-field>
          {/* Largura fixa e inteira: o select se dimensiona pelo conteúdo, caindo em
              largura fracionária, e a borda arredondada é rasterizada de forma diferente
              a cada execução */}
          <select data-test-input style={{ width: '160px' }}>
            <option>Lion-O</option>
            <option>Panthro</option>
          </select>
        </alc-field>
      ),
    },
    {
      name: 'com textarea',
      field: (
        <alc-field label="Observação" data-test-field>
          <textarea data-test-input rows={3}></textarea>
        </alc-field>
      ),
    },
  ];

  // Deve capturar screenshot do campo em cada variação
  it.each(testArray)('variacao $name', async ({ field }) => {
    const { root, waitForChanges } = await render(contentField(field));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    // O componente marca o controle com a classe no componentDidLoad
    const input = container.querySelector('[data-test-input]');
    assert.exists(input, 'O controle não foi encontrado');
    expect(input).toHaveClass('alc-field__input');

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do campo com o controle em foco
  it('com foco', async () => {
    const { root, waitForChanges } = await render(contentField(campoTexto()));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
    assert.exists(before, 'Link anterior não encontrado');

    await waitForChanges();

    // Seta o foco no elemento anterior
    before.focus();
    // Pressiona tab para o foco ir para o controle do campo
    await userEvent.keyboard('{Tab}');
    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const input = container.querySelector('[data-test-input]');
    assert.exists(input, 'O controle não foi encontrado');
    expect(document.activeElement).toBe(input);

    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do campo com erro e o controle em foco
  it('com erro e foco', async () => {
    const { root, waitForChanges } = await render(contentField(campoTexto({ errorMsg: 'Informe um nome válido.' })));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
    assert.exists(before, 'Link anterior não encontrado');

    await waitForChanges();

    // Seta o foco no elemento anterior
    before.focus();
    // Pressiona tab para o foco ir para o controle do campo
    await userEvent.keyboard('{Tab}');
    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const input = container.querySelector('[data-test-input]');
    assert.exists(input, 'O controle não foi encontrado');
    expect(input).toHaveClass('alc-field__input--error');
    expect(document.activeElement).toBe(input);

    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

});
