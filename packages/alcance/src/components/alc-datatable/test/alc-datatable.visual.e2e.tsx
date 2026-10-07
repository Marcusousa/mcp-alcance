import { assert, describe, expect, h, it, render, vi } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-datatable.visual.e2e.tsx
// yarn stencil-test --project dark alc-datatable.visual.e2e.tsx

const DADOS = [
  ['Panthro', 'Nunchaku'],
  ['Lion-O', 'Espada Justiceira'],
  ['Tygra', 'Chicote'],
  ['Cheetara', 'Bastão'],
  ['Jaga', 'Sabedoria'],
];

const COLUNAS = [{ title: 'Nome' }, { title: 'Arma' }];

const TABELA_INLINE = (
  <table>
    <thead>
      <tr>
        <th>Nome</th>
        <th>Arma</th>
      </tr>
    </thead>
    <tbody>
      {DADOS.map(([nome, arma]) => (
        <tr>
          <td>{nome}</td>
          <td>{arma}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

/**
 * A captura é feita no contêiner porque os dropdowns dos controles usam alc-popup com
 * strategy="fixed", ficando fora do box do alc-datatable.
 * A altura fixa do bloco do link mantém o componente em um offset inteiro — em offset
 * fracionário as bordas mudam a cada execução.
 * O link também serve para estacionar o ponteiro do mouse fora da área capturada: as
 * linhas da tabela têm cor de hover.
 */
const contentDatatable = (datatable: unknown, alturaContainer?: string) => (
  <div>
    <div style={{ height: '32px' }}><a data-test-before href="#" class="alc-link">Foco anterior</a></div>
    <div data-test-container style={alturaContainer ? { height: alturaContainer } : {}}>
      {datatable}
    </div>
  </div>
);

const tabelaInline = (options: object = {}) => (
  <alc-datatable options={JSON.stringify(options)} data-test-datatable>
    {TABELA_INLINE}
  </alc-datatable>
);

const tabelaPorPropriedades = (options: object = {}) => (
  <alc-datatable
    data={JSON.stringify(DADOS)}
    options={JSON.stringify({ columns: COLUNAS, ...options })}
    data-test-datatable
  ></alc-datatable>
);

/**
 * As fontes do design system são carregadas de forma assíncrona.
 * Capturar antes de estarem prontas gera imagens com a fonte de fallback.
 */
const aguardaFontes = () => document.fonts.ready;

/**
 * O alc-icon busca o SVG por HTTP e o injeta depois da renderização, sem segurar o load.
 * Sem esperar, a captura pode sair sem os ícones dos controles.
 */
const aguardaIcones = (container: HTMLElement) => vi.waitFor(() => {
  const icones = Array.from(container.querySelectorAll('alc-icon'));
  assert.isNotEmpty(icones, 'Nenhum ícone encontrado');

  icones.forEach(icone => assert.exists(icone.querySelector('svg'), 'Ícone ainda não carregado'));
});

/**
 * Afasta o ponteiro do componente, deixando-o sobre o link anterior.
 * O cursor permanece onde o último teste o largou, e a linha sob o ponteiro
 * seria capturada em estado de hover.
 */
const afastaPonteiro = (root: HTMLElement) => {
  const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
  assert.exists(before, 'Link anterior não encontrado');

  return userEvent.hover(before);
};

describe('alc-datatable', () => {

  const testArray = [
    { name: 'inline', datatable: tabelaInline(), ordenacao: true, busca: true, info: true },
    { name: 'propriedades', datatable: tabelaPorPropriedades(), ordenacao: true, busca: true, info: true },
    { name: 'sem ordenacao', datatable: tabelaInline({ ordering: false }), ordenacao: false, busca: true, info: true },
    { name: 'sem busca', datatable: tabelaInline({ searching: false }), ordenacao: true, busca: false, info: true },
    { name: 'sem informacao', datatable: tabelaInline({ info: false }), ordenacao: true, busca: true, info: false },
    { name: 'sem paginacao', datatable: tabelaInline({ paging: false }), ordenacao: true, busca: true, info: true },
  ];

  // Deve capturar screenshot da tabela em cada combinação de recursos
  it.each(testArray)('recurso $name', async ({ datatable, ordenacao, busca, info }) => {
    const { root, waitForChanges } = await render(contentDatatable(datatable));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    expect(container.querySelectorAll('tbody tr')).toHaveLength(DADOS.length);
    expect(!!container.querySelector('[data-test-dropdown-order]')).toBe(ordenacao);
    expect(!!container.querySelector('[data-test-search-field]')).toBe(busca);
    // O data-test-page-info não é aplicado quando há uma página só com todos os itens,
    // então a presença da informação é conferida pelo texto da região inferior
    expect(container.textContent.includes('itens listados')).toBe(info);

    await aguardaIcones(container);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot da tabela com busca sem resultados
  it('sem resultados', async () => {
    const { root, waitForChanges } = await render(contentDatatable(tabelaInline()));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    const busca = container.querySelector<HTMLInputElement>('[data-test-input-search]');
    assert.exists(busca, 'O campo de busca não foi encontrado');

    await userEvent.click(busca);
    await waitForChanges();

    await userEvent.keyboard('zzz');
    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    expect(container.querySelectorAll('tbody tr')).toHaveLength(1);
    assert.exists(container.querySelector('td.dt-empty'), 'A mensagem de tabela vazia não foi renderizada');

    await aguardaIcones(container);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do alerta de reposicionamento ao filtrar fora da primeira página
  it('alerta de reposicionamento', async () => {
    const { root, waitForChanges } = await render(contentDatatable(tabelaInline({ pageLength: 2 })));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    const alerta = container.querySelector<HTMLAlcAlertElement>('alc-alert');
    assert.exists(alerta, 'O alerta não foi encontrado');

    // Vai para a segunda página, condição para o alerta ser exibido ao filtrar
    const paginacao = container.querySelector<HTMLAlcPaginationElement>('[data-test-pagination]');
    assert.exists(paginacao, 'A paginação não foi renderizada');

    const paginas = paginacao.querySelectorAll<HTMLElement>('[data-test-pagination-button]');
    await userEvent.click(paginas[2]);
    await waitForChanges();

    const busca = container.querySelector<HTMLInputElement>('[data-test-input-search]');
    assert.exists(busca, 'O campo de busca não foi encontrado');

    await userEvent.click(busca);
    await waitForChanges();

    await userEvent.keyboard('a');
    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    expect(alerta.visible).toBe(true);

    await aguardaIcones(container);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

});

// Não há casos para a paginação visível nem para os dropdowns de controle abertos: os botões
// desses elementos têm largura definida pelo texto, caindo em valor fracionário, e a borda
// arredondada é rasterizada de forma diferente a cada execução. Fixar a largura do contêiner
// e capturar com scale css não resolveram. O modo sem paginação é coberto por 'sem paginacao'.
