import { assert, describe, expect, h, it, render, vi } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-autocomplete.visual.e2e.tsx
// yarn stencil-test --project dark alc-autocomplete.visual.e2e.tsx

// A prop items é tipada como Array<{ [key: string]: string }>, por isso o id é texto.
const data = [
  { id: '0', nome: 'José' },
  { id: '1', nome: 'Maria' },
  { id: '2', nome: 'João' },
];

/**
 * O popup dos resultados usa strategy="fixed", então fica fora do box do alc-autocomplete
 * e não entra em uma captura do componente. Por isso a captura é feita no contêiner,
 * alto o bastante para conter o campo e a lista aberta abaixo dele.
 * O link anterior serve para estacionar o ponteiro do mouse fora da área capturada.
 */
const contentAutocomplete = (props: Record<string, unknown> = {}) => (
  <div>
    {/* Altura fixa e inteira: sem ela o campo cai em um offset fracionário e a borda
        superior do input é rasterizada de forma diferente a cada execução. */}
    <div style={{ height: '32px' }}><a data-test-before href="#" class="alc-link">Foco anterior</a></div>
    <div data-test-container style={{ height: '300px' }}>
      <alc-autocomplete
        label="Autocomplete"
        placeholder="Digite para iniciar a busca"
        displayKeys="nome"
        data-test-autocomplete
        {...props}
      ></alc-autocomplete>
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
 * Sem esperar, a captura pode sair sem o ícone de busca ou sem o da mensagem de estado.
 */
const aguardaIcones = (container: HTMLElement) => vi.waitFor(() => {
  const icones = Array.from(container.querySelectorAll('alc-icon'));
  assert.isNotEmpty(icones, 'Nenhum ícone encontrado');

  icones.forEach(icone => assert.exists(icone.querySelector('svg'), 'Ícone ainda não carregado'));
});

/**
 * Afasta o ponteiro do componente, deixando-o sobre o link anterior.
 * O cursor permanece onde o último teste o largou, e um item da lista sob o ponteiro
 * seria capturado em estado de hover.
 */
const afastaPonteiro = (root: HTMLElement) => {
  const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
  assert.exists(before, 'Link anterior não encontrado');

  return userEvent.hover(before);
};

describe('alc-autocomplete', () => {

  const testArray = [
    { name: 'padrao', props: {} },
    { name: 'com dica', props: { hint: 'Digite ao menos duas letras.' } },
    { name: 'obrigatorio', props: { required: true } },
    { name: 'desabilitado', props: { disabled: true } },
  ];

  // Deve capturar screenshot do campo fechado em cada variação
  it.each(testArray)('modelo $name', async ({ props }) => {
    const { root, waitForChanges } = await render(contentAutocomplete(props));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    await aguardaIcones(container);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot da lista aberta com os resultados do filtro
  it('com resultados', async () => {
    const { root, waitForChanges } = await render(contentAutocomplete());

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    const autocomplete = root.querySelector<HTMLAlcAutocompleteElement>('[data-test-autocomplete]');
    assert.exists(autocomplete, 'O autocomplete não foi encontrado');

    const input = root.querySelector<HTMLInputElement>('[data-test-autocomplete-input]');
    assert.exists(input, 'O input não foi encontrado');

    const results = root.querySelector('[data-test-autocomplete-results]');
    assert.exists(results, 'Os resultados não foram encontrados');

    autocomplete.items = data;
    await waitForChanges();

    await userEvent.click(input);
    await waitForChanges();

    await userEvent.keyboard('jo');
    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    expect(results.querySelectorAll('li')).toHaveLength(2);

    await aguardaIcones(container);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot da mensagem de busca sem resultados
  it('sem resultados', async () => {
    const { root, waitForChanges } = await render(contentAutocomplete());

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    const autocomplete = root.querySelector<HTMLAlcAutocompleteElement>('[data-test-autocomplete]');
    assert.exists(autocomplete, 'O autocomplete não foi encontrado');

    const input = root.querySelector<HTMLInputElement>('[data-test-autocomplete-input]');
    assert.exists(input, 'O input não foi encontrado');

    const results = root.querySelector('[data-test-autocomplete-results]');
    assert.exists(results, 'Os resultados não foram encontrados');

    autocomplete.items = data;
    await waitForChanges();

    await userEvent.click(input);
    await waitForChanges();

    await userEvent.keyboard('zzz');
    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    expect(results.querySelectorAll('li')).toHaveLength(0);
    assert.exists(container.querySelector('.alc-autocomplete__has-an-error-indicator'), 'Mensagem de busca sem resultados não encontrada');

    await aguardaIcones(container);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot da mensagem de serviço indisponível
  it('com erro', async () => {
    const { root, waitForChanges } = await render(contentAutocomplete());

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    const autocomplete = root.querySelector<HTMLAlcAutocompleteElement>('[data-test-autocomplete]');
    assert.exists(autocomplete, 'O autocomplete não foi encontrado');

    const input = root.querySelector<HTMLInputElement>('[data-test-autocomplete-input]');
    assert.exists(input, 'O input não foi encontrado');

    // O popup só abre com o input em foco, por isso o clique antes de ligar o erro
    await userEvent.click(input);
    await waitForChanges();

    autocomplete.error = true;
    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    assert.exists(container.querySelector('.alc-autocomplete__has-an-error-indicator'), 'Mensagem de erro não encontrada');

    await aguardaIcones(container);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

});
