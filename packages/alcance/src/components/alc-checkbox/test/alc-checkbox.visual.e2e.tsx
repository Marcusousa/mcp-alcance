import { assert, describe, expect, h, it, render } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-checkbox.visual.e2e.tsx
// yarn stencil-test --project dark alc-checkbox.visual.e2e.tsx

/**
 * A captura é feita no contêiner, não no alc-checkbox: o outline de foco do input usa
 * outline-offset, que fica fora do box do host e seria cortado.
 * A altura fixa do bloco do link mantém o componente em um offset inteiro — em offset
 * fracionário as bordas mudam a cada execução.
 * O link também serve para estacionar o ponteiro do mouse fora da área capturada.
 */
const contentCheckbox = (checkbox: unknown) => (
  <div>
    <div style={{ height: '32px' }}><a data-test-before href="#" class="alc-link">Foco anterior</a></div>
    <div data-test-container style={{ padding: '4px' }}>
      {checkbox}
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

describe('alc-checkbox', () => {

  const testArray = [
    {
      name: 'com label',
      checkbox: (
        <alc-checkbox label="Notícias da semana" data-test-checkbox>
          <input type="checkbox" data-test-input />
        </alc-checkbox>
      ),
    },
    {
      name: 'com slot label',
      checkbox: (
        <alc-checkbox data-test-checkbox>
          <input type="checkbox" data-test-input />
          <label slot="label">Notícias da semana</label>
        </alc-checkbox>
      ),
    },
    {
      name: 'com dica',
      checkbox: (
        <alc-checkbox label="Notícias da semana" hint="Você vai receber semanalmente as notícias da casa." data-test-checkbox>
          <input type="checkbox" data-test-input />
        </alc-checkbox>
      ),
    },
    {
      name: 'com erro',
      checkbox: (
        <alc-checkbox label="Aceito os termos de uso" errorMsg="Você precisa aceitar os termos de uso para prosseguir." data-test-checkbox>
          <input type="checkbox" data-test-input />
        </alc-checkbox>
      ),
    },
    {
      name: 'desabilitado',
      checkbox: (
        <alc-checkbox label="Aceito os termos de uso" data-test-checkbox>
          <input type="checkbox" disabled data-test-input />
        </alc-checkbox>
      ),
    },
  ];

  // Deve capturar screenshot do checkbox em cada variação
  it.each(testArray)('modelo $name', async ({ checkbox }) => {
    const { root, waitForChanges } = await render(contentCheckbox(checkbox));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    assert.exists(container.querySelector('[data-test-input]'), 'O input não foi encontrado');

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do checkbox marcado
  it('marcado', async () => {
    const { root, waitForChanges } = await render(
      contentCheckbox(
        <alc-checkbox label="Notícias da semana" data-test-checkbox>
          <input type="checkbox" data-test-input />
        </alc-checkbox>
      )
    );

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    const input = container.querySelector<HTMLInputElement>('[data-test-input]');
    assert.exists(input, 'O input não foi encontrado');

    await userEvent.click(input);
    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    expect(input.checked).toBe(true);

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do checkbox com o input em foco
  it('com foco', async () => {
    const { root, waitForChanges } = await render(
      contentCheckbox(
        <alc-checkbox label="Notícias da semana" data-test-checkbox>
          <input type="checkbox" data-test-input />
        </alc-checkbox>
      )
    );

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
    assert.exists(before, 'Link anterior não encontrado');

    await waitForChanges();

    // Seta o foco no elemento anterior
    before.focus();
    // Pressiona tab para o foco ir para o input do checkbox
    await userEvent.keyboard('{Tab}');
    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const input = container.querySelector('[data-test-input]');
    assert.exists(input, 'O input não foi encontrado');
    expect(document.activeElement).toBe(input);

    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

});
